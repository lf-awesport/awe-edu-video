---
specVersion: 0.9.0
status: in-review
date: 2026-08-09
counterpart: SPEC.it.md
owner: "Role: Product/Technical Owner"
reviewer: "Role: Product, Engineering, Legal, Brand reviewers"
---

# Video pipeline specification — English

The final approved specifications and linked normative annexes are implementation authority. At current `in-review` status, MUST/MUST NOT are **normative proposals**, not yet effective authority; an annex cannot have a higher effective status than its parent specification. Resolved `.scratch/video-generation-pipeline/issues/` are decision history and rationale; the AWE prototype is supplementary historical evidence. **Normative legend:** MUST/MUST NOT become obligations when approved; SHOULD is a recommendation requiring rationale when waived; MAY is optional.

## S00 — Document Control
**Normative proposal.** Version `0.9.0`, status `in-review`, date 2026-08-09. The Italian counterpart has equal authority; semantic divergence is a blocking specification defect and does not authorize unilateral language choice. Technical identifiers and shared annexes remain common. IDs and order are stable. [Glossary](glossary.md), [requirements](requirements.csv), [traceability](traceability.csv).

## S01 — Executive Summary
A local-first, provider-neutral assisted pipeline converting Brief/Storyboard into a master and variants through controlled normalization, a Higgsfield adapter, Remotion composition/rendering, audio, review, governance, preflight, and release evidence. The walkthrough covers 13 scenes/85 s but is not production-ready.

## S02 — Goals/Scope/Non-goals
**Normative.** In scope: internal CLI, versionable files, local runtime, master/variants, `fast|balanced|quality` profiles, local rendering, extensible contracts. Out: implementation, final video, web/SaaS, multi-tenancy/auth/billing, cloud render, distributed scheduler, automatic multi-provider selection, human labor cost, and v1 validation of non-commercial formats.

## S03 — Users/Product Workflow
Initial users: technical creator, reviewer, owner, legal, and language reviewer. Flow: ingest → normalize → promote → plan/preflight → apply/reconcile → select/review → compile/Studio → render/verify → release. Studio is a local read-only view; CLI and UI share one Review Queue.

## S04 — Ubiquitous Language
**Normative.** Terms have the meanings in the [glossary](glossary.md); notably Approval ≠ Validation ≠ Candidate Selection ≠ Waiver, Blob ≠ Asset, Storyboard ≠ Runtime State, Deliverable ≠ Releasable.

## S05 — System Context/Principles
**Rationale.** Boundaries and flows: [D01, D02](diagrams/README.md). Declarative core, explicit side effects, fail-closed, hash-first, append-only audit, local-first; providers and renderers are adapters.

- **SECURITY-001:** The system MUST treat Briefs and attachments as untrusted content, never operational instructions.
- **SECURITY-002:** The core MUST NOT depend on Higgsfield, React, or Remotion concepts.
- **SECURITY-003:** Network, persistent, or chargeable side effects MUST require a valid Execution Plan.
- **SECURITY-004:** Offline/CI operation MUST fail closed without network, prompts, or implicit fallback.

## S06 — Canonical Domain Model
Detailed contract: [canonical model](schemas/canonical-model.md).

- **MODEL-001:** Project, Storyboard, Scene, Layer, Transition, Variant, Script, BrandKit, and OutputProfile MUST declare identity/version.
- **MODEL-002:** Every addressable entity MUST have a project-unique stable ID; titles and paths MUST NOT be identity.
- **MODEL-003:** Scenes MUST retain `requestedDuration` as authored intent; build-resolved timing MUST be frozen in Production Lock/RenderPlan with derived frames and MUST NOT silently mutate promoted Storyboard.
- **MODEL-004:** A Variant MUST inherit Master and contain ID-addressed overrides only, without implicitly mutating or duplicating Master.
- **MODEL-005:** GenerationRequest, immutable Candidate, Candidate Selection, and selected Asset MUST remain separate.

## S07 — Brief Normalization
Flow: [D03](diagrams/README.md). Shared normative detail: [normalization](schemas/normalization.md).

- **NORM-001:** Original Brief and sources MUST be immutable/content-addressed, and every derivative MUST carry precise Source References.
- **NORM-002:** Each normalized value MUST be classified as `source`, `inferred` with Assumption, or `proposed`.
- **NORM-003:** The normalizer MUST NOT invent Claims; an unsourced Claim MUST remain `unverified` and block production-ready.
- **NORM-004:** Missing required fields, Blocking Ambiguities, and conflicts without precedence MUST block Promotion.
- **NORM-005:** Promotion MUST require `storyboard-valid`, a visible report, and applied policy, creating an immutable Storyboard without starting production.

