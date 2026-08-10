# Definire il modello canonico del progetto video

Type: grilling
Status: resolved
Blocked by:

## Question

Qual è il modello di dominio minimo ma universale che rappresenta brief, storyboard, scene o segmenti, timeline, track, asset, voice-over, brand, varianti, vincoli e intenzione creativa senza dipendere da Higgsfield o Remotion?

## Answer

Il modello canonico è dichiarativo, gerarchico e provider-neutral. Lo storyboard rimane leggibile per scene, mentre la precisione operativa vive nei layer. Il dominio non contiene componenti React né campi Higgsfield: gli adapter traducono il modello verso i rispettivi runtime.

### Struttura

```text
Project
├── Brief
├── BrandKitRef
├── Script[]
├── Master
│   ├── Scene[]
│   │   └── Layer[]
│   └── Transition[]
├── Variant[]
├── OutputProfile[]
└── PolicyProfile
```

- **Project** possiede identità stabile, versione dello schema, locale predefinita e riferimenti alle sorgenti.
- **Scene** è l'unità narrativa leggibile, ordinabile, approvabile e rigenerabile.
- **Layer** è l'unità tecnica indipendente all'interno di una scena. I tipi core sono footage, image, text, audio, caption, UI, shape ed effect; altri tipi arrivano da plugin con schema, renderer e capability dichiarate.
- **Transition** vive sull'edge tra due scene e dichiara durata, modalità di sovrapposizione e layer coinvolti.
- **Variant** eredita dal master e contiene soltanto override indirizzati tramite ID stabili; non duplica l'intero storyboard.
- **BrandKit** è versionato e centralizza token semantici e asset; i layer possono applicare override locali espliciti.
- **Script** è semantico e separato dall'audio: battute/narrazione contengono speaker, locale, testo e intenzione. TTS, registrazione umana, caption e timing sono derivati versionati dello stesso script.

### Timing

I layer usano start e durata relativi alla scena. La timeline globale viene calcolata dall'ordine delle scene, dal timing risolto per la build e dalle regole delle transizioni. Lo Storyboard conserva `requestedDuration` come intent; Production Lock e RenderPlan congelano `resolvedDuration`, motivo, confidenza e differenza. Un'ottimizzazione non sovrascrive l'intenzione originale e, se materialmente diversa, richiede una nuova revisione approvata.

### Generazione e asset

Un layer generativo conserva la **generation request** (intent, provider/model suggerito, prompt, parametri e reference) separata dal **selected asset**. Ogni candidate prodotta è immutabile, content-addressed e accompagnata da hash, provenance, costo e diritti. Il render usa sempre un asset selezionato fissato; la rigenerazione è esplicita, crea una nuova candidate e non sovrascrive risultati precedenti.

### Stato e riproducibilità

La specifica dichiarativa descrive lo stato desiderato. Un lockfile/manifest generato separato registra risoluzioni concrete: versioni di provider e schema, job, candidate, asset selezionati, hash, costi, approvazioni, timing risolti e render. Lo storyboard non viene inquinato con stato volatile e il database non è la fonte primaria nella prima versione local-first.

### Invarianti

1. Ogni entità indirizzabile ha un ID stabile e unico nel progetto.
2. Ogni render punta a una versione della specifica e a un lockfile immutabile.
3. Nessuna chiamata generativa parte implicitamente durante preview o render.
4. Ogni layer generativo deve avere un preflight prima del submit e un selected asset prima del render finale.
5. Gli override delle varianti non possono modificare implicitamente il master.
6. Gli adapter possono conservare parametri provider-specifici in un namespace dedicato, ma il core non ne dipende.
7. Le unità temporali authoring sono razionali/secondi; i frame vengono derivati dall'output profile per evitare che il dominio dipenda dagli fps.

## Recursive grilling — depth 2

**Verdict:** modello valido dopo chiarimento di cardinalità e autorità. Project ha `0..n` revisioni Storyboard e `0..1` promossa corrente; Scene può avere `0..n` Layer a livello draft, mentre compile richiede contenuto renderizzabile o blank/placeholder tipizzato. `requestedDuration` è intent authored; il timing effettivo dipendente da audio/output vive in Production Lock/RenderPlan e non muta lo Storyboard. Preference/pin authored non autorizza auto-selection cross-provider; job/output/Candidate hanno cardinalità esplicita. **Residual uncertainty:** necessità v1 di Candidate multi-output e soglia per promuovere un timing delta in nuova revisione creativa.
