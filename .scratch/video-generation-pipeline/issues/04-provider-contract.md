# Definire il contratto provider-neutral per la generazione

Type: grilling
Status: resolved
Blocked by: 01, 03

## Question

Quale contratto deve separare l'orchestratore dai provider generativi affinché Higgsfield sia il primo adapter, con capability negotiation, job asincroni, errori, costi, seed/reference, retry e provenance rappresentati senza assumere una falsa portabilità?

## Answer

L'orchestratore usa un contratto a fasi. Non esiste un metodo opaco `generate()` che possa spendere crediti o degradare la qualità implicitamente. Ogni fase produce un record persistibile, validabile e riprendibile:

```text
discover → plan → quote → reserve → submit → poll → materialize
                                            ↘ reconcile / cancel
```

### Intento e capability negotiation

Il core dichiara un `GenerationIntent` provider-neutral: media type, durata, aspect ratio, qualità, audio, reference tipizzate, continuità e vincoli hard/soft. Provider e modello sono preferenze o pin opzionali. L'adapter interroga il catalogo live, valida gli schemi e produce alternative ordinate con capability soddisfatte, degradazioni, costo e motivazione. Nessuna degradazione è silenziosa: la policy `manual`, `auto` o `on-failure` decide se un'alternativa può avanzare.

Le differenze non portabili restano in un namespace provider-specifico versionato. Il core non finge che seed, character handle, motion control o output siano equivalenti tra provider.

### Quote e budget

Ogni Candidate richiede un binding recente a una Unit/Batch Quote legata all'hash esatto della richiesta, quantità, provider, modello, schema osservato, crediti/valuta, timestamp e scadenza. Una risposta provider può coprire più Candidate solo se lo scope quantità è esplicito; non si inventa una chiamata quote per Candidate. Un cambio di parametri, quantità, schema o prezzo invalida il binding. Prima del submit il ledger locale riserva il massimo autorizzato; al completamento registra il costo effettivo e libera la differenza. Il saldo provider resta autorevole, ma la Reservation impedisce overspend concorrente.

### Job lifecycle

Il core normalizza soltanto `queued`, `running`, `succeeded`, `failed`, `cancelled` e `unknown`, conservando sempre stato e payload raw redatto del provider. Il submit è preceduto dalla persistenza di una `SubmissionIntent`; la receipt successiva registra il job ID. Se il processo cade tra le due operazioni, lo stato diventa `reconciling`: si consulta la cronologia usando request hash, timestamp e metadata, senza resubmit automatico.

Retry di polling, rete e download sono automatici con backoff. Un nuovo submit generativo è una nuova candidate potenzialmente a pagamento e richiede quote e autorizzazione nuove, salvo una garanzia provider esplicita di idempotenza e assenza di addebito. Cancel è una capability opzionale: se non supportata, la pipeline smette di attendere ma non dichiara cancellato il job remoto.

### Reference e continuità

Le reference hanno ruoli semantici (`character`, `product`, `location`, `style`, `startFrame`, `endFrame`, `motion`, `voice`) e possono appartenere a un continuity bundle versionato e riutilizzabile tra scene. L'adapter le traduce nei campi e limiti del modello e segnala ruoli ignorati, conversioni ed eccedenze.

### Materializzazione e audit

Un successo provider non è ancora un asset locale. `materialize` scarica immediatamente l'output, verifica MIME/container, durata, dimensioni e codec, calcola SHA-256 e scrive atomicamente nello store content-addressed. Solo allora la candidate è utilizzabile da Remotion. URL firmati o temporanei non entrano nei file versionabili.

Il lockfile conserva il record normalizzato; un audit snapshot raw redatto conserva schema, stati, errori e metadata diagnostici, eliminando token, email, URL temporanei e dati account. Ogni candidate lega intent, piano, quote, reservation, submission, job, output materializzato, provenance, costo e diritti.

### Interfaccia concettuale

```ts
interface GenerationProvider {
  discover(): Promise<CapabilitySnapshot>;
  plan(intent: GenerationIntent, capabilities: CapabilitySnapshot): Promise<GenerationPlan>;
  quote(plan: GenerationPlan): Promise<GenerationQuote>;
  submit(intent: SubmissionIntent): Promise<JobReceipt>;
  poll(job: JobRef): Promise<JobSnapshot>;
  materialize(job: SucceededJob): Promise<MaterializedCandidate>;
  reconcile(intent: UncertainSubmission): Promise<ReconciliationResult>;
  cancel?(job: JobRef): Promise<CancelResult>;
}
```

Higgsfield v1 implementa questo contratto tramite CLI e JSON strutturato; l'MCP potrà sostituire il transport solo dopo contract/parity test negli ambienti target, senza cambiare orchestratore o modello canonico.

## Recursive grilling — depth 2

**Verdict:** contratto pronto dopo hardening. V1 non cambia provider automaticamente: risolve modelli soltanto dentro lo scope adapter autorizzato; un cambio provider richiede nuovo piano/review. Technical Plan e autorizzazione economica sono distinti; ogni Candidate ha un fresh QuoteBinding, non necessariamente una chiamata quote separata. SubmissionIntent lega plan/capability/economic/Reservation/reference hash. Reconcile può terminare `ambiguous|unsupported|unknown`; assenza da history non autorevole non prova mancato submit. MCP richiede parity suite prima di sostituire il CLI. **Residual uncertainty:** lookup/idempotency, batch output, cancellation e billing Higgsfield live.
