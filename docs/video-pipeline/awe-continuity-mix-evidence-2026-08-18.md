# AWE continuity and mix evidence — 2026-08-18

Implementation and review evidence for issues #14, #15 and the internal-preview
portion of #6. The owner explicitly deferred Storyboard revision #13 and
authorized this pass against `awe-master@1.3.0`. Copy, scene order and the 3048
resolved frames remain unchanged. A future Storyboard promotion invalidates the
Transition Beats and audio cues for every changed boundary.

## Motion Cue Sheet `awe-continuity@1.0.0`

Voice and whole-scene captions retain the existing non-overlapping half-open
scene intervals. The visual transition layer is independent and cannot replay,
overlap or truncate voice files.

| Edge | Frame | Transition Beat | Narrative anchor |
| --- | ---: | --- | --- |
| 01→02 | 170 | `phone-blue-takeover` | real phone screen becomes the blue product canvas |
| 02→03 | 260 | `magma-canvas-relay` | shared magma canvas carries into product UI |
| 03→04 | 498 | `cyan-focus-line` | browser card expands into the content system |
| 04→05 | 841 | `card-to-device` | content card becomes a device surface |
| 05→06 | 1021 | `device-depth-push` | device depth hands to progress depth |
| 06→07 | 1308 | `ranking-gold-band` | selected ranking row becomes the learning path |
| 07→08 | 1504 | `gold-brand-iris` | valued outcome opens into partner identity |
| 08→09 | 1825 | `identity-color-strips` | brand palette resolves into partner content |
| 09→10 | 2130 | `case-roadmap-line` | case card baseline becomes the roadmap |
| 10→11 | 2349 | `roadmap-community-node` | final milestone expands into the community node |
| 11→12 | 2619 | `community-live-orbit` | community orbit focuses into the live encounter |
| 12→13 | 2808 | `live-panel-cinematic-return` | live panel expands into the presenter return |

Scene pacing now carries meaningful beats through narration: browser scroll,
subject-card focus, desktop/mobile relay, ranking reordering, path emphasis,
identity focus, case-study focus, roadmap progression, community orbit/reward
focus and timed live-chat messages. Scenes 2, 11 and 13 retain declared quiet
Narrative Holds rather than perpetual decorative motion.

## Selected audio and mix

- Music source: **Uplifting Bass — Lily J**, SHA-256
  `6cdd3514fb6ce919f7b9e8984d9c11c3e2a7de9b39ec0e2658be0c64e69fd5e0`.
- Owner-approved reference: approximately -36 LUFS music bed. The RenderPlan
  binds source gain at -24.2 dB, 0.9448816 playback rate, 1.2/1.8 s fades and a
  restrained additional 2 dB duck under selected voice intervals.
- Sparse SFX only: two attenuated whooshes and two UI selects. The conditional
  heartbeat impact was rejected; ambience remains intentionally absent.
- Final internal master measurement: -15.6 LUFS integrated, -3.6 dBTP, 48 kHz
  stereo AAC. This is review evidence, not a release loudness policy.
- Mixkit rights and restrictions are recorded in
  `audio-candidate-research-2026-08-18.md`; raw stock files and recoverable stock
  stems remain internal.

## Immutable render evidence

```text
Storyboard       awe-master@1.3.0
RenderPlan       sha256:a547a699b454b8c6ba39a6c458daabf7fabedd0e02e4955d7d91236b07b16f06
Render identity  sha256:f79682443cc10e98f616ab021b2764bf9129a10a412087a6624bb0c3ae523bf1
Master MP4       sha256:3dbc88bf81afc8bab381c63f82ffe2a5f9d57cd2f07ac88f923811d1d2b7ac7d
Review proxy     sha256:a9bb2ec17c2e891c1c2ef25b71ab22d8efad53a58c4051fee574b9112b7ec4c6
12-edge reel     sha256:8e0e66fabdeccda2235d18d857e984ecd33d8c16e140766ce1d1d1900aa81815
```

Master: `.video/renders/sha256-f79682443cc10e98f616ab021b2764bf9129a10a412087a6624bb0c3ae523bf1/awe-master.mp4`.
It full-decodes as H.264, 1920×1080, 30 fps, 3048 frames, 101.610667 s,
with AAC audio. Release status remains `internal-preview-only`.

## Retained audio stems

All stems are 101.6-second, 48 kHz stereo FLAC files under the exact render
identity. `music-preduck.flac` retains the selected edit/gain/fades before the
explicit RenderPlan duck automation.

| Stem | SHA-256 |
| --- | --- |
| Voice | `673b9d93f5604f5c5f02d962e3754157f84e624bb8cdad588917ccb9730abc2c` |
| Music pre-duck | `4d6c70b3166b41475e09a322ec6457d96e65dc7c10f7f6fcd3df65117a2e67f2` |
| SFX | `98fc369fbc43e14d4e309e49e4b6b5bd49b0bb18f568b63f27fa89f3eb65fe21` |

## Review result

Full-proxy and 12-edge audiovisual reviews passed:

- all 13 scenes present and ordered;
- all 12 boundaries populated, distinct and narratively anchored;
- uninterrupted, non-overlapping Italian voice and readable captions;
- meaningful intra-scene motion through active narration;
- discreet music and restrained SFX with no speech masking;
- no black frames, freezes, clipped transitions, broken assets or audio cuts.

Pre-existing internal placeholder labels, blue-screen footage content and the
pending structural/editorial decisions remain owned by #13. Production release
still requires #4/#6 caption alignment, explicit output loudness/true-peak
policy, current Rights Grants and human release authority.
