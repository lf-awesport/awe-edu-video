import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chmodSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import YAML from 'yaml';

const run = (...args: string[]) => JSON.parse(execFileSync('node', ['--import', 'tsx', 'src/cli.ts', ...args, '--json'], {encoding: 'utf8'}));
const projectState = (root: string, projectId = 'awe-pilot-example') => join(root, 'state', 'projects', createHash('sha256').update(projectId).digest('hex'));
describe('CLI public seam', () => {
  it('discovers and quotes through an injected executable without a submit path', () => {
    const root = mkdtempSync(join(tmpdir(), 'video-provider-'));
    const executable = join(root, 'fake-higgsfield');
    const log = join(root, 'argv.jsonl');
    writeFileSync(executable, `#!/usr/bin/env node
const fs = require('node:fs'); const args = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(log)}, JSON.stringify(args) + '\\n');
if (args[0] === '--version') console.log('higgsfield 1.1.20 (fake)');
else if (args[0] === 'workspace') console.log(JSON.stringify({id:'redacted-ready',name:null,plan_type:'free',credits:10,is_selected:true,user_role:'owner'}));
else if (args[0] === 'model') console.log(JSON.stringify({display_name:'Seedance 2.0 Mini',job_type:'seedance_2_0_mini',type:'video',rules:[],params:[{name:'prompt',type:'string',required:true},{name:'duration',type:'integer',default:5,required:false,enum:[5]},{name:'resolution',type:'string',default:'720p',required:false,enum:['720p']},{name:'aspect_ratio',type:'string',default:'16:9',required:false,enum:['16:9']},{name:'generate_audio',type:'boolean',default:true,required:false}]}));
else if (args[0] === 'generate' && args[1] === 'cost') console.log(JSON.stringify({credits:12.5}));
else process.exit(9);
`);
    chmodSync(executable, 0o755);
    const doctor = run('provider', 'doctor', '--provider', 'higgsfield', '--provider-executable', executable, '--runtime-root', root);
    expect(doctor.result.ready).toBe(true);
    expect(doctor.result.snapshotPath).not.toMatch(/^\//);
    const preflight = run('preflight', '--scope', 'provider', '--refresh-quotes', '--provider-executable', executable, '--runtime-root', root);
    expect(preflight.result).toMatchObject({quoteStatus: 'missing', priceObservationStatus: 'current-non-authorizing', quoteBindings: []});
    expect(preflight.result.candidateCostObservations).toHaveLength(4);
    expect(preflight.result.candidateCostObservations[0]).toMatchObject({basis:'price-observation', authorizing:false});
    expect(preflight.result.costEstimate).toMatchObject({unit:'credits', minimum:{amount:25, quantity:2}, expected:{amount:50, quantity:4}, maximum:{amount:50, quantity:4}});
    expect(preflight.result.freshness.expiresAt).toBeNull();
    const calls = readFileSync(log, 'utf8').trim().split('\n').map((line) => JSON.parse(line) as string[]);
    const costCalls = calls.filter((call) => call[0] === 'generate' && call[1] === 'cost');
    expect(costCalls).toHaveLength(2);
    expect(costCalls.every((call) => call.includes('--generate-audio=false'))).toBe(true);
    expect(calls.some((call) => call.includes('create') || call.includes('upload'))).toBe(false);
  }, 30_000);

  it.each([
    ['missing 720p', "params.find(p=>p.name==='resolution').enum=['1080p']"],
    ['missing 16:9', "params.find(p=>p.name==='aspect_ratio').enum=['9:16']"],
    ['wrong job type', "payload.job_type='other'; payload.type='image'"],
  ])('blocks doctor and writes no snapshot for %s capability drift', (_label, mutation) => {
    const root = mkdtempSync(join(tmpdir(), 'video-provider-drift-'));
    const executable = join(root, 'fake-higgsfield');
    writeFileSync(executable, `#!/usr/bin/env node
const args=process.argv.slice(2); const params=[{name:'prompt',type:'string',required:true},{name:'duration',type:'integer',default:5,required:false,enum:[5]},{name:'resolution',type:'string',required:false,enum:['720p']},{name:'aspect_ratio',type:'string',required:false,enum:['16:9']},{name:'generate_audio',type:'boolean',default:false,required:false,enum:[false]}]; const payload={display_name:'Seedance',job_type:'seedance_2_0_mini',type:'video',rules:[],params}; ${mutation};
if(args[0]==='--version') console.log('higgsfield 1.1.20'); else if(args[0]==='workspace') console.log(JSON.stringify({workspace:{id:'selected'}})); else if(args[0]==='model') console.log(JSON.stringify(payload)); else process.exit(9);`);
    chmodSync(executable, 0o755);
    const doctor = run('provider', 'doctor', '--provider-executable', executable, '--runtime-root', root);
    expect(doctor.result).toMatchObject({ready:false, model:'blocked', snapshotPath:null});
    expect(doctor.artifacts).toEqual([]);
  }, 30_000);

  it('keeps provider preflight offline unless refresh is explicit', () => {
    const result = run('preflight', '--scope', 'provider', '--provider-executable', '/must/not/run');
    expect(result.result).toMatchObject({networkIntent: 'offline', quoteStatus: 'missing'});
  }, 30_000);
  it('validates the declarative 13-scene AWE project and exposes blockers', () => {
    const result = run('validate', '--project', 'examples/awe-project.yaml');
    expect(result.schemaVersion).toBe('1.0.0');
    expect(result.result.valid).toBe(true);
    expect(result.result.sceneCount).toBe(13);
    expect(result.result.releaseStatus).toBe('internal-preview-only');
    expect(result.result.blockers.length).toBeGreaterThan(0);
    expect(result.result.blockers.every((blocker: string) => !blocker.endsWith(':unverified'))).toBe(true);
  }, 30_000);
  it.each([
    ['fractional frame durations', (project: any) => { project.storyboard.scenes[0].seconds += 0.01; project.storyboard.scenes[1].seconds -= 0.01; }],
    ['duplicate claim IDs', (project: any) => { project.claims = [{id:'duplicate',status:'unverified'},{id:'duplicate',status:'unverified'}]; }],
  ])('rejects %s during CLI validation', (_label, mutate) => {
    const root = mkdtempSync(join(tmpdir(), 'video-project-invalid-'));
    const path = join(root, 'project.yaml');
    const project = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    mutate(project); writeFileSync(path, YAML.stringify(project));
    expect(() => run('validate', '--project', path)).toThrow();
  }, 30_000);
  it('reports zero generation cost while retaining unknown costs', () => {
    const result = run('preflight', '--project', 'examples/awe-project.yaml', '--scene', 'scene-03');
    expect(result.result.costs.generation.amount).toBe(0);
    expect(result.result.costs.localRender.status).toBe('unknown');
    expect(result.result.costs.remotionLicense.status).toBe('unknown');
  }, 30_000);

  it('imports an immutable voice candidate and reports the authored timing delta', () => {
    const root = mkdtempSync(join(tmpdir(), 'video-voice-candidate-'));
    const source = join(root, 'source.mp3');
    execFileSync('ffmpeg', ['-v','error','-f','lavfi','-i','sine=frequency=440:duration=6.648','-ar','24000','-ac','1',source]);
    const result = run(
      'candidate', 'import', '--kind', 'voice', '--scene', 'scene-01', '--file', source,
      '--candidate-id', 'voice-s01-smoke-01', '--source-provider', 'higgsfield',
      '--source-model', 'text2speech_v2:seed_speech', '--source-job-id', 'job-smoke-01',
      '--voice-id', 'preset-smoke-01', '--runtime-root', join(root, 'runtime'),
    );
    expect(result.result).toMatchObject({
      candidateId: 'voice-s01-smoke-01', sceneId: 'scene-01', authoredDurationSeconds: 5,
      selectionStatus: 'blocked-timing-proposal-required', releaseStatus: 'internal-preview-only',
    });
    expect(result.result.durationSeconds).toBeCloseTo(6.696, 2);
    expect(result.result.durationDeltaSeconds).toBeCloseTo(1.696, 2);
    expect(result.result.audioSha256).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(result.result.manifestPath).not.toContain(source);
    const manifest = JSON.parse(readFileSync(join(root, 'runtime', result.result.manifestPath), 'utf8'));
    expect(manifest).toMatchObject({
      id: 'voice-s01-smoke-01', projectId: 'awe-pilot-example', sceneId: 'scene-01',
      utteranceIds: ['utt-s01-01'], source: {provider: 'higgsfield', model: 'text2speech_v2:seed_speech'},
      timing: {authoredDurationSeconds: 5, selectionStatus: 'blocked-timing-proposal-required'},
    });
    expect(manifest.audioAsset.path).toMatch(/^blobs\/sha256\/[a-f0-9]{64}\/audio\.mp3$/);
  }, 30_000);

  it('records one materialization, reuses it, and reconstructs state', () => {
    const root = mkdtempSync(join(tmpdir(), 'video-state-'));
    const first = run('build', '--project', 'examples/awe-project.yaml', '--runtime-root', root);
    const second = run('build', '--project', 'examples/awe-project.yaml', '--runtime-root', root);
    const status = run('status', '--project', 'examples/awe-project.yaml', '--runtime-root', root);
    const reconstructed = run('reconstruct', '--project', 'examples/awe-project.yaml', '--runtime-root', root);
    expect(first.result.cache).toBe('miss');
    expect(second.result.cache).toBe('hit');
    expect(status.result.verifiedEventCount).toBe(1);
    expect(status.result.planOutputs).toHaveLength(1);
    expect(reconstructed.result).toEqual(status.result);
  }, 30_000);
  it('materializes and caches the full preview independently from Scene 3', () => {
    const root = mkdtempSync(join(tmpdir(), 'video-master-state-'));
    const first = run('build', '--to', 'preview', '--runtime-root', root);
    const second = run('build', '--to', 'preview', '--runtime-root', root);
    const scene = run('build', '--scene', 'scene-03', '--to', 'preview', '--runtime-root', root);
    const state = run('reconstruct', '--runtime-root', root);
    expect(first.result).toMatchObject({cache:'miss',totalFrames:2550,planHash:'sha256:4c1b775b6f97fa61e41bc478b462760158afbc00d3ad286422a3d196d134fd2d'});
    expect(second.result.cache).toBe('hit');
    expect(scene.result).toMatchObject({cache:'miss',totalFrames:180});
    expect(state.result.planOutputs).toHaveLength(2);
  }, 30_000);
  it('fails closed with a useful diagnostic for a corrupt event log', () => {
    const root = mkdtempSync(join(tmpdir(), 'video-state-corrupt-'));
    run('build', '--project', 'examples/awe-project.yaml', '--runtime-root', root);
    const log = join(projectState(root), 'events.jsonl');
    writeFileSync(log, readFileSync(log, 'utf8').replace('plan-materialized', 'plan-corrupted'));
    expect(() => run('reconstruct', '--project', 'examples/awe-project.yaml', '--runtime-root', root)).toThrow(/Invalid event|hash-chain|Divergent/);
  }, 30_000);
});
