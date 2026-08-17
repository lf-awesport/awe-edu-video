import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brand, brandAsset} from './remotion-brand.ts';

type PlannedScene = RenderPlan['scenes'][number];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Scene03BrandReveal = ({scene}: {scene: PlannedScene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame, fps, durationInFrames: 0.8 * fps, config: {damping: 200}});
  const copyIn = spring({frame: frame - 0.45 * fps, fps, durationInFrames: 0.9 * fps, config: {damping: 200}});
  const browserIn = spring({frame: frame - 1.35 * fps, fps, durationInFrames: 1.2 * fps, config: {damping: 20, stiffness: 150}});
  const detailIn = spring({frame: frame - 2.7 * fps, fps, durationInFrames: 0.8 * fps, config: {damping: 200}});
  const ambientShift = interpolate(frame, [0, 6 * fps], [0, -42], {...clamp, easing: Easing.inOut(Easing.sin)});

  return (
    <AbsoluteFill style={{backgroundColor: brand.colors.blue, color: brand.colors.white, overflow: 'hidden'}}>
      <Img
        src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')}
        style={{position: 'absolute', inset: -80, width: 2080, height: 1240, objectFit: 'cover', opacity: 0.3, transform: `translateX(${ambientShift}px) scale(1.04)`}}
      />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,29,99,.97) 0%, rgba(0,40,130,.9) 39%, rgba(0,51,154,.18) 75%)'}} />
      <div style={{position: 'absolute', width: 640, height: 640, right: -190, top: -250, borderRadius: '50%', border: `2px solid ${brand.colors.cyan}55`}} />
      <div style={{position: 'absolute', width: 410, height: 410, right: -80, top: -130, borderRadius: '50%', border: `2px solid ${brand.colors.cyan}33`}} />

      <div style={{position: 'absolute', left: brand.safeArea + 24, top: 68, opacity: logoIn, transform: `translateY(${(1 - logoIn) * -18}px)`}}>
        <Img src={brandAsset('brand/logos/awe-sport-education-horizontal-white.svg')} style={{width: 330, height: 'auto'}} />
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

      <div style={{position: 'absolute', left: 720, top: 170, width: 1080, height: 720, opacity: browserIn, transform: `perspective(1600px) translateX(${(1 - browserIn) * 150}px) rotateY(${(1 - browserIn) * 8 - 3}deg) scale(${0.94 + browserIn * 0.06})`, transformOrigin: 'center right'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: brand.colors.white, boxShadow: '0 42px 100px rgba(0,10,48,.48)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.7)'}}>
          <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 11, padding: '0 23px', background: '#EAF0F8', borderBottom: '1px solid #D5DEEC'}}>
            {['#FF6B68', '#FFC45A', '#42CC75'].map((color) => <span key={color} style={{width: 13, height: 13, borderRadius: '50%', background: color}} />)}
            <div style={{marginLeft: 20, height: 28, flex: 1, maxWidth: 470, borderRadius: 9, background: '#FFFFFF', color: '#55709C', fontFamily: brand.fonts.body, fontSize: 15, display: 'grid', placeItems: 'center'}}>awesporteducation.org</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 54, bottom: 0, overflow: 'hidden', background: '#fff'}}>
            <Img src={brandAsset('ui/runtime/app-main-awe-edu.png')} style={{width: '100%', height: 'auto', display: 'block', transform: `translateY(${interpolate(frame, [2.4 * fps, 6 * fps], [-2, -64], clamp)}px)`}} />
          </div>
        </div>

        <div style={{position: 'absolute', right: 18, bottom: -28, padding: '17px 24px', borderRadius: 17, background: brand.colors.cyan, color: brand.colors.ink, fontFamily: brand.fonts.display, fontWeight: 800, fontSize: 21, letterSpacing: 0.2, opacity: detailIn, transform: `translateY(${(1 - detailIn) * 25}px) rotate(1deg)`, boxShadow: '0 18px 50px rgba(0,18,70,.32)'}}>
          Corsi · video · quiz
        </div>
      </div>

      <div style={{position: 'absolute', left: brand.safeArea + 24, bottom: 52, fontFamily: brand.fonts.body, fontSize: 17, opacity: 0.62}}>Concept demo · UI e copy da approvare</div>
      <div style={{position: 'absolute', right: 56, bottom: 43, fontFamily: brand.fonts.display, fontSize: 18, fontWeight: 800, letterSpacing: 2, opacity: 0.72}}>{scene.id.toUpperCase()}</div>
    </AbsoluteFill>
  );
};
