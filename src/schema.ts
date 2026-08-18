import {z} from 'zod';

export const GenerationDeclarationSchema = z.object({
  sceneId: z.enum(['scene-01', 'scene-13']),
  prompt: z.string().min(1),
  model: z.literal('seedance_2_0_mini'),
  durationSeconds: z.literal(5),
  resolution: z.literal('720p'),
  aspectRatio: z.literal('16:9'),
  generateAudio: z.literal(false),
  candidates: z.object({balanced: z.literal(2)}),
  inputStatus: z.literal('provisional-internal-creative'),
});

export const ExactGenerationRequestSchema = GenerationDeclarationSchema.omit({
  candidates: true,
  inputStatus: true,
});
export type ExactGenerationRequest = z.infer<typeof ExactGenerationRequestSchema>;

export const CapabilitySnapshotSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  provider: z.literal('higgsfield'),
  model: z.literal('seedance_2_0_mini'),
  cliVersion: z.string().min(1),
  observedAt: z.string().datetime(),
  modelSchemaHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  supportedConstraints: z.object({
    jobType: z.literal('seedance_2_0_mini'),
    type: z.literal('video'),
    promptRequired: z.literal(true),
    durationSeconds: z.array(z.number().int()),
    durationDefault: z.number().int(),
    resolutions: z.array(z.string()),
    aspectRatios: z.array(z.string()),
    generateAudio: z.array(z.boolean()),
    generateAudioDefault: z.boolean(),
  }),
});
export type CapabilitySnapshot = z.infer<typeof CapabilitySnapshotSchema>;

export const PriceObservationSchema = z.object({
  kind: z.literal('PriceObservation'), provider: z.string(), model: z.string(), requestHash: z.string(),
  capabilitySnapshotHash: z.string(), observedAt: z.string().datetime(), amount: z.number().nonnegative(),
  unit: z.literal('credits'), evidencePath: z.string(), authorizing: z.literal(false),
});
export type PriceObservation = z.infer<typeof PriceObservationSchema>;

export const UnitQuoteSchema = z.object({
  kind: z.literal('UnitQuote'), provider: z.string(), model: z.string(), requestHash: z.string(),
  schemaHash: z.string(), quantity: z.literal(1), amount: z.number().nonnegative(), unit: z.string(),
  issuedAt: z.string().datetime(), expiresAt: z.string().datetime(), authorizing: z.literal(true),
});

export const QuoteBindingSchema = z.object({
  sceneId: z.enum(['scene-01', 'scene-13']),
  candidate: z.number().int().positive(),
  requestHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  evidencePath: z.string().refine((path) => !path.startsWith('/') && !path.split('/').includes('..')),
  quoteStatus: z.literal('non-authorizing'),
});
export const CandidateCostObservationSchema = z.object({
  basis: z.literal('price-observation'),
  authorizing: z.literal(false),
  sceneId: z.enum(['scene-01', 'scene-13']),
  candidate: z.number().int().positive(),
  requestHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  capabilitySnapshotHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  evidencePath: z.string().refine((path) => !path.startsWith('/') && !path.split('/').includes('..')),
});
export const CostEstimateSchema = z.object({
  unit: z.literal('credits'),
  minimum: z.object({amount: z.number().nonnegative(), quantity: z.number().int(), formula: z.string()}),
  expected: z.object({amount: z.number().nonnegative(), quantity: z.number().int(), formula: z.string()}),
  maximum: z.object({amount: z.number().nonnegative(), quantity: z.number().int(), formula: z.string()}),
});
export const QuoteFreshnessSchema = z.object({
  observedAt: z.array(z.string().datetime()),
  expiresAt: z.null(),
  expiryStatus: z.literal('not-provided-by-provider'),
});

