# Progettare il preflight del costo tecnico

Type: grilling
Status: resolved
Blocked by: 01, 02, 04, 06, 16

## Question

Come deve stimare e presentare il preflight i costi minimo, probabile e massimo di API, tentativi, storage, tempo macchina e rendering per scena, master e variante, indicando assunzioni, incertezza e scostamento consuntivo?

## Answer

Il preflight produce un Cost Estimate versionato e approvabile prima di qualsiasi side effect potenzialmente oneroso. Conserva unità native e formule; la conversione monetaria è una vista aggiuntiva, mai un rimpiazzo dei dati sorgente.

### Scenari

- `minimum`: una candidate valida, nessun retry, soli output richiesti;
- `expected`: candidate previste dal profilo più retry storici/probabili;
- `maximum`: candidate autorizzate, retry generativi, varianti e fallback più costosi entro budget.

Ogni scenario espone quantità, formule, assunzioni, fonte e confidence. Il maximum deve rientrare nei Budget applicabili prima dell'esecuzione.

### Unità e conversioni

Le voci mantengono crediti provider, byte/mese, CPU/GPU time, render count, durata e valuta nativa. Conversioni monetarie richiedono tasso verificato, fonte e timestamp; crediti senza conversione ufficiale restano crediti. Costi unknown non diventano zero: indicano causa/confidence e bloccano submit a pagamento salvo stima manuale approvata con margine.

### Quote, validità e margini

Ogni Quote lega request hash, provider, modello/schema/prezzo, timestamp, unità nativa ed `expiresAt`. Cambi a richiesta, schema, tariffa o scadenza invalidano la voce. I margini sono per-linea e dipendono da confidence/volatilità: quote live basse, retry e stime manuali più alte.

Cost Estimate e Approval sono legati agli hash delle Quote. Aumenti oltre soglia o hard budget richiedono nuovo preflight; variazioni entro soglia possono avanzare solo tramite policy versionata con evidence.

### Budget e ledger

I Budget sono gerarchici per progetto, fase, provider, scena/layer e variante; prevale il limite più restrittivo. Prima del submit il ledger crea Reservation e impedisce a processi concorrenti di spendere la stessa disponibilità.

Il ledger distingue `quoted`, `reserved`, `charged`, `refunded` e `unknown`. Failure/cancellazioni non implicano gratuità: transazioni e saldo vengono riconciliati. Un addebito incerto riduce prudentemente il disponibile. Reservation si liberano dopo completamento, cancellazione riconciliata, quote scaduta o abbandono; dopo crash restano `reconciling` finché il provider esclude un addebito.

### Costo totale, incrementale e varianti

Il report mostra:

- `historical`: costo già sostenuto;
- `incremental`: nuova spesa richiesta;
- `total-attributed`: costo tecnico complessivo del deliverable.

Una cache hit ha costo incrementale zero ma conserva il costo storico. Costi condivisi compaiono una volta nel totale progetto; ogni variante mostra costo incrementale e quota attribuita senza doppio conteggio.

### Compute, storage e licenze

Il render locale stima frame, risoluzione, codec, concorrenza, durata, CPU/GPU, RAM e spazio temporaneo. Diventa costo monetario solo con tariffa macchina configurata. Lo storage usa un orizzonte configurabile, default 90 giorni per candidate/intermedi, con retention distinta per selected asset, render, evidence e backup.

Abbonamenti e minimi come Remotion distinguono `fixed`, `marginal` e `allocated`; l'intero costo fisso non viene duplicato su ogni video. Il lavoro umano resta escluso, pur mostrando il numero di review/checkpoint.

### Report e consuntivo

Il drill-down è progetto → fase → provider → variante → scena → layer → candidate, con subtotali minimum/expected/maximum. Tempi iniziali derivano da benchmark/documentazione con confidence bassa e vengono calibrati con metriche storiche per modello, durata, risoluzione e workstation.

Dopo l'esecuzione si confrontano stimato, riservato, addebitato/rimborsato, durata e storage reali, con cause degli scostamenti. La calibrazione aggiorna modelli futuri senza riscrivere preventivi storici.

## Recursive grilling — depth 2

**Verdict:** pronto dopo hardening della concorrenza. Reservation aggiorna atomicamente tutti i Budget gerarchici applicabili o nessuno, per unità nativa, con CAS/fencing; unità incompatibili non sono sommate come authority. `unknown` consuma il massimo riservato fino a evidence provider o adjustment append-only autorizzato; timeout non libera fondi. Maximum enumera ogni paid attempt/fallback autorizzato. Il costo Remotion distingue preview, full render, fixed/minimum e allocated. **Residual uncertainty:** provider privi di transaction lookup possono lasciare unknown permanente con escalation manuale.
