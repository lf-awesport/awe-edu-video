# Definire esperienza CLI e layout versionabile

Type: grilling
Status: resolved
Blocked by: 03, 06, 07, 08, 09, 15, 16

## Question

Quali comandi, file, manifest, directory e artefatti intermedi deve esporre la prima versione al team tecnico affinché configurazione, review, resume, rigenerazione, preflight, Studio e render siano comprensibili e versionabili senza committare asset pesanti?

## Answer

La prima versione espone una CLI goal-oriented sopra un progetto autonomo, dichiarativo e portabile. Le sorgenti umane e le decisioni intenzionalmente esportate sono versionabili; stato operativo e binari pesanti restano locali. Nella specifica l'eseguibile si chiama `video`, lasciando il nome effettivo del package all'implementazione.

### Layout dichiarativo

Ogni progetto è una directory identificata da un `video.yaml`. Un repository può contenerne più di una senza richiedere un workspace formale.

```text
<project>/
├── video.yaml
├── storyboard/
│   ├── master.yaml
│   └── variants/
├── scripts/
│   ├── master.yaml
│   └── locales/
├── brand/
│   ├── brand.yaml
│   └── fonts.yaml
├── policies/
│   ├── approvals.yaml
│   ├── budgets.yaml
│   ├── rights.yaml
│   └── retention.yaml
├── references/
│   └── assets.yaml
├── outputs/
│   └── profiles.yaml
└── .video/
```

Il Project Manifest contiene almeno schema version, project ID stabile, titolo, Storyboard, default di locale/Production Profile/Output Profile e riferimenti ai moduli. YAML è il formato umano; JSON canonico e schema-versionato è il formato degli artefatti macchina. Configurazioni piccole possono restare inline e venire estratte successivamente.

La CLI trova il `video.yaml` più vicino risalendo dalla directory corrente; `--project <path>` prevale. La precedenza è default schema → configurazione utente → manifest → variante/output profile → flag CLI. Segreti e credenziali seguono un canale separato e non possono essere introdotti nel manifest.

Scene, layer e variant usano slug leggibili e stabili; titoli modificabili non sono identità. Asset, candidate, piani, Approval e render hanno ID generati accompagnati dal rispettivo hash autoritativo.

### Confine Git e Runtime State

In Git entrano input dichiarativi e, soltanto tramite export esplicito, snapshot portabili di Storyboard, selezioni, Approval, Production Lock, Release Manifest e provenance. Non entrano Blob, cache, lease, credenziali, preview, render o stato operativo mutabile.

```text
.video/
├── state/
│   ├── snapshot.json
│   ├── events.jsonl
│   └── leases/
├── ledger/
├── plans/
├── approvals/
├── candidates/
├── staging/
├── previews/
├── renders/
└── logs/
```

I metadata project-scoped vivono in `.video/`; i Blob SHA-256 possono essere deduplicati in un Asset Store globale. Nessun riferimento autoritativo usa path assoluti. Path e URL sono fonti di importazione: dopo l'ingestione ogni Asset punta a un Blob materializzato, senza dipendere dalla fonte originaria.

`video init` aggiunge in modo idempotente un blocco marcato a `.gitignore`, preservando le regole dell'utente, e crea anche una protezione locale in `.video/`. Segnala segreti o Asset restricted già tracciati.

### Export, collaborazione e portabilità

Un export riproducibile contiene solo metadata redatti e hash:

```text
exports/<name>/
├── storyboard.snapshot.json
├── selections.json
├── approvals.json
├── production.lock.json
├── release-manifest.json
└── provenance.json
```

Il Production Lock congela input, policy, risoluzioni provider, dipendenze e hash di una build; è distinto dal Runtime State usato per resume. `video materialize` risolve i Blob richiesti prima nello store locale e poi nei backend autorizzati, senza sostituire contenuto mancante con bytes diversi.

Decisioni fra macchine vengono scambiate come bundle append-only di review/decisioni. Un import verifica project ID, artifact hash, actor, ruolo e policy, conserva i conflitti e non incorpora Blob o evidenze restricted. L'identità dell'attore deriva da un profilo locale stabile; un backend collaborativo futuro deve rispettare lo stesso contratto.

### Superficie CLI

Il percorso ordinario chiede un obiettivo e lascia al reconciler il calcolo del DAG:

```text
video init [--from-brief | --from-storyboard]
video validate
video normalize
video promote
video build --to <preflight|preview|final>
video build --scene <id> --to <goal>
video preflight
video apply <plan-id>
video resume <plan-id>
video reconcile [--job <id>]
```

Asset e candidate sono espliciti:

```text
video asset import|inspect|verify|usages
video generate --layer <scene/layer> [--new-candidate]
video candidate list|select|compare
```

Una richiesta generativa identica riusa la cache. `--new-candidate` introduce un nonce e richiede nuova Quote e autorizzazione. Generazione, Candidate Selection e Approval sono eventi distinti.

Diagnostica e review:

```text
video status [--scene <id>]
video inspect <target>
video events --target <target>
video diff
video explain --blocked <target>
video review list|show|approve|request-changes|reject|waive
video doctor
video repair --plan
video invalidate <target> --reason <text>
video rebuild-index
video state reconstruct
```

Studio e release:

```text
video studio [--scene|--variant|--plan]
video render --plan <id>
video verify <render-id>
video release create <render-id> --name <name>
video export release <release-id> --out <path>
```

`video studio` materializza uno staging immutabile e apre `Video`, `ScenePreview` o `LayerPreview`; Studio è read-only e non genera Asset né crea Approval. I render sono immutabili e identificati dal RenderPlan hash. Soltanto una promozione esplicita crea un Deliverable; alias locali come `latest` non sono autoritativi.

La prima implementazione deve coprire un tracer verticale dalla normalizzazione alla release, con status, preflight, resume, review e diagnostica indispensabili. GC definitiva, migrazioni complesse, backend remoti multipli, Waiver avanzati e confronti visuali automatici possono seguire, ma i loro contratti non devono essere preclusi.

### Execution Plan, resume e concorrenza

Prima di side effect onerosi o persistenti, la CLI salva un Execution Plan immutabile. Il flusso canonico separa pianificazione e applicazione; una sessione interattiva può unirle solo mostrando il piano e chiedendo conferma. CI e modalità non interattiva falliscono chiuse senza piano valido e autorizzato. Quote scadute o input hash cambiati impediscono l'applicazione.

Ogni build effettua una riconciliazione leggera. Lavori locali deterministici possono riprendere; submit provider incerti restano `reconciling` e non vengono ripetuti. `resume` continua un piano valido, non equivale a retry generativo.

Lease granulari permettono processi concorrenti su rami distinti; Studio e letture usano snapshot consistenti. Compare-and-swap protegge modifiche dichiarative, mentre migrazione e GC richiedono lease globale. Riparazione e invalidazione sono pianificate e non distruttive; non esiste un `--force` capace di saltare Budget, diritti o invarianti.

### Preflight e output macchina

Il preflight presenta scope, cache hit/miss, costo incrementale e maximum, Budget residuo, compute/storage, Approval richieste e unknown. Il drill-down arriva a ogni voce. Unknown, Quote scadute e maximum oltre Budget bloccano l'esecuzione.

Ogni comando informativo supporta `--json`; ogni mutazione supporta piano/dry-run quando applicabile. Il JSON ha schema versionato e include almeno project ID, comando, risultato, diagnostica e riferimenti agli artefatti. Exit code distinti rappresentano input invalido, decisione umana, Budget/Quote, dipendenze/diritti, provider/render, riconciliazione e completamento parziale.

`--non-interactive`, implicato da `CI=true`, disabilita prompt e fallback non dichiarati. `--offline` blocca provider, download e refresh Quote: una dipendenza mancante produce un piano bloccato, mai accesso di rete implicito.

### Sicurezza, provider e manutenzione

Token e segreti provengono da ambiente, keychain o secret store; il manifest contiene soltanto credential profile. Log ed eventi strutturati redigono token, URL firmati, dati personali e contenuti restricted. Payload diagnostici completi sono cifrati e opt-in; nessuna telemetria remota è attiva per default.

I comandi `provider inspect/doctor` e `renderer doctor` verificano Higgsfield e Remotion dietro gli adapter. Un pass-through nativo è diagnostico e `untracked`: il risultato entra nella pipeline soltanto tramite import esplicito.

Schema migration, garbage collection e cancellazione fisica producono sempre un piano. Le migrazioni mostrano diff e backup; la GC verifica riferimenti, retention e legal hold e passa per quarantena. Nessuna di queste operazioni avviene implicitamente durante build o render.

## Recursive grilling — depth 2

**Verdict:** pronto dopo rendere configurazione e collaborazione falsificabili. Merge config è schema-aware per campo, ha unset esplicito e provenance; ogni valore semantico entra nel resolved-config hash. Bundle decisionali sono idempotenti, anti-replay, authority-bound e convergono indipendentemente dall'ordine; conflitti non usano last-write-wins. La grammatica è contract surface con availability matrix T1–T10: comandi non implementati rispondono esplicitamente, non simulano successo. Lease write usa fencing. **Residual uncertainty:** firma/keystore e backend collaborativo concreto.
