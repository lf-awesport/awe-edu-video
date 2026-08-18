import React, {type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Easing, Freeze, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video} from 'remotion';
import type {RenderPlan} from './schema.js';
import {brand, brandAsset} from './remotion-brand.ts';

type PlannedScene = RenderPlan['scenes'][number];
type SceneProps = {scene: PlannedScene};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const subjects = ['fan-experience', 'sports-marketing', 'sports-sponsorship', 'media', 'sports-finance', 'sports-law', 'sports-governance', 'sports-tourism', 'sports-equipment', 'event-management', 'esports', 'sport-for-good'];
const subjectNames = ['Fan experience', 'Sports marketing', 'Sponsorship', 'Media', 'Finance', 'Sports law', 'Governance', 'Tourism', 'Equipment', 'Events', 'Esports', 'Sport for good'];
const subjectColors = ['#EC264F', '#A2CD4B', '#43A7DE', '#9E55A0', '#FFC757', '#F06059', '#243E8F', '#F181A8', '#009F97', '#EF8621', '#AF9FCB', '#71CCDA'];

const reveal = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay * fps, fps, durationInFrames: 0.8 * fps, config: {damping: 200}});

const SceneShell = ({scene, children, accent = brand.colors.cyan, light = false, fadeIn = false, fadeOut = false}: SceneProps & {children: ReactNode; accent?: string; light?: boolean; fadeIn?: boolean; fadeOut?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = scene.frameInterval.end - scene.frameInterval.start;
  const ambient = interpolate(frame, [0, duration], [0, 1], clamp);
  const entryOpacity = fadeIn ? interpolate(frame, [0, 0.35 * fps], [0, 1], clamp) : 1;
  const exitOpacity = fadeOut ? interpolate(frame, [duration - 0.35 * fps, duration], [1, 0], clamp) : 1;
  const opacity = entryOpacity * exitOpacity;
  return <AbsoluteFill style={{background: light ? brand.colors.mist : `linear-gradient(135deg, ${brand.colors.ink}, ${brand.colors.blue})`, color: light ? brand.colors.ink : brand.colors.white, fontFamily: brand.fonts.display, overflow: 'hidden', opacity}}>
    <div style={{position: 'absolute', width: 680, height: 680, right: -310, top: -330, borderRadius: '50%', border: `2px solid ${accent}55`, transform:`translate(${ambient*24}px,${ambient*18}px) scale(${1+ambient*.035})`}} />
    <div style={{position: 'absolute', width: 360, height: 360, left: -210, bottom: -230, borderRadius: '50%', background: `${accent}22`, transform:`translate(${ambient*32}px,${-ambient*16}px)`}} />
    {children}
    <div style={{position: 'absolute', left: 76, bottom: 35, fontFamily: brand.fonts.body, fontSize: 16, opacity: 0.58}}>Concept demo · internal preview</div>
    <div style={{position: 'absolute', right: 52, bottom: 34, display: 'flex', alignItems: 'center', gap: 18, fontSize: 16, fontWeight: 800, letterSpacing: 2, opacity: 0.66}}>
      {scene.claims.length > 0 && <span style={{color: light ? '#A04325' : '#FFD178'}}>CLAIM DA VERIFICARE</span>}
      {scene.id.toUpperCase()}
    </div>
  </AbsoluteFill>;
};

const Eyebrow = ({children, color = brand.colors.cyan}: {children: ReactNode; color?: string}) => <div style={{display: 'flex', alignItems: 'center', gap: 14, color, fontWeight: 800, fontSize: 19, letterSpacing: 3.2, textTransform: 'uppercase'}}><span style={{width: 38, height: 4, borderRadius: 4, background: color}} />{children}</div>;
const Title = ({children, style}: {children: ReactNode; style?: CSSProperties}) => <div style={{fontSize: 70, lineHeight: 0.99, letterSpacing: -3, fontWeight: 900, ...style}}>{children}</div>;
const Logo = ({color = false, width = 300}: {color?: boolean; width?: number}) => <Img src={brandAsset(`brand/logos/awe-sport-education-horizontal-${color ? 'color' : 'white'}.svg`)} style={{width, height: 'auto'}} />;

const Browser = ({asset, style, scroll = 0}: {asset: string; style: CSSProperties; scroll?: number}) => <div style={{position: 'absolute', borderRadius: 28, background: '#fff', boxShadow: '0 35px 90px rgba(0,15,60,.34)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.8)', ...style}}>
  <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', background: '#E9EFF7'}}>{['#FF6B68', '#FFC45A', '#42CC75'].map(color => <span key={color} style={{width: 11, height: 11, borderRadius: '50%', background: color}} />)}<div style={{width: 360, height: 25, marginLeft: 16, borderRadius: 8, background: '#fff', color: '#6680A5', fontFamily: brand.fonts.body, fontSize: 13, display: 'grid', placeItems: 'center'}}>awesporteducation.org</div></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 46, bottom: 0, overflow: 'hidden'}}><Img src={brandAsset(asset)} style={{width: '100%', height: 'auto', transform: `translateY(${scroll}px)`}} /></div>
</div>;

const Scene01 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const intro = reveal(frame, fps, 0.15);
  const anchorFrame = Math.round(3.25 * fps);
  const takeover = interpolate(frame, [anchorFrame, 5.25 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const copyOut = interpolate(frame, [1.85 * fps, 2.65 * fps], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const blueOpacity = interpolate(takeover, [.68, .88], [0, 1], clamp);
  const magmaOpacity = interpolate(takeover, [.84, 1], [0, 1], clamp);
  const footageStyle: CSSProperties = {position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transformOrigin:'45% 45.8%',transform:`translate(${takeover*95}px, ${takeover*45}px) scale(${1+takeover*3.8})`};
  return <SceneShell scene={scene} accent={brand.colors.cyan} fadeOut={false}>
    {scene.media?.footage ? frame < anchorFrame
      ? <Video src={staticFile(scene.media.footage.path)} muted style={footageStyle}/>
      : <Freeze frame={anchorFrame}><Video src={staticFile(scene.media.footage.path)} muted style={footageStyle}/></Freeze>
      : <Img src={brandAsset('subjects/runtime/sports-marketing.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
    <div style={{position:'absolute',inset:0,background:'#1479E8',opacity:blueOpacity}}/>
    <Img src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:magmaOpacity}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(4,16,49,.91) 0%,rgba(4,25,72,.52) 46%,rgba(4,25,72,.08) 78%)',opacity:copyOut}}/>
    <div style={{position:'absolute',left:92,top:72,opacity:copyOut}}><Logo width={280}/></div>
    <div style={{position: 'absolute', left: 96, top: 338, width: 790, opacity: intro * copyOut, transform: `translateY(${(1 - intro) * 55}px)`}}><Eyebrow color={brand.colors.cyan}>Oltre il campo</Eyebrow><Title style={{fontSize: 88, marginTop: 27}}>Sai come funziona<br />davvero lo sport?</Title><div style={{marginTop: 30, fontFamily: brand.fonts.body, fontSize: 30, lineHeight: 1.25}}>Scopri l’industria, le competenze<br />e le persone che ci sono dietro.</div></div>
  </SceneShell>;
};

const Scene02 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const logoIn = interpolate(frame, [0, .65 * fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const canvasDepth = interpolate(frame, [.4 * fps, 3 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <SceneShell scene={scene} accent={brand.colors.cyan} fadeIn={false} fadeOut={false}>
    <Img src={brandAsset('brand/backgrounds/runtime/magma-gradient.png')} style={{position:'absolute',inset:-60,width:2040,height:1200,objectFit:'cover',transform:`scale(${1+canvasDepth*.035}) translateX(${-canvasDepth*20}px)`}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(0,27,88,.48),rgba(0,51,154,.16))'}}/>
    <div style={{position:'absolute',left:680,top:430,opacity:logoIn,transform:`scale(${.92+logoIn*.08})`,transformOrigin:'center'}}><Logo width={560}/></div>
  </SceneShell>;
};

const Scene04 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const head = interpolate(frame, [.1 * fps, .75 * fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const deckOpacity = interpolate(frame, [.35 * fps, .9 * fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const focus = interpolate(frame, [5.1 * fps, 10.6 * fps], [0, 11], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <SceneShell scene={scene} light accent="#FFC757" fadeIn={false} fadeOut={false}><div style={{position: 'absolute', left: 90, top: 68, opacity: head, transform: `translateY(${(1-head)*24}px)`}}><Eyebrow color={brand.colors.blue}>Un percorso strutturato</Eyebrow><Title style={{fontSize: 58, marginTop: 15}}>Esplora il <span style={{color: brand.colors.blue}}>business dello sport</span></Title></div>
    <div style={{position: 'absolute', left: 92, right: 92, top: 250, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, perspective: 1400}}>{subjects.map((subject, i) => {
      const column = i % 4;
      const row = Math.floor(i / 4);
      const finalCenterX = 303 + column * 438;
      const finalCenterY = 350 + row * 216;
      const fanX = 960 + (i - 5.5) * 68;
      const fanY = 510 + Math.abs(i - 5.5) * 8;
      const x = interpolate(frame, [.45 * fps, 1.35 * fps, 3.15 * fps, 4.75 * fps], [960-finalCenterX, fanX-finalCenterX, fanX-finalCenterX, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
      const y = interpolate(frame, [.45 * fps, 1.35 * fps, 3.15 * fps, 4.75 * fps], [510-finalCenterY, fanY-finalCenterY, fanY-finalCenterY, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
      const rotation = interpolate(frame, [.45 * fps, 1.35 * fps, 3.15 * fps, 4.75 * fps], [(i-5.5)*.35, (i-5.5)*3.2, (i-5.5)*3.2, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
      const scale = interpolate(frame, [.45 * fps, 1.35 * fps, 3.15 * fps, 4.75 * fps], [.88, .9, .9, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
      const emphasis = Math.max(0, 1 - Math.abs(focus - i));
      return <div key={subject} style={{height: 200, borderRadius: 18, overflow: 'hidden', position: 'relative', boxShadow: `0 ${10+emphasis*18}px ${28+emphasis*32}px rgba(11,42,91,${.16+emphasis*.2})`, opacity: deckOpacity*(.78+emphasis*.22), zIndex: 20-Math.abs(i-5.5), outline:`${emphasis*6}px solid ${subjectColors[i]}`, transform: `translate3d(${x}px,${y-emphasis*18}px,${-Math.abs(i-5.5)*7}px) rotateZ(${rotation}deg) scale(${scale+emphasis*.075})`, transformOrigin: 'center'}}><Img src={brandAsset(`subjects/runtime/${subject}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover',filter:`saturate(${.82+emphasis*.38}) brightness(${.9+emphasis*.1})`}} /><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '36px 17px 13px', background: 'linear-gradient(transparent,rgba(2,12,40,.9))', color: '#fff', fontSize: 18, fontWeight: 800}}>{subjectNames[i]}</div><div style={{position: 'absolute', left: 13, top: 13, width: 10, height: 35, borderRadius: 8, background: subjectColors[i]}} /></div>})}</div>
    <div style={{position: 'absolute', right: 88, top: 175, padding: '11px 18px', borderRadius: 12, background: '#E6F8FD', color: brand.colors.blue, fontSize: 16, fontWeight: 800}}>VIDEO · TEST · QUIZ</div></SceneShell>;
};

const Scene05 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const left = reveal(frame, fps, .2); const right = reveal(frame, fps, 1.1); const relay=interpolate(frame,[2.1*fps,5.45*fps],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <SceneShell scene={scene} light accent="#43A7DE"><div style={{position: 'absolute', left: 95, top: 80, width: 630, opacity: left}}><Eyebrow color={brand.colors.blue}>Un’esperienza fluida</Eyebrow><Title style={{marginTop: 24}}>Impara.<br /><span style={{color: '#43A7DE'}}>Passo dopo passo.</span></Title><div style={{marginTop: 30, fontFamily: brand.fonts.body, fontSize: 30, lineHeight: 1.3}}>Contenuti e lezioni progettati per accompagnare l’utente su ogni dispositivo.</div></div>
    <Browser asset="ui/runtime/app-lesson.png" scroll={-120-relay*115} style={{left: 800-relay*55, top: 112, width: 790, height: 820, opacity: left, transform: `translateY(${(1-left)*70}px) rotate(${-2+relay}deg) scale(${1-relay*.035})`}} />
    <div style={{position: 'absolute', right: 95+relay*80, top: 300-relay*28, width: 295, height: 625, borderRadius: 42, padding: 12, background: '#071E4F', boxShadow: '0 32px 70px rgba(0,30,100,.35)', opacity: right, transform: `translateX(${(1-right)*80}px) rotate(${4-relay*4}deg) scale(${1+relay*.045})`}}><div style={{width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden', position: 'relative', background: '#fff'}}><Img src={brandAsset('ui/runtime/app-main-awe-edu.png')} style={{width: '100%', height: 'auto', transform: `translateY(${-5-relay*65}px)`}} /></div></div>
  </SceneShell>;
};

const Scene06 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progressIn = interpolate(frame, [.2*fps, 1*fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const depth = interpolate(frame, [3.15*fps, 5.35*fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const rankingIn = interpolate(frame, [4.35*fps, 6.3*fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const reorder = interpolate(frame, [6.55*fps, 8.87*fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const score = Math.round(interpolate(frame, [.8*fps, 3*fps], [0, 78], {...clamp, easing: Easing.out(Easing.cubic)}));
  const ranks = [{name:'Alex R.',status:'Avanzato',from:1,to:0},{name:'Marta B.',status:'In corso',from:0,to:1},{name:'Sam K.',status:'In corso',from:2,to:2}];
  return <SceneShell scene={scene} accent={brand.colors.cyan} fadeIn={false} fadeOut={false}><div style={{position: 'absolute', left: 94, top: 80}}><Eyebrow color={brand.colors.cyan}>Gamification · concept UI</Eyebrow><Title style={{marginTop: 22}}>Impara. Avanza. <span style={{color: brand.colors.cyan}}>Sfida.</span></Title></div>
    <div style={{position: 'absolute', left: 95, top: 310, width: 570, height: 535, borderRadius: 30, background: '#fff', color: brand.colors.ink, padding: 44, opacity: progressIn*(1-depth*.32), transform: `perspective(1400px) translateX(${(1-depth)*280}px) translateZ(${-depth*180}px) rotateY(${depth*5}deg) scale(${1.08-depth*.08})`, transformOrigin: 'center'}}><div style={{fontSize: 23, fontWeight: 800, color: brand.colors.blue}}>PROGRESSO PERSONALE</div><div style={{display: 'flex', alignItems: 'center', gap: 42, marginTop: 45}}><div style={{width: 190, height: 190, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `conic-gradient(${brand.colors.cyan} ${score}%, #E4EAF2 0)`}}><div style={{width: 145, height: 145, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', fontSize: 42, fontWeight: 900}}>{score}%</div></div><div><div style={{fontSize: 20, color: '#62728D'}}>PROSSIMO OBIETTIVO</div><div style={{fontSize: 34, fontWeight: 900, marginTop: 10}}>Sports Marketing</div><div style={{marginTop: 26, color: '#58708F', fontFamily: brand.fonts.body, fontSize: 22}}>Completa il quiz per avanzare</div></div></div></div>
    <div style={{position: 'absolute', left: 720, right: 95, top: 310, height: 535, borderRadius: 30, background: '#082358', padding: 42, opacity: rankingIn, transform: `perspective(1400px) translateX(${(1-rankingIn)*180}px) translateZ(${(1-rankingIn)*-220}px) scale(${.94+rankingIn*.06})`}}><div style={{fontSize: 23, fontWeight: 800, color: brand.colors.cyan}}>CLASSIFICA · ESEMPIO</div><div style={{position:'relative',marginTop:24,height:384}}>{ranks.map((rank)=>{const position=interpolate(reorder,[0,1],[rank.from,rank.to]);const place=Math.round(interpolate(reorder,[0,1],[rank.from+1,rank.to+1]));const leader=rank.to===0;return <div key={rank.name} style={{position:'absolute',left:0,right:0,top:position*128,height:112,borderRadius:18,display:'grid',gridTemplateColumns:'90px 1fr 170px',alignItems:'center',padding:'0 28px',background:leader?`rgba(51,197,243,${.16+reorder*.84})`:'#ffffff10',color:leader&&reorder>.55?brand.colors.ink:'#fff',transform:`scale(${1+(leader?reorder*.025:0)})`,boxShadow:leader?`0 ${Math.round(reorder*18)}px ${Math.round(reorder*45)}px rgba(0,12,50,.28)`:'none'}}><span style={{fontSize:30,fontWeight:900}}>{String(place).padStart(2,'0')}</span><span style={{fontSize:28,fontWeight:800}}>{rank.name}</span><span style={{fontSize:21,fontWeight:900,textAlign:'right'}}>{rank.status}</span></div>})}</div></div>
  </SceneShell>;
};

const Scene07 = ({scene}: SceneProps) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const steps = [['01','ATTIVITÀ','Scopri i contenuti'],['02','VERIFICHE','Mettiti alla prova'],['03','COMPETENZE','Valorizza il percorso']];
  const journey=interpolate(frame,[1.4*fps,6*fps],[0,2.99],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <SceneShell scene={scene} accent="#FFC757"><div style={{position:'absolute',left:92,top:92,width:700}}><Eyebrow color="#FFC757">Il percorso</Eyebrow><Title style={{marginTop:22}}>Costruisci.<br /><span style={{color:'#FFC757'}}>Verifica. Valorizza.</span></Title><div style={{fontFamily:brand.fonts.body,fontSize:28,lineHeight:1.35,marginTop:30}}>Attività e verifiche accompagnano ogni fase dell’apprendimento.</div></div>
    <div style={{position:'absolute',right:105,top:135,width:900,display:'grid',gap:22}}>{steps.map(([number,title,description],index)=>{const r=reveal(frame,fps,.35+index*.35);const active=Math.max(0,1-Math.abs(journey-index));return <div key={number} style={{height:205,borderRadius:26,background:index===2?'#FFC757':'#fff',color:brand.colors.ink,display:'grid',gridTemplateColumns:'120px 1fr',alignItems:'center',padding:'0 42px',boxShadow:`0 ${24+active*10}px ${60+active*20}px rgba(0,0,30,.25)`,opacity:r,outline:`${active*4}px solid ${index===2?'#fff':'#FFC757'}`,transform:`translateX(${(1-r)*80-active*14}px) scale(${1+active*.025})`}}><div style={{fontSize:48,fontWeight:900,color:brand.colors.blue}}>{number}</div><div><div style={{fontSize:30,fontWeight:900,letterSpacing:2}}>{title}</div><div style={{fontFamily:brand.fonts.body,fontSize:23,marginTop:10,color:'#52637E'}}>{description}</div></div></div>})}</div>
  </SceneShell>;
};

const Scene08 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const p=interpolate(frame,[.8*fps,10*fps],[0,1],clamp); const identity=interpolate(frame,[2*fps,10*fps],[0,2.99],{...clamp,easing:Easing.inOut(Easing.cubic)}); const cards=[['app-main-awe-edu.png','AWE','#00339A'],['app-main-color-01.png','PARTNER 01','#EC264F'],['app-main-color-02.png','PARTNER 02','#009F97']];
  return <SceneShell scene={scene} light accent="#F181A8"><div style={{position:'absolute',left:90,top:70}}><Eyebrow color={brand.colors.blue}>Brand personalizzabile</Eyebrow><Title style={{fontSize:62,marginTop:18}}>Una piattaforma.<br/><span style={{color:'#EC264F'}}>Molte identità.</span></Title></div><div style={{position:'absolute',left:720,right:85,top:100,bottom:95,display:'flex',gap:24,alignItems:'center'}}>{cards.map(([asset,label,color],i)=>{const r=reveal(frame,fps,.5+i*.45);const active=Math.max(0,1-Math.abs(identity-i)); return <div key={asset} style={{position:'relative',width:330,height:750,borderRadius:26,overflow:'hidden',background:'#fff',boxShadow:`0 ${30+active*12}px ${70+active*25}px rgba(10,36,88,.23)`,outline:`${active*5}px solid ${color}`,opacity:r,transform:`translateY(${(1-r)*70 + (i-1)*Math.sin(p*Math.PI)*20-active*18}px) rotate(${(i-1)*(3-active*2)}deg) scale(${1+active*.04})`}}><div style={{height:62,background:color,display:'grid',placeItems:'center',color:'#fff',fontSize:19,fontWeight:900,letterSpacing:2}}>{label}</div><Img src={brandAsset(`ui/runtime/${asset}`)} style={{width:'100%',height:'auto'}}/></div>})}</div><div style={{position:'absolute',left:95,top:460,width:510,fontFamily:brand.fonts.body,fontSize:29,lineHeight:1.35}}>Logo, palette e contenuti si adattano all’identità del partner.</div><div style={{position:'absolute',left:95,top:640,display:'flex',gap:14}}>{['#00339A','#33C5F3','#EC264F','#009F97','#FFC757'].map((c,i)=><div key={c} style={{width:58,height:58,borderRadius:'50%',background:c,transform:`translateY(${Math.sin((p+i*.13)*Math.PI*2)*8}px) scale(${.9+Math.sin((p+i*.08)*Math.PI)*.1})`}}/>)}</div></SceneShell>;
};

const Scene09 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const focus=interpolate(frame,[1.8*fps,9.45*fps],[0,2.99],{...clamp,easing:Easing.inOut(Easing.cubic)}); const courses=[['sports-marketing','Marketing strategy'],['sports-sponsorship','Sponsorship case'],['event-management','Event activation']];
  return <SceneShell scene={scene} accent="#F181A8"><div style={{position:'absolute',left:92,top:72}}><Eyebrow color="#F181A8">Contenuti del partner</Eyebrow><Title style={{fontSize:64,marginTop:18}}>Il know-how diventa<br/><span style={{color:'#F181A8'}}>formazione concreta.</span></Title></div><div style={{position:'absolute',left:92,right:92,top:340,display:'flex',gap:28}}>{courses.map(([asset,title],i)=>{const r=reveal(frame,fps,.5+i*.32);const active=Math.max(0,1-Math.abs(focus-i));return <div key={asset} style={{width:550,height:470,borderRadius:26,overflow:'hidden',background:'#fff',color:brand.colors.ink,opacity:r,boxShadow:`0 ${active*22}px ${active*60}px rgba(0,0,20,.28)`,transform:`translateY(${(1-r)*60-active*22}px) scale(${1+active*.035})`}}><Img src={brandAsset(`subjects/runtime/${asset}.png`)} style={{width:'100%',height:310,objectFit:'cover',transform:`scale(${1+active*.06})`}}/><div style={{padding:'24px 28px'}}><div style={{fontSize:16,fontWeight:800,color:'#9E55A0',letterSpacing:2}}>CASE STUDY · ESEMPIO</div><div style={{fontSize:29,fontWeight:900,marginTop:10}}>{title}</div></div></div>})}</div></SceneShell>;
};

const Scene10 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const p=interpolate(frame,[.6*fps,6.7*fps],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <SceneShell scene={scene} light accent="#EF8621"><div style={{position:'absolute',left:92,top:90}}><Eyebrow color="#EF8621">Una roadmap condivisa</Eyebrow><Title style={{marginTop:24}}>Obiettivi e modalità<br/><span style={{color:'#EF8621'}}>costruiti insieme.</span></Title></div><div style={{position:'absolute',left:720,right:120,top:430,height:18,borderRadius:12,background:'#D6DFEA'}}><div style={{height:'100%',width:`${p*100}%`,borderRadius:12,background:'linear-gradient(90deg,#EF8621,#FFC757)'}}/>{[0,.25,.5,.75,1].map((v,i)=><div key={v} style={{position:'absolute',left:`${v*100}%`,top:-18,width:54,height:54,borderRadius:'50%',background:p>=v?'#EF8621':'#fff',border:'6px solid #fff',boxShadow:'0 5px 20px rgba(0,30,80,.2)',transform:'translateX(-50%)'}}><div style={{position:'absolute',top:70,left:'50%',transform:'translateX(-50%)',width:170,textAlign:'center',fontSize:19,fontWeight:800}}>STEP {i+1}</div></div>)}</div><div style={{position:'absolute',left:745,top:660,fontFamily:brand.fonts.body,fontSize:28,color:'#52637E'}}>Durata e milestone definite con il partner.</div><div style={{position:'absolute',right:120,top:110,padding:'18px 24px',borderRadius:16,background:'#E6F8FD',color:brand.colors.blue,fontWeight:900}}>PROGETTO SU MISURA</div></SceneShell>;
};

const Scene11 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const orbit=interpolate(frame,[1.2*fps,8.15*fps],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)}); const rewardFocus=interpolate(frame,[2.4*fps,8.1*fps],[0,2.99],clamp); const groups=['COMMUNITY','PARTECIPANTI','UTENTI','PARTNER']; const rewards=['PREMI','ESPERIENZE','PARTECIPAZIONE'];
  return <SceneShell scene={scene} accent="#A2CD4B"><div style={{position:'absolute',left:92,top:75}}><Eyebrow color="#A2CD4B">Attiva la community</Eyebrow><Title style={{fontSize:63,marginTop:20}}>Connetti le persone.<br/><span style={{color:'#A2CD4B'}}>Premia il percorso.</span></Title></div><div style={{position:'absolute',left:100,top:365,width:760,height:470}}><div style={{position:'absolute',left:270,top:140,width:220,height:220,borderRadius:'50%',background:'#A2CD4B',color:brand.colors.ink,display:'grid',placeItems:'center',fontSize:30,fontWeight:900,transform:`scale(${1+Math.sin(orbit*Math.PI)*.04})`}}>PARTNER</div>{groups.map((g,i)=>{const angle=i*Math.PI/2+.35+orbit*.42;const r=reveal(frame,fps,.6+i*.2);return <div key={g} style={{position:'absolute',left:310+Math.cos(angle)*275,top:180+Math.sin(angle)*175,width:180,height:90,borderRadius:18,background:'#fff',color:brand.colors.ink,display:'grid',placeItems:'center',fontSize:18,fontWeight:900,opacity:r,transform:`translate(-50%,-50%) scale(${r})`}}>{g}</div>})}</div><div style={{position:'absolute',right:95,top:350,width:760}}>{rewards.map((reward,i)=>{const r=reveal(frame,fps,1+i*.3);const active=Math.max(0,1-Math.abs(rewardFocus-i));return <div key={reward} style={{height:125,marginBottom:18,borderRadius:24,background:i===0?'#A2CD4B':'#ffffff10',color:i===0?brand.colors.ink:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 36px',opacity:r,outline:`${active*3}px solid #A2CD4B`,transform:`translateX(${(1-r)*65-active*18}px) scale(${1+active*.025})`}}><span style={{fontSize:27,fontWeight:900}}>{reward}</span><span style={{fontFamily:brand.fonts.body,fontSize:19}}>Esempio da validare →</span></div>})}</div></SceneShell>;
};

const Scene12 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const r=reveal(frame,fps,.35); const zoom=interpolate(frame,[.4*fps,5.75*fps],[1,1.075],{...clamp,easing:Easing.inOut(Easing.sin)}); const delays=[1.1,2.5,4.55]; const messages=['Ciao a tutta la community!','Qual è la skill più richiesta?','Grazie, domanda interessante.'];
  return <SceneShell scene={scene} accent="#EC264F"><div style={{position:'absolute',left:92,top:72}}><Eyebrow color="#FF7592">Incontro · concept</Eyebrow><Title style={{fontSize:62,marginTop:18}}>Incontra. Condividi.<br/><span style={{color:'#FF7592'}}>Confrontati.</span></Title></div><div style={{position:'absolute',left:92,top:350,width:1050,height:540,borderRadius:28,overflow:'hidden',background:'#122D61',border:'1px solid #ffffff20',opacity:r}}><Img src={brandAsset('subjects/runtime/media.png')} style={{width:'100%',height:'100%',objectFit:'cover',opacity:.75,transform:`scale(${zoom})`}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(transparent 45%,rgba(3,12,38,.86))'}}/><div style={{position:'absolute',left:28,top:26,padding:'12px 18px',borderRadius:12,background:'#EC264F',fontWeight:900,letterSpacing:2}}>INCONTRO · DEMO</div><div style={{position:'absolute',left:35,bottom:32,fontSize:30,fontWeight:900}}>Sport Industry Q&amp;A</div></div><div style={{position:'absolute',right:92,top:350,width:610,height:540,borderRadius:28,background:'#fff',color:brand.colors.ink,padding:32,opacity:reveal(frame,fps,.8)}}><div style={{fontSize:22,fontWeight:900,color:brand.colors.blue}}>DOMANDE · UI DIMOSTRATIVA</div>{messages.map((m,i)=>{const messageIn=reveal(frame,fps,delays[i]);return <div key={m} style={{marginTop:28,padding:'20px 22px',borderRadius:18,background:i===2?'#E6F8FD':'#EEF2F8',fontFamily:brand.fonts.body,fontSize:21,opacity:messageIn,transform:`translateX(${(1-messageIn)*38}px)`}}>{m}</div>})}</div></SceneShell>;
};

const Scene13 = ({scene}: SceneProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const ctaStart=4.4*fps; const logo=reveal(frame,fps,4.55); const cta=reveal(frame,fps,5.15); const glow=interpolate(frame,[ctaStart,7.3*fps],[.65,1],{...clamp,easing:Easing.inOut(Easing.sin)}); const footageOpacity=interpolate(frame,[4*fps,ctaStart],[1,0],clamp);
  return <SceneShell scene={scene} accent={brand.colors.cyan}>
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
