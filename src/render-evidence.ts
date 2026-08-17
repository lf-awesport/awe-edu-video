import {spawnSync} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {access, mkdir, open, readFile, rename, rm} from 'node:fs/promises';
import {join, relative, resolve, sep} from 'node:path';
import {canonicalHash, canonicalJson} from './compiler.js';
import type {RenderPlan} from './schema.js';

export const RENDER_MANIFEST_SCHEMA_VERSION = '1.0.0';
export const INTERNAL_SCALE = 1;
export const DELIVERY_CODEC = 'h264';
export const FFMPEG_TRANSFORM = {
  executable: 'ffmpeg',
  arguments: ['-v', 'error', '-xerror', '-y', '-i', '$INPUT', '-map', '0:v:0', '-c:v', 'copy', '-an', '$OUTPUT'],
} as const;

const sha256Bytes = (bytes: Uint8Array) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;

export interface RenderIdentityBody {
  schemaVersion: '1.0.0';
  renderPlanHash: string;
  compositionId: 'Scene03' | 'AweMaster';
  sourceHashes: Record<string, string>;
  remotionVersion: string;
  codec: 'h264';
  internalScale: 1;
  delivery: {width: number; height: number; fps: number; totalFrames: number};
  ffmpegTransform: typeof FFMPEG_TRANSFORM;
}

export interface TechnicalProbe {
  codec: string; width: number; height: number; fps: string; frameCount: number; durationSeconds: number;
}

export interface RenderManifest {
  schemaVersion: '1.0.0';
  renderIdentityHash: string;
  renderIdentity: RenderIdentityBody;
  planHash: string;
  compositionId: 'Scene03' | 'AweMaster';
  mediaPath: string;
  mediaSha256: string;
  technicalProbe: TechnicalProbe;
  releaseStatus: 'internal-preview-only';
}

export const renderIdentityFromInputs = (input: Omit<RenderIdentityBody, 'schemaVersion' | 'codec' | 'internalScale' | 'ffmpegTransform'>) => {
  const body: RenderIdentityBody = {schemaVersion: '1.0.0', ...input, codec: DELIVERY_CODEC, internalScale: INTERNAL_SCALE, ffmpegTransform: FFMPEG_TRANSFORM};
  return {body, renderIdentityHash: canonicalHash(body)};
};

export async function computeRenderIdentity(plan: RenderPlan, compositionId: 'Scene03' | 'AweMaster', projectRoot = process.cwd()) {
  const packageJson = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8')) as {dependencies?: Record<string, string>};
  const remotionVersion = packageJson.dependencies?.remotion;
  if (!remotionVersion || !/^\d+\.\d+\.\d+$/.test(remotionVersion)) throw new Error('package.json must pin an exact Remotion version');
  const renderInputs = [
    'src/remotion.tsx',
    'src/remotion-entry.tsx',
    'src/remotion-brand.ts',
    'src/remotion-scene-03.tsx',
    'src/remotion-scenes.tsx',
    'assets/brand/backgrounds/runtime/magma-gradient.png',
    'assets/brand/fonts/libre-franklin/LibreFranklin-Variable.ttf',
    'assets/brand/fonts/poppins/Poppins-Medium.ttf',
    'assets/brand/fonts/poppins/Poppins-ExtraBold.ttf',
    'assets/brand/fonts/poppins/Poppins-Black.ttf',
    'assets/brand/logos/awe-sport-education-horizontal-white.svg',
    'assets/brand/logos/awe-sport-education-horizontal-color.svg',
    'assets/ui/runtime/app-lesson.png',
    'assets/ui/runtime/app-main-awe-edu.png',
    'assets/ui/runtime/app-main-color-01.png',
    'assets/ui/runtime/app-main-color-02.png',
    ...['fan-experience', 'sports-marketing', 'sports-sponsorship', 'media', 'sports-finance', 'sports-law', 'sports-governance', 'sports-tourism', 'sports-equipment', 'event-management', 'esports', 'sport-for-good'].map((subject) => `assets/subjects/runtime/${subject}.png`),
  ];
  const sourceHashes = Object.fromEntries(await Promise.all(renderInputs.map(async (path) => [path, sha256Bytes(await readFile(join(projectRoot, path)))])));
  return renderIdentityFromInputs({
    renderPlanHash: plan.planHash, compositionId,
    sourceHashes,
    remotionVersion,
    delivery: {width: plan.outputProfile.width, height: plan.outputProfile.height, fps: plan.outputProfile.fps, totalFrames: plan.totalFrames},
  });
}

