import React, {type CSSProperties} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brand} from './remotion-brand.ts';

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

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FullCover = ({progress, color, shape = 'band'}: {progress: number; color: string; shape?: 'band' | 'circle' | 'diagonal' | 'card'}) => {
  const envelope = Math.sin(progress * Math.PI);
  const common: CSSProperties = {position: 'absolute', background: color};
  if (shape === 'circle') return <div style={{...common, left: '50%', top: '50%', width: 2300, height: 2300, borderRadius: '50%', transform: `translate(-50%,-50%) scale(${envelope})`}}/>;
  if (shape === 'diagonal') return <div style={{...common, inset: -300, transform: `translateX(${interpolate(progress, [0, .5, 1], [-2300, 0, 2300], clamp)}px) rotate(-12deg)`}}/>;
  if (shape === 'card') return <div style={{...common, left: '50%', top: '50%', width: 1920, height: 1080, borderRadius: `${interpolate(envelope, [0, 1], [180, 0])}px`, transform: `translate(-50%,-50%) scale(${envelope})`}}/>;
  return <div style={{...common, left: 0, right: 0, top: '50%', height: 1080, transform: `translateY(-50%) scaleY(${envelope})`}}/>;
};

const TransitionBeat = ({motif, progress}: {motif: TransitionMotif; progress: number}) => {
  if (motif === 'phone-blue-takeover' || motif === 'magma-canvas-relay') return null;
  const envelope = Math.sin(progress * Math.PI);
  if (motif === 'cyan-focus-line') return <AbsoluteFill><div style={{position:'absolute',left:'50%',top:'50%',width:1920,height:1080,borderRadius:`${interpolate(envelope,[0,1],[48,0])}px`,background:brand.colors.mist,border:`${interpolate(envelope,[0,1],[8,0])}px solid ${brand.colors.cyan}`,boxShadow:'0 30px 100px rgba(0,20,70,.35)',transform:`translate(-50%,-50%) scale(${envelope})`,transformOrigin:'72% 48%'}}/></AbsoluteFill>;
  if (motif === 'ranking-gold-band') return <AbsoluteFill><div style={{position:'absolute',left:'63%',top:'54%',width:1920,height:1080,borderRadius:`${interpolate(envelope,[0,1],[90,0])}px`,background:'#FFC757',boxShadow:'0 30px 100px rgba(0,15,60,.38)',transform:`translate(-50%,-50%) scale(${envelope})`,transformOrigin:'70% 60%'}}/></AbsoluteFill>;
  if (motif === 'roadmap-community-node') return <AbsoluteFill><div style={{position:'absolute',left:'76%',top:'43%',width:2300,height:2300,borderRadius:'50%',background:'#A2CD4B',border:`${18*(1-envelope)}px solid #E7F4C8`,transform:`translate(-50%,-50%) scale(${envelope})`}}/></AbsoluteFill>;
  if (motif === 'live-panel-cinematic-return') return <AbsoluteFill><div style={{position:'absolute',left:'42%',top:'58%',width:1920,height:1080,borderRadius:`${interpolate(envelope,[0,1],[34,0])}px`,background:brand.colors.blue,border:`${interpolate(envelope,[0,1],[7,0])}px solid #FF7592`,boxShadow:'0 30px 110px rgba(0,10,50,.45)',transform:`translate(-50%,-50%) scale(${envelope})`,transformOrigin:'35% 55%'}}/></AbsoluteFill>;
  if (motif === 'identity-color-strips') {
    const colors = [brand.colors.blue, brand.colors.cyan, '#EC264F', '#009F97', '#FFC757'];
    return <AbsoluteFill>{colors.map((color, index) => <div key={color} style={{position: 'absolute', left: `${index * 20}%`, width: '20.2%', top: 0, bottom: 0, background: color, transform: `scaleY(${Math.min(1, envelope * 1.18)})`, transformOrigin: index % 2 ? 'bottom' : 'top'}}/>)}</AbsoluteFill>;
  }
  if (motif === 'community-live-orbit') {
    return <AbsoluteFill><FullCover progress={progress} color="#EC264F" shape="circle"/><div style={{position:'absolute',left:'50%',top:'50%',width:900,height:900,border:'18px solid #FFB5C5',borderRadius:'50%',transform:`translate(-50%,-50%) rotate(${progress*150}deg) scale(${.3+envelope*.7})`}}/></AbsoluteFill>;
  }
  const style = {
    'card-to-device': {color: brand.colors.mist, shape: 'card' as const},
    'device-depth-push': {color: brand.colors.blue, shape: 'diagonal' as const},
    'gold-brand-iris': {color: '#FFC757', shape: 'circle' as const},
    'case-roadmap-line': {color: '#EF8621', shape: 'band' as const},
  }[motif];
  return style ? <FullCover progress={progress} {...style}/> : null;
};

export const TransitionLayer = ({plan}: {plan: RenderPlan}) => {
  const frame = useCurrentFrame();
  const cue = motionCueSheetForPlan(plan).transitions.find(({frame: boundary, durationInFrames}) => Math.abs(frame - boundary) <= durationInFrames / 2);
  if (!cue) return null;
  const start = cue.frame - cue.durationInFrames / 2;
  const progress = interpolate(frame, [start, start + cue.durationInFrames], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{pointerEvents: 'none'}}><TransitionBeat motif={cue.motif} progress={progress}/></AbsoluteFill>;
};
