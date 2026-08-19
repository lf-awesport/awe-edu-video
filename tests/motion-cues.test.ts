import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import YAML from 'yaml';
import {compileMaster} from '../src/compiler.js';
import {beatSheenStyle, beatSurfaceMotifs, beatSurfaceStyle, motionCueSheetForPlan} from '../src/remotion-motion.js';

describe('AWE Motion Cue Sheet public seam', () => {
  it('binds one named Transition Beat to every exact master boundary', () => {
    const project = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const cues = motionCueSheetForPlan(compileMaster(project));

    expect(cues).toMatchObject({id: 'awe-continuity', version: '1.0.0'});
    expect(cues.transitions.map(({id, frame, motif}) => [id, frame, motif])).toEqual([
      ['scene-01-to-scene-02', 170, 'phone-blue-takeover'],
      ['scene-02-to-scene-03', 260, 'magma-canvas-relay'],
      ['scene-03-to-scene-04', 498, 'cyan-focus-line'],
      ['scene-04-to-scene-05', 841, 'card-to-device'],
      ['scene-05-to-scene-06', 1021, 'device-depth-push'],
      ['scene-06-to-scene-07', 1308, 'ranking-gold-band'],
      ['scene-07-to-scene-08', 1504, 'gold-brand-iris'],
      ['scene-08-to-scene-09', 1825, 'identity-color-strips'],
      ['scene-09-to-scene-10', 2130, 'case-roadmap-line'],
      ['scene-10-to-scene-11', 2349, 'roadmap-community-node'],
      ['scene-11-to-scene-12', 2619, 'community-live-orbit'],
      ['scene-12-to-scene-13', 2808, 'live-panel-cinematic-return'],
    ]);
    expect(cues.transitions.every(({durationInFrames}) => durationInFrames >= 18 && durationInFrames <= 30)).toBe(true);
    expect(cues.transitions.every(({voicePolicy}) => voicePolicy === 'preserve-non-overlapping-scene-intervals')).toBe(true);
  });

  it('keeps every scene active through narration or declares a Narrative Hold', () => {
    const project = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const cues = motionCueSheetForPlan(compileMaster(project));

    expect(cues.scenes.map(({sceneId, finalBeatFrame, narrativeHold}) => [sceneId, finalBeatFrame, narrativeHold])).toEqual([
      ['scene-01', 158, false], ['scene-02', 82, true], ['scene-03', 220, false],
      ['scene-04', 318, false], ['scene-05', 164, false], ['scene-06', 266, false],
      ['scene-07', 180, false], ['scene-08', 300, false], ['scene-09', 284, false],
      ['scene-10', 201, false], ['scene-11', 244, true], ['scene-12', 173, false],
      ['scene-13', 218, true],
    ]);
  });
});

describe('AWE Transition Beat surface', () => {
  it('paints every covering motif as a lit brand surface instead of a flat fill', () => {
    expect(beatSurfaceMotifs).toEqual([
      'cyan-focus-line', 'card-to-device', 'device-depth-push', 'ranking-gold-band',
      'gold-brand-iris', 'identity-color-strips', 'case-roadmap-line',
      'roadmap-community-node', 'community-live-orbit', 'live-panel-cinematic-return',
    ]);

    for (const motif of beatSurfaceMotifs) {
      const surface = beatSurfaceStyle(motif, 0.5);
      expect(surface.backgroundColor, motif).toBeTruthy();
      expect(surface.backgroundImage, motif).toContain('radial-gradient');
      expect(surface.backgroundImage, motif).toContain('linear-gradient');
    }
  });

  it('moves the beat sheen across the beat so fully covered frames still travel', () => {
    const [motif] = beatSurfaceMotifs;
    const offsets = [0, 0.5, 1].map((progress) => beatSheenStyle(motif!, progress).transform);

    expect(new Set(offsets).size).toBe(3);
  });
});
