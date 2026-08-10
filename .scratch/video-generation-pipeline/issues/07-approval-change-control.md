# Definire approvazioni e controllo delle modifiche

Type: grilling
Status: resolved
Blocked by: 03, 06, 15, 16

## Question

Come devono funzionare policy `manual`, `auto`, `skip` e `on-failure`, versioni degli artefatti, ottimizzazione automatica del timing e change report reversibile senza rendere implicite o distruttive le decisioni creative?

## Answer

Approval, Validation, Candidate Selection e Waiver sono concetti distinti. Le policy configurano i checkpoint decisionali, ma non trasformano failure tecniche, legali o di sicurezza in pass.

### Approval immutabili e granulari

Ogni Approval lega identità/ruolo o policy versionata a un artifact hash, dependency hash e scope esatti: progetto, scena, layer, candidate, script, audio, RenderPlan, variante o render. Layer e scene avanzano indipendentemente; lo stato progetto aggrega Approval mancanti, superseded, scadute e bloccanti.

Quando cambia un dependency hash, l'Approval precedente resta nell'audit log come `superseded` e non si trasferisce alla nuova versione. Approvazioni creative scadono per invalidazione; Approval legate a licenze, consensi, prezzi o Claim ereditano anche la scadenza della fonte.

### Ruoli

Gli attori hanno ruoli semantici `creator`, `reviewer`, `owner` e `legal`, anche se nella prima versione possono coincidere. La policy stabilisce separazione dei compiti e auto-approval. L'autore può auto-approvare lavoro creativo interno quando consentito, ma non consenso, diritti, Waiver o release finale che richiedano owner/legal.

### Policy di checkpoint

- `manual`: il DAG attende una decisione esplicita;
- `auto`: crea Approval soltanto quando Validation e soglie versionate passano;
- `skip`: non crea il checkpoint;
- `on-failure`: richiede review quando Validation, costo o degradazione superano le soglie.

Ogni transizione registra policy hash/versione, evidence, soglie, valori osservati e artifact hash. Cambiare policy non riscrive decisioni passate.

### Esiti e batch

Gli esiti sono `approve`, `reject`, `request-changes` e `waive-validation`. Reject, request changes e Waiver richiedono motivazione; approve può avere commento. Un batch mostra l'insieme chiuso prima della conferma e crea record individuali per ogni hash, mai una regola dinamica che approvi artefatti futuri.

### Validation e Waiver

`skip` non supera una Validation fallita. Un Waiver esplicito conserva failure, rationale, attore autorizzato, scope e scadenza. Non sono derogabili: consenso mancante per volto/voice cloning, diritti d'uso obbligatori assenti, file corrotto/non renderizzabile, artifact hash diverso da quello approvato e impossibilità tecnica dell'output richiesto.

Budget insufficiente richiede aumento del budget. Claim non verificati sono ammessi in preview interne ma impediscono un deliverable production-ready.

### Selezione, varianti e revoca

Candidate Selection sceglie l'asset usato dal piano; Approval lo giudica accettabile. Sono eventi separati. Un'Approval del master vale per una variante soltanto quando artifact e Validation hash sono identici; crop, layout, traduzione, audio, caption e CTA modificati richiedono decisioni specifiche o auto-policy della variante.

Revocare Approval, consenso o licenza non cancella il record: aggiunge revoca, causa e autore. I dipendenti diventano stale/blocked. Render esistenti restano auditabili ma non pubblicabili.

### Ottimizzazione, change report e rollback

Ottimizzazioni automatiche di testo, timing o layout producono proposte, non mutazioni di artefatti approvati. Applicarle crea una nuova versione e invalida i dipendenti tramite hash.

Il change report mostra diff semantico per scena/layer, causa, prima/dopo, dipendenti invalidati, Approval superseded, variazioni timing/costo, degradazioni e Validation cambiate. Il rollback seleziona una versione precedente come base di una nuova revisione: non riscrive event log o decisioni successive.

### Release

Un render completato non è automaticamente pubblicabile. Diventa `releasable` soltanto quando il Release Manifest lega hash, output profile, Approval richieste, Validation, Waiver valide, diritti e assenza di dipendenze stale.

## Recursive grilling — depth 2

**Verdict:** pronto dopo separazione identity/authority. Ogni Approval lega un Authority Snapshot verificabile; un profilo locale non può auto-attribuirsi legal/rights/release authority. La validità corrente è ricalcolata a use time da tutte le expiry/revoche senza mutare il record storico. Required `unknown|error|missing` attiva `on-failure`. Bundle import è idempotente, anti-replay e authority-bound; bundle non verificabile resta untrusted. **Residual uncertainty:** identity/signature provider concreto e policy di validità dell'autorità dopo la decisione storica.
