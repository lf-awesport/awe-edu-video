import React from 'react';
import {AbsoluteFill, Composition, getInputProps, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {RenderPlan} from './schema.js';

type PlannedScene = RenderPlan['scenes'][number];
const accents: Record<string,string>={
  'cinematic-office':'#efb86b','monitor-push':'#39d8cb','logo-ui':'#52e1d5','metrics':'#ffc85c','devices':'#6fe3ff','gamification':'#b58cff','certificate':'#f2d587','rebranding':'#ff6fae','case-studies':'#62d6aa','timeline':'#ff9c67','community-rewards':'#a5df63','live-session':'#ff667d','closing-cta':'#44dfce',
};

const SceneView=({scene}: {scene:PlannedScene})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:18,mass:.8}}); const accent=accents[scene.presentation.kind] ?? '#42d8ca';
  const push=scene.presentation.kind==='monitor-push' ? interpolate(frame,[0,scene.requestedDurationSeconds*fps],[1,2.8]) : 1;
  return <AbsoluteFill style={{background:`radial-gradient(circle at 78% 15%,${accent}35,transparent 36%),linear-gradient(135deg,#06142d,#102b55 65%,#073c4b)`,color:'white',fontFamily:'Arial, Helvetica, sans-serif',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:55,border:`2px solid ${accent}55`,borderRadius:34,transform:`scale(${push})`,transformOrigin:'72% 45%'}} />
    <div style={{position:'absolute',left:110,top:82,color:accent,fontWeight:800,letterSpacing:5,fontSize:22}}>{scene.id.toUpperCase()} · {scene.presentation.kind.replaceAll('-',' ').toUpperCase()}</div>
    <div style={{margin:'auto 110px',opacity:enter,transform:`translateY(${(1-enter)*55}px)`}}>
      <h1 style={{fontSize:72,lineHeight:1.02,maxWidth:1300,margin:'0 0 45px',letterSpacing:-2}}>{scene.presentation.title}</h1>
      <div style={{display:'flex',gap:24,flexWrap:'wrap',maxWidth:1500}}>{scene.presentation.content.map((item,index)=><div key={item} style={{background:index===0?accent:'#ffffff12',color:index===0?'#07162c':'white',border:`2px solid ${accent}`,borderRadius:18,padding:'22px 30px',fontSize:30,fontWeight:750,transform:`translateY(${Math.max(0,1-enter)*25*(index+1)}px)`}}>{item}{scene.claims.length>0 && <span style={{fontSize:20,marginLeft:16,opacity:.82}}>UNVERIFIED</span>}</div>)}</div>
    </div>
    {scene.presentation.footagePlaceholder&&<div style={{position:'absolute',right:105,top:115,width:390,height:310,borderRadius:28,background:'#ffffff0c',border:`3px dashed ${accent}`,display:'grid',placeItems:'center',textAlign:'center',fontSize:25,color:accent}}>DETERMINISTIC ILLUSTRATION<br/>FOOTAGE PLACEHOLDER</div>}
    {scene.claims.length>0&&<div style={{position:'absolute',left:110,bottom:72,maxWidth:1450,fontSize:21,color:'#ffd585'}}>FACTUAL CONTENT · {scene.claims.map(c=>`${c.id}: ${c.status}`).join(' · ')}</div>}
    <div style={{position:'absolute',right:48,bottom:34,fontSize:20,color:'#d5e2f5',opacity:.82}}>Concept demo — internal preview</div>
  </AbsoluteFill>;
};

export const AweMaster=({plan}:{plan:RenderPlan})=><AbsoluteFill>{plan.scenes.map(scene=><Sequence key={scene.id} from={scene.frameInterval.start} durationInFrames={scene.frameInterval.end-scene.frameInterval.start}><SceneView scene={scene}/></Sequence>)}</AbsoluteFill>;
export const Scene03=({plan}:{plan:RenderPlan})=><SceneView scene={plan.scenes[0]!}/>;
export const RemotionRoot=()=>{const {plan}=getInputProps() as {plan:RenderPlan}; return <>
  <Composition id="Scene03" component={Scene03} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
  <Composition id="AweMaster" component={AweMaster} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
</>};
