# AWE 13-scene walkthrough / Walkthrough AWE in 13 scene

**Candidate normative annex. Effective status inherits the parent specification (`in-review`); it becomes implementation authority only when that parent is approved. / Allegato normativo candidato; status ereditato dalla specifica padre.** Applicable requirement IDs for every scene: **RELEASE-001–RELEASE-005, MODEL-003, MODEL-005, PROVIDER-003, QUALITY-001, RIGHTS-001–RIGHTS-003, COST-001, COST-005**. Every MUST/SHOULD/MAY below is attributable to those IDs. The user-provided Storyboard/working Brief is narrative authority subject to Claim verification; E01 and prototype branch `prototype/awe-walkthrough` commit `2411d71710ecd857406c62e78c2c558d591f84c4` are supplementary historical/replay evidence, not implementation or release evidence.

Common gates / Gate comuni: all scenes MUST use selected, materialized, hash-bound Assets and selected VoiceCandidate build timing; Claims, UI and branding MUST use captured Source References, never generated footage as authority. The authored scene durations total a requested 85 s; resolved duration MAY differ only through an explicit timing proposal/change report and approved Output Profile policy. Every scene remains internal-preview-only until its blockers close. Cost `unknown` MUST NOT become zero. Higgsfield MUST be used only for exactly 5 s footage in S1 and S13; S13's final 3 s MUST be Remotion. / Durate authored = 85 s richiesti; durata risolta può cambiare solo con proposta/change report e policy approvata.

**Current internal-preview selection (2026-08-18):** `awe-livia-balanced@1.0.0`
resolves the unchanged 85-second authored storyboard to 3048 frames / 101.6
seconds. It binds one local 48 kHz PCM Livia voice asset per scene and selected
footage for S1/S13 by SHA-256. This is review evidence, not production authority;
rights, approved captures, loudness/mix and release approval remain open.

## Stable Claim registry / Registro Claim stabile

These IDs are normative dependencies for the scene bindings below. `supported` describes current discovery evidence, not release approval: every supporting source still requires an authorized immutable capture/hash and freshness review. `partial` and `unverified` block the unsupported portion from production use. / Questi ID sono dipendenze normative. `supported` non equivale a release approval; `partial` e `unverified` bloccano la parte non supportata.

| Claim ID | Scene | Status | Current discovery support / Supporto discovery corrente |
|---|---:|---|---|
| `claim-platform-web-sport-business` | 3 | supported | `SRC-AWE-01`, subject to immutable capture and owner approval |
| `claim-12-areas` | 4 | unverified | `SRC-AWE-01` proves 12 courses, not equivalence to 12 key areas |
| `claim-400-videos` | 4 | unverified | no registered authoritative source |
| `claim-1200-quizzes` | 4 | unverified | no registered authoritative source |
| `claim-fast-accessible-short-format` | 5 | partial | accessible education is described by `SRC-AWE-01`; “short” format and the complete commercial wording require approval/evidence |
| `claim-gamification-points-ranking` | 6 | partial | tests/quizzes/rankings/prizes supported by `SRC-AWE-01`; points, badges, levels and achievements require exact evidence before depiction |
| `claim-final-certificate` | 7 | unverified | no registered authoritative source/template |
| `claim-custom-branding` | 8 | supported | customized campuses and branded content in `SRC-AWE-01`, subject to exact partner assets/grants |
| `claim-partner-content-case-studies` | 9 | supported | branded content and case studies in `SRC-AWE-01`, subject to exact shown case/source |
| `claim-two-month-duration` | 10 | unverified | no registered authoritative source |
| `claim-licensing-target-access` | 11 | unverified | no registered authoritative source for licensing/target access |
| `claim-rewards-merch-experience-internship` | 11 | partial | prizes/experiences supported by `SRC-AWE-01`; merchandising and internships require exact evidence |
| `claim-live-sessions` | 12 | unverified | `SRC-AWE-01` supports interviews, not live sessions |
| `claim-final-cta` | 13 | unverified | CTA/payoff not yet defined or approved |

## Stable timing and layer bindings / Binding stabili di timing e layer

