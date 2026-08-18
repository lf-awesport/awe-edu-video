# AWE master copy review

Prepared on 2026-08-18 for [GitHub issue #2](https://github.com/lf-awesport/awe-edu-video/issues/2).
The owner approved the recommended fallback package, CTA 1 and the Italian
pronunciation “Aue” on 2026-08-18. The approved copy is locked in canonical
Storyboard `awe-master@1.1.0`; its compiled RenderPlan hash is
`sha256:4c1b775b6f97fa61e41bc478b462760158afbc00d3ad286422a3d196d134fd2d`.
Current Storyboard `awe-master@1.2.0` is a visual-only opening revision and
preserves this approved copy verbatim. The separately approved balanced timing
and selected audiovisual media compile to RenderPlan
`sha256:54cf44400f27009235e143c2d534dd4aa7b13f374e7e6ffd7224539d67d0709d`
(3048 frames / 101.6 seconds); they do not revise the copy authority.
This Approval covers editorial wording and pronunciation only. It does not make
the current internal preview releasable or authorize paid TTS synthesis.

## Approved outcome

The release copy keeps supported wording and uses the safer revisions for scenes
4–12. Unsupported numbers, points, certificate, fixed duration, licensing,
internship and live-session Claims are not dependencies of Storyboard `1.1.0`.
Scene 13 uses CTA 1: “Porta la formazione sportiva nella tua community. Scopri
AWE Sport Education.” The source register retains the removed Claims as decision
history and provenance; reintroducing one requires its own evidence and Approval.

## Scene matrix

| Scene | Previous copy | Evidence status | Approved release copy | Decision |
|---|---|---|---|---|
| 01 | Ti piace lo sport? Bene. Ma sai come funziona davvero l’industria che c’è dietro? | Creative hook; no factual Claim. | Keep. | Approved. |
| 02 | Lascia che ti faccia vedere. | Creative transition; no factual Claim. | Keep. | Approved. |
| 03 | AWE Sport Education presenta una piattaforma web dedicata alla formazione nel mondo dello sport business. | Supported by `SRC-AWE-01`, subject to immutable capture and owner approval. | Replace “sport business” with “business dello sport”. | Approved. |
| 04 | All’interno, gli utenti trovano un percorso strutturato su 12 aree chiave dello sport business, con oltre 400 video brevi in lingua inglese e più di 1200 quiz per misurare ciò che hanno imparato. | **Blocked:** 12 courses do not prove 12 areas; 400+ and 1200+ have no registered source. | **Fallback:** “All’interno, gli utenti trovano un percorso strutturato dedicato al business dello sport, con video, test e quiz per mettere alla prova ciò che hanno imparato.” | Approved. |
| 05 | Il formato è veloce e accessibile, con contenuti brevi e un’esperienza che accompagna l’utente passo dopo passo. | Partial: platform/learning approach supported; “short” and full wording need approval. | “Il percorso propone contenuti e attività che accompagnano l’utente passo dopo passo.” | Approved. |
| 06 | Grazie alla gamification, ogni utente può avanzare nel percorso, accumulare punti, testare le proprie competenze e scalare la classifica. | Partial: tests, quizzes and rankings supported; points are not registered evidence. | “Grazie alla gamification, ogni utente può avanzare nel percorso, mettersi alla prova con test e quiz e confrontarsi nella classifica.” | Approved. |
| 07 | Al termine, chi completa con successo le attività riceve un certificato finale che attesta le competenze acquisite. | **Blocked:** no registered certificate source or authorized template. | **Fallback:** “Attività e verifiche accompagnano l’utente lungo il percorso e valorizzano le competenze sviluppate.” | Approved. |
| 08 | Per il partner, la piattaforma diventa uno spazio completamente personalizzabile, adattabile alla propria identità visiva, integrando logo, colori e branding. | Supported generally by `SRC-AWE-01`; exact partner assets and grants still required. | “Per il partner, la piattaforma diventa uno spazio personalizzabile, adattabile alla propria identità visiva con logo, colori e contenuti brandizzati.” | Approved. |
| 09 | Il partner può anche inserire contenuti formativi dedicati, come case studies concreti legati alla propria realtà. La piattaforma diventa così un canale per condividere il proprio know-how e valorizzare il proprio ruolo nella sport industry. | Supported generally by `SRC-AWE-01`; each case shown needs an exact source and grant. | “Il partner può integrare contenuti formativi e casi studio legati alla propria realtà, condividendo competenze ed esperienza nel settore dello sport.” | Approved. |
| 10 | La durata del progetto è fino a un massimo di due mesi. | **Blocked:** no registered authoritative source. | **Fallback:** “Durata e modalità del progetto vengono definite insieme al partner, in base ai suoi obiettivi.” | Approved. |
| 11 | Durante questo periodo, il partner può rendere disponibile la piattaforma al proprio target — fan, utenti, community, studenti o stakeholder — attraverso un sistema di licenze e mettere in palio premi per i più meritevoli: merchandising, esperienze e stage. | **Blocked/partial:** prizes and experiences supported; licensing, target access, merchandising and internships are not. | **Fallback:** “Il partner può coinvolgere la propria community e valorizzare la partecipazione con premi ed esperienze dedicate.” | Approved. |
| 12 | Il partner ha inoltre la possibilità di interagire direttamente con gli utenti tramite sessioni live. | **Blocked:** registered source supports interviews, not live sessions. | **Fallback:** “Il progetto può creare occasioni di incontro e confronto dedicate agli utenti.” | Approved. |
| 13 | CTA da definire. | Previously blocked: no approved CTA/payoff. | “Porta la formazione sportiva nella tua community. Scopri AWE Sport Education.” | CTA 1 approved. |

## CTA alternatives

1. **Recommended:** “Porta la formazione sportiva nella tua community. Scopri AWE Sport Education.”
2. “Trasforma il know-how sportivo in un’esperienza che coinvolge. Scopri AWE Sport Education.”
3. “Forma. Coinvolgi. Cresci con AWE Sport Education.”

The CTA is a creative proposal. It must not imply an unverified offer or become
authoritative merely because it appears here.

## Pronunciation decisions

The owner approved the spoken form of:

- `AWE`: approved as **“Aue” with Italian vowels**, ending in Italian `/e/`;
  it MUST NOT sound like the English exclamation “awe” or end in `/i/` as “aui”;
- `AWE Sport Education`: pronounce the brand token as “Aue”; review the English
  words in the generated Candidate before selection;
- any retained English terms. The recommended copy replaces `case studies`,
  `know-how` and `sport industry` with Italian wording to reduce ambiguity.

The TTS normalization is `AWE → Aue`. This spelling is an implementation aid,
not a brand-copy change, and the generated result still requires listening
approval because providers may choose different stress or vowel transitions.

## Approval record

- **Authority:** project owner.
- **Approved:** recommended scene package, fallback wording, CTA 1 and `AWE → Aue`.
- **Canonical Storyboard:** `awe-master@1.1.0`.
- **RenderPlan:** `sha256:4c1b775b6f97fa61e41bc478b462760158afbc00d3ad286422a3d196d134fd2d`.
- **Visual review:** scenes 4, 6, 7 and 10–13 reviewed at 1920×1080; removed
  Claims and the old CTA are absent, with no blocking clipping.
- **Remaining gate:** generated pronunciation and voice quality require listening
  approval. Paid provider use requires a separate explicit Budget authorization.
