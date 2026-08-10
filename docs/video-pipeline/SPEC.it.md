---
specVersion: 0.9.0
status: in-review
date: 2026-08-09
counterpart: SPEC.en.md
owner: "Role: Product/Technical Owner"
reviewer: "Role: Product, Engineering, Legal, Brand reviewers"
---

# Specifica pipeline video — Italiano

Le specifiche finali approvate e gli allegati normativi collegati sono autorità di implementazione. Nello stato corrente `in-review`, MUST/MUST NOT sono **proposte normative**, non ancora autorità vigente; lo status effettivo di un allegato non può superare quello della specifica padre. Gli issue risolti in `.scratch/video-generation-pipeline/issues/` sono storia decisionale e rationale; il prototipo AWE è evidence storica supplementare. **Legenda normativa:** MUST/DEVE e MUST NOT/NON DEVE sono obblighi una volta approvati; SHOULD/DOVREBBE una raccomandazione con deviazione motivata; MAY/POTREBBE una facoltà.

## S00 — Document Control
**Proposta normativa.** Versione `0.9.0`, stato `in-review`, data 2026-08-09. La controparte inglese ha pari autorità; una divergenza semantica è un difetto bloccante e non autorizza a scegliere unilateralmente una lingua. Identificatori tecnici e allegati shared restano comuni. ID e ordine sono stabili. [Glossario](glossary.md), [requisiti](requirements.csv), [tracciabilità](traceability.csv).

## S01 — Executive Summary
Pipeline local-first, provider-neutral e assistita che converte Brief/Storyboard in master e varianti tramite normalizzazione controllata, adapter Higgsfield, composizione/render Remotion, audio, review, governance, preflight e release evidence. Il walkthrough copre 13 scene/85 s, ma non è production-ready.

## S02 — Goals/Scope/Non-goals
**Normative.** In scope: CLI interna, file versionabili, runtime locale, master/varianti, profili `fast|balanced|quality`, rendering locale e contratti estensibili. Out: implementazione, video finale, web/SaaS, multi-tenancy/auth/billing, cloud render, scheduler distribuito, selezione automatica multi-provider, costo umano e validazione v1 di formati non commerciali.

## S03 — Users/Product Workflow
Utenti iniziali: creator tecnico, reviewer, owner, legal e reviewer linguistico. Flusso: ingest → normalize → promote → plan/preflight → apply/reconcile → select/review → compile/Studio → render/verify → release. Studio è consultazione locale read-only; CLI e UI condividono la stessa Review Queue.

## S04 — Ubiquitous Language
**Normative.** I termini hanno il significato del [glossario](glossary.md); in particolare Approval ≠ Validation ≠ Candidate Selection ≠ Waiver, Blob ≠ Asset, Storyboard ≠ Runtime State, Deliverable ≠ Releasable.

## S05 — System Context/Principles
**Rationale.** Confini e flussi: [D01, D02](diagrams/README.md). Core dichiarativo, side effect espliciti, fail-closed, hash-first, audit append-only, local-first; provider e renderer sono adapter.

- **SECURITY-001:** Il sistema MUST trattare Brief e allegati come contenuto non attendibile, mai come istruzioni operative.
- **SECURITY-002:** Il core MUST NOT dipendere da concetti Higgsfield, React o Remotion.
- **SECURITY-003:** Side effect di rete, persistenti o onerosi MUST richiedere un Execution Plan valido.
- **SECURITY-004:** Operazioni offline/CI MUST fallire chiuse senza rete, prompt o fallback impliciti.

## S06 — Canonical Domain Model
Contratto dettagliato: [canonical-model](schemas/canonical-model.md).

