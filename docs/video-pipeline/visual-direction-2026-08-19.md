# Visual direction pass — 2026-08-19

Scope: **visual direction only** against the unchanged `awe-master@1.3.0`
structure. This pass does not change copy, timing, voice-over, scene order,
selected audio or release status. Tracker: [issue #13](https://github.com/lf-awesport/awe-edu-video/issues/13).

## Reconciliation before work

Recompiling the fixture reproduces the current plan hash exactly, so the
structure this pass refines is the one recorded in `HANDOFF.md`:

```text
RenderPlan   sha256:a547a699b454b8c6ba39a6c458daabf7fabedd0e02e4955d7d91236b07b16f06
Structure    awe-master@1.3.0 · 13 scenes · 3048 frames · 101.6 s @ 30 fps
Baseline     npm test 37/37 · npm run typecheck pass
```

The RenderPlan hash is the non-regression proof for this pass. Copy, resolved
intervals, the selected Livia voice and the selected audio mix are all compiled
into that hash. It must stay `a547a699…` after the change. Only the **render
identity** moves, because it binds the Remotion source hashes.

## Tracker note

The declaration below was prepared for issue #13 but could not be posted from
this session: the GitHub integration (`met-no-code`) has no issue-write
permission and `POST /issues/13/comments` returns `403 Resource not accessible by
integration`. It is recorded here so ownership is still declared before
implementation, per `AGENTS.md`.

### Scenes and files owned by this pass

| Area | File |
|---|---|
| Transition Beats, all 12 boundaries — rendering only | `src/remotion-motion.tsx` |
| Scenes 04, 08, 10, 11 — layout and contrast only | `src/remotion-scenes.tsx` |
| Cue-sheet regression seam | `tests/motion-cues.test.ts` |
| Evidence | `docs/video-pipeline/visual-direction-2026-08-19.md` |
| Handoff | `HANDOFF.md` |

Not touched: `examples/awe-project.yaml`, `src/compiler.ts`, `src/schema.ts`,
`src/voice-candidate.ts`, and every file under `assets/`.

## Finding 1 — Transition Beats occlude the frame with flat colour

The 12 Transition Beats live on an independent visual layer, but 10 of them
reduce the frame to a single flat colour at their peak. Measured as the share of
the frame occupied by the single most common colour, on 1920×1080 stills rendered
from the current plan at each boundary frame:

| Boundary | Motif | Dominant-colour coverage |
|---|---|---|
| 170 | `phone-blue-takeover` | 5.9% |
| 260 | `magma-canvas-relay` | 17.0% |
| 498 | `cyan-focus-line` | **100.0%** |
| 841 | `card-to-device` | **100.0%** |
| 1021 | `device-depth-push` | **100.0%** |
| 1308 | `ranking-gold-band` | 81.2% |
| 1504 | `gold-brand-iris` | **100.0%** |
| 1825 | `identity-color-strips` | 19.8% |
| 2130 | `case-roadmap-line` | **100.0%** |
| 2349 | `roadmap-community-node` | 80.7% |
| 2619 | `community-live-orbit` | 95.2% |
| 2808 | `live-panel-cinematic-return` | 82.7% |

At frame 1504 the master is a solid `#FFC757` rectangle with no trace of either
scene. The coverage itself is doing useful work — it hides the hard cut the owner
complained about — but a textureless slab held for 3–5 frames reads as a render
fault rather than an intended handoff.

The fix keeps every motif's identity, `frame`, `durationInFrames` and
`voicePolicy` byte-identical and changes only how the beat surface is painted:
a lit brand surface (directional gradient plus a sheen that travels with the
beat's own progress) instead of a flat fill. The surface is exposed as a public
seam, `beatSurfaceStyle` and `beatSheenStyle` in `src/remotion-motion.tsx`, and
`tests/motion-cues.test.ts` now fails if any covering motif regresses to a flat
fill or if the sheen stops travelling.

Re-measured on the same boundary frames after the change:

| Boundary | Before | After |
|---|---|---|
| 498 | 100.0% | 24.4% |
| 841 | 100.0% | 18.1% |
| 1021 | 100.0% | 10.2% |
| 1308 | 81.2% | 7.1% |
| 1504 | 100.0% | 13.4% |
| 1825 | 19.8% | 1.8% |
| 2130 | 100.0% | 5.6% |
| 2349 | 80.7% | 8.3% |
| 2619 | 95.2% | 11.0% |
| 2808 | 82.7% | 6.7% |

## Finding 2 — Scene 08 collides with the caption band

The three device cards are 750 px tall, centred in a container inset 100/95, and
carry a `translateY` swell plus a rotation. The third card reaches y≈955. A
two-line caption plate starts at y≈924, so the card runs under the caption.

Fixed by pulling the block into the caption-free band (container inset 96/186)
and shortening the cards to 672 px. No card now crosses the lower safe area.

## Finding 3 — Scene 11 orbit node overlaps the centre

The ring nodes and the centre circle are positioned in two independent coordinate
systems. The `COMMUNITY` node's left edge lands at x≈556 while the centre circle
reaches x≈590, a ~34 px overlap that puts the pill on top of the `PARTNER` label.

Fixed by restating the ring as one centre `(470, 610)` with an explicit hub
diameter of 200 px and ring radii of 300×190 px. The tightest case, a node on the
horizontal axis, leaves 300 − 85 = 215 px between hub centre and node edge
against a 100 px hub radius, so every node clears the hub with margin.

## Finding 4 — Invisible chips in scenes 04 and 10

The `VIDEO · TEST · QUIZ` and `PROGETTO SU MISURA` chips use `#E6F8FD` on the
`mist` `#EAF8FD` scene background. The chip shape is effectively invisible; only
its text reads. Both now use a solid brand-blue chip with white text. The wording
is unchanged.

## Proposals held for owner approval — not implemented

These touch copy, assets or structure, so they stay proposals.

**P1 — Baked-in card text collides with overlay labels (scenes 04 and 12).**
The images in `assets/subjects/runtime/` carry their title burnt into the file
(`FAN EXPERIENCE - PREVIEW`, `di Team AWE Sport Education`). The renderer draws
its own label (`Fan experience`) into the same band, so the two texts overlap and
neither reads. This is the master's worst legibility defect. Every remedy leaves
this pass's scope: (a) crop the image past the burnt-in band — an asset decision
that removes words currently on screen; (b) drop the overlay label — on-screen
copy; (c) request clean subject exports from the designer — a new asset.
Recommendation: (c), with (a) as a declared fallback.

Scene 09 uses the same source images but is *not* affected: it places its overlay
copy in a clean white band below the image instead of over the burnt-in band.
That layout is the working reference if the owner chooses a renderer-side remedy.

**P2 — Duplicate `PARTNER` label in scene 11.** `PARTNER` appears both as a ring
node and as the centre. The geometry is fixed by this pass, but removing or
renaming the node is on-screen copy.

**P3 — Scene 10 is close to empty.** Title top-left, a thin timeline mid-right,
one line of text; the lower-left quadrant stays empty for the whole 7.3 s.
Filling it needs new copy or a new asset.

**P4 — Scene 13 caption is redundant.** The caption repeats the on-screen CTA
verbatim. Changing it is copy/VO.
