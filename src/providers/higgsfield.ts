import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {z} from 'zod';
import {canonicalHash, canonicalJson} from '../compiler.js';
import {CapabilitySnapshotSchema, ExactGenerationRequestSchema, PriceObservationSchema, type CapabilitySnapshot, type ExactGenerationRequest, type PriceObservation} from '../schema.js';

const MAX_OUTPUT = 256 * 1024;
const TIMEOUT_MS = 10_000;

export interface CommandRunner { (executable: string, args: readonly string[]): Promise<{stdout: string; stderr: string; exitCode: number}> }

export const boundedCommandRunner: CommandRunner = (executable, args) => new Promise((resolveCommand, reject) => {
  const child = spawn(executable, [...args], {shell: false, stdio: ['ignore', 'pipe', 'pipe']});
  let stdout = '', stderr = '', size = 0, finished = false;
  const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('provider command timed out')); }, TIMEOUT_MS);
  const collect = (target: 'stdout'|'stderr') => (chunk: Buffer) => {
    size += chunk.length;
    if (size > MAX_OUTPUT) { child.kill('SIGKILL'); reject(new Error('provider command exceeded output limit')); return; }
    if (target === 'stdout') stdout += chunk.toString('utf8'); else stderr += chunk.toString('utf8');
  };
  child.stdout.on('data', collect('stdout')); child.stderr.on('data', collect('stderr'));
  child.on('error', (error) => { clearTimeout(timer); if (!finished) { finished = true; reject(new Error(`provider executable unavailable: ${error.message}`)); } });
  child.on('close', (code) => { clearTimeout(timer); if (!finished) { finished = true; resolveCommand({stdout, stderr, exitCode: code ?? -1}); } });
});

const safeRelative = (root: string, path: string) => {
  const value = relative(resolve(root), resolve(path));
  if (!value || value === '..' || value.startsWith(`..${sep}`)) throw new Error('provider evidence path escaped runtime root');
  return value.split(sep).join('/');
};
const parseJson = (text: string, label: string): unknown => { try { return JSON.parse(text); } catch { throw new Error(`${label} returned invalid JSON (raw output redacted)`); } };

const WorkspaceStatusSchema = z.object({
  workspace: z.object({id: z.string().min(1).optional(), name: z.string().min(1).optional(), status: z.string().min(1).optional()}).passthrough().optional(),
  workspace_id: z.string().min(1).optional(),
  current_workspace: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
}).passthrough();
const ModelValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const ModelPayloadSchema = z.object({
  display_name: z.string().min(1),
  job_type: z.string().min(1),
  params: z.array(z.object({name: z.string().min(1), type: z.string().min(1), default: ModelValueSchema.optional(), required: z.boolean(), enum: z.array(ModelValueSchema).optional()}).passthrough()),
  rules: z.unknown(),
  type: z.string().min(1),
}).passthrough();
const CostPayloadSchema = z.object({credits: z.number().nonnegative()}).passthrough();

export class HiggsfieldQuoteAdapter {
  constructor(private readonly runtimeRoot: string, private readonly executable = 'higgsfield', private readonly run: CommandRunner = boundedCommandRunner, private readonly now = () => new Date()) {}

  private async invokeJson(args: string[], label: string) {
    const result = await this.run(this.executable, [...args, '--json']);
    if (result.exitCode !== 0) throw new Error(`${label} failed (provider diagnostics redacted)`);
    return parseJson(result.stdout, label);
  }

