import type {RenderPlan} from './schema.js';

type TransitionMotif =
  | 'phone-blue-takeover'
  | 'magma-canvas-relay'
  | 'cyan-focus-line'
  | 'card-to-device'
  | 'device-depth-push'
  | 'ranking-gold-band'
  | 'gold-brand-iris'
  | 'identity-color-strips'
  | 'case-roadmap-line'
  | 'roadmap-community-node'
  | 'community-live-orbit'
  | 'live-panel-cinematic-return';

const designs: Array<{motif: TransitionMotif; durationInFrames: number}> = [
  {motif: 'phone-blue-takeover', durationInFrames: 20},
  {motif: 'magma-canvas-relay', durationInFrames: 20},
  {motif: 'cyan-focus-line', durationInFrames: 20},
  {motif: 'card-to-device', durationInFrames: 24},
  {motif: 'device-depth-push', durationInFrames: 22},
  {motif: 'ranking-gold-band', durationInFrames: 20},
  {motif: 'gold-brand-iris', durationInFrames: 24},
  {motif: 'identity-color-strips', durationInFrames: 30},
  {motif: 'case-roadmap-line', durationInFrames: 22},
  {motif: 'roadmap-community-node', durationInFrames: 24},
  {motif: 'community-live-orbit', durationInFrames: 26},
  {motif: 'live-panel-cinematic-return', durationInFrames: 24},
];

const sceneCues = [
  {finalBeatFrame: 158, narrativeHold: false}, {finalBeatFrame: 82, narrativeHold: true},
  {finalBeatFrame: 220, narrativeHold: false}, {finalBeatFrame: 318, narrativeHold: false},
  {finalBeatFrame: 164, narrativeHold: false}, {finalBeatFrame: 266, narrativeHold: false},
  {finalBeatFrame: 180, narrativeHold: false}, {finalBeatFrame: 300, narrativeHold: false},
  {finalBeatFrame: 284, narrativeHold: false}, {finalBeatFrame: 201, narrativeHold: false},
  {finalBeatFrame: 244, narrativeHold: true}, {finalBeatFrame: 173, narrativeHold: false},
  {finalBeatFrame: 218, narrativeHold: true},
] as const;

export const motionCueSheetForPlan = (plan: RenderPlan) => ({
  id: 'awe-continuity',
  version: '1.0.0',
  transitions: plan.scenes.slice(0, -1).map((scene, index) => ({
    id: `${scene.id}-to-${plan.scenes[index + 1]!.id}`,
    frame: scene.frameInterval.end,
    motif: designs[index]!.motif,
    durationInFrames: designs[index]!.durationInFrames,
    voicePolicy: 'preserve-non-overlapping-scene-intervals' as const,
  })),
  scenes: plan.scenes.map((scene, index) => ({sceneId: scene.id, ...sceneCues[index]!})),
});

// Every covering motif paints a lit brand surface rather than a flat fill. A
// Nothing paints over a cut any more: every scene carries its own entrance
// and exit, so the cue sheet stays the continuity contract without a beat
// wiping the frame.
export const TransitionLayer = (_: {plan: RenderPlan}) => null;
