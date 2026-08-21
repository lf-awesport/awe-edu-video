import React from 'react';
import {AbsoluteFill, Audio, Composition, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brandFontFaces} from './remotion-brand.ts';
import {Scene03BrandReveal} from './remotion-scene-03.tsx';
import {TransitionLayer} from './remotion-motion.tsx';
import {BrandedScene} from './remotion-scenes.tsx';

type PlannedScene = RenderPlan['scenes'][number];

const SceneVisual=({scene}: {scene:PlannedScene}) => scene.id === 'scene-03' ? <Scene03BrandReveal scene={scene}/> : <BrandedScene scene={scene}/>;

const SceneVoice=({scene}: {scene:PlannedScene})=><AbsoluteFill>
  {scene.media?.voice && <Audio src={staticFile(scene.media.voice.path)}/>}
</AbsoluteFill>;

const dbVolume = (db: number) => 10 ** (db / 20);

const MasterAudio = ({plan}: {plan: RenderPlan}) => {
  const audio = plan.audio;
  if (!audio) return null;
  const fps = plan.outputProfile.fps;
  const musicVolume = (frame: number) => {
    const duck = Math.max(0, ...plan.scenes.map((scene) => {
      if (!scene.media?.voice) return 0;
      const start = scene.frameInterval.start;
      const end = start + scene.media.voice.durationSeconds * fps;
      return Math.min(
        interpolate(frame, [start, start + audio.ducking.attackFrames], [0, 1], {extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
        interpolate(frame, [end, end + audio.ducking.releaseFrames], [1, 0], {extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
      );
    }));
    const fade = Math.min(
      interpolate(frame, [0, 36], [0, 1], {extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
      interpolate(frame, [plan.totalFrames - 54, plan.totalFrames], [1, 0], {extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
    );
    return dbVolume(audio.music.gainDb + duck * audio.ducking.musicUnderVoiceDb) * fade;
  };
  return <>
    <Audio src={staticFile(audio.music.path)} playbackRate={audio.music.playbackRate} volume={musicVolume}/>
    {audio.cues.map((cue) => {
      const asset = audio.sfx[cue.asset];
      const from = Math.max(0, cue.frame - Math.round(asset.durationSeconds * fps / 2));
      return <Sequence key={cue.id} from={from} durationInFrames={Math.ceil(asset.durationSeconds * fps)}><Audio src={staticFile(asset.path)} volume={dbVolume(cue.gainDb)}/></Sequence>;
    })}
  </>;
};

export const AweMaster=({plan}:{plan:RenderPlan})=><AbsoluteFill>
  {plan.scenes.map(scene=><Sequence key={`visual-${scene.id}`} from={scene.frameInterval.start} durationInFrames={scene.frameInterval.end-scene.frameInterval.start}><SceneVisual scene={scene}/></Sequence>)}
  <TransitionLayer plan={plan}/>
  {plan.scenes.map(scene=><Sequence key={`voice-${scene.id}`} from={scene.frameInterval.start} durationInFrames={scene.frameInterval.end-scene.frameInterval.start}><SceneVoice scene={scene}/></Sequence>)}
  <MasterAudio plan={plan}/>
</AbsoluteFill>;
export const Scene03=({plan}:{plan:RenderPlan})=><SceneVisual scene={plan.scenes[0]!}/>;
export const RemotionRoot=()=>{const {plan}=getInputProps() as {plan:RenderPlan}; return <><style>{brandFontFaces}</style>
  <Composition id="Scene03" component={Scene03} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
  <Composition id="AweMaster" component={AweMaster} durationInFrames={plan.totalFrames} fps={plan.outputProfile.fps} width={plan.outputProfile.width} height={plan.outputProfile.height} defaultProps={{plan}}/>
</>};