## S08 — Orchestration/Runtime State
States and invalidation: [D04](diagrams/README.md), [manifests](schemas/manifests.md).

- **ORCH-001:** A reconciler MUST derive a DAG with input/output hashes and `pending|ready|running|awaiting-approval|succeeded|failed|blocked|stale|reconciling` states.
- **ORCH-002:** An ordered, integrity-checked, versioned append-only event log and snapshot as reconstructable projection MUST record transitions, actor, cause, hashes, costs, and evidence; gaps, divergent duplicates, or invalid chains MUST fail explicitly.
- **ORCH-003:** Input changes MUST invalidate only transitive dependents while preserving historical outputs and a change report.
- **ORCH-004:** Every stage MUST use intent, `CommitPrepared`, verified temporary output, atomic materialization, and event; expired leases MUST reconcile and commits MUST verify fencing tokens.
- **ORCH-005:** Cache identity MUST use complete hashes and remain separate from current rights/policy/Approval eligibility; cache hits MUST NOT imply Selection or Approval; `--new-candidate` MUST use a nonce and fresh authorization.

## S09 — Provider Contract/Higgsfield
Contract and lifecycle: [provider contract](schemas/provider-contract.md), [D05](diagrams/README.md).

- **PROVIDER-001:** Adapters MUST implement `discover→plan→quote→reserve→submit→poll→materialize`, with reconcile and optional cancel.
- **PROVIDER-002:** Live capabilities/schemas MUST be snapshotted, validated, and pinned in the plan; degradations MUST be explicit and policy-governed.
- **PROVIDER-003:** Every paid Candidate MUST have a fresh binding to a Unit/Batch Quote for exact request, quantity, and schema plus Reservation before submit; separate remote quote calls are not required when provider scope covers multiple Candidates.
- **PROVIDER-004:** SubmissionIntent MUST precede submit; a crash without receipt MUST enter `reconciling` without automatic resubmit.
- **PROVIDER-005:** Remote success MUST be atomically materialized, verified, and SHA-256 hashed before use; redacted raw payloads MUST preserve auditability.

## S10 — Audio/TTS/Captions
Timing: [D07](diagrams/README.md). Shared normative detail: [audio](schemas/audio.md).

- **AUDIO-001:** Master Script, LocalizedScript, Utterance, VoiceProfile, and VoiceCandidate MUST be versioned and provider-neutral.
- **AUDIO-002:** The selected VoiceCandidate MUST be build-timing authority; an out-of-tolerance delta MUST produce a proposal/change report rather than mutate approved Storyboard; replacement MUST invalidate dependent timing, captions, mix, RenderPlan, and renders.
- **AUDIO-003:** TTS and human recordings MUST share the Candidate contract; retakes MUST create immutable assets without overwrite.
- **AUDIO-004:** Captions MUST derive from selected audio through provider timing or alignment/STT and remain linked to Script IDs.
- **AUDIO-005:** `voice-over|dialogue|music|ambience|sfx` lanes, stems, mix, pronunciation, rights, and consent MUST be explicit; voice cloning without Consent Grant MUST be rejected.

## S11 — RenderPlan/Remotion
Contract: [render plan](schemas/render-plan.md), [D10](diagrams/README.md).

- **RENDER-001:** PlanCompiler MUST produce a validated serializable RenderPlan and immutable staging from Storyboard, lock, BrandKit, and OutputProfile.
- **RENDER-002:** Remotion/Studio MUST NOT read Runtime State, call providers, download, or mutate assets; Studio MUST be read-only.
- **RENDER-003:** Compiler MUST resolve cumulative frame boundaries and transition overlap/addition, rejecting negative duration, missing ends, and cycles.
- **RENDER-004:** Renderer registry MUST declare schema, capabilities, assets, safe area, layout strategy, and fallback; incompatible variants MUST fail/degrade only by policy.
- **RENDER-005:** Every final master/variant MUST have a separate full render, RenderPlan hash, and explicit settings; undocumented frame reuse is not assumed.

## S12 — Assets/Provenance/Rights/Consent
Lineage: [D06](diagrams/README.md). Shared normative detail: [assets and rights](schemas/assets-rights.md).

