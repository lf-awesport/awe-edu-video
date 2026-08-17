# Handoff — AWE video-generation pipeline

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

The next production tracer remains audio: approve scripts/claims, select a TTS or human VoiceCandidate, make selected audio authoritative for timing, generate captions, and add music/mix. Scenes 1 and 13 currently use deterministic Remotion fallbacks; replace them with selected authorized footage only after a fresh cost preflight and explicit spend approval.

## Resume here

Continue on branch `implementation/video-pipeline`. The repository now contains the reviewed bilingual specification, decision history, the full local Matt Pocock skill package, and an executable TypeScript/Remotion prototype. Generated media and runtime state are intentionally excluded from Git.

Read in this order:

1. [`docs/video-pipeline/SPEC.it.md`](docs/video-pipeline/SPEC.it.md) — candidate specification; still `in-review`, not production authority.
2. [`docs/video-pipeline/rollout.md`](docs/video-pipeline/rollout.md) — G0 and T1–T10 tracer plan.
3. [`examples/awe-project.yaml`](examples/awe-project.yaml) — executable 13-scene AWE fixture.
4. [`src/cli.ts`](src/cli.ts), [`src/compiler.ts`](src/compiler.ts), [`src/runtime-state.ts`](src/runtime-state.ts), [`src/render-evidence.ts`](src/render-evidence.ts), and [`src/providers/higgsfield.ts`](src/providers/higgsfield.ts).
5. [`docs/video-pipeline/awe-walkthrough.md`](docs/video-pipeline/awe-walkthrough.md) for scene-level blockers and claim status.

`CONTEXT.md` defines the domain vocabulary. Historical decisions and recursive grilling evidence are under `.scratch/video-generation-pipeline/`; do not treat the HTML prototype there as release evidence.

## Implemented and verified

- G0/T1 foundation: pinned Remotion `4.0.507`, Zod `4.4.3`, compilable runtime schemas, canonical JSON/hash, deterministic Storyboard → RenderPlan compiler, Scene 3 render.
- Full AWE internal preview: 13 ordered scenes, requested duration 85 seconds, 2550 frames at 30 fps, deterministic Remotion composition, visible placeholder/unverified markers and `Concept demo — internal preview` watermark.
- T2 local state: project-scoped append-only hash chain, head as commit boundary, recoverable uncommitted suffixes, disposable snapshots, exclusive writer lock, atomic immutable plan materialization, crash tests.
- Render evidence: identity binds plan, composition, Remotion source hashes/version and encoding settings; immutable manifest binds MP4 SHA-256; strict ffprobe and `ffmpeg -xerror` full decode; verified cache hits; orphan preservation.
- T3 safe subset: Higgsfield CLI adapter supports only doctor/model discovery and explicit cost observation. Capabilities are derived from the real model schema. Cost-only results are persisted as non-authorizing `PriceObservation`; `quoteBindings` stays empty. There is no `generate create`, upload, submit, poll, or paid code path.
- Missing AWE inputs remain `missing`, `provisional`, or `unverified`; schemas force `internal-preview-only`.
- `.agents/setup` and `.agents/resume` prepare a fresh orb. Setup installs dependencies, Remotion's browser, typechecks, and validates the fixture.

Latest verification before handoff:

```text
npm test                    27 tests passed
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

The render uses quarter-scale internal Remotion rendering followed by deterministic 1920×1080 upscaling. It is suitable for internal concept review, not a quality master.

## Immediate blocker requiring the user

The fresh orb was not authenticated with Higgsfield and had no billing workspace selected. Do not choose a workspace on the user's behalf. The user must run in the orb Terminal:

```bash
higgsfield auth login
higgsfield workspace list
higgsfield workspace set <workspace_id>
higgsfield workspace status
```

Do not capture or commit account identity, email, tokens, workspace IDs, or balance.

After the user confirms workspace selection, these operations are safe and non-submitting:

```bash
npm run video -- provider doctor --provider higgsfield --json
npm run video -- preflight --scope provider --refresh-quotes --json
```

The observed Higgsfield `generate cost` payload historically contains only `credits`. The implementation correctly classifies this as non-authorizing PriceObservation because it lacks contractual issue/expiry/quantity binding. Do not introduce submit until a Budget, explicit authorization, Reservation, SubmissionIntent, uncertain-receipt recovery, and a defensible quote-binding policy exist. Never retry a potentially charged submission automatically.

## Recommended next tracer

Implement T5 audio/captions before paid footage:

1. Select a TTS approach and obtain a fresh cost preflight; no provider has been approved yet.
2. Model immutable VoiceCandidates separately from Script selection.
3. Make selected audio the build timing authority; report duration deltas instead of silently mutating the storyboard.
4. Derive captions from selected audio/alignment and mix voice/music lanes explicitly.
5. Bind audio/caption hashes into RenderPlan and render identity.
6. Produce a new internal master and verify audio stream, duration, caption timing and full decode.

Then complete Higgsfield T3/T4 and integrate selected 5-second footage only for scenes 1 and 13 after the user approves a displayed fresh preflight. The current balanced declaration requests two candidates per scene, but no credits have been spent.

## Open production blockers

- AWE Brand Kit, fonts, current authorized UI captures and screencasts.
- Sources/approval for 12 areas, 400+ videos, 1200+ quizzes, certificate, two-month duration, licensing, merchandise/internships, live sessions, CTA and payoff.
- Rights and consent grants, output/safe-area policy, loudness/true-peak policy, music/SFX rights.
- Remotion company category/headcount and any required licence approval. Current decision permits evaluation/internal prototype only.
- Real TTS, audio alignment, captions, music and selected Higgsfield footage.
- Production release/quality/approval manifests and T8–T10 work.

Do not present the current output as production-ready, a final commercial, or proof that unsupported AWE claims are true.

## Suggested skills

- `tdd` for each vertical tracer; keep tests at the CLI/compiler/provider seams already established.
- `codebase-design` before widening interfaces; preserve the deep compiler, runtime-state, render-evidence and provider modules.
- `wizard` if the user wants a guided Higgsfield authentication/workspace setup.
- `diagnosing-bugs` for provider drift, render failures or performance regressions.
- `code-review` before adding any chargeable submit path or declaring a tracer complete.