Each Scene references one initial Utterance ID owned by its LocalizedScript. Semantic `cue-*` IDs bind token spans in that Utterance, not guessed timestamps; after a VoiceCandidate is selected, word timing or forced alignment MUST resolve each semantic cue to an exact half-open frame boundary in RenderPlan. Structural `boundary-*` and `segment-*` IDs do not bind words: the compiler MUST derive them from resolved Scene boundaries, Transition semantics or fixed provider/compositor constraints. Until every applicable cue and boundary is resolved, the scene is not render-ready. Unless a row narrows it, base visual, selected audio and captions cover `[scene-start, scene-end)`; every cue-triggered visual Layer—including text, UI, logo, image/icon, shape and effect—enters at its cue and remains through the exclusive `scene-end`, while explicit switch/replacement rules end the preceding Layer at the next cue. A continuity last-frame Asset refers to frame `scene-end - 1`, never to the exclusive boundary itself. T5/T7 MAY refine exits and animation envelopes without renaming IDs or changing narrative order, through a new reviewed Storyboard/RenderPlan revision. / Ogni scena referenzia un Utterance ID posseduto dal LocalizedScript. I cue semantici legano span di token e la VoiceCandidate selezionata DEVE risolverli; boundary e segment strutturali derivano invece da Scene, Transition o vincoli provider/compositor. Ogni Layer visuale attivato da cue resta fino al boundary esclusivo salvo switch/exit esplicito; l'Asset dell'ultimo frame indica `scene-end - 1`. I refinement POSSONO cambiare envelope, non ID o ordine narrativo, tramite nuova revisione.

| Scene | Utterance ID | Ordered semantic cues, structural boundaries/segments and normative layer binding / Cue semantici ordinati, boundary/segment strutturali e binding layer | Claim dependencies |
|---:|---|---|---|
| 1 | `utt-s01-01` | `cue-s01-hook` → protagonist/office emphasis; `cue-s01-industry` → phone presentation emphasis. `boundary-s01-end` is the exclusive compiler-resolved scene end; `continuity-asset-s01-last-frame` captures the centered phone at frame `boundary-s01-end - 1` for S2. Footage/UI/audio/caption cover full scene. | none |
| 2 | `utt-s02-01` | `cue-s02-show` → push through the centered phone into the AWE EDU splash. Transition, audio and caption cover the full `[scene-start,boundary-s02-end)` segment; exclusive `boundary-s02-end` equals S3 start, and its prior displayed frame is the approved continuity frame. Remotion, not generated footage, owns the real logo/UI transition. | none |
| 3 | `utt-s03-01` | `cue-s03-brand` → logo enters; `cue-s03-platform` → UI shell begins; `cue-s03-sport-business` → panels complete. Base UI spans full scene. | `claim-platform-web-sport-business` |
| 4 | `utt-s04-01` | `cue-s04-areas` → 12-area card; `cue-s04-videos` → 400+ card; `cue-s04-quizzes` → 1200+ card. Base UI spans full scene; each Claim layer enters at its cue. | `claim-12-areas`, `claim-400-videos`, `claim-1200-quizzes` |
| 5 | `utt-s05-01` | `cue-s05-fast` → desktop state; `cue-s05-short` → video/quiz state; `cue-s05-step` → mobile/swipe state. Device/UI layers switch only at resolved cues. | `claim-fast-accessible-short-format` |
| 6 | `utt-s06-01` | `cue-s06-progress` → XP/progress; `cue-s06-points` → points/badges only if evidenced; `cue-s06-test` → quiz; `cue-s06-ranking` → ranking end state. | `claim-gamification-points-ranking` |
| 7 | `utt-s07-01` | `cue-s07-complete` → certificate enters; `cue-s07-certificate` → name/signature/seal reveal. Certificate layer remains to scene end. | `claim-final-certificate` |
| 8 | `utt-s08-01` | `cue-s08-partner` → base partner campus; `cue-s08-custom` → token transition; `cue-s08-brand` → final partner logo/palette state. | `claim-custom-branding` |
| 9 | `utt-s09-01` | `cue-s09-content` → branded course; `cue-s09-case-study` → case-study card; `cue-s09-know-how` → partner value/end state. | `claim-partner-content-case-studies` |
| 10 | `utt-s10-01` | `cue-s10-duration` → timeline starts; `cue-s10-two-months` → two-month marker/milestones. | `claim-two-month-duration` |
| 11 | `utt-s11-01` | `cue-s11-targets` → user network; `cue-s11-licences` → licensing layer; `cue-s11-rewards` → reward cards; `cue-s11-internships` → internship card only if evidenced. | `claim-licensing-target-access`, `claim-rewards-merch-experience-internship` |
| 12 | `utt-s12-01` | `cue-s12-interact` → speaker/live shell; `cue-s12-live` → chat/Q&A/reactions only if evidenced. | `claim-live-sessions` |
| 13 | `utt-s13-01` | CTA text remains unresolved. Structural `segment-s13-higgsfield` is `[scene-start,scene-start+5s)` and `segment-s13-remotion` is `[scene-start+5s,boundary-s13-end)`; semantic `cue-s13-cta` MUST resolve inside the Remotion segment after CTA/script/audio approval. | `claim-final-cta` |