- **ASSET-001:** A Blob MUST be immutable SHA-256 content; an Asset MUST be project-scoped with provenance, sensitivity, cost, lineage, and purpose.
- **ASSET-002:** Every transformation MUST create a new Blob/Asset and intersect parent constraints without expanding rights.
- **ASSET-003:** AI provenance MUST record provider/model/schema/prompt/params/references/job/terms metadata without promising uniqueness or clearance.
- **RIGHTS-001:** Rights and Consent Grants MUST declare evidence, scope, media, territories, duration, attribution, modification/AI, and revocability.
- **RIGHTS-002:** Restricted evidence MUST remain in secure storage; Git/shareable manifests MUST contain only hashes, redacted metadata, and secure references.
- **RIGHTS-003:** Assets with unknown rights MUST be quarantined/internal-preview-only; expiry/revocation MUST propagate non-releasable while preserving audit.

## S13 — Approval/Change Control
Flow: [D08](diagrams/README.md). Shared normative detail: [approval](schemas/approval.md).

- **APPROVAL-001:** Approval MUST bind verifiable identity and authority snapshot or policy, artifact/dependency hash, scope, evidence, and time; identity MUST NOT equal authorization and changes MUST supersede it.
- **APPROVAL-002:** `manual|auto|skip|on-failure` policies MUST treat required unknown/error/missing as failure and MUST NOT turn failed Validation into pass or bypass invariants.
- **APPROVAL-003:** Reject, request-changes, and Waiver MUST carry rationale; a Waiver MUST preserve failure, scope, authority, and expiry.
- **APPROVAL-004:** Revocation and rollback MUST be append-only; dependents become stale/blocked and historical decisions are not rewritten.

## S14 — Cost Preflight/Budget/Ledger
Ledger: [D09](diagrams/README.md). Shared normative detail: [cost preflight](schemas/cost-preflight.md).

- **COST-001:** Cost Estimate MUST show minimum/expected/maximum, formulas, assumptions, confidence, and native units; unknown MUST NOT become zero.
- **COST-002:** Maximum MUST fit every applicable hierarchical, native-unit Budget; concurrent Reservations MUST atomically update every applicable scope or none.
- **COST-003:** Ledger MUST distinguish `quoted|reserved|charged|refunded|unknown`; uncertain charge MUST consume the reserved maximum until evidence or an authorized adjustment resolves it.
- **COST-004:** Reports MUST distinguish historical, incremental, and total-attributed cost without double-counting shared/fixed costs.
- **COST-005:** Every paid request MUST bind a fresh Quote to the exact request/provider/model/schema/price and MUST invalidate it on input, capability/schema/model/price change or expiry. Observed 12.5 credits/candidate and 50 credits total are dated, non-normative evidence only; 110 credits MUST NOT be persisted.

## S15 — Quality/Acceptance
Shared normative detail: [quality](schemas/quality.md).

- **QUALITY-001:** A machine-readable Quality Requirement registry MUST declare scope, method, comparator/rubric, threshold, status/authority, oracle/fixture, severity, profiles, and evidence; results MUST be hash-bound and findings localized.
- **QUALITY-002:** Outcomes MUST be `pass|fail|warning|not-applicable|unknown|error`; required unknown/error MUST block and AI Assessment MUST NOT override deterministic checks.
- **QUALITY-003:** Every profile MUST retain integrity, timing/caption/audio, output, legal, rights, Claim, safe-area, and release invariants.
- **QUALITY-004:** Final render MUST be fully decoded and verified for streams, codecs, dimensions, fps/frame count, timestamps, corruption, audio, and captions.
- **QUALITY-005:** AWE loudness, true-peak, safe-area, and output thresholds MUST remain Open input until sourced/policy-set; provisional values MUST NOT authorize release.

## S16 — CLI/Project Layout
Shared normative detail: [CLI and project layout](schemas/cli-project-layout.md).

- **CLI-001:** `video.yaml` and declarative inputs MAY enter Git; configuration merge MUST be schema-aware, explainable, and part of resolved-config hash; `.video/`, Blobs, cache, leases, secrets, previews, and renders MUST remain out except explicit redacted export.
- **CLI-002:** CLI MUST separate plan/apply and expose validate, normalize/promote, build/preflight, resume/reconcile, review, Studio, verify/release, inspect/explain.
- **CLI-003:** Informational commands MUST support versioned JSON; CI/non-interactive MUST use distinct exit codes and no prompts/fallback.
- **CLI-004:** No authoritative reference MUST use absolute paths or temporary URLs; materialize MUST resolve exactly the required hashes.