- **MODEL-001:** Project, Storyboard, Scene, Layer, Transition, Variant, Script, BrandKit e OutputProfile MUST avere identità/versione dichiarate.
- **MODEL-002:** Ogni entità indirizzabile MUST avere un ID stabile unico nel progetto; titoli e path MUST NOT essere identità.
- **MODEL-003:** Scene MUST conservare `requestedDuration` come intent; timing risolto di build MUST essere congelato in Production Lock/RenderPlan, con frame derivati, senza mutare silenziosamente lo Storyboard promosso.
- **MODEL-004:** Variant MUST ereditare il Master e contenere solo override per ID, senza mutare o duplicare implicitamente il Master.
- **MODEL-005:** GenerationRequest, Candidate immutabile, Candidate Selection e selected Asset MUST restare separati.

## S07 — Brief Normalization
Flusso: [D03](diagrams/README.md). Dettaglio normativo shared: [normalization](schemas/normalization.md).

- **NORM-001:** Brief originale e fonti MUST essere immutabili/content-addressed e ogni derivato MUST avere Source Reference puntuali.
- **NORM-002:** Ogni valore normalizzato MUST essere classificato `source`, `inferred` con Assumption, oppure `proposed`.
- **NORM-003:** Il normalizzatore MUST NOT inventare Claim; Claim senza fonte MUST restare `unverified` e bloccare production-ready.
- **NORM-004:** Required mancanti, Blocking Ambiguity e conflitti senza priorità MUST bloccare Promotion.
- **NORM-005:** Promotion MUST richiedere `storyboard-valid`, report visibile e policy applicata, creando uno Storyboard immutabile senza avviare produzione.

## S08 — Orchestration/Runtime State
Stati e invalidazione: [D04](diagrams/README.md), [manifests](schemas/manifests.md).

- **ORCH-001:** Un reconciler MUST derivare un DAG con input/output hash e stati `pending|ready|running|awaiting-approval|succeeded|failed|blocked|stale|reconciling`.
- **ORCH-002:** Event log append-only ordinato, integro e versionato e snapshot come proiezione ricostruibile MUST registrare transizioni, actor, causa, hash, costi ed evidence; gap, duplicati divergenti o chain invalida MUST fallire esplicitamente.
- **ORCH-003:** Cambi input MUST invalidare soltanto dipendenti transitivi, conservando output storici e change report.
- **ORCH-004:** Ogni fase MUST usare intent, `CommitPrepared`, output temporaneo verificato, materializzazione atomica ed evento; lease scaduti MUST riconciliarsi e i commit MUST verificare fencing token.
- **ORCH-005:** Cache identity MUST avere hash completi e restare separata dall'eligibility corrente di rights/policy/Approval; cache hit MUST NOT implicare Selection o Approval; `--new-candidate` MUST usare nonce e nuova autorizzazione.

## S09 — Provider Contract/Higgsfield
Contratto e lifecycle: [provider-contract](schemas/provider-contract.md), [D05](diagrams/README.md).

- **PROVIDER-001:** Adapter MUST implementare `discover→plan→quote→reserve→submit→poll→materialize`, con reconcile e cancel opzionale.
- **PROVIDER-002:** Capability/schema live MUST essere snapshot, validati e pin nel piano; degradazioni MUST essere esplicite e governate da policy.
- **PROVIDER-003:** Ogni Candidate onerosa MUST avere binding fresco a Unit/Batch Quote per request, quantità e schema esatti e Reservation prima del submit; non è richiesta una chiamata quote separata quando lo scope provider copre più Candidate.
- **PROVIDER-004:** SubmissionIntent MUST precedere submit; crash senza receipt MUST entrare `reconciling` senza resubmit automatico.
- **PROVIDER-005:** Successo remoto MUST essere materializzato atomicamente, verificato e SHA-256 prima dell'uso; payload raw redatti MUST preservare audit.

## S10 — Audio/TTS/Captions
Timing: [D07](diagrams/README.md). Dettaglio normativo shared: [audio](schemas/audio.md).

