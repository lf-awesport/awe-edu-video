import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brand, brandAsset} from './remotion-brand.ts';

type PlannedScene = RenderPlan['scenes'][number];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Scene03BrandReveal = ({scene}: {scene: PlannedScene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = scene.frameInterval.end - scene.frameInterval.start;
  const logoMove = interpolate(frame, [0.45 * fps, 1.7 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const browserIn = spring({frame: frame - 1.6 * fps, fps, durationInFrames: 1 * fps, config: {damping: 200}});
  const detailIn = spring({frame: frame - 2.8 * fps, fps, durationInFrames: 0.7 * fps, config: {damping: 200}});
  const copyOut = interpolate(frame, [duration - .6 * fps, duration], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const logoX = interpolate(logoMove, [0, 1], [680, brand.safeArea + 24]);
  const logoY = interpolate(logoMove, [0, 1], [430, 68]);
  const logoScale = interpolate(logoMove, [0, 1], [1, 0.59]);

  return (
    <AbsoluteFill style={{backgroundColor: brand.colors.ink, color: brand.colors.white, overflow: 'hidden'}}>
      <Img
        src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
      />

      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${logoX}px, ${logoY}px) scale(${logoScale})`, transformOrigin: 'top left'}}>
        <Img src={brandAsset('brand/logos/awe-sport-education-horizontal-white.svg')} style={{width: 560, height: 'auto'}} />
      </div>

      <div style={{position: 'absolute', left: brand.safeArea + 24, top: 305, width: 610, opacity: 1 - copyOut}}>
        {[
          <div key="eyebrow" style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, fontFamily: brand.fonts.display, fontWeight: 800, fontSize: 22, letterSpacing: 3.5, textTransform: 'uppercase', color: brand.colors.white}}>
            <span style={{width: 42, height: 4, background: brand.colors.cyan, borderRadius: 4}} />
            Formazione digitale
          </div>,
          <div key="line1" style={{fontFamily: brand.fonts.display, fontWeight: 900, fontSize: 76, lineHeight: 0.98, letterSpacing: -3.4}}>Il mondo dello</div>,
          <div key="line2" style={{fontFamily: brand.fonts.display, fontWeight: 900, fontSize: 76, lineHeight: 0.98, letterSpacing: -3.4, color: brand.colors.white}}>sport business.</div>,
          <div key="body" style={{marginTop: 32, maxWidth: 540, fontFamily: brand.fonts.body, fontWeight: 400, fontSize: 31, lineHeight: 1.25, color: brand.colors.mist}}>
            Una piattaforma web dedicata a chi vuole conoscere lo sport oltre il campo.
          </div>,
        ].map((line, i) => {
          const entry = spring({frame: frame - (1.45 + i * .22) * fps, fps, durationInFrames: 0.8 * fps, config: {damping: 200}});
          return <div key={line.key} style={{opacity: entry, transform: `translateY(${(1 - entry) * 34}px)`}}>{line}</div>;
        })}
      </div>

      <div style={{position: 'absolute', left: 720, top: 170, width: 1080, height: 720, opacity: browserIn, transform: `perspective(1600px) translateX(${(1 - browserIn) * 150 + copyOut * 420}px) rotateY(-3deg) scale(${0.96 + browserIn * 0.04})`, transformOrigin: 'center right'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: brand.colors.white, boxShadow: '0 42px 100px rgba(0,10,48,.48)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.7)'}}>
          <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 11, padding: '0 23px', background: '#EAF0F8', borderBottom: '1px solid #D5DEEC'}}>
            {['#FF6B68', '#FFC45A', '#42CC75'].map((color) => <span key={color} style={{width: 13, height: 13, borderRadius: '50%', background: color}} />)}
            <div style={{marginLeft: 20, height: 28, flex: 1, maxWidth: 470, borderRadius: 9, background: '#FFFFFF', color: '#55709C', fontFamily: brand.fonts.body, fontSize: 15, display: 'grid', placeItems: 'center'}}>awesporteducation.org</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 54, bottom: 0, overflow: 'hidden', background: '#fff'}}>
            <Img src={brandAsset('ui/runtime/platform-desktop.png')} style={{width: '100%', height: 'auto', display: 'block'}} />
          </div>
        </div>

        <div style={{position: 'absolute', right: -46, bottom: -250, width: 312, height: 646, borderRadius: 40, padding: 12, background: '#071E4F', boxShadow: '0 34px 80px rgba(0,14,60,.5)', opacity: detailIn, transform: `translateY(${(1 - detailIn) * 44}px) rotate(${3 - detailIn * 1.5}deg)`}}>
          <div style={{position: 'absolute', inset: 12, borderRadius: 30, overflow: 'hidden', background: '#fff'}}>
            <Img src={brandAsset('ui/runtime/platform-mobile.png')} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 'auto', transform: `translateY(${interpolate(frame, [1.6 * fps, duration - 14], [0, -232], {...clamp, easing: Easing.inOut(Easing.cubic)})}px)`}} />
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
