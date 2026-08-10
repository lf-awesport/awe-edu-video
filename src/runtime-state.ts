import {createHash, randomUUID} from 'node:crypto';
import {mkdir, open, readFile, rename, rm, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {canonicalJson} from './compiler.js';

const SCHEMA_VERSION = '1.0.0';
const GENESIS_HASH = 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
const sha256 = (value: string) => `sha256:${createHash('sha256').update(value).digest('hex')}`;

export interface MaterializedArtifact {
  inputHashes: string[];
  outputHashes: string[];
  artifactPath: string;
}

interface RuntimeEvent extends MaterializedArtifact {
  schemaVersion: string;
  projectId: string;
  sequence: number;
  eventId: string;
  previousHash: string;
  eventHash: string;
  type: 'plan-materialized' | 'render-verified';
}

interface Snapshot {
  schemaVersion: string;
  projectId: string;
  verifiedEventCount: number;
  head: string | null;
  planOutputs: MaterializedArtifact[];
  renderOutputs: MaterializedArtifact[];
}

interface Head {
  schemaVersion: string;
  projectId: string;
  sequence: number;
  eventHash: string;
}

export interface ReconstructedState extends Snapshot {
  discardedIncompleteTail: boolean;
}

export type RuntimeCommitStage = 'after-append' | 'after-snapshot' | 'after-head';
export interface RuntimeStateOptions {
  /** Test seam for simulating process failure at durable commit stages. */
  afterStage?: (stage: RuntimeCommitStage) => void | Promise<void>;
}

const isMissing = (error: unknown) => error instanceof Error && 'code' in error && error.code === 'ENOENT';
const isHash = (value: unknown): value is string => typeof value === 'string' && /^sha256:[0-9a-f]{64}$/.test(value);

const syncDirectory = async (path: string) => {
  try {
    const directory = await open(path, 'r');
    try { await directory.sync(); } finally { await directory.close(); }
  } catch { /* Some filesystems do not support directory fsync. */ }
};

const atomicBytes = async (path: string, bytes: string) => {
  const temporary = `${path}.tmp-${process.pid}-${randomUUID()}`;
  const file = await open(temporary, 'wx');
  try { await file.writeFile(bytes); await file.sync(); } finally { await file.close(); }
  await rename(temporary, path);
  await syncDirectory(dirname(path));
};

const atomicJson = (path: string, value: unknown) => atomicBytes(path, `${canonicalJson(value)}\n`);

export class LocalRuntimeState {
  readonly stateRoot: string;
  private readonly logPath: string;
  private readonly headPath: string;
  private readonly snapshotPath: string;
  private readonly lockPath: string;

  constructor(private readonly runtimeRoot: string, private readonly projectId: string, private readonly options: RuntimeStateOptions = {}) {
    const projectHash = createHash('sha256').update(projectId).digest('hex');
    this.stateRoot = join(runtimeRoot, 'state', 'projects', projectHash);
    this.logPath = join(this.stateRoot, 'events.jsonl');
    this.headPath = join(this.stateRoot, 'head.json');
    this.snapshotPath = join(this.stateRoot, 'snapshot.json');
    this.lockPath = join(this.stateRoot, 'writer.lock');
  }

  artifactRelativePath(path: string) {
    const result = relative(resolve(this.runtimeRoot), resolve(path));
    if (!result || result === '..' || result.startsWith(`..${sep}`)) throw new Error(`Runtime artifact must be beneath runtime root: ${path}`);
    return result.split(sep).join('/');
  }

  private genesis(): Snapshot {
    return {schemaVersion: SCHEMA_VERSION, projectId: this.projectId, verifiedEventCount: 0, head: null, planOutputs: [], renderOutputs: []};
  }

  private async acquireLock() {
    await mkdir(this.stateRoot, {recursive: true});
    try { await mkdir(this.lockPath); } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
        let owner = 'unknown owner';
        try { owner = (await readFile(join(this.lockPath, 'owner.json'), 'utf8')).trim(); } catch { /* conservative: do not steal */ }
        throw new Error(`Runtime state writer lock is already held (${owner})`);
      }
      throw error;
    }
    try {
      await writeFile(join(this.lockPath, 'owner.json'), `${canonicalJson({pid: process.pid, startedAt: new Date().toISOString(), projectId: this.projectId})}\n`, {flag: 'wx'});
    } catch (error) {
      await rm(this.lockPath, {recursive: true, force: true});
      throw error;
    }
  }

  private async withLock<T>(action: () => Promise<T>): Promise<T> {
    await this.acquireLock();
    try { return await action(); } finally { await rm(this.lockPath, {recursive: true, force: true}); }
  }

  private validateEvent(event: RuntimeEvent, index: number, previousHash: string) {
    const {eventHash, ...body} = event;
    if (event.schemaVersion !== SCHEMA_VERSION || event.projectId !== this.projectId || !['plan-materialized','render-verified'].includes(event.type) || event.sequence !== index + 1 || event.previousHash !== previousHash || !isHash(eventHash) || !Array.isArray(event.inputHashes) || !event.inputHashes.every(isHash) || !Array.isArray(event.outputHashes) || !event.outputHashes.every(isHash) || typeof event.artifactPath !== 'string' || !event.artifactPath || event.artifactPath.startsWith('/') || event.artifactPath.split('/').includes('..')) throw new Error(`Invalid event or hash-chain gap at sequence ${index + 1}`);
    if (sha256(canonicalJson(body)) !== eventHash) throw new Error(`Divergent event hash at sequence ${event.sequence}`);
  }

  private async reconstructLocked(): Promise<ReconstructedState & {committedBytes: string; suffix: string}> {
    let head: Head | undefined;
    try {
      const parsed = JSON.parse(await readFile(this.headPath, 'utf8')) as Head;
      if (parsed.schemaVersion !== SCHEMA_VERSION || parsed.projectId !== this.projectId || !Number.isInteger(parsed.sequence) || parsed.sequence < 1 || !isHash(parsed.eventHash)) throw new Error('Invalid or unsupported committed runtime head');
      head = parsed;
    } catch (error) {
      if (!isMissing(error)) {
        if (error instanceof SyntaxError) throw new Error('Malformed runtime head JSON');
        throw error;
      }
    }

    let log = '';
    try { log = await readFile(this.logPath, 'utf8'); } catch (error) {
      if (!isMissing(error)) throw error;
      if (head) throw new Error('Committed head references an absent runtime event log');
    }
    const count = head?.sequence ?? 0;
    const events: RuntimeEvent[] = [];
    let previousHash = GENESIS_HASH;
    let offset = 0;
    for (let index = 0; index < count; index++) {
      const newline = log.indexOf('\n', offset);
      if (newline < 0) throw new Error(`Committed head references absent bytes at sequence ${index + 1}`);
      let event: RuntimeEvent;
      try { event = JSON.parse(log.slice(offset, newline)) as RuntimeEvent; } catch { throw new Error(`Malformed committed runtime event at line ${index + 1}`); }
      this.validateEvent(event, index, previousHash);
      previousHash = event.eventHash;
      events.push(event);
      offset = newline + 1;
    }
    if (head && previousHash !== head.eventHash) throw new Error(`Committed head mismatch at sequence ${head.sequence}`);
    const suffix = log.slice(offset);
    const outputs = (type: RuntimeEvent['type']) => events.filter((event) => event.type === type).map(({inputHashes, outputHashes, artifactPath}) => ({inputHashes, outputHashes, artifactPath}));
    const snapshot: Snapshot = count === 0 ? this.genesis() : {schemaVersion: SCHEMA_VERSION, projectId: this.projectId, verifiedEventCount: count, head: previousHash, planOutputs: outputs('plan-materialized'), renderOutputs: outputs('render-verified')};
    let snapshotCurrent = false;
    try { snapshotCurrent = canonicalJson(JSON.parse(await readFile(this.snapshotPath, 'utf8'))) === canonicalJson(snapshot); } catch { /* disposable */ }
    if (!snapshotCurrent) await atomicJson(this.snapshotPath, snapshot);
    return {...snapshot, discardedIncompleteTail: suffix.length > 0, committedBytes: log.slice(0, offset), suffix};
  }

  async reconstruct(): Promise<ReconstructedState> {
    return this.withLock(async () => {
      const {committedBytes: _committedBytes, suffix: _suffix, ...state} = await this.reconstructLocked();
      return state;
    });
  }

  async recordMaterialized(artifact: MaterializedArtifact): Promise<{cache: 'hit' | 'miss'; state: ReconstructedState}> {
    return this.recordArtifact('plan-materialized', artifact);
  }

  async recordRenderVerified(artifact: MaterializedArtifact): Promise<{cache: 'hit' | 'miss'; state: ReconstructedState}> {
    return this.recordArtifact('render-verified', artifact);
  }

  private async recordArtifact(type: RuntimeEvent['type'], artifact: MaterializedArtifact): Promise<{cache: 'hit' | 'miss'; state: ReconstructedState}> {
    return this.withLock(async () => {
      const current = await this.reconstructLocked();
      if (current.suffix) {
        await atomicBytes(`${this.logPath}.uncommitted-${Date.now()}-${randomUUID()}`, current.suffix);
        await atomicBytes(this.logPath, current.committedBytes);
      }
      const collection = type === 'plan-materialized' ? current.planOutputs : current.renderOutputs;
      const existing = collection.find((output) => canonicalJson(output.inputHashes) === canonicalJson(artifact.inputHashes));
      if (existing) {
        if (canonicalJson(existing) !== canonicalJson(artifact)) throw new Error('Cache input maps to divergent materialized artifact');
        const {committedBytes: _committedBytes, suffix: _suffix, ...state} = current;
        return {cache: 'hit', state: {...state, discardedIncompleteTail: false}};
      }
      const sequence = current.verifiedEventCount + 1;
      const previousHash = current.head ?? GENESIS_HASH;
      const eventId = sha256(canonicalJson({projectId: this.projectId, sequence, type, artifactHash: artifact.outputHashes[0]}));
      const body = {schemaVersion: SCHEMA_VERSION, projectId: this.projectId, sequence, eventId, previousHash, type, ...artifact};
      const event: RuntimeEvent = {...body, eventHash: sha256(canonicalJson(body))};
      const logFile = await open(this.logPath, 'a');
      try { await logFile.write(`${canonicalJson(event)}\n`); await logFile.sync(); } finally { await logFile.close(); }
      await syncDirectory(this.stateRoot);
      await this.options.afterStage?.('after-append');
      const snapshot: Snapshot = {schemaVersion: SCHEMA_VERSION, projectId: this.projectId, verifiedEventCount: sequence, head: event.eventHash, planOutputs: type === 'plan-materialized' ? [...current.planOutputs, artifact] : current.planOutputs, renderOutputs: type === 'render-verified' ? [...current.renderOutputs, artifact] : current.renderOutputs};
      await atomicJson(this.snapshotPath, snapshot);
      await this.options.afterStage?.('after-snapshot');
      await atomicJson(this.headPath, {schemaVersion: SCHEMA_VERSION, projectId: this.projectId, sequence, eventHash: event.eventHash});
      await this.options.afterStage?.('after-head');
      return {cache: 'miss', state: {...snapshot, discardedIncompleteTail: false}};
    });
  }
}
