# Domain Context

## Terms

### Brief

The immutable collection of source material that expresses what a video project is intended to achieve. A Brief may contain free text, a structured storyboard, documents, URLs, images, and other references. It is evidence, not executable instruction.

### Normalized Storyboard Draft

A proposed structured interpretation of a Brief. It may contain sourced facts, explicit inferences, and creative proposals, but it is not yet the authoritative Storyboard.

### Storyboard

The authoritative, structured creative intent for a video project after the required validation and approval. It organizes the narrative into Scenes without containing volatile production state.

### Source Reference

A traceable link from a Storyboard element, script line, or Claim back to evidence in the Brief.

### Assumption

An explicit value or interpretation introduced because the Brief did not supply it. An Assumption records whether it came from a declared default or an inference and remains reviewable.

### Claim

A factual, numerical, quoted, testimonial, legal, or commercial assertion presented by the video. A Claim requires a Source Reference or remains unverified and blocks production use.

### Creative Proposal

A generated suggestion about narrative, visuals, pacing, or presentation. A Creative Proposal is not a factual assertion and does not become authoritative merely because it appears in a draft.

### Normalization

The traceable transformation of a Brief into a Normalized Storyboard Draft. Normalization may organize, infer, and propose, but it does not promote its own output to an authoritative Storyboard.

### Promotion

The controlled transition that makes a validated Normalized Storyboard Draft a new immutable version of the authoritative Storyboard.

### Blocking Ambiguity

An unresolved interpretation of required source material for which choosing an answer would materially change the Storyboard. A Blocking Ambiguity prevents Promotion.

### Normalization Report

The reviewable account of how a Normalized Storyboard Draft was produced, including Source References, Assumptions, unresolved ambiguities, Claim verification, defaults, proposals, and differences from the previous Storyboard.

### Voice Profile

A provider-independent description of the intended speaking voice, including locale, accent, register, pace, energy, perceived age, pronunciation requirements, and consent constraints.

### Voice Candidate

An immutable spoken-audio interpretation of a Localized Script produced by TTS or human recording. Once selected, a Voice Candidate is the timing authority for its covered script units.

### Localized Script

A versioned linguistic and cultural adaptation of Script units for one locale. It remains linked to the master Script while allowing different wording, pacing, and duration.

### Utterance

The smallest independently generatable or recordable unit of spoken Script that should preserve coherent delivery and prosody. A Voice Candidate covers one or more Utterances.

### Pronunciation Lexicon

A versioned, locale-specific set of approved pronunciations for names, acronyms, and domain terms used when generating, recording, or validating spoken audio.

### Audio Lane

A semantic class of audio clips with shared mixing policy. The canonical lanes are voice-over, dialogue, music, ambience, and sound effects.

### Approval

An immutable decision by an identified actor or versioned policy about one exact artifact version and scope. An Approval never floats to a changed artifact.

### Authority Snapshot

Immutable evidence that the identified actor or policy was authorized for a decision scope, including role assignment, issuing authority, policy hash, credential identity, and validity. Identity alone is not authority.

### Validation

An evaluated technical, legal, safety, quality, or production-readiness condition. Validation evidence may inform an Approval but is not itself a human decision.

### Waiver

An explicit, scoped, expiring decision by an authorized actor to accept a failed but waivable Validation. A Waiver records rationale and never disguises the failure as a pass.

### Candidate Selection

The decision that chooses one immutable Candidate for use by a downstream plan. Candidate Selection and Approval are separate decisions even when performed together.

### Release Manifest

The evidence bundle that binds a deliverable to its artifact hashes, output profile, required Approvals, Validation results, valid Waivers, rights, and dependency freshness.

### Releasable

The state of a deliverable whose Release Manifest proves that every required condition for publication or delivery is currently satisfied.

### Blob

Immutable binary content identified by its cryptographic hash. A Blob has technical metadata but no project-specific meaning or usage rights by itself.

### Asset

A project-scoped record that gives a Blob provenance, semantic purpose, sensitivity, lineage, cost, and applicable rights. The same Blob may back distinct Assets with different contexts.

### Rights Grant

Evidence-backed permission to use an Asset within explicit media, territories, duration, attribution, sublicensing, modification, and AI-related constraints.

### Consent Grant

