# AWE continuity, voice pacing and audio grill — 2026-08-18

Status: two-depth recursive grill of issues #1, #6 and #13 against the exact
`awe-master@1.3.0` render and current Remotion implementation. This document
adopts planning recommendations; it does not select music, grant rights, set
release loudness policy or promote the pending Storyboard revision.

## Verified baseline

The current renderer places each scene in an adjacent, non-overlapping
`Sequence`; voice and the whole-scene caption live inside that same Sequence.
There is no cross-scene transition layer, global music lane, ambience lane or
SFX lane. Except for the phone takeover across scenes 1–3, every boundary is a
direct visual cut. The selected WAV files nearly fill their resolved scene
intervals, so the pacing defect is not excess silence after narration: it is
that the principal visual action often finishes while narration is still active.

| Scene | Resolved duration | Selected voice | Principal motion ends | Unmotivated/static remainder risk |
|---|---:|---:|---:|---:|
| 01 | 5.667 s | 5.608 s | 5.250 s | 0.417 s |
| 02 | 3.000 s | 1.941 s | 3.000 s ambient canvas | low; 1.060 s post-voice hold is intentional only if it hands to S3 |
| 03 | 7.933 s | 7.874 s | 6.000 s | 1.933 s |
| 04 | 11.433 s | 11.411 s | 4.750 s | 6.683 s |
| 05 | 6.000 s | 5.142 s | ~2.100 s | ~3.900 s |
| 06 | 9.567 s | 9.543 s | 7.250 s | 2.317 s |
| 07 | 6.533 s | 6.473 s | ~1.750 s | ~4.783 s |
| 08 | 10.700 s | 10.673 s | 7.000 s | 3.700 s |
| 09 | 10.167 s | 10.137 s | ~1.840 s | ~8.327 s |
| 10 | 7.300 s | 7.264 s | 4.200 s | 3.100 s |
| 11 | 9.000 s | 7.875 s | ~1.600 s | ~7.400 s |
| 12 | 6.300 s | 6.270 s | ~1.900 s | ~4.400 s |
| 13 | 8.000 s | 6.070 s | ~6.000 s | ~2.000 s |

The principal-motion values come from the frame functions in the current code,
not from automated visual inference. Scene 5 and scenes 7–13 are still subject
to the structural Storyboard gate in #13, so their numbers diagnose the current
preview but do not authorize polishing obsolete layouts.

## Dependency graph

```diagram
┌──────────────────────────────────┐
│ #13 Promote stable Storyboard    │
└────────────────┬─────────────────┘
                 ▼
┌──────────────────────────────────┐
│ Cross-scene + voice pacing tracer│
│ transition beats + cue sheet     │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│ #6 Materialize lanes and mix     │◀──── approved music/SFX package
│ voice · music · ambience · SFX   │
└────────────────┬─────────────────┘
                 ▼
┌──────────────────────────────────┐
│ #7 Exact reviewed master         │
└──────────────────────────────────┘
```

Music direction and candidate selection can proceed in parallel with #13, but
the final edit and mix cannot be locked until scene order and timing are stable.
Issue #4 remains the generic Candidate/selection/alignment contract required for
production-grade pipeline completion; its body must acknowledge that the AWE
fixture already has direct hash-bound voice/caption rendering.

## Root #1 — destination map

**Verdict: split required.** “Make it fluid” combines stable Storyboard,
cross-scene visual choreography, voice-aware intra-scene pacing, sound asset
selection/rights and technical mix evidence. They have different owners and
proof.

### Depth 1 decisions

1. **Should every hard cut become a dissolve? Why it matters:** a universal
   dissolve would conceal cuts but preserve the same disconnected grammar.
   **Recommendation:** no. Every changed boundary gets a named Transition Beat
   based on object, color, path, shape or camera direction; clean cuts remain
   valid where contrast is narratively motivated. **Ticket consequence:** the
   transition tracer inventories all 12 boundaries and renders each exact edge.
2. **Can transitions be added before #13? Why it matters:** scenes 5 and 7–13
   may be removed or rewritten. **Recommendation:** only design the grammar and
   cue map now; implement the full sequence after #13. **Ticket consequence:**
   #13 is a hard dependency, avoiding polish on obsolete structure.
3. **What does “animation ends too early” mean? Why it matters:** taste needs a
   falsifiable seam. **Recommendation:** during active narration, no scene may
   leave more than 1.5 s after its last meaningful visual beat unless the cue
   sheet declares a Narrative Hold with reading purpose or restrained ambient
   motion. **Ticket consequence:** scene-level timings derive from selected
   voice duration and are reviewed against exact WAV hashes.
4. **Should total duration change? Why it matters:** visual overlap can shorten
   a Remotion timeline and overlapping scene components can overlap voices.
   **Recommendation:** the pending Storyboard decides scene intervals; after
   that, visual transition overlap is decoupled from non-overlapping voice
   playback and must preserve the approved resolved total. **Ticket
   consequence:** audio cannot remain nested in visually overlapping sequences.

### Depth 2 hardening

- **Could named Transition Beats become another template?** Yes. Permit a small
  vocabulary, but require adjacent beats to differ in geometry and narrative
  role; no same wipe at every edge.