## Scene 01 / Scena 01 — 5 s
- **VO (working Brief, complete / completo):** “Ti piace lo sport? Bene. Ma sai come funziona davvero l’industria che c’è dietro?”
- **Visual intent / Intento:** young professional at desk, eye contact, real platform on monitor / giovane professionista, sguardo in camera, piattaforma reale sul monitor. **Layers:** `footage`, `ui`, `image/logo`, `audio`, `caption`, `ambience`.
- **Technique/provider responsibility:** Each planned Higgsfield Candidate MUST be an immutable 5 s/720p cinematic footage output; the balanced plan MUST request and materialize two such Candidates for this scene. Remotion MUST composite verified monitor UI/logo/captions. Fallback: authorized live footage or approved still + Remotion camera move. / Ogni Candidate Higgsfield pianificata DEVE essere un output cinematografico immutabile 5 s/720p; balanced DEVE richiederne e materializzarne due. Remotion compositing; fallback footage/still autorizzato.
- **Assets + Source Reference:** materialized footage Candidate; verified AWE UI/BrandKit (`SRC-AWE-01`, `SRC-AWE-02` only for their exact excerpts); protagonist reference. **Role:** generation creates subject/office footage; references constrain subject/UI; continuity bundle anchors identity, office, gaze, light, palette and S1 end frame for S2/S13.
- **Timing/dependencies:** 5 s; approved final boundary feeds S2. **Approval/review:** Candidate Selection separately, creative/brand/legal review. **Quality gate:** decode, face/anatomy/gaze/flicker, authentic UI, S1→S2/S13 continuity. **Provenance/rights/consent:** AI/model/terms lineage, UI Rights Grant, protagonist likeness/reference Consent Grant. **Cost/blocker:** expected scene cost is the sum of the two fresh `QuoteBinding` amounts for its balanced Candidates; observed 12.5 each is a dated `PriceObservation` only. Blocked by fresh bindings/Budget, selected Candidate, UI/logo rights and protagonist consent.

## Scene 02 / Scena 02 — 3 s
- **VO:** “Lascia che ti faccia vedere.”
- **Visual intent:** push into monitor and enter digital world. **Layers:** `footage|image`, `effect`, canonical `transition`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion only; deterministic crop/scale on approved still is fallback. **Assets + Source Reference:** selected S1 boundary and verified S3 screenshot (`SRC-AWE-01/02` only as applicable). **Role:** no generation; first/last-frame references define transition; continuity carries monitor geometry, palette and motion.
- **Timing/dependencies:** exact S1 end/S3 start, no gap/double frame. **Approval/review:** both reference hashes and transition review. **Quality gate:** continuity, boundary math, readability. **Provenance/rights/consent:** transformed Asset inherits intersection of parents and records lineage. **Cost/blocker:** generation 0; Remotion compute/licence unknown; blocked until parent selections/rights and transition approval are current.

