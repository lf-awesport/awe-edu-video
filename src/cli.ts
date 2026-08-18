import {spawnSync} from 'node:child_process';
import {access, mkdir, open, readFile, rename, rm} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {dirname, join, resolve} from 'node:path';
import YAML from 'yaml';
import {canonicalHash, canonicalJson, compileMaster, compileScene} from './compiler.js';
import {CandidateCostObservationSchema, CostEstimateSchema, PriceObservationSchema, ProjectSchema, QuoteFreshnessSchema, RenderPlanSchema, type Project} from './schema.js';
import {LocalRuntimeState} from './runtime-state.js';
import {HiggsfieldQuoteAdapter} from './providers/higgsfield.js';
import {CapabilitySnapshotSchema} from './schema.js';
import {computeRenderIdentity, FFMPEG_TRANSFORM, INTERNAL_SCALE, prepareRenderEvidence, publishRenderEvidence, renderEvidencePaths, verifyRenderEvidence} from './render-evidence.js';
import {importVoiceCandidate} from './voice-candidate.js';

const args = process.argv.slice(2);
const command = args[0];
const jsonOutput = args.includes('--json');

const option = (name: string, fallback?: string) => {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
};

const projectPath = resolve(option('--project', 'examples/awe-project.yaml')!);
const sceneId = option('--scene', 'scene-03')!;
const masterPreview = option('--to') === 'preview' && !args.includes('--scene');
const runtimeRoot = option('--runtime-root', '.video')!;
const providerExecutable = option('--provider-executable', 'higgsfield')!;

const respond = (projectId: string, result: unknown, artifacts: unknown[] = []) => {
  console.log(
    JSON.stringify(
      {
        schemaVersion: '1.0.0',
        projectId,
        command,
        result,
        diagnostics: [],
        artifacts,
      },
      null,
      jsonOutput ? 0 : 2,
    ),
  );
};

const loadProject = async () =>
  ProjectSchema.parse(YAML.parse(await readFile(projectPath, 'utf8')));

const planPath = (hash: string) =>
  join(runtimeRoot, 'plans', hash.replace(':', '-'), 'render-plan.json');

const materializePlan = async (project: Project, scene: string) => {
  const plan = masterPreview ? compileMaster(project) : compileScene(project, scene);
  const path = planPath(plan.planHash);
  await mkdir(dirname(path), {recursive: true});
  const materializationLock = join(dirname(path), '.materialize.lock');
  try {
    await mkdir(materializationLock);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') throw new Error(`Plan materialization is already in progress: ${path}`);
    throw error;
  }

  try {
    try {
      await access(path);
      const existing = RenderPlanSchema.parse(JSON.parse(await readFile(path, 'utf8')));
      if (canonicalJson(existing) !== canonicalJson(plan)) {
        throw new Error(`Plan hash collision or corrupt immutable plan: ${path}`);
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        const bytes = `${canonicalJson(plan)}\n`;
        const temporary = join(dirname(path), `.render-plan.${process.pid}.${randomUUID()}.tmp`);
        const file = await open(temporary, 'wx');
        try {
          await file.writeFile(bytes);
          await file.sync();
        } finally {
          await file.close();
        }
        try {
          const staged = RenderPlanSchema.parse(JSON.parse(await readFile(temporary, 'utf8')));
          const {id: _id, planHash, ...hashBody} = staged;
          if (canonicalJson(staged) !== canonicalJson(plan) || canonicalHash(hashBody) !== planHash) throw new Error(`Staged immutable plan failed verification: ${path}`);
          await rename(temporary, path);
          try { const directory = await open(dirname(path), 'r'); try { await directory.sync(); } finally { await directory.close(); } } catch { /* best effort */ }
        } finally {
          await rm(temporary, {force: true});
        }
      } else {
        throw error;
      }
    }
  } finally {
    await rm(materializationLock, {recursive: true, force: true});
  }

  return {plan, path};
};

const runChecked = (executable: string, executableArgs: string[]) => {
  const result = spawnSync(executable, executableArgs, {encoding: 'utf8'});
  if (result.status !== 0) {
    throw new Error(result.stderr || `${executable} exited with ${result.status}`);
  }
  return result.stdout;
};

