# Handoff — AWE video-generation pipeline

## Footage-anchor and motion-language master — 2026-08-18

The owner-approved motion revision is complete at `awe-master@1.3.0`. Scenes
1–3 now use the phone physically present in the selected footage as the sole
Transition Anchor: the camera pushes into its blue screen, expands to the magma
canvas, and introduces the AWE logo/UI without a second synthetic device.
Scene 4 now transforms one 3D topic deck into the final 4×3 grid. Scene 6 uses
the distinct progress → depth → cyan ranking → reorder choreography. Copy,
Livia voice assets, captions, 3048-frame timing and release status are
unchanged.

```text
RenderPlan       sha256:180e381b71f66625cc1c0e4e9e5c2d141177fc638266b414b7a734a441f6627a
Render identity  sha256:cdea63a13c449335f0778b589edd941f8f3bd487f2a9dc122fc083916de93b08
Master MP4       sha256:258ad78a11554faccfe3f230a197c96092895a70852e1c518491778118dd85f0
Media            H.264 1920×1080, 30 fps, 3048 frames; AAC 48 kHz stereo
Video duration   101.600 seconds (container 101.610667 s; AAC packet padding)
Path             .video/renders/sha256-cdea63a13c449335f0778b589edd941f8f3bd487f2a9dc122fc083916de93b08/awe-master.mp4
```

The immutable verifier and an independent `ffmpeg -xerror` pass fully decoded
the master. Localized opening, scene 4 and scene 6 reviews passed without
duplicate phones, black frames, clipping, overlap or missing media. Full-proxy
audiovisual review confirmed all 13 ordered scenes, continuous Italian
narration/captions, the revised motion beats and the unchanged closing
footage-to-CTA transition. Review evidence is under
`.video/reviews/opening-1.3.0/`, `.video/reviews/motion-1.3.0/` and
`.video/reviews/awe-motion-1.3.0/` and remains intentionally untracked.

Issues #11 and #12 own the completed tracers. Issue #13 remains the next
creative gate: do not remove/merge scene 5 or alter scenes 7–13 until the
designer/owner provides the named assets, copy, Claim evidence and promoted
Storyboard revision. This artifact remains `internal-preview-only`; successful
motion review does not grant rights or release authority.

## Balanced audiovisual master — 2026-08-18

The owner approved the balanced timing selection. The unchanged authored
Storyboard remains `awe-master@1.2.0` (85 requested seconds), while
`awe-livia-balanced@1.0.0` explicitly resolves it to 3048 frames / 101.6 video
seconds. All 13 selected Livia voice assets are locally materialized as mono
48 kHz PCM, sped up at most 1.2×, and hash-bound into the RenderPlan. Italian
captions use the approved scene copy. Selected opening and closing footage is
also local, hash-bound and rendered without reading provider runtime state.

```text
RenderPlan       sha256:54cf44400f27009235e143c2d534dd4aa7b13f374e7e6ffd7224539d67d0709d
Render identity  sha256:6608e64c1f41a545d36804e7c14f717ea21391b7de54737291d2602a8cace9fc
Master MP4       sha256:c69d7c15270f20c69c1741024c39c915c8e350ac5b36299319d502ef0c4bc087
Media            H.264 1920×1080, 30 fps, 3048 frames; AAC 48 kHz stereo
Video duration   101.600 seconds (container 101.610667 s; AAC packet padding)
Path             .video/renders/sha256-6608e64c1f41a545d36804e7c14f717ea21391b7de54737291d2602a8cace9fc/awe-master.mp4
```

The immutable verifier checked both streams and fully decoded the output. A
13-frame contact sheet and full audiovisual proxy review found every scene
populated, continuous Italian narration, matching captions, clean opening
person/phone → AWE UI and closing footage → Remotion CTA transitions, and no
black frames, clipped speech or blocking media defects. Review artifacts are in
`.video/reviews/awe-livia-balanced-1.0.0/` and remain intentionally untracked.

This is still `internal-preview-only`. It is not a production or publication
master: authorized desktop captures, partner/certificate assets, second-half
designer review, rights/consent, loudness and mix policy, music/SFX rights,
Remotion licensing classification and release approval remain open. No further
Higgsfield submission is needed for this preview. Last observed team balance
was 3960 credits after 24 credits of the approved 31.20-credit ceiling were
spent; do not treat that observation as a fresh quote or authorization.

