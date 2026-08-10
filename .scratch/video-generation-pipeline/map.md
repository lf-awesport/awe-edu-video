# Pipeline universale di generazione video

Label: wayfinder:map

## Destination

Una specifica tecnica e di prodotto bilingue (italiano e inglese), completa per la review e stressata tramite walkthrough end-to-end delle 13 scene AWE, per una pipeline assistita e local-first che trasformi brief o storyboard in video e varianti. La specifica deve includere un preflight del costo tecnico di generazione e rendering ed essere pronta per la successiva scomposizione in backlog; la conformità implementativa richiede prima il gate G0 con schemi compilabili, harness e decisione Remotion.

## Notes

- Caso pilota: video commerciale AWE Sport Education, 13 scene, circa 85 secondi.
- Ambizione: core universale ed estensibile a qualsiasi tipologia di video; il primo formato concretamente validato resta il commerciale AWE.
- Utente iniziale: team tecnico interno via CLI, file versionabili e Remotion Studio.
- Input: brief libero o storyboard; entrambi convergono in uno storyboard canonico approvabile.
- Media: pipeline ibrida con Higgsfield, asset reali, screenshot/screencast, brand kit, stock e motion graphics Remotion.
- Provider: Higgsfield è il primo adapter, non un vincolo del dominio.
- Audio: TTS revisionabile e sostituibile con registrazione umana.
- Output: master più varianti dichiarate (formato, lingua, CTA o durata).
- Checkpoint: configurabili per progetto, non obbligatori globalmente.
- Profili: `quality`, `balanced`, `fast`.
- Timing: il sistema può ottimizzare script e durate, producendo un change report reversibile.
- Governance: provenance e diritti completi per ogni asset e render.
- Preflight: API, tentativi, storage, tempo macchina e rendering; escluso il costo del lavoro umano.
- La mappa prende decisioni e produce evidenze; non implementa il sistema e non genera il video finale.

## Decisions so far