- **AUDIO-001:** Script master, LocalizedScript, Utterance, VoiceProfile e VoiceCandidate MUST essere versionati e provider-neutral.
- **AUDIO-002:** La VoiceCandidate selezionata MUST essere timing authority di build; delta fuori tolleranza MUST produrre proposta/change report, non mutare lo Storyboard approvato; la sostituzione MUST invalidare timing, caption, mix, RenderPlan e render dipendenti.
- **AUDIO-003:** TTS e registrazioni umane MUST condividere il contratto Candidate; retake MUST creare asset immutabili senza overwrite.
- **AUDIO-004:** Caption MUST derivare dall'audio selezionato tramite timing provider o alignment/STT e restare collegate agli Script ID.
- **AUDIO-005:** Lane `voice-over|dialogue|music|ambience|sfx`, stem, mix, pronuncia, diritti e consenso MUST essere espliciti; voice cloning senza Consent Grant MUST essere rifiutato.

## S11 — RenderPlan/Remotion
Contratto: [render-plan](schemas/render-plan.md), [D10](diagrams/README.md).

- **RENDER-001:** PlanCompiler MUST produrre RenderPlan validato, serializzabile e staging immutabile da Storyboard, lock, BrandKit e OutputProfile.
- **RENDER-002:** Remotion/Studio MUST NOT leggere Runtime State, chiamare provider, scaricare o mutare asset; Studio MUST essere read-only.
- **RENDER-003:** Compiler MUST risolvere cumulative frame boundaries, transition overlap/addition e rifiutare durata negativa, fine assente e cicli.
- **RENDER-004:** Renderer registry MUST dichiarare schema, capability, asset, safe-area, layout strategy e fallback; variante incompatibile MUST fallire/degradare solo per policy.
- **RENDER-005:** Ogni master/variante finale MUST avere render integrale distinto, hash RenderPlan e impostazioni esplicite; nessun riuso frame non documentato è assunto.

## S12 — Assets/Provenance/Rights/Consent
Lineage: [D06](diagrams/README.md). Dettaglio normativo shared: [asset e diritti](schemas/assets-rights.md).

- **ASSET-001:** Blob MUST essere immutabile SHA-256; Asset MUST essere project-scoped con provenance, sensitivity, cost, lineage e purpose.
- **ASSET-002:** Ogni trasformazione MUST creare nuovo Blob/Asset e applicare l'intersezione dei vincoli parent senza ampliare diritti.
- **ASSET-003:** Provenance AI MUST registrare provider/model/schema/prompt/params/reference/job/terms metadata senza promettere unicità o clearance.
- **RIGHTS-001:** Rights Grant e Consent Grant MUST dichiarare evidence, scope, media, territori, durata, attribuzione, modifiche/AI e revocabilità.
- **RIGHTS-002:** Evidence restricted MUST restare in secure storage; Git/manifest condivisibili MUST contenere solo hash, metadata redatti e secure reference.
- **RIGHTS-003:** Asset con diritti ignoti MUST essere quarantined/internal-preview-only; scadenza/revoca MUST propagare non-releasable conservando audit.

## S13 — Approval/Change Control
Flusso: [D08](diagrams/README.md). Dettaglio normativo shared: [approval](schemas/approval.md).

- **APPROVAL-001:** Approval MUST legare identity e authority snapshot verificabile o policy, artifact/dependency hash, scope, evidence e tempo; identità MUST NOT equivalere ad autorizzazione e i cambi MUST renderla superseded.
- **APPROVAL-002:** Policy `manual|auto|skip|on-failure` MUST trattare required unknown/error/missing come failure e MUST NOT trasformare Validation fallite in pass né saltare invarianti.
- **APPROVAL-003:** Reject, request-changes e Waiver MUST avere rationale; Waiver MUST preservare failure, scope, autorità e scadenza.
- **APPROVAL-004:** Revoca e rollback MUST essere append-only; dipendenti diventano stale/blocked e decisioni storiche non vengono riscritte.

## S14 — Cost Preflight/Budget/Ledger
Ledger: [D09](diagrams/README.md). Dettaglio normativo shared: [cost preflight](schemas/cost-preflight.md).