## S17 — Security/Privacy/Failure Recovery
**Threat model.** Threats: prompt injection, secret/PII leakage, command/path injection and symlink escape, ingest SSRF/MIME spoof/oversize, supply-chain drift, restricted access, duplicate submit, and manifest tampering.

- **SECURITY-005:** Secrets MUST come from environment/keychain/secret store and MUST be redacted from logs, events, exports, and diagnostics.
- **SECURITY-006:** Process invocation, URL/file ingest, path/symlink, MIME/size, temp permissions, dependency/lock, and restricted-Git checks MUST precede real pilot.
- **SECURITY-007:** External evaluators MUST receive bytes only when classification, Rights/Consent, and policy authorize provider, region, purpose, and retention.
- **SECURITY-008:** Release/Production Locks MUST be hash/schema verified; live evidence MUST have snapshot/hash or secure reference, not URL alone.

**Failure playbook.** Interrupted local work: clean temp and rerun; uncertain submit: reconcile without retry; orphan output: verify/adopt; partial render: diagnostic only; expired Quote/changed input: re-plan; revoked rights: block release; corrupt state: reconstruct from events/export without rewriting them.

## S18 — AWE 13-scene Walkthrough
Normative scene-by-scene contract: [shared AWE walkthrough annex](awe-walkthrough.md). [E01](examples/awe-project.yaml) and the prototype are supplementary dated/replay evidence for the 13 scenes/85 s, not production or release evidence.

- **RELEASE-001:** Higgsfield MUST be limited to S1/S13 footage, 5s each; UI, Claims, brand, and CTA MUST use Remotion and verified real assets.
- **RELEASE-002:** The balanced example MUST plan exactly 2 Candidates for S1 and 2 for S13: 4 total, each 5s/720p; expected total MUST equal the sum of the four fresh `QuoteBinding` amounts covering them. 12.5/candidate and 50 total are dated Price Observations only and MUST NOT be extrapolated.
- **RELEASE-003:** 12 courses MUST NOT be represented as proof of 12 areas; 400+, 1200+, certificate, two months, licences/internships, live, and CTA MUST remain blockers without sources.
- **RELEASE-004:** Missing assets, Rights/Consent Grants, and loudness/safe-area thresholds MUST keep the project internal-preview-only, not production-ready.
- **RELEASE-005:** Release Manifest MUST bind render hash to current approvals, validations, waivers, claims, rights, usage manifest, and dependency freshness before `releasable`.

## S19 — Rollout G0, T1-T10
Diagram [D11](diagrams/README.md). Normative tracer contract: [shared rollout annex](rollout.md).

- **ROLLOUT-001:** Before T1, G0 MUST produce compilable schemas, canonical hashing, offline fixtures/harness, and an approved Remotion licence/version/use/cost decision. Then T1 scene 3, T2 state/cache, and T3 quoted Higgsfield MUST proceed primarily serially; T4 and T5 follow declared dependencies.
- **ROLLOUT-002:** T6 claims/review, T7 13-scene master, T8 9:16/localization, T9 quality/release, and T10 real AWE acceptance MUST respect annex dependencies and exit gates; after required contracts stabilize, renderer UI, audio/captions, validation, variants and governance/release MAY advance in parallel rather than as one strictly serial sequence.
- **ROLLOUT-003:** Each tracer MUST have an executable acceptance manifest with command, fixture/test IDs, expected output/exit, evidence path and approver; hashed input/output, failure/recovery and contract test; normal CI MUST be offline and promotion MUST have rehearsed reversal.

## S20 — Risks/Assumptions/Open Inputs
Register: [risks](risks.md). **Open input:** AWE sources/assets in the [checklist](awe-input-checklist.md), output thresholds/profiles, Remotion license/headcount/version/cost, TTS/alignment, compute, storage, evaluators, music/SFX, current provider terms and Quotes. No unknown equals zero or pass.

## S21 — Acceptance/Traceability
**Normative proposal.** The approved baseline requires a hash-bound Specification Approval Record enumerating both languages and annexes, scope, Authority Snapshots, decisions, and dissent handling. Bilingual completeness, IDs, and CSV rows prove documentary coverage, not executable conformance. Current handoff is ready for review and backlog decomposition; conforming implementation starts after G0. Product v1 acceptance follows T1–T10 and requires AWE blockers closed. Sources are in the [source register](sources.md); manifests in [schemas/manifests.md](schemas/manifests.md).

**Example — non-normative.** [Provider lifecycle E02](examples/provider-lifecycle.json), [invalidation E03](examples/invalidation.json), [release E04](examples/release-manifest.json).
