import {execFileSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import YAML from 'yaml';
import {compileMaster, compileScene} from '../src/compiler.js';
import {computeRenderIdentity, FFMPEG_TRANSFORM, prepareRenderEvidence, publishRenderEvidence, renderEvidencePaths, renderIdentityFromInputs, verifyRenderEvidence} from '../src/render-evidence.js';

const sourceHashes = {'src/remotion.tsx': `sha256:${'1'.repeat(64)}`, 'src/remotion-entry.tsx': `sha256:${'2'.repeat(64)}`} as const;
const input = {renderPlanHash:`sha256:${'3'.repeat(64)}`,compositionId:'Scene03' as const,sourceHashes,remotionVersion:'4.0.507',delivery:{width:1920,height:1080,fps:30,totalFrames:180}};

describe('immutable render evidence seam', () => {
  it('is deterministic and changes for source and render configuration changes', () => {
    const first = renderIdentityFromInputs(input);
    expect(renderIdentityFromInputs(input)).toEqual(first);
    expect(renderIdentityFromInputs({...input, sourceHashes:{...sourceHashes,'src/remotion.tsx':`sha256:${'4'.repeat(64)}`}}).renderIdentityHash).not.toBe(first.renderIdentityHash);
    expect(renderIdentityFromInputs({...input, delivery:{...input.delivery,fps:24}}).renderIdentityHash).not.toBe(first.renderIdentityHash);
  });

  it('preserves the rendered audio stream in the immutable delivery transform', () => {
    expect(FFMPEG_TRANSFORM.arguments).toContain('0:a:0?');
    expect(FFMPEG_TRANSFORM.arguments).not.toContain('-an');
    expect(FFMPEG_TRANSFORM.arguments).toContain('$DURATION');
  });

  it('fails closed when runtime-selected media bytes differ from the hash-bound plan', async () => {
    const project = YAML.parse(readFileSync('examples/awe-project.yaml','utf8'));
    const plan = compileMaster(project);
    const changed = structuredClone(plan);
    changed.scenes[0]!.media!.voice.sha256 = `sha256:${'0'.repeat(64)}`;
    await expect(computeRenderIdentity(changed, 'AweMaster')).rejects.toThrow(/media hash/);
  });

  it('rejects a same-profile replacement by hash before technical verification', async () => {
    const root = mkdtempSync(join(tmpdir(), 'render-evidence-'));
    const plan = compileScene(YAML.parse(readFileSync('examples/awe-project.yaml','utf8')), 'scene-03');
    const identity = await computeRenderIdentity(plan, 'Scene03');
    const staged = join(root, 'staged.mp4');
    const make = (path:string, color:string) => execFileSync('ffmpeg',['-v','error','-f','lavfi','-i',`color=${color}:s=1920x1080:r=30:d=6`,'-c:v','libx264','-an',path]);
    make(staged, 'white');
    const evidence = await publishRenderEvidence(root, plan, identity, staged);
    await expect(verifyRenderEvidence(root, plan, identity)).resolves.toMatchObject({technicalVerified:true});
    make(join(root,'replacement.mp4'), 'black');
    writeFileSync(evidence.mediaPath, readFileSync(join(root,'replacement.mp4')));
    await expect(verifyRenderEvidence(root, plan, identity)).rejects.toThrow(/SHA-256/);
  }, 30_000);

  it('fails closed for missing and tampered manifests', async () => {
    const root = mkdtempSync(join(tmpdir(), 'render-manifest-'));
    const plan = compileScene(YAML.parse(readFileSync('examples/awe-project.yaml','utf8')), 'scene-03');
    const identity = await computeRenderIdentity(plan, 'Scene03');
    await expect(verifyRenderEvidence(root, plan, identity)).rejects.toThrow(/Missing render manifest/);
    const staged = join(root,'staged.mp4');
    execFileSync('ffmpeg',['-v','error','-f','lavfi','-i','color=white:s=1920x1080:r=30:d=6','-c:v','libx264','-an',staged]);
    const evidence = await publishRenderEvidence(root, plan, identity, staged);
    writeFileSync(evidence.manifestPath, readFileSync(evidence.manifestPath,'utf8').replace('internal-preview-only','tampered'));
    await expect(verifyRenderEvidence(root, plan, identity)).rejects.toThrow(/canonical|tampered/);
  }, 30_000);

  it('reuses valid evidence and fails closed instead of overwriting tampered evidence', async () => {
    const root = mkdtempSync(join(tmpdir(), 'render-prepare-'));
    const plan = compileScene(YAML.parse(readFileSync('examples/awe-project.yaml','utf8')), 'scene-03');
    const identity = await computeRenderIdentity(plan, 'Scene03');
    const staged = join(root,'staged.mp4');
    execFileSync('ffmpeg',['-v','error','-f','lavfi','-i','color=white:s=1920x1080:r=30:d=6','-c:v','libx264','-an',staged]);
    const published = await publishRenderEvidence(root, plan, identity, staged);

    await expect(prepareRenderEvidence(root, plan, identity)).resolves.toMatchObject({cache:'hit', evidence:{mediaSha256:published.mediaSha256}});
    const originalMedia = readFileSync(published.mediaPath);
    writeFileSync(published.manifestPath, readFileSync(published.manifestPath,'utf8').replace('internal-preview-only','tampered'));
    await expect(prepareRenderEvidence(root, plan, identity)).rejects.toThrow(/canonical|tampered/);
    expect(readFileSync(published.mediaPath)).toEqual(originalMedia);
  }, 30_000);

  it('preserves orphan media and allows fresh evidence publication', async () => {
    const root = mkdtempSync(join(tmpdir(), 'render-orphan-'));
    const plan = compileScene(YAML.parse(readFileSync('examples/awe-project.yaml','utf8')), 'scene-03');
    const identity = await computeRenderIdentity(plan, 'Scene03');
    const paths = renderEvidencePaths(root, identity.renderIdentityHash, 'Scene03');
    execFileSync('mkdir',['-p',paths.directory]);
    writeFileSync(paths.mediaPath, 'incomplete publication');

    const prepared = await prepareRenderEvidence(root, plan, identity);
    expect(prepared).toMatchObject({cache:'miss'});
    if (prepared.cache !== 'miss') throw new Error('Expected cache miss');
    expect(prepared.orphanPath).toMatch(/\.orphan-/);
    expect(readFileSync(prepared.orphanPath!,'utf8')).toBe('incomplete publication');
    expect(existsSync(paths.mediaPath)).toBe(false);

    const staged = join(root,'fresh.mp4');
    execFileSync('ffmpeg',['-v','error','-f','lavfi','-i','color=black:s=1920x1080:r=30:d=6','-c:v','libx264','-an',staged]);
    await expect(publishRenderEvidence(root, plan, identity, staged)).resolves.toMatchObject({technicalVerified:true});
    expect(readFileSync(prepared.orphanPath!,'utf8')).toBe('incomplete publication');
  }, 30_000);
});
