# Qualitative risk register / Registro rischi qualitativo

| ID | Category | Probability | Impact | Detectability | Mitigation | Owner role | Tracer/gate |
|---|---|---|---|---|---|---|---|
| R01 | Claims | high | critical | high | Source References; fail-closed release | owner/legal | T6/T10 |
| R02 | Rights/consent | high | critical | medium | Grants, secure evidence, usage manifest, revocation propagation | legal | T9/T10 |
| R03 | Provider drift | high | high | high | Live discovery, schema snapshot, Quote freshness, replay tests | adapter owner | T3 |
| R04 | Duplicate charge | medium | high | medium | SubmissionIntent, Reservation, reconciliation, no blind retry | runtime owner | T4 |
| R05 | Remotion license | medium | high | high | G0 legal/headcount/version/use/terms decision before T1; configured fixed/marginal budget and recheck triggers | owner/legal | G0/T1/T9 |
| R06 | Unknown technical cost | high | medium | high | Unknown blocks paid work; manual approved estimate with margin | owner | T3/T9 |
| R07 | Timing/audio drift | medium | high | high | Selected voice authority; cumulative frame boundaries; full verification | audio owner | T5 |
| R08 | Variant loses essentials | medium | high | high | Explicit layout strategy; safe-area/CTA/logo gate | brand reviewer | T8 |
| R09 | Secret/PII leakage | medium | critical | medium | Secret channels, redaction, restricted classification and Git checks | security owner | pre-pilot/T10 |
| R10 | Supply-chain/tool drift | medium | high | high | Pinned toolchain, lock, dependency scan, baseline and contract tests | engineering owner | T1-T9 |
| R11 | AWE asset incompleteness | high | high | high | Parallel input checklist; placeholders internal-preview-only | product owner | T7/T10 |
| R12 | Quality thresholds absent | high | high | high | Approve sourced output/loudness/safe-area policies before release | quality owner | T9/T10 |
| R13 | Specification interpreted as implementation-ready | high | high | high | `in-review` authority rules; G0 compilable schemas/harness; hash-bound Specification Approval Record | product/technical owner | G0/pre-T1 |
| R14 | Approval authority spoofed | medium | critical | high | Authority snapshot; signed/trusted bundles; local profile cannot self-grant legal/release roles | owner/legal/security | T6/T9 |
| R15 | Erasure deletes shared Blob or misses replicas | low | critical | medium | Global reference/replica inventory, logical-vs-physical deletion, tombstone replay and legal-hold tests | rights/storage owner | T9/post-v1 gate |

Assumptions are not facts: initial users are an internal technical team; local file persistence and Linux/macOS target are accepted for v1; provider access exists but credentials and balances are not specification data.