const versioned = {id: z.string().min(1), version: z.string().min(1)};
const SceneIdSchema = z.string().regex(/^scene-\d{2}$/);
const RuntimeMediaAssetSchema = z.object({
  path: z.string().regex(/^runtime-selected\/(voice|footage)\/scene-\d{2}\.(wav|mp4)$/),
  sha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  durationSeconds: z.number().positive(),
});
const VisualKindSchema = z.enum(['cinematic-office', 'phone-push', 'logo-ui', 'metrics', 'devices', 'gamification', 'certificate', 'learning-progress', 'rebranding', 'case-studies', 'timeline', 'community-rewards', 'live-session', 'community-meeting', 'closing-cta']);
const ScenePresentationSchema = z.object({
  kind: VisualKindSchema,
  title: z.string().min(1),
  content: z.array(z.string().min(1)).min(1),
  voiceOver: z.string().min(1),
  claimIds: z.array(z.string()).default([]),
  footagePlaceholder: z.boolean().optional(),
});
export const ProjectSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  projectId: z.string().min(1),
  status: z.literal('internal-preview-only'),
  outputProfile: z.object({
    ...versioned,
    width: z.literal(1920),
    height: z.literal(1080),
    fps: z.literal(30),
    codec: z.literal('h264'),
  }),
  storyboard: z.object({
    ...versioned,
    scenes: z
      .array(
        z.object({
          id: z.string().regex(/^scene-\d{2}$/),
          seconds: z.number().positive(),
          status: z.enum(['provisional', 'missing']),
          technique: z.string(),
          presentation: ScenePresentationSchema,
        }),
      )
      .length(13),
  }),
  claims: z.array(z.object({id: z.string(), status: z.literal('unverified')})),
  productionProfile: z.literal('balanced'),
  generations: z.array(GenerationDeclarationSchema).length(2),
  timingSelection: z.object({
    ...versioned,
    voiceTempo: z.literal(1.2),
    authoredTotalFrames: z.literal(2550),
    resolvedTotalFrames: z.literal(3048),
    sceneFrames: z.record(SceneIdSchema, z.number().int().positive()),
  }),
  selectedMedia: z.object({
    voices: z.record(SceneIdSchema, RuntimeMediaAssetSchema),
    footage: z.record(SceneIdSchema, RuntimeMediaAssetSchema),
  }),
}).superRefine((p, ctx) => {
  const expected = Array.from({length: 13}, (_, index) => `scene-${String(index + 1).padStart(2, '0')}`);
  if (p.storyboard.scenes.some((scene, index) => scene.id !== expected[index])) ctx.addIssue({code: 'custom', message: 'scenes must be ordered scene-01 through scene-13'});
  if (new Set(p.storyboard.scenes.map((s) => s.id)).size !== p.storyboard.scenes.length) {
    ctx.addIssue({code: 'custom', message: 'scene IDs must be unique'});
  }
  if (p.storyboard.scenes.reduce((total, scene) => total + scene.seconds, 0) !== 85) {
    ctx.addIssue({code: 'custom', message: 'AWE authored scenes must total 85 seconds'});
  }
  for (const scene of p.storyboard.scenes) if (!Number.isInteger(scene.seconds * p.outputProfile.fps)) {
    ctx.addIssue({code: 'custom', message: `${scene.id} duration must resolve to an integer frame count`});
  }
  if (new Set(p.generations.map((g) => g.sceneId)).size !== 2) ctx.addIssue({code: 'custom', message: 'scene-01 and scene-13 generation declarations are required'});
  if (expected.some((id) => !(id in p.timingSelection.sceneFrames))) ctx.addIssue({code: 'custom', message: 'approved timing must cover all scenes'});
  if (Object.values(p.timingSelection.sceneFrames).reduce((total, frames) => total + frames, 0) !== p.timingSelection.resolvedTotalFrames) ctx.addIssue({code: 'custom', message: 'approved scene timing must equal resolved total frames'});
  if (expected.some((id) => !(id in p.selectedMedia.voices))) ctx.addIssue({code: 'custom', message: 'selected voice media must cover all scenes'});
  if (!p.selectedMedia.footage['scene-01'] || !p.selectedMedia.footage['scene-13']) ctx.addIssue({code: 'custom', message: 'selected opening and closing footage are required'});
  const claimIds = new Set(p.claims.map((claim) => claim.id));
  if (p.claims.some((claim) => claim.id.length === 0)) ctx.addIssue({code: 'custom', message: 'claim IDs must be nonempty'});
  if (claimIds.size !== p.claims.length) ctx.addIssue({code: 'custom', message: 'claim IDs must be unique'});
  for (const scene of p.storyboard.scenes) for (const id of scene.presentation.claimIds) if (!claimIds.has(id)) ctx.addIssue({code:'custom', message:`unknown claim dependency ${id}`});
});
export type Project = z.infer<typeof ProjectSchema>;

export const RenderPlanSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  id: z.string(),
  planHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  projectId: z.string(),
  storyboard: z.object(versioned),
  releaseStatus: z.literal('internal-preview-only'),
  outputProfile: z.object({
    ...versioned,
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    codec: z.string(),
  }),
  totalFrames: z.number().int().positive(),
  timing: z.object({
    ...versioned,
    voiceTempo: z.literal(1.2),
    authoredTotalFrames: z.literal(2550),
    resolvedTotalFrames: z.literal(3048),
  }).optional(),
  scenes: z.array(
    z.object({
      id: z.string(),
      requestedDurationSeconds: z.number(),
      status: z.string(),
      renderer: z.string(),
      presentation: ScenePresentationSchema,
      claims: z.array(z.object({id: z.string(), status: z.literal('unverified')})),
      frameInterval: z.object({start: z.number().int(), end: z.number().int()}),
      media: z.object({
        voice: RuntimeMediaAssetSchema,
        footage: RuntimeMediaAssetSchema.optional(),
      }).optional(),
    }),
  ),
  rendererRegistry: z.object({
    placeholder: z.object({
      id: z.string(),
      version: z.string(),
      network: z.literal(false),
      runtimeWrites: z.literal(false),
    }),
  }),
  blockers: z.array(z.string()),
  compiler: z.object({id: z.string(), version: z.string()}),
});
export type RenderPlan = z.infer<typeof RenderPlanSchema>;