Evidence-backed permission from an identifiable subject for specified uses of their likeness or voice, including cloning and transformation constraints, media, territories, duration, and revocability.

### Asset Usage Manifest

A deliverable-specific account of every Asset used, where it appears by variant, Scene, Layer, and time/frame range, its transformation lineage, and the Rights and Consent Grants relied upon.

### Quote

A provider-backed, time-bounded price for one exact request hash in the provider's native unit. A Quote is evidence for a Cost Estimate, not permission to spend.

### Price Observation

A dated provider price response lacking one or more contractual Quote fields such as exact request/schema hash, quantity scope, issue/expiry, or charged outcome. It informs planning but cannot authorize submit.

### Quote Binding

The immutable link from one planned Candidate to the fresh Unit or Batch Quote whose exact request, quantity, provider, model, schema, unit, issue, and expiry scope covers it.

### Cost Estimate

A versioned projection of minimum, expected, and maximum technical resource consumption for a declared scope, with formulas, assumptions, confidence, and source Quotes.

### Reservation

A temporary claim against an approved Budget made before a potentially chargeable operation, preventing concurrent work from spending the same available amount.

### Budget

An authorized hard limit on technical resource consumption for a declared scope and native unit. Budgets may be nested; the most restrictive applicable limit governs a Reservation.

### Project Manifest

The versioned, human-editable root document that identifies a video project and declares its schema version, authoritative inputs, policies, output requirements, and logical references. It contains no credentials or volatile execution state.

### Runtime State

The project-local, machine-managed record of execution snapshots, events, leases, plans, ledger entries, candidates, and generated outputs. Runtime State is reproducible or exportable where required but is not an authoritative creative input and is excluded from normal version control.

### Asset Store

A content-addressed store of immutable Blobs shared across projects for physical deduplication. Project-specific Asset identity, provenance, sensitivity, and rights remain outside the shared Blob identity.

### Production Lock

An immutable, portable snapshot of the exact Storyboard, selections, policies, dependencies, provider resolutions, and artifact hashes required to reproduce one production build. It is distinct from mutable Runtime State and contains no secrets or restricted evidence.

### Execution Plan

An immutable proposal for reconciling a declared project scope to a requested goal. It records intended operations, cache reuse, invalidations, degradations, Quotes, Reservations, expected outputs, and the input hashes whose continued validity is required before application.

### Review Queue

The derived set of exact artifact versions awaiting a human decision under the applicable approval policies. CLI and visual review tools expose the same queue; they do not maintain separate approval state.

### Deliverable

An immutable render selected and named for delivery. A Deliverable is not necessarily Releasable until its Release Manifest proves all publication conditions remain satisfied.

### Production Profile

A named policy preset, such as `fast`, `balanced`, or `quality`, that controls candidate counts, fallback tolerance, validation depth, and approval defaults without changing the Storyboard's creative intent.

### Output Profile

A versioned declaration of a deliverable's technical and presentation constraints, including dimensions, aspect ratio, frame rate, codecs, audio, captions, and layout strategy. Different Output Profiles may produce Variants from the same Master.

### Quality Requirement

A versioned, scoped statement of a condition an artifact is expected to satisfy, including its evaluation method, threshold or rubric, severity, and applicable Production and Output Profiles.

### Validation Result

Immutable evidence from evaluating one Quality Requirement against one exact artifact and dependency hash. Its outcome, observations, evaluator identity and version remain distinct from any Approval based on it.

### Quality Finding

A localized observation produced by a Validation Result, tied where possible to a Scene, Layer, time or frame range, measured value, expected condition, severity, and remediation guidance.

### Motion Language

A versioned visual grammar for how elements enter, move, transform, hand off between Scenes, and settle. A Motion Language defines reusable motion families, easing and pacing constraints, but does not change Storyboard narrative authority or make every Scene use the same animation.

### Transition Anchor

An identifiable visual state at a Scene boundary that both sides of a transition can reproduce or inherit, such as the same object, crop, color field, direction of travel, or layout geometry. A Transition Anchor enables continuity without fabricating an unrelated intermediate object.

### Review Package

The minimal evidence bundle presented for one human decision, including the exact artifact, relevant source intent, localized findings, references or baselines, changes from the prior version, and the consequences of each available decision.
