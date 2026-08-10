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
    expect(a.planHash).toBe('sha256:f322acc5cd0924c2c944fe933067b3620d188f2b0c4ba1d7708c78aaa3b6d5ae');
    expect(JSON.stringify(a)).not.toContain(process.cwd());
  });

  it('compiles the authored master into exact ordered half-open intervals', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    const plan = compileMaster(input);
    expect(plan.totalFrames).toBe(2550);
    expect(plan.scenes.map(({id, frameInterval}) => [id, frameInterval])).toEqual([
      ['scene-01',{start:0,end:150}],['scene-02',{start:150,end:240}],['scene-03',{start:240,end:420}],
      ['scene-04',{start:420,end:660}],['scene-05',{start:660,end:840}],['scene-06',{start:840,end:1080}],
      ['scene-07',{start:1080,end:1230}],['scene-08',{start:1230,end:1500}],['scene-09',{start:1500,end:1740}],
      ['scene-10',{start:1740,end:1890}],['scene-11',{start:1890,end:2160}],['scene-12',{start:2160,end:2310}],
      ['scene-13',{start:2310,end:2550}],
    ]);
    expect(plan.planHash).toBe('sha256:ac22aa2786de0afc0bdb3bebb8b07f27615517f607f82e33d7c60c7a21b4abf3');
    expect(plan.scenes.flatMap(scene=>scene.claims).every(claim=>claim.status==='unverified')).toBe(true);
  });

  it('rejects missing or reordered authored scenes', () => {
    const input = YAML.parse(readFileSync('examples/awe-project.yaml', 'utf8'));
    [input.storyboard.scenes[0],input.storyboard.scenes[1]]=[input.storyboard.scenes[1],input.storyboard.scenes[0]];
    expect(()=>compileMaster(input)).toThrow(/ordered/);
  });
});
