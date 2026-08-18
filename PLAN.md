Summary: Repair the opening by transitioning through the phone already present
in selected footage, then establish a non-repetitive AWE Motion Language on the
stable app-section scenes 4 and 6. Do not animate designer-marked obsolete or
blocked structure before a new Storyboard promotion.

Status: Completed for `awe-master@1.3.0`. The exact native master and localized
clips passed technical verification, full decode and creative review. The next
work is the human-gated Storyboard promotion in #13, not additional autonomous
polish on the blocked scenes.

Context: The current master is a verified 3048-frame internal preview. Motion
audit found a duplicated synthetic phone, broken portrait-to-desktop geometry,
and repeated universal fades/reveal springs. The raw opening footage supplies a
usable blue-screen Transition Anchor around 3.25 s. Designer feedback makes
scene 4 and scene 6 executable, but scene 5, scene 7 and scenes 8–13 depend on
editorial/assets/rights decisions.

System Impact: Storyboard copy and authored timing remain authoritative and
unchanged. The selected footage hash remains the opening source of truth;
opening anchor evidence becomes stale if that hash changes. RenderPlan media
binding and render identity stay intact. Motion ownership remains in Remotion,
with only proven shared tokens/primitives extracted; no generic transition
schema is introduced yet.

Approach: Execute two independent visual tracers, followed by one human
Storyboard gate. First remove the synthetic phone and build one continuous
footage-screen → blue/magma → product handoff across scenes 1–3. Second replace
the repeated reveal grammar in scenes 4 and 6 with distinct deck-to-grid and
progress-to-ranking transformations. Defer the rest until the designer's
structural feedback is promoted.

Changes:
- `src/remotion-scenes.tsx` — remove the S1/S2 `Phone` overlay; sequence the
  opening hierarchy; implement the footage-screen takeover; add scene 4 fan/grid
  and scene 6 progress/depth/reorder choreography; remove generic fades only on
  changed boundaries.
- `src/remotion-scene-03.tsx` — inherit the full-frame magma anchor and introduce
  product surfaces without a portrait-to-desktop jump.
- `src/remotion.tsx` — keep audio/caption ownership; change only if a shared
  boundary wrapper is proven necessary by the two tracers.
- `src/remotion-motion.ts` — create only if at least two scenes reuse concrete
  easing/progress helpers; no speculative transition framework.
- `examples/awe-project.yaml` — preserve copy/timing/media; version only the
  visual Storyboard intent required by approved tracer outcomes.
- `tests/compiler.test.ts` — prove copy, timing and selected media hashes remain
  unchanged across the visual revision.
- `docs/video-pipeline/designer-feedback-2026-08-18.md` — keep feedback status
  and blocked decisions synchronized.
- `HANDOFF.md` — record new render/review evidence and remaining human gates.

Verification:
- Run `npm test`, `npm run typecheck`, fixture validation/build, native master
  render and immutable verification.
- Produce old/new clips for scenes 1–3, scene 4 and scene 6 plus contact sheets
  at boundary/key-state frames.
- Verify the opening contains exactly one phone, the existing screen is the
  Transition Anchor, and portrait geometry resolves through blue/magma before
  desktop/mobile product surfaces enter.
- Verify scene 4 performs one fan-to-grid transformation and scene 6 performs
  progress → depth handoff → one ranking reorder, with different geometry and
  rhythm.
- Full-decode audio/video; check captions, blank frames, clipping and unchanged
  `internal-preview-only` release status.
- Obtain human creative review of the exact rendered hash; technical green alone
  does not close visual acceptance.
