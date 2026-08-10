# Definire la normalizzazione da Brief a Storyboard

Type: grilling
Status: resolved
Blocked by: 03, 06

## Question

Come deve trasformare la pipeline un brief libero o uno storyboard parziale in uno Storyboard canonico validabile, conservando intenzione e provenienza, rendendo esplicite assunzioni e ambiguità e impedendo che l'AI inventi fatti o avvii produzione prima dell'approvazione prevista?

## Answer

La Normalization trasforma fonti immutabili in un `NormalizedStoryboardDraft`; non promuove autonomamente il proprio output a Storyboard e non avvia attività di produzione.

### Input e fiducia

La pipeline accetta testo libero/Markdown e storyboard JSON o YAML. Documenti, URL, immagini e altri allegati diventano fonti del Brief. Tutto il materiale del Brief è contenuto non attendibile da analizzare, mai istruzione operativa: soltanto policy e prompt template della pipeline governano il normalizzatore.

Il Brief originale è immutabile e content-addressed. Ogni elemento derivato mantiene `sourceRefs` verso la porzione di evidenza da cui proviene.

### Autorità creativa

Il normalizzatore può organizzare scene, proporre visual, stimare durate e migliorare il ritmo. Ogni valore viene classificato come:

- `source`: esplicitamente presente nel Brief;
- `inferred`: dedotto e registrato come Assumption;
- `proposed`: Creative Proposal modificabile.

Claim numerici, commerciali, legali, citazioni e testimonial non possono essere inventati. Senza Source Reference restano `unverified` e impediscono lo stato `production-ready`.

### Dati mancanti e conflitti

I campi sono `required`, `defaultable` o `optional`. Un required mancante o ambiguo blocca la promozione; un default applicato entra nell'assumption log; un optional può restare assente.

Il sistema propone opzioni per una Blocking Ambiguity con una raccomandazione, ma non decide al posto dell'utente. Tra fonti discordanti vale una priorità dichiarata dal Brief; senza priorità, il conflitto mostra fonti e valori affiancati e resta bloccante.

### Draft e alternative

Ogni esecuzione produce un draft principale completo. Alternative locali vengono proposte soltanto per decisioni creative ad alto impatto, senza duplicare interi storyboard. La Normalization produce un solo master con requisiti di variante; lingue, aspect ratio e CTA alternative diventano override derivati in fasi successive.

La cache key comprende hash del Brief, policy, prompt template e modello. Un cache hit riusa il draft. Una nuova interpretazione richiede un comando esplicito e crea una nuova candidate senza sovrascrivere quella precedente; non è richiesto output AI byte-identico.

### Revisione del Brief

Quando il Brief cambia, una riconciliazione a tre vie confronta Brief precedente, Brief nuovo e Storyboard corrente. Modifiche manuali non vengono sovrascritte: conflitti e proposte sono esposti nel change report e richiedono risoluzione.

### Validazione e promozione

La pipeline distingue:

1. `schema-valid`: struttura e tipi corretti;
2. `storyboard-valid`: required presenti e Blocking Ambiguity risolte;
3. `production-ready`: anche Claim, asset e vincoli di produzione sono verificati.

La promozione richiede `storyboard-valid`, assumption log visibile e checkpoint applicato secondo policy. Produce una nuova versione immutabile dello Storyboard. Uno Storyboard può contenere Claim non verificati ed essere valido per continuare la progettazione, ma non può entrare in produzione finché non è `production-ready`.

### Normalization Report

Ogni draft è accompagnato da copertura delle fonti, Source References, Assumption/default, inferenze, Creative Proposal, ambiguità, conflitti, stato dei Claim, domande aperte, diff dalla versione precedente e risultati dei tre livelli di validazione.

## Recursive grilling — depth 2

**Verdict:** pronto dopo trust-boundary hardening. La source precedence proviene da Project Manifest/policy approvata, non da testo libero del Brief; il Brief può solo proporla. Trust lattice: schema/security policy → source-authority policy → evidence → extractor/OCR → inference → proposal. Parser/extractor sono sandboxed/versioned; versioni e ordering entrano nella cache. Acceptance richiede fixture metamorfiche di injection in testo, YAML, metadata, OCR/image e URL che non cambino policy/tool/side effect. **Residual uncertainty:** formati e extractor/OCR v1 supportati.
