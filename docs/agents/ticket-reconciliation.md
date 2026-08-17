# Reconciliation of local video-pipeline tickets

Reconciled on 2026-08-17 against commit `2212727` and the GitHub tracker. The 17
local tickets are resolved design decisions. This table records how their still
relevant implementation consequences map to the active graph without reopening
completed or superseded work.

| Local ticket | Reconciled state | Active consequence |
|---|---|---|
| 01 Higgsfield capabilities | Research resolved; CLI discovery and cost observation implemented, live video lifecycle unknown. | Optional footage [#5](https://github.com/lf-awesport/awe-edu-video/issues/5). |
| 02 Remotion runtime | G0 evaluation decision and version pin implemented; production licence remains unknown. | Release authority [#9](https://github.com/lf-awesport/awe-edu-video/issues/9). |
| 03 Canonical model | Minimal Project and RenderPlan schemas/compiler implemented; broad universal model remains candidate-spec scope. | Variant inheritance [#8](https://github.com/lf-awesport/awe-edu-video/issues/8); no standalone issue. |
| 04 Provider contract | Safe discovery/PriceObservation subset implemented; no paid submit path exists. | Optional live lifecycle [#5](https://github.com/lf-awesport/awe-edu-video/issues/5). |
| 05 Remotion composition contract | Storyboard → RenderPlan → native render and evidence implemented for visual master; audio inputs absent. | Audio tracer [#4](https://github.com/lf-awesport/awe-edu-video/issues/4) and AV master [#7](https://github.com/lf-awesport/awe-edu-video/issues/7). |
| 06 Orchestration lifecycle | T2 append-only runtime state, recovery, locks, plans, and cache evidence implemented. Provider reconciliation remains unnecessary until paid submit is approved. | Optional footage [#5](https://github.com/lf-awesport/awe-edu-video/issues/5). |
| 07 Approval/change control | Contract resolved, not implemented as release authority. | Copy/Claim gate [#2](https://github.com/lf-awesport/awe-edu-video/issues/2) and release gate [#9](https://github.com/lf-awesport/awe-edu-video/issues/9). |
| 08 Asset governance | Brand/UI/subject assets and provenance manifests now exist; rights evidence and audio grants remain incomplete. | Full audio [#6](https://github.com/lf-awesport/awe-edu-video/issues/6) and release gate [#9](https://github.com/lf-awesport/awe-edu-video/issues/9). |
| 09 Cost preflight | Non-authorizing Higgsfield PriceObservation implemented; Budget/Reservation is intentionally absent because submit is absent. | TTS authorization [#3](https://github.com/lf-awesport/awe-edu-video/issues/3) and optional footage [#5](https://github.com/lf-awesport/awe-edu-video/issues/5). |
| 10 CLI/project layout | The tracer-sized CLI subset is implemented; the complete conceptual command surface is not a current destination. | Extend only inside the owning tracer; no horizontal CLI issue. |
| 11 Quality validation | Visual full decode, identity, and manual review are implemented; AV and release quality are incomplete. | AV master [#7](https://github.com/lf-awesport/awe-edu-video/issues/7) and release gate [#9](https://github.com/lf-awesport/awe-edu-video/issues/9). |
| 12 AWE walkthrough | All 13 visual scenes now compile/render; Claim, audio, release, and optional footage remain open. | [#2](https://github.com/lf-awesport/awe-edu-video/issues/2), [#5](https://github.com/lf-awesport/awe-edu-video/issues/5), and [#7](https://github.com/lf-awesport/awe-edu-video/issues/7). |
| 13 Specification shape | Bilingual package exists and remains `in-review`; it is not implementation or release approval. | Production authority [#9](https://github.com/lf-awesport/awe-edu-video/issues/9). |
| 14 Higgsfield access | Authenticated CLI discovery and one TTS smoke completed; access is not spending or production authorization. | TTS decision [#3](https://github.com/lf-awesport/awe-edu-video/issues/3) and optional footage [#5](https://github.com/lf-awesport/awe-edu-video/issues/5). |
| 15 Brief normalization | Contract resolved but implementation is outside the current “finish AWE master” destination because the canonical fixture already exists. | Deferred; preserve in the candidate specification. |
| 16 Audio/TTS | Provider research and immutable MP3 import exist; selection, approved timing, alignment, caption, mix, and stems do not. | [#3](https://github.com/lf-awesport/awe-edu-video/issues/3), [#4](https://github.com/lf-awesport/awe-edu-video/issues/4), and [#6](https://github.com/lf-awesport/awe-edu-video/issues/6). |
| 17 Rollout plan | G0/T1/T2 and the internal visual T7 outcome are complete; residual work has been re-sliced by current dependency, not copied as T1–T10 placeholders. | Canonical map [#1](https://github.com/lf-awesport/awe-edu-video/issues/1). |

## Grilling outcome

- Paid Higgsfield footage is optional because deterministic scene 1/13 fallbacks
  already render; it must not block the AV master.
- Full TTS generation is blocked by copy lock, while a scene 1–3 internal tracer
  may proceed after the Voice/privacy/spend decision.
- Technical render verification and release approval remain separate gates.
- Variants follow the approved master timing to avoid multiplying stale audio,
  caption, and layout work.