try {
  const project = await loadProject();

  if (command === 'provider' && args[1] === 'doctor') {
    if (option('--provider', 'higgsfield') !== 'higgsfield') throw new Error('Unsupported provider');
    const result = await new HiggsfieldQuoteAdapter(runtimeRoot, providerExecutable).doctor();
    respond(project.projectId, result, typeof result.snapshotPath === 'string' ? [{type: 'CapabilitySnapshot', path: result.snapshotPath}] : []);
  } else if (command === 'validate') {
    respond(project.projectId, {
      valid: true,
      sceneCount: project.storyboard.scenes.length,
      requestedDurationSeconds: project.storyboard.scenes.reduce(
        (total, scene) => total + scene.seconds,
        0,
      ),
      releaseStatus: project.status,
      blockers: [
        ...project.claims.map((claim) => `${claim.id}:unverified`),
        ...project.storyboard.scenes
          .filter((scene) => scene.status === 'missing')
          .map((scene) => `${scene.id}:missing`),
      ],
    });
  } else if (command === 'build') {
    const {plan, path} = await materializePlan(project, sceneId);
    const state = new LocalRuntimeState(runtimeRoot, project.projectId);
    const recorded = await state.recordMaterialized({
      inputHashes: [canonicalHash({project, scope: masterPreview ? 'master-preview' : sceneId})],
      outputHashes: [plan.planHash],
      artifactPath: state.artifactRelativePath(path),
    });
    respond(
      project.projectId,
      {planHash: plan.planHash, path, totalFrames: plan.totalFrames, cache: recorded.cache},
      [{type: 'RenderPlan', path, hash: plan.planHash}],
    );
  } else if (command === 'status' || command === 'reconstruct') {
    const state = await new LocalRuntimeState(runtimeRoot, project.projectId).reconstruct();
    respond(project.projectId, state);
  } else if (command === 'preflight') {
    const scope = option('--scope');
    const providerScope = scope === 'provider' || sceneId === 'scene-01' || sceneId === 'scene-13';
    if (!providerScope) {
      if (sceneId !== 'scene-03') throw new Error('Preflight supports scene-01, scene-03, scene-13, or --scope provider');
      respond(project.projectId, {
      scope: {sceneId},
      costs: {
        generation: {
          status: 'known',
          amount: 0,
          unit: 'credits',
          reason: 'no provider generation',
        },
        localRender: {status: 'unknown', pricing: 'not-configured'},
        remotionLicense: {
          status: 'unknown',
          reason: 'company category/headcount missing; blocks production use',
        },
      },
      releaseStatus: project.status,
      });
    } else if (!args.includes('--refresh-quotes')) {
      respond(project.projectId, {scope: scope === 'provider' ? {provider: 'higgsfield'} : {sceneId}, networkIntent: 'offline', quoteStatus: 'missing', costEstimate: {status: 'unknown', unit: 'credits'}, blockers: ['fresh provider cost evidence requires explicit --refresh-quotes', 'submission is unavailable in this tracer']});
    } else {
      const adapter = new HiggsfieldQuoteAdapter(runtimeRoot, providerExecutable);
      const doctor = await adapter.doctor();
      if (doctor.ready !== true || typeof doctor.snapshotPath !== 'string') {
        respond(project.projectId, {scope: scope === 'provider' ? {provider: 'higgsfield'} : {sceneId}, networkIntent: 'explicit-refresh', quoteStatus: 'blocked', doctor, blockers: ['provider is not ready', 'submission is unavailable in this tracer']});
      } else {
        const snapshot = CapabilitySnapshotSchema.parse(JSON.parse(await readFile(join(runtimeRoot, doctor.snapshotPath), 'utf8')));
        const declarations = project.generations.filter((generation) => scope === 'provider' || generation.sceneId === sceneId);
        const observations = await Promise.all(declarations.map(({candidates: _candidates, inputStatus: _inputStatus, ...request}) => adapter.observePrice(request, snapshot)));
        const parsedObservations = observations.map((item) => PriceObservationSchema.parse(item));
        const candidateCostObservations = parsedObservations.flatMap((observation, index) => Array.from({length: declarations[index]!.candidates.balanced}, (_, candidate) => CandidateCostObservationSchema.parse({basis: 'price-observation', authorizing: false, sceneId: declarations[index]!.sceneId, candidate: candidate + 1, requestHash: observation.requestHash, capabilitySnapshotHash: observation.capabilitySnapshotHash, evidencePath: observation.evidencePath})));
        const minimum = observations.reduce((sum, item) => sum + item.amount, 0);
        const expected = observations.reduce((sum, item, index) => sum + item.amount * declarations[index]!.candidates.balanced, 0);
        const freshness = QuoteFreshnessSchema.parse({observedAt: parsedObservations.map((item) => item.observedAt), expiresAt: null, expiryStatus: 'not-provided-by-provider'});
        const costEstimate = CostEstimateSchema.parse({unit: 'credits', minimum: {amount: minimum, quantity: observations.length, formula: 'one candidate per scoped unique scene request'}, expected: {amount: expected, quantity: candidateCostObservations.length, formula: 'balanced profile candidate count × observed per-request credits'}, maximum: {amount: expected, quantity: candidateCostObservations.length, formula: 'expected; no authorized retry policy exists'}});
        respond(project.projectId, {scope: scope === 'provider' ? {provider: 'higgsfield'} : {sceneId}, networkIntent: 'explicit-refresh', quoteStatus: 'missing', priceObservationStatus: 'current-non-authorizing', freshness, observations: parsedObservations, candidateCostObservations, quoteBindings: [], costEstimate, blockers: ['price observations are non-authorizing and lack contractual quote binding', 'explicit budget and an authorizing quote are required', 'submission is unavailable in this tracer']}, [{type: 'CapabilitySnapshot', path: doctor.snapshotPath}, ...observations.map((item) => ({type: 'PriceObservation', path: item.evidencePath}))]);
      }
    }
  } else if (command === 'candidate' && args[1] === 'import') {
    if (option('--kind') !== 'voice') throw new Error('Only voice candidate import is supported');
    const file = option('--file'), candidateId = option('--candidate-id'), sourceProvider = option('--source-provider'), sourceModel = option('--source-model'), sourceJobId = option('--source-job-id'), voiceId = option('--voice-id');
    if (!file || !candidateId || !sourceProvider || !sourceModel || !sourceJobId || !voiceId) throw new Error('Voice candidate import requires --file, --candidate-id, --source-provider, --source-model, --source-job-id and --voice-id');
    const imported = await importVoiceCandidate({project,runtimeRoot,sceneId,file,candidateId,sourceProvider,sourceModel,sourceJobId,voiceId});
    const {manifest} = imported;
    respond(project.projectId, {
      candidateId:manifest.id, sceneId:manifest.sceneId, audioSha256:manifest.audioAsset.sha256,
      durationSeconds:manifest.audioAsset.durationSeconds, authoredDurationSeconds:manifest.timing.authoredDurationSeconds,
      durationDeltaSeconds:manifest.timing.durationDeltaSeconds, selectionStatus:manifest.timing.selectionStatus,
      releaseStatus:manifest.releaseStatus, manifestPath:imported.manifestPath, blockers:manifest.blockers,
    }, [{type:'VoiceCandidate',path:imported.manifestPath,hash:manifest.manifestHash},{type:'AudioAsset',path:manifest.audioAsset.path,hash:manifest.audioAsset.sha256}]);
  } else if (command === 'render') {
    const {plan, path: materializedPlanPath} = await materializePlan(project, sceneId);
    const state = new LocalRuntimeState(runtimeRoot, project.projectId);
    await state.recordMaterialized({
      inputHashes: [canonicalHash({project, scope: masterPreview ? 'master-preview' : sceneId})],
      outputHashes: [plan.planHash],
      artifactPath: state.artifactRelativePath(materializedPlanPath),
    });
    const compositionId = masterPreview ? 'AweMaster' : 'Scene03';
    const identity = await computeRenderIdentity(plan, compositionId);
    const prepared = await prepareRenderEvidence(runtimeRoot, plan, identity);
    const paths = renderEvidencePaths(runtimeRoot, identity.renderIdentityHash, compositionId);
    let evidence: Awaited<ReturnType<typeof publishRenderEvidence>>;
    if (prepared.cache === 'hit') {
      evidence = prepared.evidence;
    } else {
      const [{bundle}, {renderMedia, selectComposition}] = await Promise.all([
        import('@remotion/bundler'),
        import('@remotion/renderer'),
      ]);
      const unique = `${process.pid}.${randomUUID()}`;
      const remotionOutput = join(paths.directory, `.remotion.${unique}.tmp.mp4`);
      const deliveryOutput = join(paths.directory, `.delivery.${unique}.tmp.mp4`);
      await mkdir(paths.directory, {recursive: true});
      await rm(remotionOutput, {force: true});
      await rm(deliveryOutput, {force: true});

      try {
        const serveUrl = await bundle({
          entryPoint: resolve('src/remotion-entry.tsx'),
          publicDir: resolve('assets'),
          symlinkPublicDir: true,
        });
        const composition = await selectComposition({serveUrl, id: compositionId, inputProps: {plan}, timeoutInMilliseconds: 120_000});
        await renderMedia({
          serveUrl,
          composition,
          codec: 'h264',
          scale: INTERNAL_SCALE,
          outputLocation: remotionOutput,
          inputProps: {plan},
          overwrite: true,
          timeoutInMilliseconds: 120_000,
          concurrency: 1,
        });
        runChecked('ffmpeg', FFMPEG_TRANSFORM.arguments.map((argument) => argument
          .replace('$INPUT', remotionOutput)
          .replace('$WIDTH', String(plan.outputProfile.width))
          .replace('$HEIGHT', String(plan.outputProfile.height))
          .replace('$DURATION', String(plan.totalFrames / plan.outputProfile.fps))
          .replace('$OUTPUT', deliveryOutput)));
      } finally {
        await rm(remotionOutput, {force: true});
      }

      try { evidence = await publishRenderEvidence(runtimeRoot, plan, identity, deliveryOutput); }
      finally { await rm(deliveryOutput, {force:true}); }
    }
    await state.recordRenderVerified({inputHashes:[identity.renderIdentityHash],outputHashes:[canonicalHash(evidence.manifest),evidence.mediaSha256],artifactPath:state.artifactRelativePath(evidence.manifestPath)});
    respond(
      project.projectId,
      {
        path: evidence.mediaPath,
        manifestPath: evidence.manifestPath,
        renderIdentityHash: identity.renderIdentityHash,
        mediaSha256: evidence.mediaSha256,
        cache: prepared.cache,
        technicalVerified: true,
        planHash: plan.planHash,
        media: evidence.technicalProbe,
        releaseStatus: project.status,
        renderScale: INTERNAL_SCALE,
        previewQuality: 'native 1920x1080 deterministic motion render for internal review',
        deliveryScale: `${plan.outputProfile.width}x${plan.outputProfile.height}`,
      },
      [{type: 'MP4', path: evidence.mediaPath, hash: evidence.mediaSha256}, {type:'RenderManifest',path:evidence.manifestPath}],
    );
  } else if (command === 'verify') {
    const plan = masterPreview ? compileMaster(project) : compileScene(project, sceneId);
    const identity = await computeRenderIdentity(plan, masterPreview ? 'AweMaster' : 'Scene03');
    const evidence = await verifyRenderEvidence(runtimeRoot, plan, identity);
    const state = new LocalRuntimeState(runtimeRoot, project.projectId);
    await state.recordRenderVerified({inputHashes:[identity.renderIdentityHash],outputHashes:[canonicalHash(evidence.manifest),evidence.mediaSha256],artifactPath:state.artifactRelativePath(evidence.manifestPath)});
    respond(project.projectId, {
      technicalVerified: true,
      fullDecode: true,
      renderIdentityHash: identity.renderIdentityHash,
      manifestPath: evidence.manifestPath,
      mediaSha256: evidence.mediaSha256,
      media: evidence.technicalProbe,
      path: evidence.mediaPath,
      releaseStatus: project.status,
    });
  } else {
    throw new Error(`Unsupported command: ${command}`);
  }
} catch (error) {
  console.error(
    JSON.stringify({
      schemaVersion: '1.0.0',
      command,
      result: 'invalid',
      diagnostics: [error instanceof Error ? error.message : String(error)],
    }),
  );
  process.exitCode = 2;
}
