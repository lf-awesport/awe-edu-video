# Definire il contratto tra storyboard e composizioni Remotion

Type: grilling
Status: resolved
Blocked by: 02, 03

## Question

Come devono essere tradotti modello canonico, asset approvati, audio e varianti in composizioni Remotion mantenendo template estensibili, timing modificabile, preview affidabili e rigenerazione selettiva?

## Answer

Remotion riceve esclusivamente un `RenderPlan` risolto, validato e serializzabile. Storyboard, lockfile, brand kit e asset store vengono compilati prima di entrare nel runtime React; i componenti non leggono stato operativo e non chiamano provider.

```text
Storyboard + Lockfile + BrandKit + OutputProfile
                       │
                       ▼
                 PlanCompiler
                       │
                       ▼
           RenderPlan + immutable staging
                       │
                       ▼
                  Remotion Video
```

### Renderer registry

Ogni tipo di layer viene risolto tramite un registry. Un plugin dichiara identificatore, schema Zod, renderer React, capability, aspect ratio supportati, safe area, layout strategy, dipendenze asset e fallback. Le scene sono dati composti da layer; non richiedono un componente custom. Sono possibili plugin branded come `awe.certificate`, senza inserire eccezioni AWE nel core.

### Composizioni

- `Video` è la composizione parametrica principale e riceve RenderPlan più variant ID.
- `ScenePreview` isola una scena per review e debug.
- `LayerPreview` è opzionale e diagnostica un singolo renderer.

Il numero di composizioni non cresce con scene e varianti. `calculateMetadata()` deriva durata in frame, dimensioni, fps e default di encoding dal RenderPlan.

### Compilazione e timing

Il PlanCompiler applica ereditarietà e override, risolve asset selezionati, brand token, script, timing e output profile. Converte secondi razionali e millisecondi caption in frame interi una sola volta, usando confini cumulativi per evitare gap, sovrapposizioni involontarie e drift.

Se un layer supera la durata authored, il compiler produce una proposta di build con `resolvedDuration`, scene successive, transizioni e durata totale ricalcolate; il change report mostra la differenza rispetto a `requestedDuration`. La proposta è applicabile automaticamente solo entro una tolleranza/policy approvata e prima del checkpoint pertinente; altrimenti richiede nuova revisione. Durate negative, layer senza fine e dipendenze cicliche sono errori di compilazione.

Le transizioni sono edge tra scene e specificano se la durata si sovrappone o si aggiunge. Il compilatore produce intervalli di frame non ambigui prima del render.

### Asset e determinismo

Ogni RenderPlan crea uno staging immutabile identificato dal proprio hash:

```text
render-bundles/<render-plan-hash>/
├── plan.json
├── assets/
├── fonts/
├── captions/
└── provenance.json
```

Lo staging contiene link o copie verificate degli asset content-addressed, font approvati con licenza/hash e caption normalizzate. Remotion usa soltanto path/URL relativi stabili; non dipende da URL provider, CDN, Google Fonts o font di sistema. Nessuna generazione, download o mutazione avviene durante preview o render.

### Varianti responsive

Le varianti ereditano il master. Ogni renderer dichiara layout strategy, safe area, crop/reframe, breakpoint, dimensione minima del testo e incompatibilità. Il compilatore seleziona una strategia supportata o fallisce/degrada secondo policy; il semplice scaling geometrico non equivale a supporto della variante.

### Studio e render selettivo

Remotion Studio è read-only rispetto al progetto: naviga RenderPlan, scene e layer ma non riscrive storyboard, lockfile o approvazioni. Le modifiche si effettuano nei file canonici e richiedono ricompilazione.

`ScenePreview`, `LayerPreview`, `frameRange` e profili low-resolution accelerano review e diagnostica. Master e varianti finali vengono sempre renderizzati integralmente da un RenderPlan fissato; per la prima versione non si implementa cache per-scena più stitching, perché complicherebbe transizioni, audio continuo e compatibilità codec.

### Audio e caption

Il RenderPlan mantiene lane separate per voice-over, dialogue, music, ambience e SFX, con clip, timing, trim, loop e volume espliciti. Remotion produce il mix finale. Le caption restano collegate agli ID semantici dello script, usano millisecondi nel dato intermedio e frame soltanto nel piano compilato.

### Output

Ogni master o variante produce una chiamata `renderMedia()` distinta con codec, risoluzione, qualità e audio espliciti. Bundle React e asset staging possono essere riusati quando i rispettivi hash non cambiano, ma non si assume riuso di frame tra render. Ogni output registra hash del RenderPlan, impostazioni renderer, checksum del file e provenance.

## Recursive grilling — depth 2

**Verdict:** boundary corretto dopo hardening. RenderPlan è self-contained; Variant ID è metadata, non lookup. Overflow produce resolved build proposal e change report, non mutazione silenziosa dello Storyboard. Studio props sono transient diagnostics e render parziali non promotable. Link di staging devono restare nel bundle, puntare a content-addressed target e passare hash verification. Deterministic PlanCompiler e byte-identità MP4 sono claim distinti; il final richiede full decode. **Residual uncertainty:** equivalenza media cross-platform, symlink policy Linux/macOS e soglia di timing materialmente approvabile.
