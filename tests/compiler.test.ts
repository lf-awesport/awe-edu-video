import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import YAML from 'yaml';
import {compileMaster, compileScene} from '../src/compiler.js';

describe('Storyboard -> RenderPlan public seam', () => {
  it('compiles Scene 3 to the same canonical plan regardless of project location', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const a = compileScene(input, 'scene-03');
    const b = compileScene(structuredClone(input), 'scene-03');
    expect(a).toEqual(b);
    expect(a.totalFrames).toBe(180);
    expect(a.scenes[0].frameInterval).toEqual({start: 0, end: 180});
    expect(a.planHash).toBe('sha256:232ebb8955992ff6a1776223b234b457667e2811c304cfdc583a2b9afe585aaa');
    expect(JSON.stringify(a)).not.toContain(process.cwd());
  });

  it('compiles the approved resolved master into exact ordered half-open intervals', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);
    expect(plan.totalFrames).toBe(3048);
    expect(plan.scenes.map(({id, frameInterval}) => [id, frameInterval])).toEqual([
      ['scene-01',{start:0,end:170}],['scene-02',{start:170,end:260}],['scene-03',{start:260,end:498}],
      ['scene-04',{start:498,end:841}],['scene-05',{start:841,end:1021}],['scene-06',{start:1021,end:1308}],
      ['scene-07',{start:1308,end:1504}],['scene-08',{start:1504,end:1825}],['scene-09',{start:1825,end:2130}],
      ['scene-10',{start:2130,end:2349}],['scene-11',{start:2349,end:2619}],['scene-12',{start:2619,end:2808}],
      ['scene-13',{start:2808,end:3048}],
    ]);
    expect(plan.planHash).toBe('sha256:54cf44400f27009235e143c2d534dd4aa7b13f374e7e6ffd7224539d67d0709d');
    expect(plan.scenes.flatMap((scene) => scene.claims)).toEqual([]);
  });

  it('compiles the owner-approved copy lock without removed Claim dependencies', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);
    expect(plan.storyboard.version).toBe('1.2.0');
    expect(plan.scenes.flatMap((scene) => scene.claims)).toEqual([]);
    expect(plan.blockers).not.toContain('claims are unverified');
    expect(plan.scenes.find(({id}) => id === 'scene-04')?.presentation.voiceOver).toBe(
      'All’interno, gli utenti trovano un percorso strutturato dedicato al business dello sport, con video, test e quiz per mettere alla prova ciò che hanno imparato.',
    );
    expect(plan.scenes.find(({id}) => id === 'scene-13')?.presentation.voiceOver).toBe(
      'Porta la formazione sportiva nella tua community. Scopri AWE Sport Education.',
    );
  });

  it('compiles the approved phone opening without changing script or timing authority', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);
    const opening = plan.scenes.slice(0, 3);

    expect(plan.storyboard.version).toBe('1.2.0');
    expect(opening.map(({id, requestedDurationSeconds}) => [id, requestedDurationSeconds])).toEqual([
      ['scene-01', 5],
      ['scene-02', 3],
      ['scene-03', 6],
    ]);
    expect(opening[0]?.status).toBe('missing');
    expect(opening[0]?.presentation).toMatchObject({
      kind: 'cinematic-office',
      footagePlaceholder: true,
      voiceOver: 'Ti piace lo sport? Bene. Ma sai come funziona davvero l’industria che c’è dietro?',
    });
    expect(opening[1]?.presentation).toMatchObject({
      kind: 'phone-push',
      content: ['TELEFONO CENTRATO', 'INGRESSO NELLO SCHERMO', 'UI AWE REALE'],
      voiceOver: 'Lascia che ti faccia vedere.',
    });
    expect(opening[2]?.presentation).toMatchObject({
      kind: 'logo-ui',
      content: ['LANDING AWE EDU', 'LOGO IN ALTO A SINISTRA', 'UI DIMOSTRATIVA'],
    });
  });

  it('binds the approved balanced timing and selected audiovisual media into the master plan', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);

    expect(plan.storyboard.version).toBe('1.2.0');
    expect(plan.totalFrames).toBe(3048);
    expect((plan as any).timing).toMatchObject({
      id: 'awe-livia-balanced',
      version: '1.0.0',
      voiceTempo: 1.2,
      authoredTotalFrames: 2550,
      resolvedTotalFrames: 3048,
    });
    expect(plan.scenes.map(({frameInterval}) => frameInterval.end - frameInterval.start)).toEqual([
      170, 90, 238, 343, 180, 287, 196, 321, 305, 219, 270, 189, 240,
    ]);
    expect((plan.scenes[0] as any).media).toMatchObject({
      voice: {
        path: 'runtime-selected/voice/scene-01.wav',
        sha256: 'sha256:fbe1d513c27aebf43241e32bd19583b4018696f9f5d552e8e55d086b388b46d0',
      },
      footage: {
        path: 'runtime-selected/footage/scene-01.mp4',
        sha256: 'sha256:e455ecec73107b6a6ea1f9867791da016d6536d24d1167bd6dc77829b5da009b',
      },
    });
    expect((plan.scenes[12] as any).media).toMatchObject({
      voice: {path: 'runtime-selected/voice/scene-13.wav'},
      footage: {
        path: 'runtime-selected/footage/scene-13.mp4',
        sha256: 'sha256:116dfb5099d4f2d9869d5952d24e0e8e5c5bf2a3dfe07eea6078ede5beb0fcd4',
      },
    });
  });

  it('rejects missing or reordered authored scenes', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    [input.storyboard.scenes[0],input.storyboard.scenes[1]]=[input.storyboard.scenes[1],input.storyboard.scenes[0]];
    expect(()=>compileMaster(input)).toThrow(/ordered/);
  });
});
