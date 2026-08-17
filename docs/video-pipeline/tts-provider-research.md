# TTS provider decision for the AWE Italian preview

**Observed 2026-08-11; decision scope:** the 13-scene, Italian, `internal-preview-only` fixture. This is implementation research, not a quote or legal opinion. Only provider-operated documentation, pricing and terms were used. Voice cloning, voice design and uploaded reference voices are out of scope.

## Decision

**Internal-preview default — Higgsfield `text2speech_v2`, `seed_speech`, preset voice.** Live CLI discovery and an authorized smoke on 2026-08-11 proved that the `Livia` preset supports Seed Speech and produces intelligible standard Italian. Fresh, non-authorizing observations total **4.00 credits** for one Candidate per Scene and **5.90 credits** under the current balanced assumption; the Scene 1 smoke consumed 0.20 credits. Its 6.648 s result exceeded the authored 5 s by 1.648 s and is therefore materialized but blocked pending a timing proposal, caption alignment and rights evidence. Higgsfield also exposes `qwen_audio_tts` with `language=it` and a much lower observed cost, but two reasoned attempts using catalog presets were rejected before job creation as unavailable for Qwen Audio; the CLI does not expose the required compatibility mapping, so Qwen is not currently an operable pipeline choice. The CLI returns completed media through `result_url`, but no word/character alignment or safe materialization command; T5 therefore needs controlled URL download and validated local alignment.[^hf-cli]

**Production-oriented default — ElevenLabs direct API, paid Starter (or higher), stock voice, `eleven_multilingual_v2`.** The direct API remains preferable when provider timing should be authoritative because its timestamp endpoint returns audio and alignment together. Higgsfield's current terms do not restrict commercial use of Outputs, including on the free plan, but its service may use retained content to improve models; account deletion starts a 30-day deletion process and cannot remove content already incorporated into model improvement.[^hf-terms] Privacy approval therefore remains required for either Higgsfield or ElevenLabs.

For ElevenLabs, call `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps`, choosing an approved stock `voice_id` returned by `GET /v1/voices`; request the default MP3 or an allowed WAV format. The endpoint returns the audio as base64 plus start/end times for every original and normalized character, and supports a versioned pronunciation dictionary. The model is explicitly recommended by ElevenLabs for content creation, supports Italian, and has a 10,000-character per-request limit—well above every scene here.[^el-timing][^el-models] Persist the decoded bytes immediately in the pipeline's content-addressed asset store with request/response provenance. This creates an immutable pipeline asset; ElevenLabs does **not** document an immutable provider-hosted download URL, so the provider history must not be the authority.

This is the smallest defensible T5 path because one response supplies both the candidate audio and caption alignment; no forced-alignment/STT node is needed for the first implementation (alignment still needs the validation required by `audio.md`). Use a paid plan: ElevenLabs' terms limit free users to non-commercial use, while paid users may use output commercially; its help center likewise says Free has no commercial licence and paid plans do (excluding Beta Services).[^el-terms][^el-commercial] Starter is currently shown at **$6/month** and includes 60,000 Multilingual v2/v3 characters.[^el-price] Disable all cloning/design paths in the adapter and allowlist only reviewed stock voice IDs.

**Fallback — Google Cloud Text-to-Speech WaveNet, `it-IT-Wavenet-E` (female) or `it-IT-Wavenet-F` (male).** Use the documented synchronous `POST https://texttospeech.googleapis.com/v1/text:synthesize` API and save its base64 `audioContent` as the immutable local asset.[^g-api] Google lists both Italian WaveNet stock voices and describes WaveNet as GA/general-purpose with SSML control.[^g-voices] For captions, generate SSML with a uniquely named `<mark>` before each word and request `SSML_MARK` timepoints. Google documents `<mark>`, but warns against consecutive/rapid marks and marks with no intervening audio; the explicit `enable_time_pointing = SSML_MARK` response is documented in **v1beta1**, not on the v1 REST method page.[^g-ssml][^g-timepoints] Therefore this fallback has a mandatory preflight spike: prove word-mark timepoints against Italian punctuation/numbers on the exact deployed endpoint, or plan forced alignment. It is not as small as the default.

## Fit and evidence

