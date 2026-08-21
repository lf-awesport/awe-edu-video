import React, {type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Easing, Freeze, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brand, brandAsset} from './remotion-brand.ts';

type PlannedScene = RenderPlan['scenes'][number];
type SceneProps = {scene: PlannedScene};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const subjects = ['fan-experience', 'sports-marketing', 'sports-sponsorship', 'media', 'sports-finance', 'sports-law', 'sports-governance', 'sports-tourism', 'sports-equipment', 'event-management', 'esports', 'sport-for-good'];
const subjectColors = ['#EC264F', '#A2CD4B', '#43A7DE', '#9E55A0', '#FFC757', '#F06059', '#243E8F', '#F181A8', '#009F97', '#EF8621', '#AF9FCB', '#71CCDA'];

const reveal = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay * fps, fps, durationInFrames: 0.8 * fps, config: {damping: 200}});

// With no beat covering the cuts, every scene owns its own exit. Copy fades
// out as one block; graphics are given movement instead.
const sceneOut = (frame: number, fps: number, scene: PlannedScene, hold = .6) => {
  const duration = scene.frameInterval.end - scene.frameInterval.start;
  return interpolate(frame, [duration - hold * fps, duration], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
};

// Copy arrives a line at a time and leaves all at once.
const Copy = ({frame, fps, out, delay = .2, step = .22, style, children}: {frame: number; fps: number; out: number; delay?: number; step?: number; style: CSSProperties; children: ReactNode}) =>
  <div style={{position: 'absolute', opacity: 1 - out, ...style}}>
    {React.Children.toArray(children).map((line, i) => {
      const entry = reveal(frame, fps, delay + i * step);
      return <div key={i} style={{opacity: entry, transform: `translateY(${(1 - entry) * 30}px)`}}>{line}</div>;
    })}
  </div>;

const Arrow = ({name, draw, from, style}: {name: string; draw: number; from: 'top' | 'bottom' | 'left' | 'right'; style: CSSProperties}) => {
  const hidden = `${((1 - Math.max(0, Math.min(1, draw))) * 100).toFixed(2)}%`;
  const clipPath = from === 'top' ? `inset(0 0 ${hidden} 0)` : from === 'bottom' ? `inset(${hidden} 0 0 0)` : from === 'left' ? `inset(0 ${hidden} 0 0)` : `inset(0 0 0 ${hidden})`;
  return <Img src={brandAsset(`components/arrows/${name}@3x.png`)} style={{position: 'absolute', opacity: Math.min(1, draw * 8) * .92, clipPath, pointerEvents: 'none', ...style}} />;
};

const stroke = (frame: number, fps: number, delay: number) => interpolate(frame, [delay * fps, (delay + .72) * fps], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});

