import {createHash} from 'node:crypto';
import {ProjectSchema, RenderPlanSchema, type Project, type RenderPlan} from './schema.js';

const canonicalize = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(canonicalize)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.entries(value)
            .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
            .map(([key, child]) => [key, canonicalize(child)]),
        )
      : value;

export const canonicalJson = (value: unknown) => JSON.stringify(canonicalize(value));
export const canonicalHash = (value: unknown) =>
  `sha256:${createHash('sha256').update(canonicalJson(value)).digest('hex')}`;

export function compileScene(raw: Project, sceneId: string): RenderPlan {
  const project = ProjectSchema.parse(raw);
  const scene = project.storyboard.scenes.find((candidate) => candidate.id === sceneId);
  if (!scene) throw new Error(`Unknown scene ID: ${sceneId}`);
  if (sceneId !== 'scene-03') throw new Error('T1 supports only scene-03');

  const totalFrames = Math.round(scene.seconds * project.outputProfile.fps);
  const body = {
    schemaVersion: '1.0.0' as const,
    projectId: project.projectId,
    storyboard: {id: project.storyboard.id, version: project.storyboard.version},
    releaseStatus: 'internal-preview-only' as const,
    outputProfile: project.outputProfile,
    totalFrames,
    scenes: [
      {
        id: scene.id,
        requestedDurationSeconds: scene.seconds,
        status: scene.status,
        renderer: 'placeholder',
        presentation: scene.presentation,
        claims: project.claims.filter((claim) => scene.presentation.claimIds.includes(claim.id)),
        frameInterval: {start: 0, end: totalFrames},
      },
    ],
    rendererRegistry: {
      placeholder: {
        id: 'awe-branded-placeholder',
        version: '1.0.0',
        network: false as const,
        runtimeWrites: false as const,
      },
    },
    blockers: [
      'AWE assets are missing',
      'claims are unverified',
      'rights, safe-area and loudness evidence are missing',
      'production use is blocked',
    ],
    compiler: {id: 'awe-plan-compiler', version: '1.0.0'},
  };
  const hash = canonicalHash(body);

  return RenderPlanSchema.parse({...body, id: `render-plan-${hash.slice(7, 19)}`, planHash: hash});
}

export function compileMaster(raw: Project): RenderPlan {
  const project = ProjectSchema.parse(raw);
  let cursor = 0;
  const scenes = project.storyboard.scenes.map((scene) => {
    const frames = scene.seconds * project.outputProfile.fps;
    if (!Number.isInteger(frames)) throw new Error(`Scene duration is not frame-exact: ${scene.id}`);
    const start = cursor; cursor += frames;
    return {id:scene.id, requestedDurationSeconds:scene.seconds, status:scene.status, renderer:'placeholder', presentation:scene.presentation, claims:project.claims.filter((claim) => scene.presentation.claimIds.includes(claim.id)), frameInterval:{start,end:cursor}};
  });
  const body = {
    schemaVersion:'1.0.0' as const, projectId:project.projectId,
    storyboard:{id:project.storyboard.id,version:project.storyboard.version}, releaseStatus:'internal-preview-only' as const,
    outputProfile:project.outputProfile, totalFrames:cursor, scenes,
    rendererRegistry:{placeholder:{id:'awe-concept-motion-graphics',version:'2.0.1',network:false as const,runtimeWrites:false as const}},
    blockers:['AWE assets are missing','claims are unverified','rights, safe-area and loudness evidence are missing','production use is blocked'],
    compiler:{id:'awe-plan-compiler',version:'2.0.0'},
  };
  const hash=canonicalHash(body);
  return RenderPlanSchema.parse({...body,id:`render-plan-${hash.slice(7,19)}`,planHash:hash});
}
