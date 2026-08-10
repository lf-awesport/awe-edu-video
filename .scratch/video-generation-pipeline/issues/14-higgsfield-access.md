# Acquisire una sessione Higgsfield rappresentativa

Type: task
Status: resolved
Blocked by:

## Question

È disponibile un account Higgsfield sul piano candidato alla produzione con cui autorizzare l'MCP, senza condividere token, così da acquisire schemi `tools/list` redatti, osservare un job minimo submit→poll→result e verificare prezzi, crediti e limiti effettivi necessari a chiudere la ricerca sull'adapter?

## Answer

Successo parziale rispetto alla domanda originale. Il CLI ufficiale Higgsfield è autenticato localmente, il workspace è selezionato e l'account dispone di un piano a pagamento. `model list`, `model get ... --json` e cost discovery funzionano. Questo prova accesso per discovery, non rappresentatività produttiva. Non sono stati acquisiti MCP `tools/list`, submit→poll→result, actual charge, concurrency/rate limits o termini/policy account applicabili. Nessun token, indirizzo email o saldo viene registrato nel repository.

## Recursive grilling — depth 2

**Verdict:** risolto solo come accesso CLI discovery. Il possesso di crediti non equivale ad autorizzazione di spesa/upload né idoneità produttiva. Un futuro `provider doctor` deve catturare timestamp, CLI version, schema hash e terms reference redatti, distinguendo metadata auditabili da email/token/saldo vietati. Live smoke richiede Execution Plan, Budget, data classification e terms review. **Residual uncertainty:** piano/workspace del pilot, no-training/confidenzialità, regione/limiti e supporto MCP nello stesso account.
