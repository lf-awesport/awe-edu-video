import {createHash, randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {link, mkdir, open, readFile, rm} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {z} from 'zod';
import {canonicalHash, canonicalJson} from './compiler.js';
import type {Project} from './schema.js';

const MAX_AUDIO_BYTES = 100 * 1024 * 1024;
const AudioProbeSchema = z.object({
  streams: z.array(z.object({codec_name:z.literal('mp3'),sample_rate:z.string().regex(/^\d+$/),channels:z.number().int().positive()})).length(1),
  format: z.object({duration:z.string(),size:z.string()}),
});

export const VoiceCandidateManifestSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  manifestHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  projectId: z.string().min(1),
  sceneId: z.string().regex(/^scene-\d{2}$/),
  utteranceIds: z.array(z.string().regex(/^utt-s\d{2}-\d{2}$/)).length(1),
  kind: z.literal('tts'),
  source: z.object({provider:z.string().min(1),model:z.string().min(1),jobId:z.string().min(1),voiceId:z.string().min(1)}),
  scriptHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  audioAsset: z.object({
    sha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    path: z.string().regex(/^blobs\/sha256\/[a-f0-9]{64}\/audio\.mp3$/),
    bytes: z.number().int().positive(), codec: z.literal('mp3'), sampleRate: z.number().int().positive(),
    channels: z.number().int().positive(), durationSeconds: z.number().positive(),
  }),
  timing: z.object({
    authoredDurationSeconds: z.number().positive(), candidateDurationSeconds: z.number().positive(),
    durationDeltaSeconds: z.number(), selectionStatus: z.literal('blocked-timing-proposal-required'),
  }),
  blockers: z.tuple([
    z.literal('timing proposal and approval are required before selection'),
    z.literal('voice rights and provider terms evidence are not bound'),
    z.literal('caption alignment is missing'),
  ]),
  releaseStatus: z.literal('internal-preview-only'),
});

const safeRelative = (root: string, path: string) => {
  const value = relative(resolve(root), resolve(path));
  if (!value || value === '..' || value.startsWith(`..${sep}`)) throw new Error('Voice candidate artifact escaped runtime root');
  return value.split(sep).join('/');
};

const writeImmutable = async (path: string, bytes: Uint8Array) => {
  await mkdir(dirname(path), {recursive:true});
  try {
    const file = await open(path, 'wx');
    try { await file.writeFile(bytes); await file.sync(); } finally { await file.close(); }
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
    if (!Buffer.from(await readFile(path)).equals(Buffer.from(bytes))) throw new Error(`Divergent immutable artifact already exists: ${path}`);
  }
};

const probeAudio = (path: string) => {
  const result = spawnSync('ffprobe', ['-v','error','-select_streams','a:0','-show_entries','format=duration,size:stream=codec_name,sample_rate,channels','-of','json',path], {encoding:'utf8'});
  if (result.status !== 0) throw new Error('Voice candidate audio probe failed');
  const parsed = AudioProbeSchema.parse(JSON.parse(result.stdout));
  const durationSeconds = Number(parsed.format.duration), bytes = Number(parsed.format.size);
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || !Number.isSafeInteger(bytes) || bytes <= 0 || bytes > MAX_AUDIO_BYTES) throw new Error('Voice candidate audio metadata is invalid');
  const decode = spawnSync('ffmpeg', ['-v','error','-xerror','-i',path,'-map','0:a:0','-f','null','-'], {encoding:'utf8'});
  if (decode.status !== 0) throw new Error('Voice candidate audio failed full decode');
  return {durationSeconds,bytes,codec:parsed.streams[0]!.codec_name,sampleRate:Number(parsed.streams[0]!.sample_rate),channels:parsed.streams[0]!.channels};
};

export async function importVoiceCandidate(input: {
  project: Project; runtimeRoot: string; sceneId: string; file: string; candidateId: string;
  sourceProvider: string; sourceModel: string; sourceJobId: string; voiceId: string;
}) {
  const scene = input.project.storyboard.scenes.find((item) => item.id === input.sceneId);
  if (!scene) throw new Error(`Unknown scene ID: ${input.sceneId}`);
  const sourcePath = resolve(input.file), bytes = await readFile(sourcePath);
  if (bytes.length === 0 || bytes.length > MAX_AUDIO_BYTES) throw new Error('Voice candidate file size is invalid');
  const probe = probeAudio(sourcePath);
  if (probe.bytes !== bytes.length) throw new Error('Voice candidate probe size differs from imported bytes');
  const digest = createHash('sha256').update(bytes).digest('hex');
  const audioSha256 = `sha256:${digest}`;
  const audioPath = join(input.runtimeRoot, 'blobs', 'sha256', digest, 'audio.mp3');
  await writeImmutable(audioPath, bytes);
  const durationDeltaSeconds = Number((probe.durationSeconds - scene.seconds).toFixed(6));
  const body = {
    schemaVersion:'1.0.0' as const, id:input.candidateId, projectId:input.project.projectId, sceneId:scene.id,
    utteranceIds:[`utt-s${scene.id.slice(-2)}-01`], kind:'tts' as const,
    source:{provider:input.sourceProvider,model:input.sourceModel,jobId:input.sourceJobId,voiceId:input.voiceId}, scriptHash:canonicalHash(scene.presentation.voiceOver),
    audioAsset:{sha256:audioSha256,path:safeRelative(input.runtimeRoot,audioPath),...probe},
    timing:{authoredDurationSeconds:scene.seconds,candidateDurationSeconds:probe.durationSeconds,durationDeltaSeconds,selectionStatus:'blocked-timing-proposal-required' as const},
    blockers:['timing proposal and approval are required before selection','voice rights and provider terms evidence are not bound','caption alignment is missing'] as const,
    releaseStatus:'internal-preview-only' as const,
  };
  const manifest = VoiceCandidateManifestSchema.parse({...body,manifestHash:canonicalHash(body)});
  const manifestPath = join(input.runtimeRoot, 'candidates', 'voice', manifest.manifestHash.slice(7), 'voice-candidate.json');
  const temporary = `${manifestPath}.${process.pid}.${randomUUID()}.tmp`;
  await mkdir(dirname(manifestPath), {recursive:true});
  try {
    const encoded = Buffer.from(`${canonicalJson(manifest)}\n`);
    await writeImmutable(temporary, encoded);
    try { await link(temporary, manifestPath); }
    catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
      if (!Buffer.from(await readFile(manifestPath)).equals(encoded)) throw new Error(`Divergent immutable voice candidate exists: ${manifestPath}`);
    }
  } finally { await rm(temporary, {force:true}); }
  return {manifest,manifestPath:safeRelative(input.runtimeRoot,manifestPath)};
}
