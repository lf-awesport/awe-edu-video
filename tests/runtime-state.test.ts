import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {LocalRuntimeState, type RuntimeCommitStage} from '../src/runtime-state.js';

const hash = (digit: string) => `sha256:${digit.repeat(64)}`;
const artifact = (digit = '1') => ({inputHashes: [hash(digit)], outputHashes: [hash('f')], artifactPath: `plans/${digit}.json`});

describe('LocalRuntimeState crash recovery seam', () => {
  for (const stage of ['after-append', 'after-snapshot', 'after-head'] as RuntimeCommitStage[]) {
    it(`recovers a failure ${stage}`, async () => {
      const root = mkdtempSync(join(tmpdir(), 'runtime-crash-'));
      const crashing = new LocalRuntimeState(root, 'project', {afterStage: (seen) => { if (seen === stage) throw new Error('crash'); }});
      await expect(crashing.recordMaterialized(artifact())).rejects.toThrow('crash');
      const recovered = new LocalRuntimeState(root, 'project');
      const before = await recovered.reconstruct();
      expect(before.verifiedEventCount).toBe(stage === 'after-head' ? 1 : 0);
      expect(before.discardedIncompleteTail).toBe(stage !== 'after-head');
      const next = await recovered.recordMaterialized(artifact());
      expect(next.cache).toBe(stage === 'after-head' ? 'hit' : 'miss');
      expect((await recovered.reconstruct()).verifiedEventCount).toBe(1);
    });
  }

  it('quarantines complete and malformed uncommitted suffixes before the next append', async () => {
    for (const suffix of ['{"complete":true}\n', '{broken']) {
      const root = mkdtempSync(join(tmpdir(), 'runtime-tail-'));
      const state = new LocalRuntimeState(root, 'project');
      await state.recordMaterialized(artifact());
      const log = join(state.stateRoot, 'events.jsonl');
      writeFileSync(log, readFileSync(log, 'utf8') + suffix);
      expect((await state.reconstruct()).discardedIncompleteTail).toBe(true);
      await state.recordMaterialized(artifact('2'));
      expect((await state.reconstruct()).verifiedEventCount).toBe(2);
    }
  });

  it('rebuilds missing and stale snapshots from the committed prefix', async () => {
    const root = mkdtempSync(join(tmpdir(), 'runtime-snapshot-'));
    const state = new LocalRuntimeState(root, 'project');
    await state.recordMaterialized(artifact());
    const snapshot = join(state.stateRoot, 'snapshot.json');
    rmSync(snapshot);
    expect((await state.reconstruct()).verifiedEventCount).toBe(1);
    writeFileSync(snapshot, '{}');
    expect((await state.reconstruct()).verifiedEventCount).toBe(1);
  });

  it('reconstructs independently cached render verification evidence', async () => {
    const root = mkdtempSync(join(tmpdir(), 'runtime-render-'));
    const state = new LocalRuntimeState(root, 'project');
    const evidence = {inputHashes:[hash('8')],outputHashes:[hash('9'),hash('a')],artifactPath:'renders/identity/render-manifest.json'};
    expect((await state.recordRenderVerified(evidence)).cache).toBe('miss');
    expect((await state.recordRenderVerified(evidence)).cache).toBe('hit');
    expect((await state.reconstruct()).renderOutputs).toEqual([evidence]);
  });

  it('rejects a simultaneous writer and isolates project locks', async () => {
    const root = mkdtempSync(join(tmpdir(), 'runtime-lock-'));
    let release!: () => void;
    const paused = new Promise<void>((resolve) => { release = resolve; });
    const first = new LocalRuntimeState(root, 'one', {afterStage: async (stage) => { if (stage === 'after-append') await paused; }});
    const pending = first.recordMaterialized(artifact());
    await new Promise((resolve) => setTimeout(resolve, 30));
    await expect(new LocalRuntimeState(root, 'one').recordMaterialized(artifact('2'))).rejects.toThrow(/writer lock/);
    await expect(new LocalRuntimeState(root, 'two').recordMaterialized(artifact())).resolves.toMatchObject({cache: 'miss'});
    release();
    await pending;
  });
});