export const renderEvidencePaths = (runtimeRoot: string, hash: string, compositionId: string) => {
  const directory = join(runtimeRoot, 'renders', hash.replace(':', '-'));
  return {directory, mediaPath: join(directory, `${compositionId === 'AweMaster' ? 'awe-master' : 'scene-03'}.mp4`), manifestPath: join(directory, 'render-manifest.json')};
};

const run = (executable: string, args: string[]) => {
  const result = spawnSync(executable, args, {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(result.stderr || `${executable} exited with ${result.status}`);
  return result.stdout;
};

export const probeAndDecode = (path: string, plan: RenderPlan): TechnicalProbe => {
  const raw = JSON.parse(run('ffprobe', ['-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_read_frames:format=duration','-of','json',path])) as {streams: Array<{codec_name:string;width:number;height:number;r_frame_rate:string;nb_read_frames:string}>;format:{duration:string}};
  const video = raw.streams[0];
  const probe = video && {codec: video.codec_name, width: video.width, height: video.height, fps: video.r_frame_rate, frameCount: Number(video.nb_read_frames), durationSeconds: Number(raw.format.duration)};
  if (!probe || probe.codec !== DELIVERY_CODEC || probe.width !== plan.outputProfile.width || probe.height !== plan.outputProfile.height || probe.fps !== `${plan.outputProfile.fps}/1` || probe.frameCount !== plan.totalFrames || Math.abs(probe.durationSeconds - plan.totalFrames / plan.outputProfile.fps) > 0.01) throw new Error(`Rendered media does not match RenderPlan: ${JSON.stringify(raw)}`);
  run('ffmpeg', ['-v','error','-xerror','-i',path,'-map','0:v:0','-f','null','-']);
  return probe;
};

const safeRelative = (root: string, path: string) => {
  const value = relative(resolve(root), resolve(path));
  if (!value || value === '..' || value.startsWith(`..${sep}`)) throw new Error('Render media must be beneath runtime root');
  return value.split(sep).join('/');
};

export async function verifyRenderEvidence(runtimeRoot: string, plan: RenderPlan, identity: Awaited<ReturnType<typeof computeRenderIdentity>>) {
  const paths = renderEvidencePaths(runtimeRoot, identity.renderIdentityHash, identity.body.compositionId);
  let bytes: Buffer;
  try { bytes = await readFile(paths.manifestPath); } catch { throw new Error(`Missing render manifest: ${paths.manifestPath}`); }
  let manifest: RenderManifest;
  try { manifest = JSON.parse(bytes.toString('utf8')) as RenderManifest; } catch { throw new Error(`Malformed render manifest: ${paths.manifestPath}`); }
  if (`${canonicalJson(manifest)}\n` !== bytes.toString('utf8')) throw new Error('Render manifest is not canonical');
  if (manifest.schemaVersion !== RENDER_MANIFEST_SCHEMA_VERSION || manifest.renderIdentityHash !== identity.renderIdentityHash || canonicalJson(manifest.renderIdentity) !== canonicalJson(identity.body) || manifest.planHash !== plan.planHash || manifest.compositionId !== identity.body.compositionId || manifest.releaseStatus !== 'internal-preview-only') throw new Error('Render manifest identity is stale or tampered');
  const expectedMedia = safeRelative(runtimeRoot, paths.mediaPath);
  if (manifest.mediaPath !== expectedMedia) throw new Error('Render manifest media path is invalid');
  const mediaHash = sha256Bytes(await readFile(paths.mediaPath));
  if (mediaHash !== manifest.mediaSha256) throw new Error('Rendered media SHA-256 does not match immutable manifest');
  const technicalProbe = probeAndDecode(paths.mediaPath, plan);
  if (canonicalJson(technicalProbe) !== canonicalJson(manifest.technicalProbe)) throw new Error('Technical probe differs from immutable manifest');
  return {...paths, manifest, mediaSha256: mediaHash, technicalProbe, technicalVerified: true as const};
}

export async function prepareRenderEvidence(runtimeRoot: string, plan: RenderPlan, identity: Awaited<ReturnType<typeof computeRenderIdentity>>) {
  const paths = renderEvidencePaths(runtimeRoot, identity.renderIdentityHash, identity.body.compositionId);
  try {
    await access(paths.manifestPath);
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;

    let mediaExists = true;
    try {
      await access(paths.mediaPath);
    } catch (mediaError) {
      if (mediaError instanceof Error && 'code' in mediaError && mediaError.code === 'ENOENT') mediaExists = false;
      else throw mediaError;
    }

    if (!mediaExists) return {cache: 'miss' as const, paths};
    const orphanPath = join(paths.directory, `.orphan-${process.pid}-${randomUUID()}.mp4`);
    await rename(paths.mediaPath, orphanPath);
    return {cache: 'miss' as const, paths, orphanPath};
  }

  const evidence = await verifyRenderEvidence(runtimeRoot, plan, identity);
  return {cache: 'hit' as const, paths, evidence};
}

export async function publishRenderEvidence(runtimeRoot: string, plan: RenderPlan, identity: Awaited<ReturnType<typeof computeRenderIdentity>>, stagedMedia: string) {
  const paths = renderEvidencePaths(runtimeRoot, identity.renderIdentityHash, identity.body.compositionId);
  await mkdir(paths.directory, {recursive: true});
  const lock = join(paths.directory, '.publish.lock');
  try { await mkdir(lock); } catch { throw new Error(`Render evidence publication is already in progress: ${paths.directory}`); }
  try {
    try { return await verifyRenderEvidence(runtimeRoot, plan, identity); } catch (error) {
      try { await readFile(paths.manifestPath); throw error; } catch (readError) { if (readError === error) throw error; }
    }
    let mediaAlreadyExists = true;
    try { await access(paths.mediaPath); } catch (error) { if (error instanceof Error && 'code' in error && error.code === 'ENOENT') mediaAlreadyExists = false; else throw error; }
    if (mediaAlreadyExists) throw new Error(`Divergent immutable render media exists without a valid manifest: ${paths.mediaPath}`);
    const technicalProbe = probeAndDecode(stagedMedia, plan);
    const mediaSha256 = sha256Bytes(await readFile(stagedMedia));
    const manifest: RenderManifest = {schemaVersion:'1.0.0',renderIdentityHash:identity.renderIdentityHash,renderIdentity:identity.body,planHash:plan.planHash,compositionId:identity.body.compositionId,mediaPath:safeRelative(runtimeRoot,paths.mediaPath),mediaSha256,technicalProbe,releaseStatus:'internal-preview-only'};
    const mediaTemporary = `${paths.mediaPath}.${process.pid}.${randomUUID()}.tmp`;
    const manifestTemporary = `${paths.manifestPath}.${process.pid}.${randomUUID()}.tmp`;
    await rename(stagedMedia, mediaTemporary);
    await rename(mediaTemporary, paths.mediaPath);
    const file = await open(manifestTemporary, 'wx');
    try { await file.writeFile(`${canonicalJson(manifest)}\n`); await file.sync(); } finally { await file.close(); }
    await rename(manifestTemporary, paths.manifestPath);
    return { ...paths, manifest, mediaSha256, technicalProbe, technicalVerified: true as const};
  } finally { await rm(lock, {recursive:true, force:true}); }
}
