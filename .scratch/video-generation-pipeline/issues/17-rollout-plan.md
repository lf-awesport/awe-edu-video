# Definire il rollout tracer-bullet della pipeline

Type: grilling
Status: resolved
Blocked by: 12

## Question

Quale sequenza di tracer bullet, gate e milestone deve trasformare la specifica validata sul caso AWE in una prima implementazione local-first, riducendo per primi i rischi di modello canonico, orchestrazione crash-safe, Higgsfield, Remotion, provenance, costo e release senza costruire prematuramente tutta la superficie prevista?

## Answer

Il rollout procede per tracer verticali end-to-end, ciascuno costruito per falsificare una specifica ipotesi di rischio. Non si implementano prima componenti orizzontali completi né si usa il video finale come unica prova: ogni milestone deve produrre un artefatto osservabile, attraversare happy path e failure principale e dimostrare recovery e provenance.

### Sequenza T1–T10

#### T1 — Render locale deterministico della scena 3

Ipotesi: il modello canonico può compilare una scena UI source-bound in un RenderPlan e produrre un render Remotion riproducibile.

Percorso: `video.yaml → Storyboard scene-03 → Asset import → RenderPlan → staging → Remotion → MP4 → Validation Result → provenance`.

Include Project, Storyboard, Scene, Layer, Asset reference, Output Profile e RenderPlan. Esclude provider remoto, audio generato, Approval e release.

#### T2 — Stato, cache e invalidazione

Ipotesi: due run identiche riusano output content-addressed e una modifica mirata invalida soltanto i dipendenti.

Introduce snapshot JSON, event log JSONL, write atomiche, input/output hash, cache, change report e lease locale. Dimostra rebuild, cache hit e recovery da commit locale interrotto.

#### T3 — Generazione Higgsfield preventivata

Ipotesi: una richiesta onerosa attraversa discovery, planning, Quote, Budget, Reservation, Submission Intent, submit, poll e materialization senza bypass.

Prima usa un fake provider deterministico e fixture redatte; il primo smoke reale avviene soltanto quando request hash, ledger e output verification sono operativi. Introduce Candidate e provenance provider.

#### T4 — Crash safety e reconciliation provider

Ipotesi: un crash in ogni confine critico, soprattutto fra submit e receipt, non produce una generazione duplicata.

Simula intent orfano, job incerto, receipt tardiva, output presente ma non registrato, cancellazione e addebito unknown. Il gate richiede reconciliation dimostrata e disponibilità Budget ridotta prudentemente.

#### T5 — Scene 1–3, transizione e timing audio

Ipotesi: footage generativo, UI deterministica, Transition, Voice Candidate, caption e timing cumulativo compongono un'unica preview senza gap o doppio frame.

Introduce audio lane, Localized Script, Utterance, timing derivato, transizione S1→S2→S3 e invalidazione dopo retake.

#### T6 — Claim, review e blocco release

Ipotesi: la scena 4 può essere previewata internamente ma non resa production-ready con Claim non verificati.

Introduce Source Reference, Claim, Approval, Validation, Review Package e policy fail-closed. Verifica change request, nuova revisione e Approval superseded.

#### T7 — Master AWE di 13 scene

Ipotesi: tutte le capacità visuali del commerciale compilano senza branch nel core.

Raggruppa per capacità, non per tredici implementazioni: footage/continuity 1 e 13; transizione 2; UI/motion 3, 5, 6, 8, 9, 12; Claim source-bound 4, 7, 10, 11. Placeholder esplicitamente `internal-preview-only` sono ammessi, ma impediscono release.

#### T8 — Variante 9:16 e localizzazione

Ipotesi: master e override producono una variante senza duplicare Asset condivisi e falliscono chiusi se crop, traduzione o timing perdono contenuto essenziale.

Introduce layout strategy, Localized Script, caption/localization review e Approval specifiche della variante.

#### T9 — Quality e release evidence

Ipotesi: Quality Report, Asset Usage Manifest, Production Lock e Release Manifest possono dimostrare la pubblicabilità di un hash esatto.

Introduce quality suite graduata, rights/consent propagation, Waiver consentite, materialization da lock e rollback compatibile.

#### T10 — AWE acceptance con asset reali

Ipotesi: il team può completare il percorso CLI/Studio con fonti, Claim, CTA, diritti, consensi e Quote reali senza modificare Runtime State manualmente.

Produce preview approvata, render verificato, cost reconciliation e release candidate. Non implica pubblicazione del video senza decisione separata.

### Stack e confini iniziali

La prima implementazione usa TypeScript/Node.js per CLI, core, compiler, schema e Remotion. Higgsfield CLI e media tool sono processi esterni dietro adapter tipizzati. Il workspace contiene pochi moduli profondi: CLI, core, project store, Higgsfield adapter, Remotion renderer, validation e composizioni.

I contract test vengono introdotti dal tracer che usa il seam:

