# Validare l'architettura sullo storyboard AWE

Type: prototype
Status: resolved
Blocked by: 04, 05, 06, 07, 08, 09, 10, 11

## Question

Il modello e il workflow proposti riescono a descrivere senza eccezioni ad hoc tutte le 13 scene AWE, dalla normalizzazione al master e alle varianti, producendo per ogni scena strategia, asset, provider, fallback, timing, controlli, provenance e preflight economico credibile?

## Answer

La rappresentazione concettuale copre tutte le 13 scene attraverso i contratti canonici senza eccezioni AWE note. Non è ancora una prova di conformità implementativa: richiede una fixture compilabile in T7 e input reali in T10. L'evidenza primaria storica è il [prototipo throwaway](../prototypes/awe-walkthrough.html), catturato sul branch `prototype/awe-walkthrough` al commit `2411d71710ecd857406c62e78c2c558d591f84c4`.

Il prototipo contiene un percorso guidato scena per scena, una matrice di copertura e un simulatore di stato per happy path e failure. È una specifica interattiva, non implementazione della pipeline.

### Strategia delle 13 scene

| Scene | Tecnica principale | Ruolo della generazione | Gate distintivo |
|---|---|---|---|
| 1 | Higgsfield footage + compositing Remotion | protagonista/ufficio, clip 5 s | volto, consent, continuity e UI monitor reale |
| 2 | Remotion | nessuna | raccordo fra frame approvati S1 e S3 |
| 3 | Remotion + asset reali | nessuna | logo, Brand Kit e UI source-bound |
| 4 | Remotion + asset reali | nessuna | Claim 12 aree, 400+ e 1200+ |
| 5 | Remotion + screenshot/screencast | nessuna | responsive layout e autenticità UI |
| 6 | Remotion + asset reali | nessuna | gamification mostrata solo per feature provate |
| 7 | Remotion + template reale | nessuna | certificato come Claim e asset obbligatorio |
| 8 | Remotion + brand token | nessuna | co-branding e varianti partner |
| 9 | Remotion + case study reali | nessuna | Source Reference e diritti partner |
| 10 | Remotion | nessuna | durata massima come Claim contrattuale |
| 11 | Remotion + reward asset reali | nessuna | licenze, premi e stage source-bound |
| 12 | Remotion + UI reale | nessuna | sessioni live e consent speaker |
| 13 | Higgsfield 5 s + chiusura Remotion 3 s | continuity con S1, non UI/CTA | CTA, identità, logo, consent e release |

Higgsfield è limitato al footage cinematografico delle scene 1 e 13. UI, numeri, certificati, timeline, classifiche, case study, live session e branding vengono costruiti in Remotion da fonti reali. Il raccordo nel monitor è una Transition canonica, non una capacità speciale del provider.

### Fonti e Claim

Le pagine ufficiali AWE verificate durante il walkthrough supportano:

- 12 corsi, ma non provano automaticamente l'equivalenza con “12 aree chiave”;
- piattaforma con video, test, quiz, classifiche, premi, esperienze e colloqui;
- campus digitali personalizzati e contenuti brandizzati;
- disponibilità di case study;
- navigazione Categorie, Corsi, Cerca Corsi e Classifica, con piattaforma powered by Sportwig.

Restano bloccanti per la release finché non ricevono Source Reference adeguate:

- equivalenza fra 12 corsi e 12 aree chiave;
- oltre 400 video in inglese;
- oltre 1200 quiz;
- certificato finale;
- durata del progetto fino a due mesi;
- sistema di licenze e stage;
- sessioni live;
- CTA e payoff finali.

Il modello gestisce correttamente questa incompletezza: le scene sono previewable con watermark/policy interna, ma non production-ready o releasable. Fallback editoriali possono rimuovere o sostituire Claim soltanto come nuova revisione approvata.

### Timing, varianti e invalidazione

Le durate richieste sommano esattamente 85 secondi. La Voice Candidate resta l'autorità temporale. Lo scenario di retake della scena 4 da 8 a 10 secondi dimostra che il compiler può estendere la scena, spostare di 60 frame i confini successivi a 30 fps e invalidare RenderPlan, caption, mix, preview e render senza rigenerare il footage indipendente delle scene 1 e 13.

Lo scenario verticale 9:16 dimostra che una layout strategy può fallire chiusa quando crop/reframe perde logo o CTA essenziali. La variante usa gli stessi contratti master/override, Quality Requirement e Approval; non richiede un renderer AWE-specifico.

### Failure e governance

Gli scenari di free play confermano che:

- un crash dopo submit Higgsfield conserva Submission Intent e Reservation in `reconciling`, senza resubmit automatico;
- una nuova candidate della scena 1 richiede nuovo nonce, Quote e Reservation e non sovrascrive la precedente;
- una revoca di Rights Grant rende stale/blocked i dipendenti e non releasable i render esistenti, conservandoli per audit;
- Claim mancanti bloccano la release ma non i rami indipendenti del DAG;
- il Release Manifest diventa valido soltanto nell'happy path con hash, Approval, Validation e diritti current.

Questi casi attraversano gli stati e gli oggetti già decisi: Scene, Layer, Transition, Asset, Claim, Candidate, Quote, Reservation, Validation Result, Approval, RenderPlan e Release Manifest. Nessuno richiede un'eccezione nel core.

### Preflight credibile ma incompleto

La sola Price Observation acquisita è 12,5 crediti per `seedance_2_0_mini`, 5 secondi, 720p; non contiene i campi sufficienti per una Quote autorizzativa. Il profilo `balanced` del prototipo usa due Candidate per ciascuna delle scene 1 e 13:

```text
4 candidate × 12,5 crediti = 50 crediti Higgsfield
```

Non viene estrapolato alcun prezzo ad altre durate. Il saldo provider comunicato in precedenza non è persistito come autorità. Quote freshness e Budget devono essere rivalidati prima del submit.

Restano `unknown` finché non vengono configurati o quotati: TTS/alignment, musica/SFX, compute Remotion, storage, eventuali evaluator esterni e costo/licenza Remotion. Il prototipo propone 1920×1080, 16:9, 30 fps, H.264/AAC e 48 kHz stereo; loudness e safe area restano valori provisional con fonte richiesta.

### Verdetto

Il modello supera il walkthrough concettuale: ogni scena dispone di layer, provider/fallback, timing, Approval, quality gate, provenance/rights e costo. I gap osservati non provano un'incapacità del modello, ma asset/rights/timing/provider reali possono ancora falsificarne i contratti durante T7/T10.

Prima dell'implementazione restano quindi due attività di handoff: definire un rollout tracer-bullet che riduca i rischi emersi e consolidare la specifica bilingue finale.

## Recursive grilling — depth 2

**Verdict:** scenario architetturale pronto, acceptance proof bloccata. Il prototipo non valida cardinalità/schema/compiler. Servono una fixture sintetica compilabile a 13 scene e un overlay privato AWE con inventory redatta/hashata. Placeholder devono essere tipizzati, watermarked e non-promotable. Le durate sommano 85 s requested; la resolved duration dipende dalla VoiceCandidate e deve spiegare delta. Ogni scena deve avanzare per stato `structurally-mapped→source-ready→audio-timed→render-ready→release-ready`. **Residual uncertainty:** Claim/CTA, asset/grant/consent reali, audio approvato e continuità Higgsfield S1/S13.
