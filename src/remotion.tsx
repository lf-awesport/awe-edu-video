import React from 'react';
import {AbsoluteFill, Composition, getInputProps, Sequence} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brandFontFaces} from './remotion-brand.ts';
import {Scene03BrandReveal} from './remotion-scene-03.tsx';
import {BrandedScene} from './remotion-scenes.tsx';

type PlannedScene = RenderPlan['scenes'][number];

const SceneView=({scene}: {scene:PlannedScene})=>{
  if (scene.id === 'scene-03') return <Scene03BrandReveal scene={scene}/>;
  return <BrandedScene scene={scene}/>;
};

export const AweMaster=({plan}:{plan:RenderPlan})=><AbsoluteFill>{plan.scenes.map(scene=><Sequence key={scene.id} from={scene.frameInterval.start} durationInFrames={scene.frameInterval.end-scene.frameInterval.start}><SceneView scene={scene}/></Sequence>)}</AbsoluteFill>;
export const Scene03=({plan}:{plan:RenderPlan})=><SceneView scene={plan.scenes[0]!}/>;
export const RemotionRoot=()=>{const {plan}=getInputProps() as {plan:RenderPlan}; return <><style>{brandFontFaces}</style>
  <Composition id="Scene03" component={Scene03} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
  <Composition id="AweMaster" component={AweMaster} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
</>};
