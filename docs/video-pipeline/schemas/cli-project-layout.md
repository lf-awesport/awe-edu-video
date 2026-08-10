# CLI and project layout / CLI e layout progetto

**Candidate normative annex. Effective status inherits the parent specification (`in-review`); it becomes implementation authority only when that parent is approved.** Applicable requirement IDs: **CLI-001–CLI-004, SECURITY-003–SECURITY-006, ORCH-004**. Every normative keyword maps to those IDs.

```text
<project>/
├── video.yaml
├── storyboard/{master.yaml,variants/}
├── scripts/{master.yaml,locales/}
├── brand/{brand.yaml,fonts.yaml}
├── policies/{approvals.yaml,budgets.yaml,rights.yaml,retention.yaml}
├── references/assets.yaml
├── outputs/profiles.yaml
├── exports/<name>/{storyboard.snapshot.json,selections.json,approvals.json,production.lock.json,release-manifest.json,provenance.json}
└── .video/
    ├── state/{snapshot.json,events.jsonl,leases/}
    ├── ledger/ plans/ approvals/ candidates/ staging/
    └── previews/ renders/ logs/
```

| Area | Normative contract (EN / IT) | Applicable requirement IDs |
|---|---|---|
| Discovery/config | CLI MUST find nearest ancestor `video.yaml`; `--project` wins. Precedence MUST be schema defaults → user config → manifest → variant/output profile → CLI flags. Merge MUST be schema-aware per field: scalar replace, map key-merge unless explicit replace, ordered list replace unless explicit operator, set merge only when declared, and explicit versioned unset rather than ambiguous `null`. Resolved values affecting output/policy/provider/cost/validation MUST expose provenance and enter resolved-config hash. Secrets MUST use a separate channel. / Merge config DEVE essere schema-aware, spiegabile e hash-bound; secret separati. | CLI-001, SECURITY-005 |
| Git/export | Declarative inputs MAY enter Git. `.video`, Blobs/cache/leases/secrets/previews/renders MUST stay out. `init` SHOULD add an idempotent marked `.gitignore` block and warn on tracked secrets/restricted assets. Portable export MUST contain canonical versioned redacted metadata/hashes only; materialize MUST resolve exact hashes. Decision bundle import MUST be idempotent, bind bundle/project/decision/artifact/authority/policy hashes and replay protection, preserve incompatible decisions as conflicts, and exclude Blob/restricted evidence. / Bundle DEVONO essere idempotenti, anti-replay e conservare conflitti. | CLI-001, CLI-004, SECURITY-005 |
| v1 grammar | The contract surface reserves `init`, `validate`, `normalize`, `promote`, `build --to/--scene`, `preflight`, `apply`, `resume`, `reconcile`; asset/candidate; status/inspect/events/diff/explain/review/doctor/repair/invalidate/rebuild/reconstruct; studio/render/verify/release/export commands. A tracer availability matrix MUST identify when each command becomes functional; unavailable commands MUST return explicit versioned `unsupported|not-implemented`, never simulated success. / La superficie riserva la grammatica, ma una matrice tracer DEVE dichiarare disponibilità reale; niente stub con successo finto. | CLI-002 |
| JSON/exits | Informational commands MUST support schema-versioned `--json` with project ID, command, result, diagnostics and artifact refs; mutations MUST support plan/dry-run where applicable. Exit classes MUST distinguish success, invalid input, human decision, Budget/Quote, dependency/rights, provider/render, reconciliation and partial completion. / Output JSON ed exit class DEVONO essere distinti. | CLI-003 |
| Plans/preflight | Persistent/network/chargeable effects MUST use immutable authorized Execution Plan. Interactive combined flow MUST display scope, operations, cache hit/miss, incremental/min/expected/max, remaining Budget, compute/storage, approvals, degradations, outbound data and unknowns before confirmation. Changed hashes/expired Quotes/unknown paid lines/over-budget MUST block. / Side effect DEVONO usare piano; preflight DEVE mostrare i campi e bloccare drift/unknown/budget. | SECURITY-003, CLI-002 |
| Concurrency | Granular leases SHOULD permit independent DAG branches; reads/Studio use consistent snapshots. Declarative writes MUST use CAS. Lease-protected commits MUST verify a monotonic fencing token so an expired former owner cannot commit. Migration and GC MUST acquire global lock. Expired leases MUST reconcile. / Commit protetti da lease DEVONO verificare fencing token; migration/GC lock globale. | ORCH-004, CLI-002 |
| Offline/CI | `CI=true` implies non-interactive. `--non-interactive` and `--offline` MUST disable prompts, undeclared fallback, provider/download/Quote refresh and implicit network; missing dependencies produce a blocked plan. / CI/offline DEVONO essere fail-closed. | CLI-003, SECURITY-004 |
| Maintenance | Migration, GC, repair, invalidation and physical deletion MUST always produce a non-destructive plan. Migration MUST show diff/backup; GC MUST verify references/retention/legal hold and quarantine; none MAY run implicitly during build/render. No `--force` MAY bypass Budget, rights or invariants. / Manutenzione DEVE essere pianificata; NON PUÒ essere implicita o bypassare invarianti. | CLI-002, SECURITY-006 |
