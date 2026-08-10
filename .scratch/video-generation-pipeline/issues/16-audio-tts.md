# Definire la pipeline Audio e TTS

Type: grilling
Status: resolved
Blocked by: 03, 04, 06

## Question

Come devono essere pianificati, preventivati, generati, revisionati e sostituiti voice-over TTS, registrazioni umane, musica, ambience, SFX e caption, mantenendo script semantico, timing, pronuncia, diritti, lingue e provider separati dal mix Remotion?

## Answer

L'audio conserva separati contenuto semantico, interpretazioni vocali, asset sonori, timing derivato e mix. Remotion riceve clip già materializzate e policy di mix; non genera, trascrive o scarica audio durante preview/render.

### Script, localizzazione e timing

Lo Script master è l'intenzione semantica. Ogni locale possiede un `LocalizedScript` versionato e revisionabile, collegato alle unità master ma libero di adattare testo, cultura, ritmo e durata. Caption e voice-over derivano dal LocalizedScript approvato.

Lo Script propone timing; la `VoiceCandidate` selezionata è l'autorità temporale effettiva di build per le Utterance coperte. La pipeline ricalcola pause, caption e `resolvedDuration` nel Production Lock/RenderPlan senza sovrascrivere testo o durata richiesta; un delta fuori tolleranza produce una nuova proposta/change report.

### Utterance e candidate

L'Utterance è la più piccola unità parlata indipendentemente generabile o registrabile che conserva una prosodia coerente. TTS e registrazione umana implementano lo stesso contratto VoiceCandidate. Sostituire una sorgente non cambia Storyboard o renderer, ma invalida timing e derivati dipendenti.

Il numero previsto di candidate dipende dal profilo:

- `fast`: una per Utterance;
- `balanced`: due per le Utterance critiche, una per le altre;
- `quality`: fino a tre.

Il preflight quota e riserva tutte le candidate prima del submit. Retake e nuova interpretazione creano candidate immutabili; non sovrascrivono take precedenti.

### Voice Profile e provider

Il `VoiceProfile` descrive locale, accento, registro, ritmo, energia, età percepita, pronuncia e vincoli di consenso. L'adapter lo risolve contro capability e voci live, mostrando alternative e degradazioni. Higgsfield è un adapter candidato iniziale, ma provider, modello e voice ID concreti vivono nel lockfile e vengono scelti in base a schema, qualità, diritti, costo e disponibilità di timing.

### Pronuncia e consenso

Un `PronunciationLexicon` versionato per brand e locale conserva forma scritta, resa fonetica/SSML e pronuncia approvata. Nomi o termini obbligatori non verificati possono bloccare l'approvazione del voice-over.

Voice cloning richiede prova esplicita di consenso con scopo, durata, territori e revocabilità. Un file di riferimento non costituisce consenso; in assenza di prova valida l'adapter rifiuta il submit.

### Registrazioni umane

L'import verifica integrità e formato, segmenta/allinea il take alle Utterance e mappa esplicitamente gli ID dello script. Testo diverso, parti mancanti e take aggiuntive vengono segnalati. Una registrazione non sostituisce implicitamente l'intera lane voice-over.

### Caption

Quando disponibili si usano word timings del provider; altrimenti forced alignment o speech-to-text vengono eseguiti sulla VoiceCandidate selezionata. Le caption sono quindi derivate dall'audio reale, pur restando collegate agli ID dello Script. Ogni output profile sceglie `burn-in`, sidecar SRT/VTT, entrambe o nessuna.

### Musica, ambience e SFX

Ogni asset fornito, stock o generato segue candidate → provenance/diritti → selezione → materializzazione. Nessun audio entra nel render finale senza licenza o diritti verificabili. Le lane canoniche sono voice-over, dialogue, music, ambience e SFX.

Il mix applica policy per output profile: target loudness, true peak, ducking della musica sotto il parlato, fade e limiti. Override manuali sono ammessi e tracciati.

### Invalidazione e deliverable

Una nuova VoiceCandidate invalida timing e caption delle Utterance coperte, poi timing scena, mix, RenderPlan e render dipendenti; rami indipendenti restano current.

Prima del render finale sono bloccanti: file corrotto, durata incoerente, clipping, loudness fuori tolleranza, formato non supportato, pronuncia obbligatoria non verificata, caption fuori sync e diritti/consenso mancanti. I deliverable conservano almeno mix master, stem voice, stem music, stem SFX/ambience, caption richieste e manifest.

## Recursive grilling — depth 2

**Verdict:** pronto dopo timing/change-control e consent hardening. VoiceCandidate governa timing di build ma delta fuori tolleranza produce proposal, non mutazione approvata. Execution Plan risolve un `plannedCandidateCount` intero per Utterance; extra take richiede nuova autorizzazione. Alignment/STT è nodo pianificato con tool/model/confidence/privacy/costo. Voice mode distingue stock/synthetic, identifiable imitation, reference upload, cloning e human performance con transfer/purpose consent. **Residual uncertainty:** provider TTS, region/retention, timing/SSML, tariffe e qualità alignment per lingua.