## Opening visual tracer — 2026-08-18

Designer feedback is reconciled in
[`docs/video-pipeline/designer-feedback-2026-08-18.md`](docs/video-pipeline/designer-feedback-2026-08-18.md).
The owner approved the revised opening direction and `awe-master@1.2.0` now
encodes person/phone intent for scene 1, a Remotion-owned push through the phone
in scene 2, and an AWE EDU magma splash whose logo moves top-left as scene 3
content enters. Copy and the 85-second timing are unchanged. Missing generated
footage and the desktop capture remain visible fallback markers; the output is
still `internal-preview-only`.

```text
RenderPlan       sha256:bd4c54e39f4670a81b5772fbff37dc8a0903faa261b6936b5dfce7505f5af325
Render identity  sha256:3a105a507c105a74af7cd60787d47604d7d2ffa0352e320dfc3c184b54d31d2c
Master MP4       sha256:5151f953af4a02700cce4f68ef6e09ac15836fb6eac156d27873843a7104447b
Opening clip     sha256:7399790a7ed3b79a2b8bb8c50d6eabaa860f43ef16b6043794fe9d8217cb60f1
Media            H.264, 1920×1080, 30 fps; master 85 s, opening review 14 s
Opening path     .video/reviews/opening-1.2.0/opening-scenes-01-03.mp4
```

The master and opening clip passed full decode. Motion review found continuous
scene 1→2→3 boundaries, no black flash or framing jump, clean logo splash and
top-left transition, no blocking clipping, and no decorative circles. The
fallback source's own preview label and `UI demo · desktop in attesa` remain
intentional non-blocking markers. Issue #10 owns this completed local tracer;
issue #5 remains open for generated-footage replacement after web-plan access
and a fresh authorized preflight.

## Historical voice-over standby — superseded 2026-08-18

This earlier standby was superseded by the approved balanced master above; it
is retained as decision history. Do not submit, retry, or otherwise spend more
credits on TTS without a new explicit authorization. The preserved
creative direction is Higgsfield ElevenLabs preset `Livia` with
`[confident] [upbeat]`: the voice and tone are approved, but the required
cohesive Italian pronunciation `AWE → “Aue”` is not. The latest pronunciation
attempt was rejected before returning a job ID with HTTP 403. Higgsfield status
and job-list calls then also returned 403, so neither that attempt's billing nor
the current account state is reconciled. The last verified balance is **6.6
credits**, not a current quote.

The useful local artifacts remain excluded from Git:

```text
Rejected Inworld master     job da6e2e66-5bbe-4ad4-ae81-eb1bd85c7e2a
                            .video/tts/inworld-orietta-copy-1.1.0/master.wav
Approved Livia tone smoke   job a88287fc-f278-413f-a9dc-7f9a17d4a7a3
                            .video/tts/higgsfield-elevenlabs-livia-ipa-smoke/audition.mp3
```