- **Could the 1.5 s rule create constant distracting motion?** Yes. It measures
  meaningful beats, not perpetual animation. A declared Narrative Hold can be
  visually quiet when the viewer needs to read.
- **Could scene-level voice duration fake semantic sync?** It can remove dead
  holds but cannot align individual words. The preview tracer uses a manually
  reviewed Motion Cue Sheet; production caption/word alignment remains #4.
- **Could overlap clip captions or narration?** Decouple visual transitions,
  voice and captions; verify first/last spoken samples and caption safe areas at
  every boundary.

## Root #13 — Storyboard promotion

**Verdict: blocked, with an expanded output contract.** The human decisions and
designer assets remain unavailable. The promoted revision must now also expose
stable scene intervals and narrative handoff intent, because transitions and
music cannot be finalized against a sequence known to be obsolete.

### Depth 1 decisions

1. **Must the designer prescribe transition mechanics?** No. The promotion must
   state narrative continuity and required content; motion direction owns the
   mechanics.
2. **Must music be selected before promotion?** No. The promotion must state
   section energy and emotional intent, while a separate audio gate selects
   exact assets and rights.
3. **Can existing Livia audio survive structural edits?** Only where script and
   scene ownership remain byte-identical. Merged, removed or rewritten lines
   require a timing proposal and possibly a new VoiceCandidate, never a silent
   audio edit.

### Depth 2 hardening

- Stable ordering without exact intervals is insufficient for transition and
  mix lock; the promotion must include resolved timing consequences.
- Energy labels such as “upbeat” are insufficient alone; each section needs a
  narrative role (hook, discovery/product, partner value, CTA).
- Reusing voice by waveform splice would bypass Candidate lineage; unchanged
  files may be reused only under an explicit scene/script mapping.

## Root #6 — full audio and mix

**Verdict: blocked and ready after ticket edits.** Voice is already present on
all 13 scenes, but the current whole-scene captions are not word-aligned and the
master has no music, ambience or SFX lanes, ducking, rights package, stems or
approved loudness/true-peak policy.

### Depth 1 decisions

1. **One music track or many? Why it matters:** unrelated tracks would make 13
   short scenes feel even more fragmented. **Recommendation:** one continuous,
   instrumental sport/technology bed with three edit/energy sections (hook,
   product discovery, partner/CTA), plus sparse SFX and optional office
   ambience. Multiple source tracks are acceptable only if they share key,
   tempo and sonic palette and the A/B review proves a cleaner result.
2. **What should the track sound like?** Modern, optimistic, confident and
   propulsive rather than solemn; no vocals; restrained midrange under Italian
   narration; approximately 110–122 BPM as a search range, not a release
   requirement.
3. **Can provisional music be downloaded now?** Candidates can be auditioned,
   but nothing enters the selected master without immutable local asset,
   provenance, license/rights scope and owner selection. No unknown license is
   treated as “royalty free.”
4. **How should audio create continuity?** The music bed crosses every boundary;
   automation supports section changes. Sparse whooshes, impacts, UI ticks and
   risers bind only motivated visual beats. Voice remains foreground with
   explicit ducking; SFX never compete with consonants.
5. **Can mix levels be guessed?** Preview audition levels may be provisional and
   clearly labelled, but release loudness and true peak remain human-approved
   Output Profile policy. Stems are mandatory evidence, not merely a final AAC.

### Depth 2 hardening

- A continuous bed can become monotonous; sectional edits, instrumentation
  changes and short breath points must follow the Motion Cue Sheet rather than
  arbitrary scene cuts.
- Too many SFX recreate the same repetition in audio; accents are limited to
  transition anchors and semantic state changes, with an A/B pass against the
  music-only mix.
- Ducking based only on scene boundaries is too coarse; automation follows the
  actual selected voice waveform and preserves natural pauses without pumping.
- “Royalty free” does not establish commercial, territory, duration,
  modification, synchronization or AI-use rights; the exact license evidence
  must be bound to the selected Asset.
- A stereo master alone cannot prove repairability or policy compliance; retain
  at minimum voice, music and SFX/ambience stems plus the final mix.

## Consolidated ticket delta

1. Keep #13 as the human Storyboard gate; add stable interval, handoff intent,
   section energy and unchanged-voice reuse criteria.
2. Create one transition/pacing tracer blocked by #13. It owns the 12-boundary
   inventory, visual/audio timeline separation, Motion Cue Sheet, Narrative
   Hold threshold and exact rendered-edge evidence.
3. Create one human audio-selection gate, executable in parallel. It owns 2–3
   audition candidates, direction, provenance, rights and exact selected hashes.
4. Update #6 to reflect current voice/caption evidence and depend on the
   transition tracer and selected audio package in addition to #4.
5. Update #1 with the resulting acyclic graph. #7 remains downstream of #6.

## Residual uncertainty

- Final scene structure, copy and timing from the designer/owner.
- Exact music source, budget and license terms.
- Whether opening/closing footage ambience exists as a usable authorized source
  track; the selected MP4s are currently rendered muted.
- Release loudness, true-peak and safe-area policy.
- Whether production requires word-level captions or phrase-level cues.