## Scene 03 / Scena 03 — 6 s
- **VO:** “AWE Sport Education presenta una piattaforma web dedicata alla formazione nel mondo dello sport business.”
- **Visual intent:** logo and UI assemble progressively. **Layers:** `ui`, `image/logo`, `text`, `shape`, `effect`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion from real assets; fallback is approved screenshot composition, never generated UI. **Assets + Source Reference:** current logo/BrandKit and captures; `SRC-AWE-01` supports platform description and `SRC-AWE-02` supports captured navigation/powered-by only. **Role:** no generation; references are content authority; continuity follows S2 monitor entry and BrandKit.
- **Timing/dependencies:** reveals follow semantic VO units. **Approval/review:** product/brand, UI freshness and source excerpt. **Quality gate:** logo clear-space, font/palette/contrast/safe area and UI fidelity. **Provenance/rights/consent:** capture timestamp/hash and logo/UI grants. **Cost/blocker:** generation 0; compute/licence unknown; blocked by verified current UI/BrandKit assets, grants and approved safe area.

## Scene 04 / Scena 04 — 8 s
- **VO:** “All’interno, gli utenti trovano un percorso strutturato su 12 aree chiave dello sport business, con oltre 400 video brevi in lingua inglese e più di 1200 quiz per misurare ciò che hanno imparato.”
- **Visual intent:** 12 areas, 400+, 1200+, video and quiz. **Layers:** `ui`, `text/Claim`, `image/icon`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion only; fallback MUST be an approved revision removing/replacing unsupported Claims. **Assets + Source Reference:** real UI; `SRC-AWE-01` supports 12 courses, not equivalence to 12 key areas; 400+/1200+ need new authoritative evidence. **Role:** no generation; references govern every number; continuity is graphic/brand rhythm.
- **Timing/dependencies:** dense 8 s; selected voice controls resolved duration and downstream frames. **Approval/review:** owner/legal Claim approval, then script/audio/layout separately. **Quality gate:** source-bound text, reading rate, caption sync, required layers. **Provenance/rights/consent:** exact excerpts and UI grants. **Cost/blocker:** generation 0; audio/render unknown; blocked by 12-course→12-area mapping and 400+/1200+ sources.

## Scene 05 / Scena 05 — 6 s
- **VO:** “Il formato è veloce e accessibile, con contenuti brevi e un’esperienza che accompagna l’utente passo dopo passo.”
- **Visual intent:** desktop/mobile scroll, swipe, video, quiz. **Layers:** desktop/mobile `ui`, `footage`/screencast, `effect`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion with real screenshots/screencasts; verified screenshot sequence fallback. **Assets + Source Reference:** current UI; `SRC-AWE-02` supports only captured Categorie/Corsi/Cerca Corsi/Classifica navigation and powered by Sportwig. **Role:** no generation; references bind UI; continuity maps desktop/mobile states and variant layout.
- **Timing/dependencies:** gestures/cuts on VO cues; mobile is explicit override. **Approval/review:** product/UI and variant review. **Quality gate:** fidelity, legibility, clipping/crop/safe area. **Provenance/rights/consent:** capture hash/time and platform/device grants. **Cost/blocker:** generation 0; compute unknown; blocked by current authorized captures and output/safe-area policy.

## Scene 06 / Scena 06 — 8 s
- **VO:** “Grazie alla gamification, ogni utente può avanzare nel percorso, accumulare punti, testare le proprie competenze e scalare la classifica.”
- **Visual intent:** XP, badges, levels, achievements, ranking. **Layers:** `ui`, `text`, `shape`, `image/icon`, `effect`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion; fallback MUST show only evidenced features. **Assets + Source Reference:** `SRC-AWE-01` supports tests/quizzes/rankings/prizes; any badge/level needs exact source/asset. **Role:** no generation; references govern feature mapping; continuity is sequential state and brand palette.
- **Timing/dependencies:** reveal by VO concept, end on ranking. **Approval/review:** editorial mapping + brand. **Quality gate:** no invented values/features, density/contrast/golden frames. **Provenance/rights/consent:** per-icon/UI source and grant. **Cost/blocker:** generation 0; compute unknown; blocked by real approved UI/icon assets for every depicted mechanic.

