# AWE master copy review

Prepared on 2026-08-18 for [GitHub issue #2](https://github.com/lf-awesport/awe-edu-video/issues/2).
This is a review artifact, not an Approval. The current VoiceOver remains the
authoritative working Brief until the owner chooses a revision and the selected
copy is written to the Storyboard with a stable hash.

## Recommendation

Keep the current copy where registered sources support it. For scenes 4, 7, 10,
11 and 12, use the safer fallback unless product/legal supplies the missing
evidence. The fallback preserves the narrative role while removing unsupported
numbers, certificate, duration, licensing, internship and live-session Claims.

## Scene matrix

| Scene | Current copy | Evidence status | Recommended release copy | Decision needed |
|---|---|---|---|---|
| 01 | Ti piace lo sport? Bene. Ma sai come funziona davvero l’industria che c’è dietro? | Creative hook; no factual Claim. | Keep. | Approve tone. |
| 02 | Lascia che ti faccia vedere. | Creative transition; no factual Claim. | Keep. | Approve tone. |
| 03 | AWE Sport Education presenta una piattaforma web dedicata alla formazione nel mondo dello sport business. | Supported by `SRC-AWE-01`, subject to immutable capture and owner approval. | Keep, replacing “sport business” with “business dello sport” only if preferred for pronunciation. | Approve wording. |
| 04 | All’interno, gli utenti trovano un percorso strutturato su 12 aree chiave dello sport business, con oltre 400 video brevi in lingua inglese e più di 1200 quiz per misurare ciò che hanno imparato. | **Blocked:** 12 courses do not prove 12 areas; 400+ and 1200+ have no registered source. | **Fallback:** “All’interno, gli utenti trovano un percorso strutturato dedicato al business dello sport, con video, test e quiz per mettere alla prova ciò che hanno imparato.” | Supply evidence for all three numbers, or approve fallback. |
| 05 | Il formato è veloce e accessibile, con contenuti brevi e un’esperienza che accompagna l’utente passo dopo passo. | Partial: platform/learning approach supported; “short” and full wording need approval. | “Il percorso propone contenuti e attività che accompagnano l’utente passo dopo passo.” | Approve current claim or safer wording. |
| 06 | Grazie alla gamification, ogni utente può avanzare nel percorso, accumulare punti, testare le proprie competenze e scalare la classifica. | Partial: tests, quizzes and rankings supported; points are not registered evidence. | “Grazie alla gamification, ogni utente può avanzare nel percorso, mettersi alla prova con test e quiz e confrontarsi nella classifica.” | Supply points evidence, or approve fallback. |
| 07 | Al termine, chi completa con successo le attività riceve un certificato finale che attesta le competenze acquisite. | **Blocked:** no registered certificate source or authorized template. | **Fallback:** “Attività e verifiche accompagnano l’utente lungo il percorso e valorizzano le competenze sviluppate.” | Supply certificate evidence/template, or approve fallback. |
| 08 | Per il partner, la piattaforma diventa uno spazio completamente personalizzabile, adattabile alla propria identità visiva, integrando logo, colori e branding. | Supported generally by `SRC-AWE-01`; exact partner assets and grants still required. | “Per il partner, la piattaforma diventa uno spazio personalizzabile, adattabile alla propria identità visiva con logo, colori e contenuti brandizzati.” | Approve wording and demo partner assets. |
| 09 | Il partner può anche inserire contenuti formativi dedicati, come case studies concreti legati alla propria realtà. La piattaforma diventa così un canale per condividere il proprio know-how e valorizzare il proprio ruolo nella sport industry. | Supported generally by `SRC-AWE-01`; each case shown needs an exact source and grant. | “Il partner può integrare contenuti formativi e casi studio legati alla propria realtà, condividendo competenze ed esperienza nel settore dello sport.” | Approve wording and shown case. |
| 10 | La durata del progetto è fino a un massimo di due mesi. | **Blocked:** no registered authoritative source. | **Fallback:** “Durata e modalità del progetto vengono definite insieme al partner, in base ai suoi obiettivi.” | Supply contractual evidence, or approve fallback. |
| 11 | Durante questo periodo, il partner può rendere disponibile la piattaforma al proprio target — fan, utenti, community, studenti o stakeholder — attraverso un sistema di licenze e mettere in palio premi per i più meritevoli: merchandising, esperienze e stage. | **Blocked/partial:** prizes and experiences supported; licensing, target access, merchandising and internships are not. | **Fallback:** “Il partner può coinvolgere la propria community e valorizzare la partecipazione con premi ed esperienze dedicate.” | Supply evidence for omitted offers, or approve fallback. |
| 12 | Il partner ha inoltre la possibilità di interagire direttamente con gli utenti tramite sessioni live. | **Blocked:** registered source supports interviews, not live sessions. | **Fallback:** “Il progetto può creare occasioni di incontro e confronto dedicate agli utenti.” | Supply live-session evidence, or approve fallback. |
| 13 | CTA da definire. | **Blocked:** no approved CTA/payoff. | **Recommended:** “Porta la formazione sportiva nella tua community. Scopri AWE Sport Education.” | Approve or replace CTA. |

## CTA alternatives

1. **Recommended:** “Porta la formazione sportiva nella tua community. Scopri AWE Sport Education.”
2. “Trasforma il know-how sportivo in un’esperienza che coinvolge. Scopri AWE Sport Education.”
3. “Forma. Coinvolgi. Cresci con AWE Sport Education.”

The CTA is a creative proposal. It must not imply an unverified offer or become
authoritative merely because it appears here.

## Pronunciation decisions

Before full TTS synthesis, approve the spoken form of:

- `AWE`: letter-by-letter English, Italianized spelling, or established brand pronunciation;
- `AWE Sport Education`: English pronunciation or approved Italianized delivery;
- any retained English terms. The recommended copy replaces `case studies`,
  `know-how` and `sport industry` with Italian wording to reduce ambiguity.

## Approval response format

The owner can resolve the editorial choice compactly:

```text
Scenes 01–03: keep
Scene 04: evidence | fallback
Scene 05: current | fallback
Scene 06: evidence | fallback
Scene 07: evidence | fallback
Scenes 08–09: current | recommended
Scene 10: evidence | fallback
Scene 11: evidence | fallback
Scene 12: evidence | fallback
Scene 13: CTA 1 | CTA 2 | CTA 3 | custom: ...
AWE pronunciation: ...
Authority: product/brand/legal roles or names
```

Evidence-backed choices remain blocked until the relevant source is captured,
hashed and approved. Choosing a fallback permits copy lock without asserting the
removed Claim.
