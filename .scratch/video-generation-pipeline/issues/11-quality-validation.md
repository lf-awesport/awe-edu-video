# Definire qualità, controlli e criteri di accettazione

Type: grilling
Status: resolved
Blocked by: 03, 05, 06, 07, 16

## Question

Quali controlli deterministici, valutazioni automatiche e review umane devono misurare sincronizzazione, leggibilità, continuità, brand compliance, safe area, qualità audio/video e correttezza delle varianti nei profili `quality`, `balanced` e `fast`?

## Answer

La qualità è un insieme di Quality Requirement indipendenti e versionati, non un punteggio medio. Ogni requisito dichiara scope, metodo, soglia o rubrica, severità, profili applicabili ed evidenza richiesta. Un Validation Result lega l'esito all'hash esatto dell'artefatto e delle dipendenze; i Quality Finding localizzano problemi per scena, layer e intervallo temporale/frame.

### Autorità e risultati

La pipeline distingue quattro autorità:

- `Deterministic Check`: fatto riproducibile come codec, durata, safe area o integrità;
- `Metric Evaluation`: misura confrontata con una soglia, come loudness, sync drift o contrasto;
- `AI Assessment`: giudizio probabilistico su anomalie, continuità o aderenza semantica;
- `Human Review`: decisione creativa, editoriale, linguistica o legale attribuita.

Gli esiti sono `pass`, `fail`, `warning`, `not-applicable`, `unknown` ed `error`; la severità separata è `info`, `warning` o `blocking`. Un validator indisponibile produce `unknown/error`, non un'accusa di difetto sul contenuto. `unknown` non equivale a `pass` e blocca quando il requisito è obbligatorio.

Un AI Assessment registra modello/versione, rubric hash, input hash, sampling e confidence. Può aprire un gate bloccante di review, ma nella prima versione non decide autonomamente la qualità creativa finale. Non viene ripetuto per cercare un risultato favorevole e non supera mai un controllo deterministico fallito.

### Scope, timing e cache

I requisiti possono applicarsi a candidate, layer, scena, transizione, variante, RenderPlan, render e release. Il roll-up superiore è derivato: deve preservare i finding localizzati, non ridurli a un generico `quality failed`.

I controlli vengono eseguiti appena esiste il più piccolo artefatto utile:

```text
ingest       → integrità, metadata, sicurezza, diritti
candidate    → qualità tecnica, durata, anomalie, aderenza
selection    → idoneità creativa e continuità
RenderPlan   → timing, overlap, asset e safe area prevista
preview      → composizione, sincronizzazione, leggibilità
final render → stream effettivi, codec, loudness, caption e varianti
release      → Approval, Claim, diritti, attribuzioni e freshness
```

Il riuso di un Validation Result richiede gli stessi hash di artifact, requisito, evaluator/tool/model, rubrica/soglie, reference/baseline, Output Profile e Production Profile. Cambi non correlati non invalidano l'intera quality suite.

### Profili di produzione

Gli invarianti tecnici, legali e di release sono identici in `fast`, `balanced` e `quality`. I profili cambiano profondità, campionamento, costo e checkpoint:

| Controllo | fast | balanced | quality |
|---|---|---|---|
| Integrità, timing, caption, audio e safe area | completo | completo | completo |
| AI Assessment candidate | failure/scene critiche | candidate selezionate | candidate finaliste |
| Continuità | confini critici | tutti i confini | tutti i confini, analisi profonda |
| Review creativa | master e modifiche critiche | scene chiave, master e varianti | scene, master e tutte le varianti |
| Baseline visuali | gate essenziali | gate dichiarati | regressione completa |

Le policy possono aggiungere controlli, non rimuovere invarianti.

### Integrità, timing e layout

Il render finale viene decodificato integralmente e verificato rispetto all'Output Profile: container, codec, risoluzione, aspect ratio, frame rate, durata/frame count, pixel/color policy, stream audio, timestamp, dimensione e assenza di corruzione, black/freeze non intenzionali o stream mancanti.

Il compiler garantisce i confini matematici; il render verifica gap, doppi frame, tagli di fonema/parola, cue, fade e drift. La tolleranza sync predefinita proposta è due frame, sovrascrivibile soltanto con soglia più appropriata e fonte dichiarata.

Safe area e layout combinano geometria deterministica con misure visuali: overflow, clipping, dimensione e permanenza del testo, collisioni, contrasto reale, densità, velocità di lettura, gerarchia e occlusioni. Il reviewer riceve frame annotati e intervalli problematici.

I controlli economici operano sull'intero stream; quelli costosi usano campioni deterministici content-aware: frame chiave, estremi delle animazioni, punti peggiori e confini di scena. Algoritmo, seed e frame campionati fanno parte dell'evidenza.

### Audio, caption e localizzazione

L'Output Profile dichiara loudness target/tolleranza, true peak, sample rate e channel layout. Si verificano clipping, silenzio/dropout, intelligibilità, rapporto voce/musica, ducking, fade/click, fase, canali e stem. Una correzione produce un nuovo Asset.

Caption e timing derivano dalla Voice Candidate effettiva e vengono confrontati con il Localized Script. Si verificano copertura, locale, ortografia, cue, velocità, line length, righe e corrispondenza fra burn-in e SRT/VTT. Correzioni editoriali restano versionate.