const SceneShell = ({scene, children, fadeIn = false, fadeOut = false}: SceneProps & {children: ReactNode; fadeIn?: boolean; fadeOut?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = scene.frameInterval.end - scene.frameInterval.start;
  const entryOpacity = fadeIn ? interpolate(frame, [0, 0.35 * fps], [0, 1], clamp) : 1;
  const exitOpacity = fadeOut ? interpolate(frame, [duration - 0.35 * fps, duration], [1, 0], clamp) : 1;
  const opacity = entryOpacity * exitOpacity;
  return <AbsoluteFill style={{background: brand.colors.ink, color: brand.colors.white, fontFamily: brand.fonts.display, overflow: 'hidden', opacity}}>
    <Img src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
    {children}
  </AbsoluteFill>;
};

const Eyebrow = ({children, color = brand.colors.cyan}: {children: ReactNode; color?: string}) => <div style={{display: 'flex', alignItems: 'center', gap: 14, color, fontWeight: 800, fontSize: 19, letterSpacing: 3.2, textTransform: 'uppercase'}}><span style={{width: 38, height: 4, borderRadius: 4, background: color}} />{children}</div>;
const Title = ({children, style}: {children: ReactNode; style?: CSSProperties}) => <div style={{fontSize: 70, lineHeight: 0.99, letterSpacing: -3, fontWeight: 900, ...style}}>{children}</div>;
const Logo = ({color = false, width = 300}: {color?: boolean; width?: number}) => <Img src={brandAsset(`brand/logos/awe-sport-education-horizontal-${color ? 'color' : 'white'}.svg`)} style={{width, height: 'auto'}} />;

const Scene01 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const intro = reveal(frame, fps, 0.15);
  const anchorFrame = Math.round(3.25 * fps);
  const takeover = interpolate(frame, [anchorFrame, 5.25 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const copyOut = interpolate(frame, [1.85 * fps, 2.65 * fps], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const blueOpacity = interpolate(takeover, [.68, .88], [0, 1], clamp);
  const magmaOpacity = interpolate(takeover, [.84, 1], [0, 1], clamp);
  const footageStyle: CSSProperties = {position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:1-magmaOpacity,transformOrigin:'45% 45.8%',transform:`translate(${takeover*95}px, ${takeover*45}px) scale(${1+takeover*3.8})`};
  return <SceneShell scene={scene} fadeOut={false}>
    {scene.media?.footage ? frame < anchorFrame
      ? <Video src={staticFile(scene.media.footage.path)} muted style={footageStyle}/>
      : <Freeze frame={anchorFrame}><Video src={staticFile(scene.media.footage.path)} muted style={footageStyle}/></Freeze>
      : <Img src={brandAsset('subjects/runtime/sports-marketing.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
    <div style={{position:'absolute',inset:0,background:'#1479E8',opacity:blueOpacity*(1-magmaOpacity)}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(4,16,49,.91) 0%,rgba(4,25,72,.52) 46%,rgba(4,25,72,.08) 78%)',opacity:copyOut}}/>
    <div style={{position:'absolute',left:92,top:72,opacity:copyOut}}><Logo width={280}/></div>
    <div style={{position: 'absolute', left: 96, top: 338, width: 790, opacity: intro * copyOut, transform: `translateY(${(1 - intro) * 55}px)`}}><Eyebrow color={brand.colors.cyan}>Oltre il campo</Eyebrow><Title style={{fontSize: 88, marginTop: 27}}>Sai come funziona<br />davvero lo sport?</Title><div style={{marginTop: 30, fontFamily: brand.fonts.body, fontSize: 30, lineHeight: 1.25}}>Scopri l’industria, le competenze<br />e le persone che ci sono dietro.</div></div>
  </SceneShell>;
};

const Scene02 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const logoIn = interpolate(frame, [0, .65 * fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drift = interpolate(frame, [.4 * fps, 3 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const out = sceneOut(frame, fps, scene, .5);
  return <SceneShell scene={scene} fadeIn={false} fadeOut={false}>
    <div style={{position:'absolute',left:680,top:430,opacity:logoIn*(1-out),transform:`translateY(${(1-logoIn)*40-drift*14-out*90}px) scale(${.92+logoIn*.08+drift*.02})`,transformOrigin:'center'}}><Logo width={560}/></div>
  </SceneShell>;
};

const Scene04 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const out = sceneOut(frame, fps, scene);
  // one card at a time, unhurried: the sweep now runs the full remaining scene
  const focus = interpolate(frame, [4.2 * fps, 11.2 * fps], [0, 11], {...clamp, easing: Easing.inOut(Easing.sin)});
  return <SceneShell scene={scene} fadeIn={false} fadeOut={false}>
    <Copy frame={frame} fps={fps} out={out} style={{left: 90, top: 68}}>
      <Eyebrow color="#FFC757">Un percorso strutturato</Eyebrow>
      <Title style={{fontSize: 58, marginTop: 15}}>Esplora il <span style={{color: "#FFC757"}}>business dello sport</span></Title>
    </Copy>
    <div style={{position: 'absolute', left: 226, right: 226, top: 250, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, perspective: 1400}}>{subjects.map((subject, i) => {
      const column = i % 4;
      const row = Math.floor(i / 4);
      // each card flies in from depth and takes its slot; the deck leaves together
      const lead = i * .16;
      const settle = interpolate(frame / fps - lead, [.2, 1.7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
      const emphasis = Math.max(0, 1 - Math.abs(focus - i));
      const x = (1 - settle) * (210 + column * 46) + out * (90 + column * 55);
      const y = (1 - settle) * (170 + row * 44) - out * (40 + row * 26);
      const depth = (1 - settle) * 430 - out * 260;
      const rotation = (1 - settle) * (i - 5.5) * 1.2 + out * (i - 5.5) * .8;
      return <div key={subject} style={{height: 200, borderRadius: 18, overflow: 'hidden', position: 'relative', boxShadow: `0 ${10+emphasis*18}px ${28+emphasis*32}px rgba(11,42,91,${.16+emphasis*.2})`, opacity: settle * (.78 + emphasis * .22) * (1 - out), zIndex: 20-Math.abs(i-5.5), outline:`${emphasis*6}px solid ${subjectColors[i]}`, transform: `translate3d(${x}px,${y-emphasis*18}px,${depth}px) rotateZ(${rotation}deg) scale(${1+emphasis*.075})`, transformOrigin: 'center'}}><Img src={brandAsset(`subjects/runtime/${subject}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover',filter:`saturate(${.82+emphasis*.38}) brightness(${.9+emphasis*.1})`}} /><div style={{position: 'absolute', left: 13, top: 13, width: 10, height: 35, borderRadius: 8, background: subjectColors[i]}} /></div>})}</div>
</SceneShell>;
};

const Scene05 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const left = reveal(frame, fps, .2);
  const phoneIn = reveal(frame, fps, .45);
  // browse the catalogue, then push into a lesson the way the app itself would
  const browse = interpolate(frame, [.9 * fps, 3.4 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const enter = interpolate(frame, [3.6 * fps, 4.4 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const study = interpolate(frame, [4.5 * fps, 6 * fps], [0, 1], clamp);
  const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}>
    <Copy frame={frame} fps={fps} out={out} style={{left: 95, top: 300, width: 630}}>
      <Eyebrow color={brand.colors.cyan}>Un’esperienza fluida</Eyebrow>
      <Title style={{marginTop: 24}}>Impara.</Title>
      <Title style={{color: brand.colors.white}}>Passo dopo passo.</Title>
      <div style={{marginTop: 30, fontFamily: brand.fonts.body, fontSize: 30, lineHeight: 1.3}}>Contenuti e lezioni progettati per accompagnare l’utente su ogni dispositivo.</div>
    </Copy>
    <div style={{position: 'absolute', left: 1010, top: 158, width: 760, height: 1360, borderRadius: 62, padding: 14, background: '#071E4F', boxShadow: '0 44px 120px rgba(0,20,80,.45)', opacity: phoneIn, transform: `translate(${out * 320}px, ${(1 - phoneIn) * 90}px) rotate(${-3 + enter * 1.4 + out * 4}deg) scale(${1 + enter * .03})`, transformOrigin: '40% 28%'}}>
      <div style={{position: 'absolute', inset: 14, borderRadius: 48, overflow: 'hidden', background: '#fff'}}>
        <Img src={brandAsset('ui/runtime/platform-mobile.png')} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 'auto', transform: `translateY(${-browse * 905}px)`}} />
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff', transform: `translateX(${(1 - enter) * 100}%)`, boxShadow: '-34px 0 70px rgba(0,15,60,.4)'}}>
          <Img src={brandAsset('ui/runtime/app-lesson.png')} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 'auto', transform: `translateY(${-study * 320}px)`}} />
        </div>
      </div>
    </div>
  </SceneShell>;
};

const Scene06 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progressIn = interpolate(frame, [.2*fps, 1*fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const depth = interpolate(frame, [3.15*fps, 5.35*fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const rankingIn = interpolate(frame, [4.35*fps, 6.3*fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const reorder = interpolate(frame, [6.55*fps, 8.87*fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const score = Math.round(interpolate(frame, [.8*fps, 3*fps], [0, 78], {...clamp, easing: Easing.out(Easing.cubic)}));
  const out = sceneOut(frame, fps, scene);
  const ranks = [{name:'Alex R.',status:'Avanzato',from:1,to:0},{name:'Marta B.',status:'In corso',from:0,to:1},{name:'Sam K.',status:'In corso',from:2,to:2}];
  return <SceneShell scene={scene} fadeIn={false} fadeOut={false}><Copy frame={frame} fps={fps} out={out} style={{left: 94, top: 80}}>
      <Eyebrow color={brand.colors.cyan}>Gamification · concept UI</Eyebrow>
      <Title style={{marginTop: 22}}>Impara. Avanza. <span style={{color: brand.colors.white}}>Sfida.</span></Title>
    </Copy>
    <div style={{position: 'absolute', left: 95, top: 310, width: 570, height: 535, borderRadius: 30, background: '#fff', color: brand.colors.ink, padding: 44, opacity: progressIn*(1-depth*.32), transform: `perspective(1400px) translateX(${(1-depth)*280}px) translateZ(${-depth*180}px) rotateY(${depth*5}deg) scale(${1.08-depth*.08})`, transformOrigin: 'center'}}><div style={{fontSize: 23, fontWeight: 800, color: brand.colors.blue}}>PROGRESSO PERSONALE</div><div style={{display: 'flex', alignItems: 'center', gap: 42, marginTop: 45}}><div style={{width: 190, height: 190, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `conic-gradient(${brand.colors.cyan} ${score}%, #E4EAF2 0)`}}><div style={{width: 145, height: 145, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', fontSize: 42, fontWeight: 900}}>{score}%</div></div><div><div style={{fontSize: 20, color: '#62728D'}}>PROSSIMO OBIETTIVO</div><div style={{fontSize: 34, fontWeight: 900, marginTop: 10}}>Sports Marketing</div><div style={{marginTop: 26, color: '#58708F', fontFamily: brand.fonts.body, fontSize: 22}}>Completa il quiz per avanzare</div></div></div></div>
    <div style={{position: 'absolute', left: 720, right: 95, top: 310, height: 535, borderRadius: 30, background: '#082358', padding: 42, opacity: rankingIn, transform: `perspective(1400px) translateX(${(1-rankingIn)*180}px) translateZ(${(1-rankingIn)*-220}px) scale(${.94+rankingIn*.06})`}}><div style={{fontSize: 23, fontWeight: 800, color: brand.colors.cyan}}>CLASSIFICA · ESEMPIO</div><div style={{position:'relative',marginTop:24,height:384}}>{ranks.map((rank)=>{const position=interpolate(reorder,[0,1],[rank.from,rank.to]);const place=Math.round(interpolate(reorder,[0,1],[rank.from+1,rank.to+1]));const leader=rank.to===0;return <div key={rank.name} style={{position:'absolute',left:0,right:0,top:position*128,height:112,borderRadius:18,display:'grid',gridTemplateColumns:'90px 1fr 170px',alignItems:'center',padding:'0 28px',background:leader?`rgba(51,197,243,${.16+reorder*.84})`:'#ffffff10',color:leader&&reorder>.55?brand.colors.ink:'#fff',transform:`scale(${1+(leader?reorder*.025:0)})`,boxShadow:leader?`0 ${Math.round(reorder*18)}px ${Math.round(reorder*45)}px rgba(0,12,50,.28)`:'none'}}><span style={{fontSize:30,fontWeight:900}}>{String(place).padStart(2,'0')}</span><span style={{fontSize:28,fontWeight:800}}>{rank.name}</span><span style={{fontSize:21,fontWeight:900,textAlign:'right'}}>{rank.status}</span></div>})}</div></div>
  </SceneShell>;
};

const Scene07 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const steps = [['01','ATTIVITÀ','Scopri i contenuti'],['02','VERIFICHE','Mettiti alla prova'],['03','COMPETENZE','Valorizza il percorso']];
  const journey=interpolate(frame,[1.4*fps,6*fps],[0,2.99],{...clamp,easing:Easing.inOut(Easing.cubic)});
  const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}><Copy frame={frame} fps={fps} out={out} style={{left:110,top:250,width:660}}>
      <Eyebrow color="#FFC757">Il percorso</Eyebrow>
      <Title style={{marginTop:22}}>Costruisci.</Title>
      <Title style={{color:'#FFC757'}}>Verifica. Valorizza.</Title>
      <div style={{fontFamily:brand.fonts.body,fontSize:28,lineHeight:1.35,marginTop:30}}>Attività e verifiche accompagnano ogni fase dell’apprendimento.</div>
    </Copy>
    <Arrow name="arrow-08" draw={stroke(frame, fps, 5.2)} from="bottom" style={{left: 592, top: 560, width: 150, opacity: 1 - out, transform: `rotate(80deg) translateY(${out * 120}px)`}} />
    <div style={{position:'absolute',right:150,top:210,width:900,display:'grid',gap:22,transform:`translateX(${out*260}px)`}}>{steps.map(([number,title,description],index)=>{const r=reveal(frame,fps,.35+index*.35);const active=Math.max(0,1-Math.abs(journey-index));const tick=Math.max(0,Math.min(1,(journey-index+.4)/.55));const mark=brand.colors.white;return <div key={number} style={{height:205,borderRadius:26,background:index===2?'#FFC757':'#fff',color:brand.colors.ink,display:'grid',gridTemplateColumns:'120px 1fr',alignItems:'center',padding:'0 42px',boxShadow:`0 ${24+active*10}px ${60+active*20}px rgba(0,0,30,.25)`,opacity:r,outline:`${Math.max(active*4,tick*3)}px solid ${mark}`,transform:`translateX(${(1-r)*80-active*14}px) scale(${1+active*.025})`}}><div style={{position:'relative',width:92,height:92}}><div style={{position:'absolute',inset:0,borderRadius:'50%',border:`4px solid ${mark}`,background:mark,opacity:tick,transform:`scale(${.92+tick*.08})`}}/><div style={{position:'absolute',inset:0,borderRadius:'50%',border:`4px solid ${mark}`,opacity:1-tick}}/><div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontSize:40,fontWeight:900,color:brand.colors.blue,opacity:Math.max(0,1-tick*3)}}>{number}</div><svg viewBox="0 0 100 100" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><path d="M28 52 L44 68 L73 34" fill="none" stroke={brand.colors.ink} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70*(1-tick)}/></svg></div><div><div style={{fontSize:30,fontWeight:900,letterSpacing:2}}>{title}</div><div style={{fontFamily:brand.fonts.body,fontSize:23,marginTop:10,color:'#52637E'}}>{description}</div></div></div>})}</div>
  </SceneShell>;
};

const Scene08 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const p=interpolate(frame,[.8*fps,10*fps],[0,1],clamp); const identity=interpolate(frame,[2*fps,10*fps],[0,2.99],{...clamp,easing:Easing.inOut(Easing.cubic)}); const cards=[['app-main-awe-edu.png','AWE','#00339A'],['app-main-color-01.png','PARTNER 01','#EC264F'],['app-main-color-02.png','PARTNER 02','#009F97']]; const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}><Copy frame={frame} fps={fps} out={out} style={{left:90,top:70}}>
      <Eyebrow color="#F181A8">Brand personalizzabile</Eyebrow>
      <Title style={{fontSize:62,marginTop:18}}>Una piattaforma.</Title>
      <Title style={{fontSize:62,color:brand.colors.white}}>Molte identità.</Title>
    </Copy><div style={{position:'absolute',left:720,right:85,top:96,bottom:186,display:'flex',gap:24,alignItems:'center',transform:`translateY(${out*220}px)`}}>{cards.map(([asset,label,color],i)=>{const r=reveal(frame,fps,.5+i*.45);const active=Math.max(0,1-Math.abs(identity-i)); return <div key={asset} style={{position:'relative',width:330,height:672,borderRadius:26,overflow:'hidden',background:'#fff',boxShadow:`0 ${30+active*12}px ${70+active*25}px rgba(10,36,88,.23)`,outline:`${active*5}px solid ${color}`,opacity:r,transform:`translateY(${(1-r)*70 + (i-1)*Math.sin(p*Math.PI)*20-active*18}px) rotate(${(i-1)*(3-active*2)}deg) scale(${1+active*.04})`}}><div style={{height:62,background:color,display:'grid',placeItems:'center',color:'#fff',fontSize:19,fontWeight:900,letterSpacing:2}}>{label}</div><Img src={brandAsset(`ui/runtime/${asset}`)} style={{width:'100%',height:'auto'}}/></div>})}</div><div style={{position:'absolute',left:95,top:460,width:510,fontFamily:brand.fonts.body,fontSize:29,lineHeight:1.35}}>Logo, palette e contenuti si adattano all’identità del partner.</div><div style={{position:'absolute',left:95,top:640,display:'flex',gap:14}}>{['#00339A','#33C5F3','#EC264F','#009F97','#FFC757'].map((c,i)=><div key={c} style={{width:58,height:58,borderRadius:'50%',background:c,transform:`translateY(${Math.sin((p+i*.13)*Math.PI*2)*8}px) scale(${.9+Math.sin((p+i*.08)*Math.PI)*.1})`}}/>)}</div></SceneShell>;
};

const Scene09 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const focus=interpolate(frame,[1.8*fps,9.45*fps],[0,2.99],{...clamp,easing:Easing.inOut(Easing.cubic)}); const courses=[['sports-marketing','Marketing strategy'],['sports-sponsorship','Sponsorship case'],['event-management','Event activation']]; const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}><Copy frame={frame} fps={fps} out={out} style={{left:92,top:72}}>
      <Eyebrow color="#F181A8">Contenuti del partner</Eyebrow>
      <Title style={{fontSize:64,marginTop:18}}>Il know-how diventa</Title>
      <Title style={{fontSize:64,color:'#F181A8'}}>formazione concreta.</Title>
    </Copy><div style={{position:'absolute',left:92,right:92,top:340,display:'flex',gap:28,transform:`translateY(${out*240}px)`,opacity:1-out*.4}}>{courses.map(([asset,title],i)=>{const r=reveal(frame,fps,.5+i*.32);const active=Math.max(0,1-Math.abs(focus-i));return <div key={asset} style={{width:550,height:470,borderRadius:26,overflow:'hidden',background:'#fff',color:brand.colors.ink,opacity:r,boxShadow:`0 ${active*22}px ${active*60}px rgba(0,0,20,.28)`,transform:`translateY(${(1-r)*60-active*22}px) scale(${1+active*.035})`}}><Img src={brandAsset(`subjects/runtime/${asset}.png`)} style={{width:'100%',height:310,objectFit:'cover',transform:`scale(${1+active*.06})`}}/><div style={{padding:'24px 28px'}}><div style={{fontSize:16,fontWeight:800,color:'#9E55A0',letterSpacing:2}}>CASE STUDY · ESEMPIO</div><div style={{fontSize:29,fontWeight:900,marginTop:10}}>{title}</div></div></div>})}</div></SceneShell>;
};

const Scene10 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const p=interpolate(frame,[.6*fps,6.7*fps],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)}); const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}><Copy frame={frame} fps={fps} out={out} style={{left:92,top:90}}>
      <Eyebrow color="#EF8621">Una roadmap condivisa</Eyebrow>
      <Title style={{marginTop:24}}>Obiettivi e modalità</Title>
      <Title style={{color:'#EF8621'}}>costruiti insieme.</Title>
    </Copy><div style={{position:'absolute',left:300,right:300,top:470,height:18,borderRadius:12,background:'#D6DFEA',opacity:1-out,transform:`translateX(${-out*300}px)`}}><div style={{height:'100%',width:`${p*100}%`,borderRadius:12,background:'linear-gradient(90deg,#EF8621,#FFC757)'}}/>{[0,.25,.5,.75,1].map((v,i)=><div key={v} style={{position:'absolute',left:`${v*100}%`,top:-18,width:54,height:54,borderRadius:'50%',background:p>=v?'#EF8621':'#fff',border:'6px solid #fff',boxShadow:'0 5px 20px rgba(0,30,80,.2)',transform:'translateX(-50%)'}}><div style={{position:'absolute',top:70,left:'50%',transform:'translateX(-50%)',width:170,textAlign:'center',fontSize:19,fontWeight:800}}>STEP {i+1}</div></div>)}</div><Arrow name="arrow-07" draw={stroke(frame, fps, 3)} from="left" style={{left: 1540, top: 606, width: 190, opacity: 1 - out, transform: `rotate(-9deg) translateX(${out * 220}px)`}} /><div style={{position:'absolute',left:300,width:1320,top:700,textAlign:'center',opacity:1-out,fontFamily:brand.fonts.body,fontSize:28,color:brand.colors.white}}>Durata e milestone definite con il partner.</div><div style={{position:'absolute',right:120,top:110,padding:'18px 24px',borderRadius:16,background:brand.colors.blue,color:brand.colors.white,fontWeight:900,letterSpacing:1.4}}>PROGETTO SU MISURA</div></SceneShell>;
};

const Scene11 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const orbit=interpolate(frame,[1.2*fps,8.15*fps],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)}); const rewardFocus=interpolate(frame,[2.4*fps,8.1*fps],[0,2.99],clamp); const groups=['COMMUNITY','PARTECIPANTI','UTENTI','PARTNER']; const rewards=['PREMI','ESPERIENZE','PARTECIPAZIONE']; const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}><Copy frame={frame} fps={fps} out={out} style={{left:92,top:75}}>
      <Eyebrow color="#A2CD4B">Attiva la community</Eyebrow>
      <Title style={{fontSize:63,marginTop:20}}>Connetti le persone.</Title>
      <Title style={{fontSize:63,color:'#A2CD4B'}}>Premia il percorso.</Title>
    </Copy><div style={{position:'absolute',left:0,top:0,right:0,bottom:0,opacity:1-out,transform:`scale(${1-out*.12})`}}>{(() => {
      const centre = {x: 470, y: 610};
      const hub = 200, node = {width: 170, height: 86}, radius = {x: 300, y: 190};
      return <>
        <div style={{position:'absolute',left:centre.x-hub/2,top:centre.y-hub/2,width:hub,height:hub,borderRadius:'50%',background:'#A2CD4B',color:brand.colors.ink,display:'grid',placeItems:'center',fontSize:30,fontWeight:900,transform:`scale(${1+Math.sin(orbit*Math.PI)*.04})`}}>PARTNER</div>
        {groups.map((g,i)=>{const angle=i*Math.PI/2+.35+orbit*.42;const r=reveal(frame,fps,.6+i*.2);return <div key={g} style={{position:'absolute',left:centre.x+Math.cos(angle)*radius.x,top:centre.y+Math.sin(angle)*radius.y,width:node.width,height:node.height,borderRadius:18,background:'#fff',color:brand.colors.ink,display:'grid',placeItems:'center',fontSize:18,fontWeight:900,opacity:r,transform:`translate(-50%,-50%) scale(${r})`}}>{g}</div>})}
      </>;
    })()}</div><div style={{position:'absolute',right:95,top:350,width:760}}>{rewards.map((reward,i)=>{const r=reveal(frame,fps,1+i*.3);const active=Math.max(0,1-Math.abs(rewardFocus-i));return <div key={reward} style={{height:125,marginBottom:18,borderRadius:24,background:i===0?'#A2CD4B':'#ffffff10',color:i===0?brand.colors.ink:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 36px',opacity:r,outline:`${active*3}px solid #A2CD4B`,transform:`translateX(${(1-r)*65-active*18}px) scale(${1+active*.025})`}}><span style={{fontSize:27,fontWeight:900}}>{reward}</span><span style={{fontFamily:brand.fonts.body,fontSize:19}}>Esempio da validare →</span></div>})}</div></SceneShell>;
};

const Scene12 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const r=reveal(frame,fps,.35); const zoom=interpolate(frame,[.4*fps,5.75*fps],[1,1.075],{...clamp,easing:Easing.inOut(Easing.sin)}); const delays=[1.1,2.5,4.55]; const messages=['Ciao a tutta la community!','Qual è la skill più richiesta?','Grazie, domanda interessante.']; const out = sceneOut(frame, fps, scene);
  return <SceneShell scene={scene}><Copy frame={frame} fps={fps} out={out} style={{left:92,top:72}}>
      <Eyebrow color="#FF7592">Incontro · concept</Eyebrow>
      <Title style={{fontSize:62,marginTop:18}}>Incontra. Condividi.</Title>
      <Title style={{fontSize:62,color:'#FF7592'}}>Confrontati.</Title>
    </Copy><div style={{position:'absolute',left:92,top:350,width:1050,height:540,borderRadius:28,overflow:'hidden',background:'#122D61',border:'1px solid #ffffff20',opacity:r*(1-out),transform:`translateX(${-out*280}px)`}}><Img src={brandAsset('subjects/runtime/media.png')} style={{width:'100%',height:'100%',objectFit:'cover',opacity:.75,transform:`scale(${zoom})`}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(transparent 45%,rgba(3,12,38,.86))'}}/><div style={{position:'absolute',left:28,top:26,padding:'12px 18px',borderRadius:12,background:'#EC264F',fontWeight:900,letterSpacing:2}}>INCONTRO · DEMO</div><div style={{position:'absolute',left:35,bottom:32,fontSize:30,fontWeight:900}}>Sport Industry Q&amp;A</div></div><div style={{position:'absolute',right:92,top:350,width:610,height:540,borderRadius:28,background:'#fff',color:brand.colors.ink,padding:32,opacity:reveal(frame,fps,.8)}}><div style={{fontSize:22,fontWeight:900,color:brand.colors.blue}}>DOMANDE · UI DIMOSTRATIVA</div>{messages.map((m,i)=>{const messageIn=reveal(frame,fps,delays[i]);return <div key={m} style={{marginTop:28,padding:'20px 22px',borderRadius:18,background:i===2?'#E6F8FD':'#EEF2F8',fontFamily:brand.fonts.body,fontSize:21,opacity:messageIn,transform:`translateX(${(1-messageIn)*38}px)`}}>{m}</div>})}</div></SceneShell>;
};

const Scene13 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const ctaStart=4.4*fps; const logo=reveal(frame,fps,4.55); const cta=reveal(frame,fps,5.15); const glow=interpolate(frame,[ctaStart,7.3*fps],[.65,1],{...clamp,easing:Easing.inOut(Easing.sin)}); const footageOpacity=interpolate(frame,[4*fps,ctaStart],[1,0],clamp);
  return <SceneShell scene={scene}>
    {scene.media?.footage && <Video src={staticFile(scene.media.footage.path)} muted style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:footageOpacity}}/>}
    <Img src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:interpolate(frame,[4*fps,ctaStart],[0,.42],clamp),transform:`scale(${glow})`}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(0,27,88,.94),rgba(0,51,154,.65))',opacity:interpolate(frame,[4*fps,ctaStart],[0,1],clamp)}}/>
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}><div style={{opacity:logo,transform:`translateY(${(1-logo)*-35}px)`}}><Logo width={520}/></div><div style={{marginTop:62,fontSize:72,lineHeight:1.02,fontWeight:900,letterSpacing:-3,opacity:cta,transform:`translateY(${(1-cta)*45}px)`}}>Porta la formazione sportiva<br/><span style={{color:brand.colors.cyan}}>nella tua community.</span></div><div style={{marginTop:45,padding:'18px 30px',border:`2px solid ${brand.colors.cyan}`,borderRadius:16,color:brand.colors.cyan,fontSize:20,fontWeight:800,letterSpacing:2,opacity:cta}}>SCOPRI AWE SPORT EDUCATION</div></div>
  </SceneShell>;
};

export const BrandedScene = ({scene}: SceneProps) => {
  switch (scene.id) {
    case 'scene-01': return <Scene01 scene={scene}/>;
    case 'scene-02': return <Scene02 scene={scene}/>;
    case 'scene-04': return <Scene04 scene={scene}/>;
    case 'scene-05': return <Scene05 scene={scene}/>;
    case 'scene-06': return <Scene06 scene={scene}/>;
    case 'scene-07': return <Scene07 scene={scene}/>;
    case 'scene-08': return <Scene08 scene={scene}/>;
    case 'scene-09': return <Scene09 scene={scene}/>;
    case 'scene-10': return <Scene10 scene={scene}/>;
    case 'scene-11': return <Scene11 scene={scene}/>;
    case 'scene-12': return <Scene12 scene={scene}/>;
    case 'scene-13': return <Scene13 scene={scene}/>;
    default: return null;
  }
};
