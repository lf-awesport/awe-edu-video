# AWE motion direction and recursive grill — 2026-08-18

Status: implementation proposal for internal preview. This document reconciles
the current render, designer feedback and code; it does not promote editorial
copy, Claims, rights or release authority.

## Observed problem

The current composition has no explicit transition layer. Adjacent Remotion
`Sequence`s cut directly while most scenes independently use the same 0.35 s
fade and the same high-damping 0.8 s reveal spring. Cards repeatedly fade and
translate upward or sideways. The result is technically clean but visually
uniform: each scene appears, holds and disappears rather than handing motion to
the next scene.

The opening has a separate defect. At 1–3 s the footage phone and an unrelated
Remotion phone coexist in different positions. At 4–7 s the overlay scales
through multiple device states before cutting from portrait phone geometry to a
desktop browser. Raw-footage review found a valid Transition Anchor at about
3.25 s: the existing portrait screen is large, blue, near-center, nearly flat
and unobstructed.

## Motion-language correction

| Before | After |
|---|---|
| Universal scene fade-in/fade-out | Motivated hard cut or explicit shared-object/shared-canvas handoff |
| One `reveal()` spring for most content | A small set of named motion families chosen by narrative function |
| Repeated card opacity + translate stagger | One coherent deck, state transformation, path draw or identity morph |
| Synthetic phone floats over footage phone | Only the existing footage phone; transition inherits its blue screen |
| Portrait phone cuts to desktop browser | Blue screen expands to full-frame magma, then product surfaces enter on the same canvas |
| Headline, presenter, two phones and captions compete | Sequential hierarchy: hook → presenter action → screen takeover |
| Springs used as a generic entrance | Ease-out for entrances, ease-in-out for on-screen movement; spring only where physical settling adds meaning |
| Motion added to every object | Animate the narrative subject; supporting elements remain stable |

## Motion families

1. **Camera continuity** — scenes 1–3: footage phone screen → blue field →
   magma/product canvas. One uninterrupted direction of travel; no second phone.
2. **Deck to system** — scene 4: the 12 subject cards enter as one shallow 3D
   fan, rotate through a controlled arc and settle into the final 4×3 grid.
3. **State to consequence** — scene 6: progress fills, the progress panel
   recedes, ranking advances and performs one legible position change.
4. **Product relay** — scene 5 only if retained by Storyboard promotion:
   content passes between desktop and mobile rather than both devices fading in.
5. **Identity morph** — scene 8 only after partner-section promotion: one
   surface changes brand system instead of three independent cards bobbing.
6. **Editorial progression** — scenes 9–12 only after their rewrite; choose one
   distinct motif per approved narrative beat, not before.
7. **Cinematic return** — scene 13: preserve the approved footage-to-CTA
   direction and tune it only after the new opening establishes its anchor.

## Recursive grilling — depth 1

### Should the Remotion phone be tracked onto the footage phone?

- **Recommendation:** no. Remove it.
- **Why:** a true planar track is unavailable in the current deterministic
  renderer, and approximate tracking would preserve the double-device failure.
  The footage already supplies a usable screen anchor.
- **Ticket consequence:** the opening tracer owns a match-cut/crop takeover, not
  phone reconstruction or provider regeneration.

### Should every scene receive a bespoke transition now?

- **Recommendation:** no. Improve only stable structure: opening and scenes 4/6.
- **Why:** the designer explicitly requests scene 5 removal, blocks scene 7 on
  certificate/placement, and stops review at the partner rewrite for scenes
  8–13. Polishing those scenes now creates guaranteed rework.
- **Ticket consequence:** split executable motion work from Storyboard promotion.

### Is a reusable transition framework required first?

- **Recommendation:** no generic framework. Introduce only shared motion tokens
  and two reused primitives when the opening and app tracer prove their shape.
- **Why:** transitions are currently scene-bound; a schema/framework designed
  before two concrete motifs would add names without reducing complexity.
- **Ticket consequence:** test at composition/render boundaries; extract only
  demonstrated easing, progress and boundary helpers.

### Should crossfades replace the current cuts?

- **Recommendation:** only when motivated by a shared color/object. Default to a
  clean cut with directional continuity rather than hiding discontinuity.
- **Why:** generic crossfades retain repetitive pacing and blur hierarchy.
- **Ticket consequence:** each changed edge names its Transition Anchor and
  evidence frames.

## Recursive hardening — depth 2

### Can the 3.25 s phone anchor drift across the footage?

- **Challenge:** a hard-coded crop can miss if the source asset changes.
- **Hardened decision:** bind the opening choreography to the selected footage
  hash and record anchor frame/crop in review evidence. A new footage hash makes
  the visual review stale and requires re-anchoring; do not silently reuse it.

### Can the blue-screen takeover look like another abrupt cut?

- **Challenge:** removing the phone overlay alone does not create continuity.
- **Hardened decision:** acceptance requires a boundary clip showing the last
  footage screen, first full-frame blue/magma state and first product frame.
  Position, color, scale direction and velocity must remain continuous.

### Can named motion families become another repetitive template?

- **Challenge:** replacing one generic reveal with one generic “family” still
  homogenizes the video.
- **Hardened decision:** families constrain physics and hierarchy, not layouts.
  Scene 4 must read as spatial organization; scene 6 as state/consequence. They
  must not share entrance geometry or stagger rhythm.

### Can motion work accidentally approve blocked content?

- **Challenge:** animation may make provisional UI/certificate/partners appear
  authoritative.
- **Hardened decision:** current internal-preview markers and copy stay intact;
  the motion tracer cannot introduce certificate, brands, partner Claims or new
  voice lines. Storyboard promotion remains a separate human gate.

### How is “less basic and repetitive” falsifiable?

- **Challenge:** taste alone cannot close a ticket.
- **Hardened decision:** the review package must include old/new clips and a
  motion inventory proving: no double phone; no generic SceneShell fade on
  changed edges; distinct scene 4 and scene 6 motion geometries; no unintended
  blank/freeze/clipping; and explicit human creative review of the exact hash.

## Residual uncertainty

- Exact crop coordinates and takeover duration must be tuned against rendered
  evidence, not inferred from the contact sheet alone.
- Scene 5 removal/merge and timing reallocation require Storyboard promotion.
- Scene 7 certificate/placement requires asset, Claim and rights evidence.
- Partner-section narrative and real-brand policy remain human decisions.
- Music/SFX motion accents remain out of scope until audio lanes and rights are
  approved.