| Requirement | ElevenLabs default | Google fallback |
|---|---|---|
| Italian stock synthetic voice | Multilingual v2 explicitly includes `it`; stock IDs can be listed.[^el-models][^el-timing] | Explicit `it-IT-Wavenet-E/F` stock voices.[^g-voices] |
| Download/materialize | Base64 audio in the timing response.[^el-timing] | Base64 audio in synchronous response.[^g-api] |
| Caption timing | Direct original and normalized character start/end arrays.[^el-timing] | Authored word marks, subject to the v1beta1/preflight caveat—not native word timestamps.[^g-timepoints] |
| Pronunciation | Up to three versioned pronunciation dictionaries per request.[^el-timing] | SSML supports pronunciation/control, but its markup is billable.[^g-ssml][^g-price] |
| Programmatic preflight | `GET /v1/models`, `GET /v1/voices`, and the user subscription/usage APIs are listed in the official API reference; pin model/voice and snapshot allowance before submit.[^el-timing] | Voice listing plus Cloud API usage monitoring; billing must be enabled.[^g-price] |
| Free API and commercial use | Free/API capacity exists (10,000 Multilingual characters shown), **but commercial use is expressly forbidden on Free**. Paid Starter+ is required for a defensible commercial/internal corporate preview.[^el-price][^el-terms] | The pricing page expressly makes the monthly free allowance available through the billed TTS service (billing must be enabled), so it is API usage. **Commercial use of free-allowance TTS output is not explicitly stated in the TTS pricing/docs reviewed; treat it as unknown pending counsel/contract-owner confirmation.** |
| Privacy/retention | Normal calls have logging/history; `enable_logging=false` zero-retention is Enterprise-only.[^el-timing] | The general Cloud contract/data-processing terms apply, but no TTS-specific prompt/audio retention period was found in the reviewed first-party docs. **Unknown; obtain the applicable DPA/region determination before live text leaves the repo.** |

No other provider is recommended: adding Azure/AWS would not make this two-adapter tracer smaller, and neither is needed to establish a realistic fallback. This is not a claim that they lack Italian TTS.

## Fixture size and non-authorizing cost observations

Counting Unicode code points in each `presentation.voiceOver`, including spaces and punctuation, gives **1,601 characters across 13 utterances**. For a concrete balanced estimate, scenes with one or more `claimIds` are treated as critical (scenes 04, 07, 10, 11, 12 and 13): those six get two candidates and the other seven get one, for **2,340 synthesized characters**. This is an explicit planning assumption, not a schema rule; changing the critical set requires recomputation. SSML/dictionary markup may add billable characters.

All numbers below are **PriceObservation** values: non-contractual, non-authorizing, tax-exclusive, and subject to a fresh provider check/reservation before `apply`.

| Provider/model | Official observed rate | One candidate each | Balanced assumption |
|---|---:|---:|---:|
| ElevenLabs Multilingual v2 | $0.10 / 1K characters | **$0.1601** usage-equivalent | **$0.2340** usage-equivalent |
| Google WaveNet | $4 / 1M characters | **$0.006404** before free allowance | **$0.009360** before free allowance |

ElevenLabs' displayed Starter commitment remains **$6/month**, despite the tiny usage-equivalent above; included allowance means marginal charge may be zero while allowance remains.[^el-price] Google includes 0–4 million WaveNet characters monthly, but requires billing and automatically charges above the allowance; marginal charge is therefore $0 if sufficient allowance remains.[^g-price] Google word-level `<mark>` insertion increases its billed input and is not included in the plain-script figures.

## Blocking decision before implementation

The principal unresolved blocker is **privacy/retention approval for sending the AWE script to a third party**. ElevenLabs' documented zero-retention switch is Enterprise-only, while no TTS-specific Google retention statement was located. The owner must approve standard ElevenLabs logged/history processing (and the applicable paid terms/DPA), or fund Enterprise zero retention; otherwise choose Google only after contract/privacy review and the Italian SSML-timepoint spike. Separately, do not rely on Google's free allowance for commercial rights until the contract owner confirms that interpretation.

[^el-timing]: ElevenLabs, [Create speech with timing](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps).
[^el-models]: ElevenLabs, [Models](https://elevenlabs.io/docs/models).
[^el-price]: ElevenLabs, [API pricing](https://elevenlabs.io/pricing/api).
[^el-terms]: ElevenLabs, [Terms of Service](https://elevenlabs.io/terms-of-use) (EEA users should also check the linked EU terms, which state the same free/paid commercial distinction).
[^el-commercial]: ElevenLabs Help Center, [Can I publish the content I generate on the platform?](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform).
[^g-api]: Google Cloud, [Method: text.synthesize](https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize).
[^g-voices]: Google Cloud, [Supported voices and languages](https://cloud.google.com/text-to-speech/docs/list-voices-and-types).
[^g-ssml]: Google Cloud, [Speech Synthesis Markup Language](https://cloud.google.com/text-to-speech/docs/ssml).
[^g-timepoints]: Google Cloud, [Text-to-Speech v1beta1 RPC reference](https://cloud.google.com/text-to-speech/docs/reference/rpc/google.cloud.texttospeech.v1beta1) (`TimepointType.SSML_MARK`).
[^g-price]: Google Cloud, [Text-to-Speech pricing](https://cloud.google.com/text-to-speech/pricing).
[^hf-cli]: Higgsfield, [official CLI repository](https://github.com/higgsfield-ai/cli), especially the audio model and `result_url` command documentation; capability and cost values were observed through authenticated CLI `1.1.20` model discovery and cost-only calls.
[^hf-terms]: Higgsfield, [Terms of Use Agreement](https://higgsfield.ai/terms-of-use-agreement), sections 4.4 and 16.5; see also its [July 2026 plain-language update](https://higgsfield.ai/blog/terms-of-use-privacy-policy-update).