Ogni locale pubblicato richiede copertura, preservazione di Claim e numeri, glossario, pronuncia, CTA/legal text, durata, caption, assenza di residui linguistici e review competente. Una variante tradotta non eredita automaticamente l'Approval linguistica del master.

### Brand, UI, continuità e media generativi

Il Brand Kit permette controlli deterministici su logo, clear space, dimensioni, palette, font, CTA/payoff, sfondi, crop, animazione e co-branding. Assessment e review valutano tono, prominenza e leggibilità contestuale.

UI, numeri, Claim, certificati, classifiche e case study AWE devono derivare da Source Reference o asset verificati. Remotion può ricostruirli e animarli; Higgsfield non è l'autorità sui contenuti della piattaforma.

La continuità è dichiarata nel continuity bundle: identità, ambiente, sguardo, posizione, palette, luce, stato della transizione, direzione del movimento ed elementi UI. Contact sheet e clip di confine supportano AI Assessment e review umana, specialmente per il raccordo fra scene 1, 2 e 13.

I finding generativi distinguono anatomia/identità, deformazioni, testo/logo illeggibile, flicker, instabilità, motion/fisica, background warping, duplicazioni/scomparse, lip-sync, mismatch reference e contenuti inattesi. Parlato visibile usa misura specializzata e review dell'utterance; sostituire l'audio invalida il risultato.

### Varianti e baseline

Una variante preserva gli invarianti semantici del master con override dichiarati. Si verificano scene obbligatorie, Claim/CTA, layer essenziali, traduzione, timing/caption, safe area, logo/attribuzioni, durata e output; un diff distingue cambi attesi da regressioni.

Golden frame e pixel diff si usano per layout Remotion deterministici come logo, certificato, card UI e frame statici. Footage, codec e render multi-macchina usano confronto percettivo o per regioni. Baseline e modifica della baseline sono versionate e reviewabili.

### Review, remediation e accettazione

Il Review Package contiene artifact/hash, scope, player/timecode, intento sorgente, reference/baseline, finding annotati, differenze dalla versione approvata, conseguenze delle decisioni e costo della correzione. Evita log irrilevanti e dati restricted.

Creator, reviewer, owner, legal e reviewer linguistico esercitano autorità per categoria; una persona può ricoprire più ruoli, ma il ruolo usato resta esplicito.

Auto-fix sono ammessi solo per trasformazioni deterministiche e non creative, come transcode, loudness, crop/padding dichiarato, caption alignment, font e metadata. Producono nuovi Asset, lineage, invalidazioni e nuova validazione. Rigenerazioni e modifiche creative sono proposte con limiti di tentativi e Budget; la pipeline non continua finché un evaluator passa.

Un artifact è quality-accepted quando tutti i requisiti applicabili sono valutati, tutti i blocking passano, nessuna evidence è stale, warning/unknown sono risolti secondo policy e Human Review/Waiver richieste sono valide sull'hash esatto.

Non sono derogabili: corruzione/non decodificabilità, proprietà obbligatorie dell'Output Profile impossibili o assenti, audio obbligatorio mancante o gravemente inutilizzabile, layer obbligatorio assente, legal text/attribuzione/CTA obbligatori mancanti, caption obbligatoria assente o errata per lingua/audio, artifact hash diverso, diritti/consenso mancanti, Claim bloccante non verificato e contenuto vietato dalla policy.

### Report, privacy, costo e testabilità

Il Quality Report JSON è autoritativo; CLI e vista HTML sono proiezioni. Include profili/policy, requisiti, risultati, finding, evidence, Review Package, coverage, stale/unknown, Waiver/Approval, costo/durata e roll-up.

Evaluator esterni ricevono bytes soltanto quando classificazione, Rights/Consent Grant e policy autorizzano provider, scopo, regione e retention. Il preflight espone quali dati uscirebbero dal perimetro locale.

Cost Estimate include CPU/GPU, storage di proxy/evidence, API assessment, alignment/STT, render di validazione, campionamento e numero di candidate/varianti. Un validator obbligatorio con costo unknown segue le stesse regole bloccanti degli altri provider.

La futura implementazione deve avere fixture positive e negative per corruzione, drift, caption, safe area, contrasto, loudness/clipping, freeze/black frame, font, regressioni di variante, evidence stale, validator indisponibile e reference/rights mancanti. Il walkthrough AWE applicherà questo contratto, definirà le soglie concrete dei suoi Output Profile e verificherà tutte le 13 scene senza eccezioni ad hoc.

## Recursive grilling — depth 2

**Verdict:** il meta-modello è risolto; criteri concreti richiedono registry compilabile e oracle. Ogni requirement deve avere status/authority, comparator o rubric, threshold/tolerance, fixture e comportamento unknown/error. AI produce finding/escalation, mai Approval; run policy è prefissata, rerun immutabili e niente cherry-picking, con adjudication umana separata. Full decode prova integrità, non creative correctness. I test entrano nel primo tracer che produce l'artefatto, non tutti in T9. **Residual uncertainty:** soglie AWE, evaluator/modelli/costo/data policy e reviewer authority.