## Scene 07 / Scena 07 — 5 s
- **VO:** “Al termine, chi completa con successo le attività riceve un certificato finale che attesta le competenze acquisite.”
- **Visual intent:** certificate, signature, seal, demo name. **Layers:** `ui/document`, `text`, `image/logo`, `shape`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion from real template; fallback release is approved scene removal/copy change. **Assets + Source Reference:** authoritative certificate evidence/template required; no current registered source supports it. **Role:** no generation; template/reference is content authority; continuity follows BrandKit.
- **Timing/dependencies:** reveal within 5 s; signature/seal source-bound. **Approval/review:** owner/legal/brand and controlled demo PII. **Quality gate:** verified Claim, required template and legibility. **Provenance/rights/consent:** template/signature/logo grants and privacy basis. **Cost/blocker:** generation 0; compute unknown; blocked by certificate Claim, authorized template and grants.

## Scene 08 / Scena 08 — 9 s
- **VO:** “Per il partner, la piattaforma diventa uno spazio completamente personalizzabile, adattabile alla propria identità visiva, integrando logo, colori e branding.”
- **Visual intent:** live UI rebranding. **Layers:** `ui`, brand tokens, `image/logo`, `text`, `effect`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion deterministic token transition; approved before/after screenshots fallback. **Assets + Source Reference:** `SRC-AWE-01` supports customized campuses/branded content; authorized demo partner BrandKit required. **Role:** no generation; references prove capability/assets; continuity maps token states and co-branding.
- **Timing/dependencies:** 9 s deterministic transition. **Approval/review:** AWE/partner brand for master and variant. **Quality gate:** palette, logo clear-space, contrast, UI regression. **Provenance/rights/consent:** both brands' grants/co-branding policy. **Cost/blocker:** generation 0; compute unknown; blocked by partner assets/grants and approved co-branding rules.

## Scene 09 / Scena 09 — 8 s
- **VO:** “Il partner può anche inserire contenuti formativi dedicati, come case studies concreti legati alla propria realtà. La piattaforma diventa così un canale per condividere il proprio know-how e valorizzare il proprio ruolo nella sport industry.”
- **Visual intent:** branded courses and case-study cards. **Layers:** `ui`, `image`, `text`, `logo`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion; generic but source-bound approved card fallback. **Assets + Source Reference:** `SRC-AWE-01` supports branded content/case studies generally; each shown case study/copy needs exact current source and partner asset. **Role:** no generation; references bind identities/copy; continuity uses partner BrandKit from S8.
- **Timing/dependencies:** dedicated content → partner value beats. **Approval/review:** partner/editorial/brand. **Quality gate:** exact case-study correctness, legibility, freshness. **Provenance/rights/consent:** screenshot/logo/content grants. **Cost/blocker:** generation 0; compute unknown; blocked by approved specific case-study assets/copy and partner rights.

## Scene 10 / Scena 10 — 5 s
- **VO:** “La durata del progetto è fino a un massimo di due mesi.”
- **Visual intent:** timeline and milestones. **Layers:** `shape/timeline`, `text/Claim`, `image/icon`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion; fallback is approved copy without duration. **Assets + Source Reference:** authoritative commercial/contract source required, secureRef if restricted. **Role:** no generation; contract reference is Claim authority; continuity is brand motion.
- **Timing/dependencies:** 5 s, cue on “due mesi”. **Approval/review:** owner/legal. **Quality gate:** Claim verified, timing and readability. **Provenance/rights/consent:** evidence hash/time/authority, restricted bytes not embedded. **Cost/blocker:** generation 0; compute unknown; blocked by current two-month evidence and approval.