- **COST-001:** Cost Estimate MUST mostrare minimum/expected/maximum, formule, assunzioni, confidence e unità native; unknown MUST NOT diventare zero.
- **COST-002:** Maximum MUST rientrare in ogni Budget gerarchico e per unità nativa applicabile; Reservation concorrenti MUST aggiornare atomicamente tutti gli scope o nessuno.
- **COST-003:** Ledger MUST distinguere `quoted|reserved|charged|refunded|unknown`; charge incerto MUST consumare prudentemente il massimo riservato finché evidence o adjustment autorizzato lo risolve.
- **COST-004:** Report MUST distinguere historical, incremental e total-attributed, evitando doppio conteggio di costi condivisi/fissi.
- **COST-005:** Ogni richiesta onerosa MUST legare una Quote fresca alla richiesta/provider/modello/schema/prezzo esatti e MUST invalidarla al cambio di input, capability/schema/modello/prezzo o alla scadenza. I 12,5 credits/candidate e 50 credits totali osservati sono solo evidence datata non normativa; 110 crediti MUST NOT essere persistiti.

## S15 — Quality/Acceptance
Dettaglio normativo shared: [quality](schemas/quality.md).

- **QUALITY-001:** Un registry machine-readable di Quality Requirement MUST dichiarare scope, metodo, comparator/rubric, threshold, status/authority, oracle/fixture, severity, profili ed evidence; risultati MUST essere hash-bound e finding localizzati.
- **QUALITY-002:** Esiti MUST essere `pass|fail|warning|not-applicable|unknown|error`; unknown/error obbligatori MUST bloccare e AI Assessment MUST NOT superare check deterministici.
- **QUALITY-003:** Tutti i profili MUST mantenere invarianti di integrità, timing/caption/audio, output, legal, rights, Claim, safe-area e release.
- **QUALITY-004:** Render finale MUST essere decodificato integralmente e verificato per stream, codec, dimensioni, fps/frame count, timestamp, corruzione, audio e caption.
- **QUALITY-005:** Soglie AWE loudness, true peak, safe-area e output MUST restare Open input fino a fonte/policy; valori provisional MUST NOT autorizzare release.

## S16 — CLI/Project Layout
Dettaglio normativo shared: [CLI e project layout](schemas/cli-project-layout.md).

- **CLI-001:** `video.yaml` e input dichiarativi MAY entrare in Git; merge config MUST essere schema-aware, spiegabile e incluso nel resolved-config hash; `.video/`, Blob, cache, lease, secrets, preview e render MUST restare fuori salvo export esplicito redatto.
- **CLI-002:** CLI MUST separare plan/apply e offrire validate, normalize/promote, build/preflight, resume/reconcile, review, Studio, verify/release, inspect/explain.
- **CLI-003:** Comandi informativi MUST supportare JSON versionato; CI/non-interactive MUST avere exit code distinti e nessun prompt/fallback.
- **CLI-004:** Nessun riferimento autoritativo MUST usare path assoluti o URL temporanei; materialize MUST risolvere esattamente gli hash richiesti.

## S17 — Security/Privacy/Failure Recovery
**Threat model.** Minacce: prompt injection, secret/PII leakage, command/path injection e symlink escape, ingest SSRF/MIME spoof/oversize, supply-chain drift, accesso restricted, duplicazione submit e manifest tampering.

- **SECURITY-005:** Segreti MUST provenire da ambiente/keychain/secret store e MUST essere redatti da log, eventi, export e diagnostica.
- **SECURITY-006:** Process invocation, URL/file ingest, path/symlink, MIME/size, temp permission, dependency/lock e Git restricted checks MUST precedere pilot reale.
- **SECURITY-007:** Evaluator esterni MUST ricevere bytes solo se classification, Rights/Consent e policy autorizzano provider, regione, scopo e retention.
- **SECURITY-008:** Release/Production Lock MUST essere verificati per hash e schema; evidence viva MUST avere snapshot/hash o secure reference, non solo URL.

