import React from 'react';
import {AbsoluteFill, Audio, Composition, getInputProps, Sequence, staticFile} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brand} from './remotion-brand.ts';
import {brandFontFaces} from './remotion-brand.ts';
import {Scene03BrandReveal} from './remotion-scene-03.tsx';
import {BrandedScene} from './remotion-scenes.tsx';

type PlannedScene = RenderPlan['scenes'][number];

const SceneView=({scene}: {scene:PlannedScene})=>{
  const view = scene.id === 'scene-03' ? <Scene03BrandReveal scene={scene}/> : <BrandedScene scene={scene}/>;
  return <AbsoluteFill>
    {view}
    {scene.media?.voice && <Audio src={staticFile(scene.media.voice.path)}/>}
    {scene.media?.voice && <div style={{position:'absolute',left:260,right:260,bottom:66,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
      <div style={{maxWidth:1400,padding:'13px 24px 15px',borderRadius:14,background:'rgba(3,12,38,.86)',boxShadow:'0 8px 28px rgba(0,0,0,.25)',color:'#fff',fontFamily:brand.fonts.body,fontSize:25,lineHeight:1.25,fontWeight:700,textAlign:'center'}}>{scene.presentation.voiceOver}</div>
    </div>}
  </AbsoluteFill>;
};

export const AweMaster=({plan}:{plan:RenderPlan})=><AbsoluteFill>{plan.scenes.map(scene=><Sequence key={scene.id} from={scene.frameInterval.start} durationInFrames={scene.frameInterval.end-scene.frameInterval.start}><SceneView scene={scene}/></Sequence>)}</AbsoluteFill>;
export const Scene03=({plan}:{plan:RenderPlan})=><SceneView scene={plan.scenes[0]!}/>;
export const RemotionRoot=()=>{const {plan}=getInputProps() as {plan:RenderPlan}; return <><style>{brandFontFaces}</style>
  <Composition id="Scene03" component={Scene03} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
  <Composition id="AweMaster" component={AweMaster} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
</>};