## Scene 11 / Scena 11 — 9 s
- **VO:** “Durante questo periodo, il partner può rendere disponibile la piattaforma al proprio target — fan, utenti, community, studenti o stakeholder — attraverso un sistema di licenze e mettere in palio premi per i più meritevoli: merchandising, esperienze e stage.”
- **Visual intent:** user network and reward cards. **Layers:** `ui/network`, `text/Claim`, `image/icon`, `effect`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion; fallback MUST narrow copy/visuals to evidenced facts. **Assets + Source Reference:** `SRC-AWE-01` supports prizes/experiences; licences, merchandising and internships need scoped authoritative sources/assets. **Role:** no generation; references bind each offer; continuity tracks network/reward states.
- **Timing/dependencies:** dense list in 9 s, reading/caption cues. **Approval/review:** owner/legal/partner. **Quality gate:** Claim-level provenance, readability, semantic completeness. **Provenance/rights/consent:** offer source and reward imagery grants. **Cost/blocker:** generation 0; compute unknown; blocked by licence/internship/merchandising evidence and authorized reward assets.

## Scene 12 / Scena 12 — 5 s
- **VO:** “Il partner ha inoltre la possibilità di interagire direttamente con gli utenti tramite sessioni live.”
- **Visual intent:** live speaker/chat/Q&A/reactions. **Layers:** `ui`, `footage|image`, `text/chat`, `image/icon`, `audio`, `caption`.
- **Technique/provider responsibility:** Remotion from real UI/media; fallback may depict only documented interviews after approved copy revision. **Assets + Source Reference:** `SRC-AWE-01` supports interviews, not live sessions; explicit live source and real UI required. **Role:** no generation; source governs feature; continuity captures speaker/UI state.
- **Timing/dependencies:** speaker entry/reaction on 5 s cues. **Approval/review:** Claim/editorial and speaker consent. **Quality gate:** verified live Claim, non-fabricated chat, legibility. **Provenance/rights/consent:** speaker likeness/voice Consent and UI Rights Grant. **Cost/blocker:** generation 0; compute unknown; blocked by live-session evidence, approved UI and speaker consent.

## Scene 13 / Scena 13 — 8 s
- **VO:** “CTA da definire.”
- **Visual intent:** camera leaves monitor, returns to opening office/protagonist, then logo/payoff/CTA. **Layers:** `footage`, canonical `transition`, `image/logo`, `text/CTA`, `audio`, `caption`, `music|sfx`.
- **Technique/provider responsibility:** Higgsfield MUST create only the first 5 s footage; Remotion MUST create the final 3 s exit/compositing/CTA. Fallback: authorized S1 reuse/reframe + Remotion. **Assets + Source Reference:** S1 continuity bundle, selected 5 s Candidate, approved logo/payoff/CTA and music/SFX. **Role:** generation supplies return footage only; references constrain protagonist/office and source-bound brand/CTA; continuity MUST match S1 identity, office, gaze, palette/light and motion.
- **Timing/dependencies:** exactly 5 s Higgsfield + 3 s Remotion; no 8 s provider-price extrapolation. **Approval/review:** Candidate/continuity, owner/brand/legal CTA and final release. **Quality gate:** identity/environment match, clean transition, mandatory readable CTA/logo, audio/caption/final-frame checks. **Provenance/rights/consent:** AI lineage, protagonist consent, logo/music/SFX grants. **Cost/blocker:** expected scene cost is the sum of the two fresh `QuoteBinding` amounts for its balanced Candidates; observed 12.5 each is a dated `PriceObservation` only; Remotion/audio unknown. Blocked by CTA/payoff, fresh bindings/Budget, selected Candidate, continuity approval, rights/consent and release gates.

**Authored duration invariant / Invariante durata authored:** `5+3+6+8+6+8+5+9+8+5+9+5+8 = 85 s requested`. The resolved build MUST retain and explain any delta; exact 85 s resolved is required only when an approved Output Profile says so. The balanced example MUST plan exactly four 5 s/720p Candidates total (two S1, two S13); expected total equals the sum of the four fresh `QuoteBinding` amounts. The dated 12.5/candidate and 50 total remain `PriceObservation` examples only. / 85 s è requested; il totale atteso è la somma dei quattro QuoteBinding freschi; 12,5/50 sono osservazioni storiche.