**Failure playbook.** Locale interrotto: pulire temp e rieseguire; submit incerto: reconcile senza retry; output orfano: verificare/adottare; render parziale: diagnostic-only; quote scaduta/input cambiato: re-plan; rights revocati: bloccare release; state corrotto: ricostruire eventi/export senza riscriverli.

## S18 — AWE 13-scene Walkthrough
Contratto normativo scena per scena: [allegato shared AWE walkthrough](awe-walkthrough.md). [E01](examples/awe-project.yaml) e il prototipo sono evidence supplementare datata/replay per 13 scene/85 s, non evidence di produzione o release.

- **RELEASE-001:** Higgsfield MUST essere limitato al footage S1/S13, 5s ciascuna; UI, Claim, brand e CTA MUST usare Remotion e asset reali verificati.
- **RELEASE-002:** Il balanced example MUST pianificare esattamente 2 Candidate per S1 e 2 per S13: 4 totali, ciascuna 5s/720p; il totale atteso MUST essere la somma dei quattro `QuoteBinding` freschi che le coprono. 12,5/candidate e 50 totali sono solo Price Observation datate e MUST NOT essere estrapolati.
- **RELEASE-003:** 12 corsi MUST NOT essere presentati come prova di 12 aree; 400+, 1200+, certificato, due mesi, licenze/stage, live e CTA MUST restare blocker senza fonti.
- **RELEASE-004:** Asset, Rights/Consent Grant e soglie loudness/safe-area mancanti MUST mantenere il progetto internal-preview-only, non production-ready.
- **RELEASE-005:** Release Manifest MUST legare render hash a current approvals, validations, waivers, claims, rights, usage manifest e dependency freshness prima di `releasable`.

## S19 — Rollout G0, T1-T10
Diagramma [D11](diagrams/README.md). Contratto normativo tracer: [allegato shared rollout](rollout.md).

- **ROLLOUT-001:** Prima di T1, G0 MUST produrre schemi compilabili, canonical hash, fixture/harness offline e decisione Remotion licence/version/use/cost approvata. Poi T1 scena 3, T2 state/cache e T3 Higgsfield quoted MUST avanzare principalmente in serie; T4 e T5 seguono le dipendenze dichiarate.
- **ROLLOUT-002:** T6 claims/review, T7 master 13 scene, T8 9:16/localization, T9 quality/release e T10 AWE real acceptance MUST rispettare dipendenze ed exit gate dell'allegato; stabilizzati i contratti richiesti, renderer UI, audio/caption, validation, variants e governance/release MAY avanzare in parallelo anziché in un'unica sequenza strettamente seriale.
- **ROLLOUT-003:** Ogni tracer MUST avere acceptance manifest eseguibile con comando, fixture/test ID, output/exit attesi, evidence path e approvatore; input/output hashati, failure/recovery e contract test; CI ordinaria MUST essere offline e promotion MUST avere reversal provato.

## S20 — Risks/Assumptions/Open Inputs
Registro: [risks](risks.md). **Open input:** fonti/asset AWE elencati nella [checklist](awe-input-checklist.md), soglie e profili output, Remotion license/headcount/version/costo, TTS/alignment, compute, storage, evaluator, musica/SFX, termini/provider quote freschi. Nessun unknown equivale a zero o pass.

## S21 — Acceptance/Traceability
**Proposta normativa.** La baseline approvata richiede un Specification Approval Record hash-bound che enumera entrambe le lingue e gli allegati, scope, Authority Snapshot, decisioni e gestione del dissenso. Completezza bilingue, ID e righe CSV provano copertura documentale, non conformità eseguibile. L'handoff corrente è pronto per review e decomposizione backlog; implementazione conforme inizia dopo G0. Accettazione prodotto v1 segue T1–T10 e richiede i blocker AWE chiusi. Le fonti sono nel [source register](sources.md); i manifest in [schemas/manifests.md](schemas/manifests.md).

**Example — non-normative.** [Provider lifecycle E02](examples/provider-lifecycle.json), [invalidation E03](examples/invalidation.json), [release E04](examples/release-manifest.json).
