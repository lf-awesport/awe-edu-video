# Progettare il ciclo di vita riproducibile della pipeline

Type: grilling
Status: resolved
Blocked by: 03, 04, 05

## Question

Quale state machine local-first deve governare ingestione, normalizzazione, pianificazione, generazione, selezione, composizione, review e render affinché ogni fase sia riprendibile, idempotente, cacheabile, ispezionabile e rigenerabile per singola unità?

## Answer

L'orchestratore è un reconciler local-first che porta progetto, scene e layer verso un obiettivo dichiarato. La CLI presenta fasi comprensibili, ma l'esecuzione reale è un DAG derivato da dipendenze e hash, non una pipeline globale rigida.

```text
ingest → normalize → resolve script/timing → plan assets
      → preflight → generate/materialize → select/review
      → compile RenderPlan → preview → final render → verify
```

### Granularità e stato

Ogni progetto, scena e layer ha stato, dipendenze, input hash, output hash e artefatti. Lo stato progetto è aggregato e può essere `ready`, `running`, `awaiting-approval`, `partially-blocked`, `failed` o `complete`. I nodi usano stati operativi come `pending`, `ready`, `running`, `awaiting-approval`, `succeeded`, `failed`, `blocked`, `stale` e `reconciling`.

Il lockfile conserva uno snapshot corrente per letture rapide; un event log append-only registra ogni transizione con target, causa, actor, timestamp, input/output hash, costo e riferimenti agli artefatti. Lo snapshot è ricostruibile dagli eventi, ma non è necessario rigiocarli per ogni comando.

### Invalidazione

Ogni artefatto dichiara le dipendenze e gli hash usati per produrlo. Quando cambia un input, il dependency graph marca automaticamente `stale` soltanto gli artefatti transitivamente dipendenti. Gli output precedenti non vengono cancellati e restano auditabili/selezionabili; un change report spiega la propagazione.

Esempio: una modifica al voice-over invalida timing e caption derivati, quindi RenderPlan, preview e render coinvolti, ma non una clip footage indipendente né scene non dipendenti.

### Scheduling e isolamento dei fallimenti

Il scheduler esegue i nodi `ready` del DAG, anche in parallelo. Un fallimento marca `blocked` i discendenti, mentre rami indipendenti continuano. L'orchestratore non esegue nodi con prerequisiti mancanti.

Un lease locale per unità contiene owner, PID, acquisizione, heartbeat e scadenza. Processi diversi possono lavorare sullo stesso progetto ma non sulla stessa unità. Un lease scaduto non implica successo o fallimento: il nodo entra in riconciliazione prima di essere acquisito nuovamente.

### Checkpoint e crash recovery

Ogni fase segue write-ahead intent → output temporaneo → verifica → commit atomico → evento completato. Dopo un crash, l'orchestratore classifica l'intent interrotto:

- lavoro locale deterministico senza commit: cleanup e riesecuzione sicura;
- submit provider incerto: `reconciling`, mai resubmit automatico;
- output presente ma non registrato: verifica hash e adozione atomica;
- render parziale: preservato per diagnosi, non promosso a deliverable.

### Cache

Tutte le fasi usano chiavi content-addressed. Per la generazione, la chiave include provider, modello, schema, prompt, parametri, reference, continuity bundle e output constraints. Un cache hit riusa la candidate esistente senza spesa. `--new-candidate` aggiunge un nonce, richiede nuova quote/reservation e non sostituisce candidate precedenti.

Cache hit e artefatto `current` non equivalgono ad approvazione: selezione e checkpoint restano dimensioni separate dello stato.

### CLI goal-oriented

L'utente chiede una destinazione; l'orchestratore calcola e riconcilia il sotto-grafo necessario:

```text
video build --to preflight
video build --to preview
video build --to final
video build --scene <id> --to preview
video generate --layer <scene/layer> --new-candidate
```

Comandi diagnostici mirati possono ispezionare nodi, eventi, dipendenze, cache e lease, ma non sono necessari per il percorso normale.

### Execution plan obbligatorio

Prima di side effect costosi o persistenti, la CLI produce un execution plan con nodi da eseguire, cache hit/miss, invalidazioni, degradazioni, quote, crediti riservati, spazio/tempo stimati e checkpoint. La policy di approvazione decide se il piano può essere applicato automaticamente; il piano e la decisione vengono registrati nell'event log.

## Recursive grilling — depth 2

**Verdict:** pronto dopo protocollo replay/commit più forte. Event log è source of truth ordinata, versionata e integrity-checked; snapshot/indici sono proiezioni. Commit usa `Intent→CommitPrepared→materialize→Completed`, e un output orfano è adottabile solo con prepared evidence compatibile. Gap, divergent duplicate, chain/version failure bloccano rebuild. Cache identity è separata da current eligibility di rights/policy/Approval. Lease commit usa fencing token. **Residual uncertainty:** fsync/rename/lock guarantees sui filesystem Linux/macOS target, da falsificare in T2.