  async doctor(): Promise<Record<string, unknown>> {
    const versionResult = await this.run(this.executable, ['--version']);
    if (versionResult.exitCode !== 0) return {provider: 'higgsfield', executable: false, version: null, workspace: 'unknown', model: 'blocked', ready: false, blocker: 'provider executable unavailable'};
    const versionMatch = /^higgsfield\s+([^\s]+)/.exec(versionResult.stdout.trim());
    if (!versionMatch) throw new Error('provider version response was unrecognized (raw output redacted)');
    const workspaceResult = await this.run(this.executable, ['workspace', 'status', '--json']);
    const noWorkspace = /no workspace selected/i.test(`${workspaceResult.stdout}\n${workspaceResult.stderr}`);
    if (noWorkspace) return {provider: 'higgsfield', executable: true, version: versionMatch[1], workspace: 'not-selected', model: 'blocked', ready: false, blocker: 'no workspace selected', snapshotPath: null};
    if (workspaceResult.exitCode !== 0) return {provider: 'higgsfield', executable: true, version: versionMatch[1], workspace: 'unknown', model: 'blocked', ready: false, blocker: 'workspace status failed; diagnostics redacted', snapshotPath: null};
    const workspace = WorkspaceStatusSchema.parse(parseJson(workspaceResult.stdout, 'workspace status'));
    const status = workspace.status ?? workspace.workspace?.status;
    const selectedStatus = status && !/^(unknown|none|not[-_ ]?selected|unselected)$/i.test(status);
    const selected = Boolean(workspace.workspace_id || workspace.current_workspace || workspace.workspace?.id || workspace.workspace?.name || selectedStatus);
    if (!selected) return {provider: 'higgsfield', executable: true, version: versionMatch[1], workspace: 'unknown', model: 'blocked', ready: false, blocker: 'workspace response did not prove a selected workspace (identity redacted)', snapshotPath: null};
    const modelPayload = ModelPayloadSchema.parse(await this.invokeJson(['model', 'get', 'seedance_2_0_mini'], 'model discovery'));
    const param = (name: string) => modelPayload.params.find((item) => item.name === name);
    const prompt = param('prompt'), duration = param('duration'), resolution = param('resolution'), aspectRatio = param('aspect_ratio'), audio = param('generate_audio');
    const audioAcceptsFalse =
      audio?.type === 'boolean' &&
      typeof audio.default === 'boolean' &&
      (audio.enum === undefined || audio.enum.includes(false));
    const drift =
      modelPayload.job_type !== 'seedance_2_0_mini' ? 'job_type is not seedance_2_0_mini' : modelPayload.type !== 'video' ? 'model type is not video' :
      prompt?.type !== 'string' || !prompt.required ? 'prompt is not a required string' : duration?.type !== 'integer' || duration.default !== 5 || (duration.enum !== undefined && !duration.enum.includes(5)) ? 'duration does not accept integer with default 5' :
      !resolution?.enum?.includes('720p') ? 'resolution does not include 720p' : !aspectRatio?.enum?.includes('16:9') ? 'aspect_ratio does not include 16:9' :
      !audioAcceptsFalse ? 'generate_audio does not accept boolean false' : null;
    if (drift) return {provider: 'higgsfield', executable: true, version: versionMatch[1], workspace: 'selected', model: 'blocked', ready: false, blocker: `model capability drift: ${drift} (raw payload redacted)`, snapshotPath: null};
    const observedAt = this.now().toISOString();
    const snapshot = CapabilitySnapshotSchema.parse({schemaVersion: '1.0.0', provider: 'higgsfield', model: 'seedance_2_0_mini', cliVersion: versionMatch[1], observedAt, modelSchemaHash: canonicalHash(modelPayload), supportedConstraints: {jobType: modelPayload.job_type, type: modelPayload.type, promptRequired: prompt!.required, durationSeconds: duration!.enum ?? [duration!.default], durationDefault: duration!.default, resolutions: resolution!.enum, aspectRatios: aspectRatio!.enum, generateAudio: audio!.enum ?? [false, true], generateAudioDefault: audio!.default}});
    const hash = canonicalHash(snapshot), path = join(this.runtimeRoot, 'providers', 'higgsfield', 'capabilities', hash.slice(7), 'capability-snapshot.json');
    await mkdir(dirname(path), {recursive: true});
    try { await writeFile(path, `${canonicalJson(snapshot)}\n`, {flag: 'wx'}); } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST') || (await readFile(path, 'utf8')).trim() !== canonicalJson(snapshot)) throw error;
    }
    return {provider: 'higgsfield', executable: true, version: versionMatch[1], workspace: 'selected', model: 'ready', ready: true, capabilitySnapshotHash: hash, snapshotPath: safeRelative(this.runtimeRoot, path)};
  }

  async observePrice(requestInput: ExactGenerationRequest, snapshot: CapabilitySnapshot): Promise<PriceObservation> {
    const request = ExactGenerationRequestSchema.parse(requestInput);
    const capability = CapabilitySnapshotSchema.parse(snapshot);
    const supported = capability.model === request.model && capability.supportedConstraints.jobType === request.model && capability.supportedConstraints.type === 'video' && capability.supportedConstraints.promptRequired && capability.supportedConstraints.durationSeconds.includes(request.durationSeconds) && capability.supportedConstraints.resolutions.includes(request.resolution) && capability.supportedConstraints.aspectRatios.includes(request.aspectRatio) && capability.supportedConstraints.generateAudio.includes(request.generateAudio);
    if (!supported) throw new Error('request is unsupported by capability snapshot; cost command blocked');
    const requestHash = canonicalHash(request); // observedAt intentionally cannot affect this identity
    const payload = await this.invokeJson(
      [
        'generate',
        'cost',
        request.model,
        '--prompt',
        request.prompt,
        '--duration',
        String(request.durationSeconds),
        '--resolution',
        request.resolution,
        '--aspect-ratio',
        request.aspectRatio,
        `--generate-audio=${request.generateAudio}`,
      ],
      'cost observation',
    );
    const cost = CostPayloadSchema.safeParse(payload);
    if (!cost.success) throw new Error('cost response lacked a valid native credit amount (raw output redacted)');
    const observedAt = this.now().toISOString();
    const body = {provider: 'higgsfield', model: request.model, requestHash, capabilitySnapshotHash: canonicalHash(capability), observedAt, amount: cost.data.credits, unit: 'credits' as const};
    const evidencePath = join(this.runtimeRoot, 'providers', 'higgsfield', 'prices', canonicalHash(body).slice(7), 'price-observation.json');
    const observation = PriceObservationSchema.parse({kind: 'PriceObservation', ...body, evidencePath: safeRelative(this.runtimeRoot, evidencePath), authorizing: false});
    await mkdir(dirname(evidencePath), {recursive: true}); await writeFile(evidencePath, `${canonicalJson(observation)}\n`, {flag: 'wx'});
    return observation;
  }
}
