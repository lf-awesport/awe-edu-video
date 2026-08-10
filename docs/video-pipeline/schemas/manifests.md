# Manifest conceptual contracts

**Candidate normative annex. Effective status inherits the parent specification (`in-review`); it becomes implementation authority only when that parent is approved. Not compilable JSON Schemas.** Every manifest is immutable canonical JSON with `schemaVersion`, stable ID, creation time, producer version, content hash, project ID, and dependency hashes. Missing required records or unsupported major versions fail closed.

| Manifest | Required content | Forbidden/optional |
|---|---|---|
| Project Manifest | authoritative refs, policy/output/profile defaults | no secrets/runtime; optional inline small config |
| Runtime event | `eventId`, project-scoped monotonic sequence, schema version, causation/correlation IDs, previous-event/segment hash, precondition hash, prior/next transition, actor/cause, input/output hashes, cost and evidence | append atomically; no restricted bytes; gap, divergent duplicate, broken chain or unsupported version fails replay |
| Runtime snapshot | derived node states, `lastEventId`, last sequence and verified event-prefix hash | disposable projection; reconstruction from verified prefix + suffix MUST produce the same canonical snapshot hash |
| Execution Plan | scope, operations, cache, invalidations, Quotes, Reservations, unknowns, expected outputs, input hashes | cannot apply stale inputs/Quotes |
| Production Lock | Storyboard, selections, policy/dependency/provider/tool hashes | no secrets/restricted evidence |
| Asset Usage Manifest | deliverable, every asset usage by variant/scene/layer/frame, lineage and grants | no omitted visible/audio usage |
| Quality Report | requirements/results/findings/evaluator hashes/coverage/stale/waivers | roll-up cannot erase findings |
| Release Manifest | deliverable/render/output hashes, Production Lock, approvals, validations, waivers, Claims, grants, usage manifest, freshness | `releasable` only if all required evidence current |

Versioning: 0.x changes use explicit forward migrations and preserve originals/backups; 1.0 defines public compatibility. **Valid:** [E04](../examples/release-manifest.json) explicitly non-releasable with blockers. **Invalid:** `releasable:true` with unknown rights, stale dependency, unverified Claim, missing mandatory caption, or mismatched artifact hash.

Local artifact commits MUST use a recoverable protocol: intent recorded → verified staging output → `CommitPrepared` with expected hash/destination → atomic content-addressed materialization → completion event. Reconciliation MAY adopt an orphan only when compatible prepared evidence exists; byte presence alone is never proof of success. Lease-protected writes MUST carry a monotonic fencing token checked at commit.

The event log MUST maintain an atomically persisted committed head containing the last committed sequence and event/segment hash. Replay MUST match that head. An incomplete uncommitted final record MAY be discarded with recovery evidence; loss of a complete committed tail MUST fail explicitly.