- [Stabilire il ruolo e i vincoli di Remotion](issues/02-remotion-runtime.md) — Remotion è il renderer candidato e lo Studio locale; l'adozione resta bloccata prima di T1 da versione/termini/headcount/use/costo approvati e pin, mentre orchestrazione, cache e varianti restano responsabilità della pipeline.
- [Acquisire una sessione Higgsfield rappresentativa](issues/14-higgsfield-access.md) — Il CLI ufficiale è autenticato per discovery su un workspace paid; ciò non prova MCP, idoneità produttiva, lifecycle generativo o addebito.
- [Verificare contratto, capacità e costi di Higgsfield MCP](issues/01-higgsfield-capabilities.md) — L'integrazione iniziale userà il CLI ufficiale; MCP resta non verificato. I 12,5 crediti osservati sono una Price Observation datata, non una Quote autorizzativa; lifecycle e charge richiedono live smoke autorizzato in T3/T4.
- [Definire il modello canonico del progetto video](issues/03-canonical-model.md) — Il progetto è dichiarativo e provider-neutral: scene con layer temporizzati relativamente, master con override, script e brand semantici, generation request separata da asset immutabili e lockfile operativo distinto.
- [Definire il contratto provider-neutral per la generazione](issues/04-provider-contract.md) — L'adapter è staged e capability-driven: quote e reservation precedono ogni submit, i job sono crash-safe e riconciliabili, le reference sono semantiche e ogni output viene materializzato e tracciato localmente.
- [Definire il contratto tra storyboard e composizioni Remotion](issues/05-remotion-composition-contract.md) — Un PlanCompiler produce RenderPlan e staging immutabili; Remotion usa renderer registrati, timing già risolto, Studio read-only, preview selettive e render finali integrali per master e varianti.
- [Progettare il ciclo di vita riproducibile della pipeline](issues/06-orchestration-lifecycle.md) — Un reconciler a DAG governa progetto, scene e layer con event log, invalidazione tramite hash, lease locali, checkpoint atomici, cache uniforme, isolamento dei fallimenti ed execution plan obbligatori.
- [Definire la normalizzazione da Brief a Storyboard](issues/15-brief-normalization.md) — Fonti immutabili e non attendibili diventano un draft tracciabile; source, inferenze e proposte restano distinti, conflitti e Claim possono bloccare la produzione e la promozione crea una versione Storyboard immutabile.
- [Definire la pipeline Audio e TTS](issues/16-audio-tts.md) — Script localizzati generano Voice Candidate TTS o umane per Utterance; audio selezionato governa timing e caption, mentre consenso, pronuncia, diritti, preflight, mix policy e stem restano tracciabili e provider-neutral.
- [Definire approvazioni e controllo delle modifiche](issues/07-approval-change-control.md) — Approval immutabili e granulari restano separate da Validation, Selection e Waiver; hash e revoche governano invalidazione, mentre solo un Release Manifest completo rende il deliverable pubblicabile.
- [Definire provenance, diritti e conservazione degli asset](issues/08-asset-governance.md) — Blob content-addressed supportano Asset project-scoped con lineage, Rights/Consent Grant e sensibilità; retention e revoche propagano, mentre Asset Usage Manifest collega ogni frame alle prove applicabili.
- [Progettare il preflight del costo tecnico](issues/09-cost-preflight.md) — Cost Estimate minimum/expected/maximum conserva unità e formule, Budget gerarchici e Reservation impediscono overspend, mentre ledger e consuntivo distinguono costi storici, incrementali, fissi, marginali e attribuiti.
- [Definire esperienza CLI e layout versionabile](issues/10-cli-project-layout.md) — Un progetto YAML versionabile usa Runtime State e Blob fuori Git; la CLI goal-oriented separa piano e applicazione, governa resume, review, Studio, release, portabilità e automazione fail-closed.
- [Definire qualità, controlli e criteri di accettazione](issues/11-quality-validation.md) — Quality Requirement indipendenti combinano check, metriche, AI Assessment e review; gate invarianti, profili graduati, finding localizzati e Quality Report governano accettazione e release.
- [Validare l'architettura sullo storyboard AWE](issues/12-awe-walkthrough.md) — Il prototipo copre concettualmente tutte le 13 scene senza eccezioni note; la falsificazione eseguibile richiede fixture sintetica compilabile in T7 e overlay privato AWE in T10.
- [Definire il rollout tracer-bullet della pipeline](issues/17-rollout-plan.md) — G0 precede dieci tracer verticali; ogni tracer richiede acceptance manifest eseguibile e promotion/reversal, con CI offline e T10 subordinato a un entry gate AWE esplicito.
- [Definire struttura e handoff della specifica bilingue](issues/13-specification-shape.md) — Il pacchetto IT/EN 0.9 è una candidate specification in review, pronta per review e backlog decomposition ma non ancora implementation authority; approvazione richiede record hash-bound e G0 rende i contratti compilabili.

## Not yet specified

Il recursive grilling depth 2 ha isolato quattro decisioni indipendenti da chiudere prima dei relativi gate, senza avviare implementazione:

- **Remotion adoption gate (pre-T1):** versione, termini, entità/headcount, classificazione d'uso/render, costo, telemetry/license-key, recheck e contingency.
- **Higgsfield live lifecycle (T3/T4):** snapshot CLI/schema, QuoteBinding, submit/poll/materialize, receipt incerta, retention e actual charge/refund con Budget minimo autorizzato.
- **Asset erasure protocol:** logical erasure, replica/reference authority globale, backup/export obligations, tombstone replay e physical delete sicura su Blob deduplicati.
- **Specification/contract bootstrap (G0):** Approval Record bilingue, schemi compilabili, canonical hash, fixture positive/negative, acceptance manifests e rollout reversal.

Queste aree sono blocker mirati, non prova che il core architetturale debba essere riprogettato.

## Out of scope

- Implementazione della pipeline, proof of concept eseguibile e generazione del video AWE finale.
- Applicazione web, SaaS, multi-tenancy, autenticazione e billing.
- Rendering cloud nella prima release.
- Supporto concreto e validazione di formati video diversi dal commerciale AWE nella prima release.
- Selezione automatica multi-provider e tassonomia completa di plugin per formati non ancora validati.
- Costo delle ore umane nel preflight economico.
