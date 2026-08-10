# Diagrams / Diagrammi

Plain-text diagrams are normative views where marked. IDs and captions are shared by both specs.

## D01 — System boundary / Confine di sistema
```text
[Untrusted Brief] → [local-first core + project/runtime stores] → [Release evidence]
                           │ adapters only
                ┌──────────┴──────────┐
          [Higgsfield CLI]       [Remotion renderer]
```
Caption IT: credenziali/provider/renderer restano fuori dal core. Caption EN: credentials/provider/renderer remain outside the core.

## D02 — Project hierarchy / Gerarchia Project
```text
Project ─┬─ Brief → Draft → Storyboard → Master → Scene → Layer
         ├─ Script → LocalizedScript → Utterance → VoiceCandidate
         └─ Variant overrides + OutputProfile + Policies
```
Caption IT/EN: authored identity is stable; runtime records are separate / l'identità authored è stabile; i record runtime sono separati.

## D03 — Normalization / Normalizzazione
```text
immutable sources → classify source|inferred|proposed → report
     → resolve required/ambiguity/conflict → review → Promotion
     unverified Claim ───────────────────────────────┤ blocks production
```

## D04 — DAG and invalidation / DAG e invalidazione
```text
VoiceCandidate → timing → captions → mix → RenderPlan → render
      changed       stale      stale     stale    stale      stale
Independent footage ─────────────────────────────────────── current
```

## D05 — Provider lifecycle + crash / Lifecycle provider + crash
```text
discover→plan→quote→reserve→persist intent→submit→receipt→poll→materialize
                                      X crash
                                      └→ reconciling → lookup; NO resubmit
```

## D06 — Asset lineage/rights / Lineage asset/diritti
```text
Blob(hash) ← Asset(provenance) ← transform ← Derived Asset
                 │                                  │
        Rights + Consent Grants ──intersection──────┘ → Usage Manifest
```

## D07 — Audio/timing / Audio/timing
```text
Script→LocalizedScript→Utterance→selected VoiceCandidate (timing authority)
                                      ├→ caption/alignment
voice|dialogue|music|ambience|sfx ────┴→ mix + stems → RenderPlan
```

## D08 — Approval/release / Approval/release
```text
artifact hash → Validation ─┐
             → Selection ───┼→ scoped Approval/Waiver → Release Manifest
Claims + Rights + freshness ┘                         → releasable?
```

## D09 — Preflight ledger / Ledger preflight
```text
request hash→Quote→Estimate(min/expected/max)→Budget→Reservation→charge/refund
 unknown ≠ 0          maximum must fit             uncertain = held/reconciling
```

## D10 — CLI/compiler/Remotion
```text
video plan/apply → Project+Lock+Assets → PlanCompiler → RenderPlan+staging
                                                        ├→ Studio (read-only)
                                                        └→ renderMedia → verify
```

## D11 — Rollout
```text
G0 schema/harness + Remotion gate
   └→ T1 scene3 → T2 state/cache → T3 quoted HF → T4 reconcile
                                      ├→ T5 S1-3/audio → T7 master13 → T8 9:16/i18n ┐
                                      └→ T6 claims/review ───────────────────────────┤
                                                               T9 quality/release ──┘
                                                                        └→ T10 AWE real acceptance
```
