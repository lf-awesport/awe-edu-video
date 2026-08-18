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
    expect(a.planHash).toBe('sha256:464a7066f25e0420c1d339c74d6d3495aabbff78ef27b9f0ae0600dd61710ed4');
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
    expect(plan.planHash).toBe('sha256:a547a699b454b8c6ba39a6c458daabf7fabedd0e02e4955d7d91236b07b16f06');
    expect(plan.scenes.flatMap((scene) => scene.claims)).toEqual([]);
  });

  it('compiles the owner-approved copy lock without removed Claim dependencies', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);
    expect(plan.storyboard.version).toBe('1.3.0');
    expect(plan.scenes.flatMap((scene) => scene.claims)).toEqual([]);
    expect(plan.blockers).not.toContain('claims are unverified');
    expect(plan.scenes.find(({id}) => id === 'scene-04')?.presentation.voiceOver).toBe(
      'All’interno, gli utenti trovano un percorso strutturato dedicato al business dello sport, con video, test e quiz per mettere alla prova ciò che hanno imparato.',
    );
    expect(plan.scenes.find(({id}) => id === 'scene-13')?.presentation.voiceOver).toBe(
      'Porta la formazione sportiva nella tua community. Scopri AWE Sport Education.',
    );
  });

  it('compiles the approved footage-phone opening without changing script or timing authority', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);
    const opening = plan.scenes.slice(0, 3);

    expect(plan.storyboard.version).toBe('1.3.0');
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
      content: ['SCHERMO BLU EREDITATO DAL FOOTAGE', 'TAKEOVER MAGMA', 'UI AWE REALE'],
      voiceOver: 'Lascia che ti faccia vedere.',
    });
    expect(opening[2]?.presentation).toMatchObject({
      kind: 'logo-ui',
      content: ['LANDING AWE EDU', 'LOGO IN ALTO A SINISTRA', 'UI DIMOSTRATIVA'],
    });
  });

  it('compiles distinct motion intents for the stable app-section tracers', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);

    expect(plan.scenes.find(({id}) => id === 'scene-04')?.presentation.content).toEqual([
      'MAZZO 3D DEI 12 TEMI',
      'APERTURA CONTROLLATA',
      'ASSESTAMENTO IN GRIGLIA',
    ]);
    expect(plan.scenes.find(({id}) => id === 'scene-06')?.presentation.content).toEqual([
      'PROGRESSO IN PRIMO PIANO',
      'PASSAGGIO IN PROFONDITÀ',
      'CLASSIFICA DINAMICA',
    ]);
  });

  it('binds the approved balanced timing and selected audiovisual media into the master plan', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);

    expect(plan.storyboard.version).toBe('1.3.0');
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

  it('binds the owner-selected music and sparse SFX mix without changing scene timing', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);

    expect((plan as any).audio).toEqual({
      id: 'awe-selected-mix',
      version: '1.0.0',
      music: {
        path: 'runtime-selected/music/uplifting-bass.mp3',
        sha256: 'sha256:6cdd3514fb6ce919f7b9e8984d9c11c3e2a7de9b39ec0e2658be0c64e69fd5e0',
        durationSeconds: 95.999975,
        playbackRate: 0.9448816,
        gainDb: -24.2,
        referenceLufs: -36,
      },
      sfx: {
        whoosh: {
          path: 'runtime-selected/sfx/cinematic-whoosh-fast-transition.wav',
          sha256: 'sha256:02b8cd40b3761288d54f4d6706983a2f8c110182b669ae2cdf9aab02935a4e7a',
          durationSeconds: 1.334127,
        },
        uiSelect: {
          path: 'runtime-selected/sfx/modern-technology-select.wav',
          sha256: 'sha256:00270a1847195cddb82d1b10c9407880ce311f522284afaefdc218fbba70d3ed',
          durationSeconds: 0.5,
        },
      },
      cues: [
        {id: 'product-relay', asset: 'whoosh', frame: 1021, gainDb: -22},
        {id: 'partner-relay', asset: 'whoosh', frame: 1825, gainDb: -24},
        {id: 'ranking-select', asset: 'uiSelect', frame: 1260, gainDb: -12},
        {id: 'roadmap-select', asset: 'uiSelect', frame: 2310, gainDb: -14},
      ],
      ducking: {voiceGainDb: 0, musicUnderVoiceDb: -2, attackFrames: 6, releaseFrames: 12},
      ambience: null,
      releasePolicy: null,
    });
    expect(plan.totalFrames).toBe(3048);
  });

  it('rejects missing or reordered authored scenes', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    [input.storyboard.scenes[0],input.storyboard.scenes[1]]=[input.storyboard.scenes[1],input.storyboard.scenes[0]];
    expect(()=>compileMaster(input)).toThrow(/ordered/);
  });
});
