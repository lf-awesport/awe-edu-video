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
  const copyIn = spring({frame: frame - 1.45 * fps, fps, durationInFrames: 0.8 * fps, config: {damping: 200}});
  const browserIn = spring({frame: frame - 1.6 * fps, fps, durationInFrames: 1 * fps, config: {damping: 200}});
  const detailIn = spring({frame: frame - 2.8 * fps, fps, durationInFrames: 0.7 * fps, config: {damping: 200}});
  const ambientShift = interpolate(frame, [0, duration - 18], [0, -58], {...clamp, easing: Easing.inOut(Easing.sin)});
  const logoX = interpolate(logoMove, [0, 1], [680, brand.safeArea + 24]);
  const logoY = interpolate(logoMove, [0, 1], [430, 68]);
  const logoScale = interpolate(logoMove, [0, 1], [1, 0.59]);

  return (
    <AbsoluteFill style={{backgroundColor: brand.colors.blue, color: brand.colors.white, overflow: 'hidden'}}>
      <Img
        src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')}
        style={{position: 'absolute', inset: -80, width: 2080, height: 1240, objectFit: 'cover', opacity: 0.62, transform: `translateX(${ambientShift}px) scale(1.04)`}}
      />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,29,99,.96) 0%, rgba(0,40,130,.82) 42%, rgba(0,51,154,.16) 82%)'}} />

      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${logoX}px, ${logoY}px) scale(${logoScale})`, transformOrigin: 'top left'}}>
        <Img src={brandAsset('brand/logos/awe-sport-education-horizontal-white.svg')} style={{width: 560, height: 'auto'}} />
      </div>

      <div style={{position: 'absolute', left: brand.safeArea + 24, top: 305, width: 610, opacity: copyIn, transform: `translateY(${(1 - copyIn) * 46}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, fontFamily: brand.fonts.display, fontWeight: 800, fontSize: 22, letterSpacing: 3.5, textTransform: 'uppercase', color: brand.colors.cyan}}>
          <span style={{width: 42, height: 4, background: brand.colors.cyan, borderRadius: 4}} />
          Formazione digitale
        </div>
        <div style={{fontFamily: brand.fonts.display, fontWeight: 900, fontSize: 76, lineHeight: 0.98, letterSpacing: -3.4}}>
          Il mondo dello<br />
          <span style={{color: brand.colors.cyan}}>sport business.</span>
        </div>
        <div style={{marginTop: 32, maxWidth: 540, fontFamily: brand.fonts.body, fontWeight: 400, fontSize: 31, lineHeight: 1.25, color: brand.colors.mist}}>
          Una piattaforma web dedicata a chi vuole conoscere lo sport oltre il campo.
        </div>
      </div>

      <div style={{position: 'absolute', left: 720, top: 170, width: 1080, height: 720, opacity: browserIn, transform: `perspective(1600px) translateX(${(1 - browserIn) * 150}px) rotateY(-3deg) scale(${0.96 + browserIn * 0.04})`, transformOrigin: 'center right'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: brand.colors.white, boxShadow: '0 42px 100px rgba(0,10,48,.48)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.7)'}}>
          <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 11, padding: '0 23px', background: '#EAF0F8', borderBottom: '1px solid #D5DEEC'}}>
            {['#FF6B68', '#FFC45A', '#42CC75'].map((color) => <span key={color} style={{width: 13, height: 13, borderRadius: '50%', background: color}} />)}
            <div style={{marginLeft: 20, height: 28, flex: 1, maxWidth: 470, borderRadius: 9, background: '#FFFFFF', color: '#55709C', fontFamily: brand.fonts.body, fontSize: 15, display: 'grid', placeItems: 'center'}}>awesporteducation.org</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 54, bottom: 0, overflow: 'hidden', background: '#fff'}}>
            <Img src={brandAsset('ui/runtime/app-main-awe-edu.png')} style={{width: '100%', height: 'auto', display: 'block', transform: `translateY(${interpolate(frame, [2.4 * fps, duration - 18], [-2, -94], {...clamp, easing:Easing.inOut(Easing.cubic)})}px)`}} />
          </div>
        </div>

        <div style={{position: 'absolute', right: 18, bottom: -28, padding: '17px 24px', borderRadius: 17, background: brand.colors.cyan, color: brand.colors.ink, fontFamily: brand.fonts.display, fontWeight: 800, fontSize: 21, letterSpacing: 0.2, opacity: detailIn, transform: `translateY(${(1 - detailIn) * 25}px)`, boxShadow: '0 18px 50px rgba(0,18,70,.32)'}}>
          UI demo · desktop in attesa
        </div>
      </div>

    </AbsoluteFill>
  );
};