- T1: Storyboard → RenderPlan → Remotion;
- T2: snapshot/eventi/cache;
- T3: provider contract;
- per ogni comando: JSON schema ed exit code.

La persistenza iniziale è file-based e local-first con JSON/JSONL, scritture atomiche, append-only e repository interface. SQLite o altri backend arrivano soltanto quando query o concorrenza lo richiedono. Lo schema cresce col tracer: durante `0.x` le fixture e i pilot usano migrazioni forward esplicite; da `1.0` entra una policy di compatibilità pubblica.

### Test, CI e ambienti

I provider hanno tre livelli:

1. fake deterministico per unit/contract CI;
2. replay di payload reali redatti per integration CI;
3. live smoke manuale con credenziali dedicate e Budget minimo.

La CI ordinaria è offline e non possiede credenziali provider. Il live smoke salva Execution Plan, Quote, Reservation, job e provenance e non parte da contributi non fidati.

Fixture sintetiche e redistribuibili coprono i contratti pubblici; il project fixture AWE e gli Asset reali restano in storage autorizzato. Linux CI/orb e macOS per Studio sono gli ambienti v1; Node, package manager, Chromium/Remotion e media tool sono pin. Upgrade Higgsfield/Remotion richiedono discovery diff, contract/replay test, render baseline, cost check e nuova provenance.

La promozione segue `development → internal pilot → AWE acceptance → release candidate`. È promozione di artifact, policy e lock, non deploy cloud.

### Definition of Done e parallelizzazione

Ogni tracer è un ticket o piccolo gruppo di ticket tagliato per comportamento end-to-end, non per file/package. Dichiara rischio, comando osservabile, input/output, seam, failure, evidence, dipendenze e non-obiettivi.

Un tracer è completo quando include comando reale, input versionato, output hashato, event log, cache behavior, failure simulato, resume/reconcile applicabile, preflight per side effect onerosi, Validation Result, contract test e documentazione minima. Il tracer successivo parte soltanto quando l'ipotesi precedente è dimostrata.

T1–T3 restano principalmente seriali. Dopo la stabilizzazione dei contratti possono procedere in parallelo renderer UI, audio/caption, validation, varianti e governance/release, integrando contro contract test versionati.

### Lane AWE parallela

L'implementazione non attende tutti i dati commerciali, ma una lane separata deve acquisire prima di T10:

- equivalenza 12 corsi/12 aree, quantità video/quiz;
- certificato, durata, licenze, stage e live;
- CTA/payoff;
- logo, font, screenshot/screencast e template;
- brand partner dimostrativo;
- Rights Grant e Consent Grant.

Placeholder attraversano gli stessi gate come `internal-preview-only`; non vengono mai promossi silenziosamente.

### Sicurezza, benchmark e rollback

Prima del pilot reale sono obbligatori secret redaction, process invocation senza injection, path/symlink policy, URL/file ingest limitato e verificato, MIME/size checks, lockfile e dependency scan, temp permission sicure e controllo Git di file restricted.

Dal primo tracer si raccolgono tempo per fase, FPS render, CPU/RAM, spazio, cache hit/miss, provider latency e costo quoted/reserved/charged. Servono a calibrare il preflight, non a imporre ottimizzazioni premature.

Ogni release candidate registra CLI/core, schema, adapter, provider, Remotion bundle, toolchain, Production Lock e migrazioni. Il rollback usa una versione compatibile con lo snapshot o l'ultimo export, senza riscrivere eventi, costi, Approval o provenance.

### Successo v1 e scope differito

La v1 è riuscita quando le 13 scene compilano senza override nel core, cache e RenderPlan sono riproducibili, nessun crash duplica un submit, il maximum precede ogni spesa, rigenerazione è granulare, varianti preservano dipendenze, Claim/diritti bloccano correttamente, Quality Report localizza failure, Production Lock rimaterializza e Release Manifest collega frame e Asset.

Restano dopo v1: web app, SaaS, multi-tenancy/auth/billing, cloud render, scheduler distribuito, selezione automatica multi-provider, marketplace plugin, Windows, editor visuale Storyboard, GC avanzata, firma remota e validazione concreta di formati diversi dal commerciale.

## Recursive grilling — depth 2

**Verdict:** sequenza di rischio valida dopo un gate pre-T1 e acceptance più forti. **G0 Contract Bootstrap** produce schema compilabile, canonical hash, fixture/harness e decisione Remotion. Ogni T1–T10 possiede acceptance manifest con comando, test/fixture ID, expected output/exit, environment, evidence e approvatore. T7 preserva 85 s requested ma non impone resolved 85 s senza Output Profile. T10 ha entry gate privato separato dall'exit. Promotion richiede reversal rehearsal: stop submit/release, demotion/quarantine, job/charge reconciliation e restore compatibile, senza promettere undo di costi irreversibili. **Residual uncertainty:** owner/capacità, accesso/budget live e disponibilità reviewer/AWE inputs.