The Inworld `Orietta (it)` master cost 2 credits and was rejected as too
funereal. Three ElevenLabs-via-Higgsfield tone auditions cost 0.90 credits in
total despite a 0.45-credit authorization ceiling; this operational error has
already been disclosed and recorded in GitHub issue #3. The selected Livia
smoke cost a further 0.30 credits. Qwen rejected Livia before job creation as an
incompatible preset. See
[`docs/video-pipeline/tts-provider-research.md`](docs/video-pipeline/tts-provider-research.md)
and [issue #3](https://github.com/lf-awesport/awe-edu-video/issues/3) for the
decision record.

## Copy lock update — 2026-08-18

The owner approved the safer Italian copy package, CTA 1 and pronunciation
`AWE → “Aue”` with Italian vowels and final `/e/`. That copy approval was bound
to `awe-master@1.1.0`; current Storyboard `awe-master@1.2.0` changes only the
opening visual intent and preserves the approved copy verbatim.
Unsupported numbers, points, certificate, fixed duration, licensing/internship
and live-session Claims were removed from the release copy and corresponding
visuals. The affected scenes passed a 1920×1080 contact-sheet review without
blocking clipping. See [`docs/video-pipeline/awe-copy-review.md`](docs/video-pipeline/awe-copy-review.md).

Copy and CTA are no longer blockers for the selected internal-preview voice.

## Visual master update — 2026-08-17

A complete 13-scene visual master now exists in native 1920×1080 resolution. All scenes use the supplied AWE BrandKit, local fonts, logos, UI mockups and subject artwork; generated footage, TTS and paid Higgsfield operations were intentionally excluded.

```text
RenderPlan       sha256:ac22aa2786de0afc0bdb3bebb8b07f27615517f607f82e33d7c60c7a21b4abf3
Render identity  sha256:d9a16c177004e5fb20f57736fa289f2d8f27b74b3a60ba3d41513f583db95587
MP4              sha256:b73439a9fde8ee7d661935dcb9316f7b431bc7c047a8184737af819d6f71590c
Media            H.264, 1920×1080 native, 30 fps, 2550 frames, 85 seconds, no audio
Path              .video/renders/sha256-d9a16c177004e5fb20f57736fa289f2d8f27b74b3a60ba3d41513f583db95587/awe-master.mp4
```

The render passed full decode and technical verification. A visual review of the complete 85-second proxy found all 13 scenes present in order with no blocking clipping, missing assets, broken fonts, flicker or unintended blank frames. It remains `internal-preview-only`: labels identify provisional UI, certificate, live-session, commercial-duration/reward claims and the unresolved CTA.

Runtime-sized derivatives under `assets/ui/runtime/`, `assets/subjects/runtime/` and `assets/brand/backgrounds/runtime/` prevent Chromium memory failures while preserving the supplied originals. Render identity binds every source and derivative used by the composition. Native rendering uses one worker because the complete master exceeds a stable multi-worker memory budget on the current machine.

The next production tracer remains audio when the owner resumes that lane: resolve pronunciation, select a VoiceCandidate, make selected audio authoritative for timing, generate captions, and add music/mix. Other independent work may proceed meanwhile. Scenes 1 and 13 currently use deterministic Remotion fallbacks; replace them with selected authorized footage only after a fresh cost preflight and explicit spend approval.

## Resume here

Continue on branch `main`. The repository now contains the reviewed bilingual specification, decision history, the full local Matt Pocock skill package, an executable TypeScript/Remotion prototype, and the hash-bound selected preview media under `assets/runtime-selected/`. Provider runtime state and rendered outputs under `.video/` remain intentionally excluded from Git.

GitHub Issues is the canonical active tracker. Start from [Completare e rendere rilasciabile il master audiovisivo AWE](https://github.com/lf-awesport/awe-edu-video/issues/1), then follow the dependency graph linked there. The 17 local tickets under `.scratch/video-generation-pipeline/issues/` are reconciled decision history, not open implementation tasks; see [`docs/agents/ticket-reconciliation.md`](docs/agents/ticket-reconciliation.md). `AGENTS.md` makes the Matt Pocock workflow mandatory for non-trivial work.

Read in this order:

1. [`docs/video-pipeline/SPEC.it.md`](docs/video-pipeline/SPEC.it.md) — candidate specification; still `in-review`, not production authority.
2. [`docs/video-pipeline/rollout.md`](docs/video-pipeline/rollout.md) — G0 and T1–T10 tracer plan.
3. [`examples/awe-project.yaml`](examples/awe-project.yaml) — executable 13-scene AWE fixture.
4. [`src/cli.ts`](src/cli.ts), [`src/compiler.ts`](src/compiler.ts), [`src/runtime-state.ts`](src/runtime-state.ts), [`src/render-evidence.ts`](src/render-evidence.ts), and [`src/providers/higgsfield.ts`](src/providers/higgsfield.ts).
5. [`docs/video-pipeline/awe-walkthrough.md`](docs/video-pipeline/awe-walkthrough.md) for scene-level blockers and claim status.

`CONTEXT.md` defines the domain vocabulary. Historical decisions and recursive grilling evidence are under `.scratch/video-generation-pipeline/`; do not treat the HTML prototype there as release evidence.

## Implemented and verified

- G0/T1 foundation: pinned Remotion `4.0.507`, Zod `4.4.3`, compilable runtime schemas, canonical JSON/hash, deterministic Storyboard → RenderPlan compiler, Scene 3 render.
- Full AWE internal preview: 13 ordered scenes, authored duration 85 seconds, approved resolved duration 3048 frames / 101.6 seconds at 30 fps, deterministic Remotion composition, selected voice/footage, Italian captions and `Concept demo — internal preview` watermark.
- T2 local state: project-scoped append-only hash chain, head as commit boundary, recoverable uncommitted suffixes, disposable snapshots, exclusive writer lock, atomic immutable plan materialization, crash tests.
- Render evidence: identity binds plan, composition, Remotion source hashes/version and encoding settings; immutable manifest binds MP4 SHA-256; strict ffprobe and `ffmpeg -xerror` full decode; verified cache hits; orphan preservation.
- T3 safe subset: Higgsfield CLI adapter supports only doctor/model discovery and explicit cost observation. Capabilities are derived from the real model schema. Cost-only results are persisted as non-authorizing `PriceObservation`; `quoteBindings` stays empty. There is no `generate create`, upload, submit, poll, or paid code path.
- Missing AWE inputs remain `missing`, `provisional`, or `unverified`; schemas force `internal-preview-only`.
- `.agents/setup` and `.agents/resume` prepare a fresh orb. Setup installs dependencies, Remotion's browser, typechecks, and validates the fixture.

Latest verification before handoff:

```text
npm test                    33 tests passed
npm run typecheck           passed
npm audit --audit-level=high 0 vulnerabilities
git diff --check            passed
```

Verified internal master identity from the source thread:

```text
RenderPlan       sha256:ac22aa2786de0afc0bdb3bebb8b07f27615517f607f82e33d7c60c7a21b4abf3
Render identity  sha256:2eaf4430eb7ab4d68eefd88a4c4c26bd3c0687417343ceb944aa72a5e2299601
MP4             sha256:4c85230e03a136da14d6f0f727c9d4df76c5f1b636f2df85c9564fb22894ecee
Media            H.264, 1920×1080, 30 fps, 2550 frames, 85 seconds
```

The MP4 itself is not committed. Recreate it in a fresh orb:

```bash
npm run video -- build --to preview --project examples/awe-project.yaml --json
npm run video -- render --to preview --project examples/awe-project.yaml --json
npm run video -- verify --to preview --project examples/awe-project.yaml --json
```

The current balanced render is native 1920×1080 with one worker. It is suitable
for internal concept review, not a production-quality master.

## Immediate blockers requiring humans

The balanced internal preview is complete. Production progress now requires the
designer's remaining captures/assets and review, plus rights/consent, audio mix
policy, licensing classification and human release authority. No new provider
spend is authorized. Never retry a potentially charged submission automatically,
and do not capture or commit account identity, tokens, workspace IDs or billing
data.

## Recommended next tracer

Reconcile the designer's slide-by-slide feedback against the current reviewed
master, then implement one approved vertical change at a time through the
mandatory Matt Pocock workflow. Prioritize the authorized desktop capture and
remaining designer-owned assets before visual polish. Treat music/mix and
release authority as separate gated tracers. The selected footage and Livia
voice do not need regeneration for this internal preview.

## Open production blockers

- Brand, font, logo, subject and UI mockup files are present; their production Rights Grants and current authorized UI captures/screencasts remain missing.
- Removed Claims remain unavailable unless future evidence and scoped Approval
  support reintroducing them; CTA 1 and the current fallback copy are approved.
- Rights and consent grants, output/safe-area policy, loudness/true-peak policy, music/SFX rights.
- Remotion company category/headcount and any required licence approval. Current decision permits evaluation/internal prototype only.
- Word-level caption alignment, music/SFX and an approved loudness/true-peak mix.
- Production release/quality/approval manifests and T8–T10 work.

Do not present the current output as production-ready, a final commercial, or proof that unsupported AWE claims are true.

## Suggested skills

- `tdd` for each vertical tracer; keep tests at the CLI/compiler/provider seams already established.
- `codebase-design` before widening interfaces; preserve the deep compiler, runtime-state, render-evidence and provider modules.
- `wizard` if the user wants a guided Higgsfield authentication/workspace setup.
- `diagnosing-bugs` for provider drift, render failures or performance regressions.
- `code-review` before adding any chargeable submit path or declaring a tracer complete.
