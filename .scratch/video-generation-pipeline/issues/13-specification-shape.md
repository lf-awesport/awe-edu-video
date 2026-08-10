# Definire struttura e handoff della specifica bilingue

Type: grilling
Status: resolved
Blocked by: 12, 17

## Question

Quale struttura bilingue deve avere la specifica finale affinché decisioni, diagrammi, schema, contratti, workflow, walkthrough AWE, cost model, rischi e criteri di accettazione siano non ambigui e direttamente convertibili in tracer-bullet ticket d'implementazione?

## Answer

La specifica finale è un pacchetto Markdown bilingue, versionabile e in stato `0.9.0 in-review`, sotto `docs/video-pipeline/`. Le due lingue hanno pari autorità semantica; gli identificatori tecnici restano canonici in inglese. Dopo l'approvazione, specifiche e allegati normativi diventano l'autorità di implementazione. I ticket Wayfinder restano storia decisionale e rationale, non una seconda fonte contrattuale.

### Artefatti

```text
docs/video-pipeline/
├── SPEC.it.md
├── SPEC.en.md
├── glossary.md
├── requirements.csv
├── traceability.csv
├── sources.md
├── risks.md
├── awe-input-checklist.md
├── awe-walkthrough.md
├── rollout.md
├── schemas/
│   ├── canonical-model.md
│   ├── normalization.md
│   ├── provider-contract.md
│   ├── audio.md
│   ├── render-plan.md
│   ├── assets-rights.md
│   ├── approval.md
│   ├── cost-preflight.md
│   ├── quality.md
│   ├── cli-project-layout.md
│   └── manifests.md
├── examples/
│   ├── awe-project.yaml
│   ├── provider-lifecycle.json
│   ├── invalidation.json
│   └── release-manifest.json
└── diagrams/README.md
```

Markdown e dati testuali sono autoritativi; PDF/HTML futuri sono derivati. Asset reali/restricted e il project fixture AWE privato restano fuori Git.

### Struttura bilingue

Entrambe le specifiche condividono 22 sezioni `S00–S21`: document control, executive summary, scope, utenti/workflow, ubiquitous language, principi, modello, normalizzazione, orchestrazione, provider, audio, Remotion, asset/diritti, Approval, costo, qualità, CLI, sicurezza/recovery, walkthrough AWE, rollout, rischi/open input e traceability.

I blocchi distinguono `Normative`, `Rationale`, `Example — non-normative`, `Evidence snapshot` e `Open input`. `MUST`, `MUST NOT`, `SHOULD` e `MAY` hanno significato normativo dichiarato. Gli stessi 70 Requirement ID compaiono nello stesso ordine in italiano e inglese, con prefissi per dominio.

### Contratti shared

Gli allegati normativi evitano duplicazione e definiscono entità, identity, ownership, required reference, mutabilità, cardinalità, stati, invalidazioni e failure. Includono esempi validi/invalidi senza pretendere di essere JSON Schema o TypeScript compilabile prima di T1.

Il walkthrough AWE è autosufficiente come scenario: contiene tutte le 13 scene e 85 secondi requested, VO completo, layer, provider/fallback, asset/fonti, continuità, Approval, qualità, diritti, costo e blocker. Claim ID, Utterance ID e cue semantici sono stabili; i cue vengono risolti in frame dalla Voice Candidate, mentre boundary/segment strutturali derivano dal compiler. Non vengono inventati timestamp privi di audio approvato.

Il rollout definisce T1–T10 con ipotesi falsificabile, percorso osservabile, scope/non-scope, failure principale, artefatti, dipendenze ed exit gate. T1–T3 sono principalmente seriali; i rami successivi possono avanzare in parallelo quando i contratti richiesti sono stabili.

### Evidence, costo e open input

Il Source Register separa working Brief, pagine AWE, evidence Higgsfield, documentazione/licenza Remotion e prototipo storico. Gli URL live non sono Release Evidence: servono capture/hash o `secureRef`, excerpt, authority e freshness.

La Price Observation di 12,5 crediti per una Candidate `seedance_2_0_mini` da 5 s/720p e l'esempio da 50 crediti sono evidence datata non normativa. Il requisito stabile è la somma dei quattro `QuoteBinding` freschi che coprono le Candidate pianificate, con invalidazione al drift/scadenza. Nessun saldo provider viene persistito.

Restano registrati e fail-closed: Claim AWE non verificati, CTA/payoff, Asset/BrandKit reali, Rights/Consent Grant, output/loudness/safe-area, Quote fresche, Remotion licence/costo, TTS/alignment, musica/SFX, compute, storage ed evaluator.

### Handoff

`requirements.csv` indicizza i Requirement ID senza duplicarne il testo. `traceability.csv` collega ogni requisito a G0 o a uno dei tracer T1–T10, test pianificato ed evidence. G0 e T1–T10 sono il dependency backbone del futuro backlog; la scomposizione in ticket esecutivi richiede una nuova autorizzazione e mantiene tracer end-to-end.

Il ciclo documentale è `draft → in-review → approved → superseded`, con versioning semantico. La baseline 1.0 richiede review product, tecnica, legal/rights e bilingue per i rispettivi scope. Le modifiche normative successive producono change proposal, impatto, traceability e revisione delle due lingue.

### Verifica

Il pacchetto è stato verificato con:

- 22 section ID identici e ordinati nelle due lingue;
- 70 Requirement ID identici, unici, indicizzati e tracciati;
- tracer limitati a G0 e T1–T10;
- 14 Claim ID AWE stabili;
- 13 scene e 85 secondi requested, distinti dalla durata risolta di build;
- JSON validi e YAML parsato con PyYAML;
- tutti i link relativi risolti;
- `git diff --check` senza errori;
- review esperta finale `GO` sui contratti AWE di timing, Claim e Candidate.

Il pacchetto è completo per la review e l'approvazione della specifica; non dichiara il video AWE production-ready e non avvia implementazione.

## Recursive grilling — depth 2

**Verdict:** pronto per review formale e backlog decomposition, bloccato come implementation authority. `0.9 in-review` rende MUST/MUST NOT proposte normative; lo status degli allegati eredita quello parent. Divergenza IT/EN è spec defect bloccante. La baseline richiede Specification Approval Record hash-bound con file/annex, scope, authority e dissenso. La traceability corrente prova copertura nominale, non conformità: dopo G0 deve puntare a test/fixture/evidence ID esistenti e supportare verifiche a più tracer. **Residual uncertainty:** quorum/authority di approvazione e quali open input bloccano 1.0 rispetto al solo T10.
