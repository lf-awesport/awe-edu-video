# AWE audio candidate evidence — 2026-08-18

Evidence package for issue #15 and the 101.6-second Italian AWE master. The
earlier unmaterialized Pixabay shortlist is superseded by the Mixkit candidates
below: these exact files were downloaded, decoded and auditioned against the
same voice-over master. They remain **Candidates**, not Selected Assets or a
Rights Grant.

## Recommendation

Recommend **B — Uplifting Bass by Lily J**. It is instrumental, modern,
optimistic and tech-forward, while leaving materially more space for Italian
speech than the alternates. Its full-master audition passed as a strong
candidate. Owner selection of A/B/C is still required before promotion into the
production asset manifest or Remotion composition.

Use one continuous bed with restrained section edits for hook, product and CTA.
Do not switch songs merely at scene cuts. Keep SFX sparse and motivated by a
Transition Anchor or UI state change.

## Exact music Candidates

Official catalogue evidence:
[Mixkit Industry music](https://mixkit.co/free-stock-music/tag/industry/).
The catalogue's structured data identifies each title, artist, duration,
download URL and the Mixkit Stock Music Free License.

| Audition | Exact item | Official source | Local source evidence | Full-master verdict |
| --- | --- | --- | --- | --- |
| A | **Digital Clouds** — Alejandro Magaña (A. M.), 1:41; Chillout / Electronic, Positive, Futuristic, Technology | [catalogue](https://mixkit.co/free-stock-music/tag/industry/); [MP3](https://assets.mixkit.co/music/175/175.mp3) | `digital-clouds.mp3`; 101.0155 s; SHA-256 `71cd4ea39edcc7532672bd97311abadfd318d00e7a828310a88b4f57fad9cd48` | **Conditional pass.** Clean and modern, but masks voice around 00:18–00:45 without EQ/ducking. |
| B | **Uplifting Bass** — Lily J, 1:36; Ambient / Electronic, Atmospheric, Positive, Technology | [catalogue](https://mixkit.co/free-stock-music/tag/industry/); [MP3](https://assets.mixkit.co/music/726/726.mp3) | `uplifting-bass.mp3`; 95.999975 s; SHA-256 `6cdd3514fb6ce919f7b9e8984d9c11c3e2a7de9b39ec0e2658be0c64e69fd5e0` | **Pass — recommended.** Instrumental, optimistic and propulsive with low speech-frequency competition. Strongest hook/product/CTA contour. |
| C | **New Bass 01** — Lily J, 1:36; Underscore, Positive, Futuristic, Technology | [catalogue](https://mixkit.co/free-stock-music/tag/industry/); [MP3](https://assets.mixkit.co/music/720/720.mp3) | `new-bass-01.mp3`; 95.999975 s; SHA-256 `6389a142c19ca427a32517a815f06eeaa2b6be0512edb5137c502bf840ac0f63` | **Conditional pass.** Instrumental and energetic, but flatter and more lounge/club-like; needs more EQ/ducking. |

Mixkit does not publish BPM in the reviewed catalogue metadata. Approximately
112 BPM for C is an audition estimate, not provider evidence and not a release
contract.

## Comparable full-master auditions

All proxies use the exact same 101.6-second voice/video master. Music was
normalized provisionally around -25 LUFS. B and C were time-stretched with
`atempo=0.9448816` to span the master. These are listening proofs, not a final
mix: no production ducking, EQ, SFX, stems or release loudness policy is
claimed.

| Audition | Review proxy | SHA-256 |
| --- | --- | --- |
| A | `.video/reviews/audio-auditions-1.0.0/a-digital-clouds.mp4` | `0f81803d65417a8fc7f9a9fe6228c1d1fe3c2e7a4372d3d935bf921b2fd17819` |
| B | `.video/reviews/audio-auditions-1.0.0/b-uplifting-bass.mp4` | `d4851d9bb13276a380f6539a25862e6b3bb6d6634119588af088fd03d117b977` |
| C | `.video/reviews/audio-auditions-1.0.0/c-new-bass-01.mp4` | `8c4ea5207665c8f58695d6548203c255c51a5bb397cf5cc3e753444bc88ab3b7` |

Source loudness measurements were -13.1 LUFS / +0.7 dBTP for A, -11.8 LUFS /
+0.6 dBTP for B and -18.1 LUFS / +0.3 dBTP for C. The existing voice-only
review proxy measured -15.6 LUFS / -3.5 dBTP. These measurements explain why
source gain cannot be used directly; they are not final targets.

## Minimal SFX Candidate palette

Official category pages and direct download routes are the item evidence. The
files are local research material under ignored `.video/`; none has entered the
master.

| Lane role | Exact item | Official evidence | Local source evidence | Audition verdict |
| --- | --- | --- | --- | --- |
| Sparse whoosh | **Cinematic whoosh fast transition**, 0:01, item 1492 | [category](https://mixkit.co/free-sound-effects/whoosh/); [download record](https://mixkit.co/free-sound-effects/download/1492/); [WAV](https://assets.mixkit.co/active_storage/sfx/1492/1492.wav) | `cinematic-whoosh-fast-transition.wav`; SHA-256 `02b8cd40b3761288d54f4d6706983a2f8c110182b669ae2cdf9aab02935a4e7a` | **Conditional.** Clean and tight, but slightly trailer-like. High-pass around 120–160 Hz and keep approximately 16–22 dB below VO; use only on major handoffs. |
| Soft impact | **Deep heartbeat impact**, 0:03, item 498 | [category](https://mixkit.co/free-sound-effects/impact/); [download record](https://mixkit.co/free-sound-effects/download/498/); [WAV](https://assets.mixkit.co/active_storage/sfx/498/498.wav) | `deep-heartbeat-impact.wav`; SHA-256 `6097c4b9350beb3f6af7cc078bc81c0dd28ba381315eca066063a1cf85507db2` | **Conditional.** Clean but sub-heavy and potentially ominous. Use at most once, high-pass around 80–100 Hz and attenuate; reject if it makes the cut feel dramatic or funereal. |
| UI tick/snap | **Modern technology select**, 0:01, item 3124 | [category](https://mixkit.co/free-sound-effects/click/); [download record](https://mixkit.co/free-sound-effects/download/3124/); [WAV](https://assets.mixkit.co/active_storage/sfx/3124/3124.wav) | `modern-technology-select.wav`; SHA-256 `00270a1847195cddb82d1b10c9407880ce311f522284afaefdc218fbba70d3ed` | **Pass.** Clean, minimalist and non-game-like. It may need 1–3 dB of gain after the music bed is established. |

The impact is intentionally optional. The audition did not justify forcing an
impact onto every settle; music automation plus a whoosh or UI transient is the
preferred default.

## Mixkit license findings

Primary sources reviewed on 2026-08-18:

- [Stock Music Free License](https://mixkit.co/license/modal/musicFree/);
- [Stock Sound Effects Free License](https://mixkit.co/license/modal/sfxFree/);
- [Mixkit User Terms](https://mixkit.co/terms/), last revised 2025-10-02.

| Question | Verified position for AWE |
| --- | --- |
| Commercial synchronized web/social/advertising video | Music license permits commercial and non-commercial online videos, social platforms, podcasts, online advertising and educational use. SFX license permits commercial and non-commercial projects including online videos and advertisements. |
| Edit / time stretch / mix | Both licenses permit use in a completed project; the music license expressly permits editing, cutting and modification. The proposed timing, fades, EQ and ducking are therefore permitted project modifications. |
| Attribution | Not required by either free license. |
| Prohibited music uses | Do not release the track as music, remix music, register it with a rights-management service, or use it in CDs/DVDs, video games, TV or radio. The current web/social AWE brief does not authorize those channels. |
| Raw redistribution / sublicensing | User Terms §9 forbids licensing, sublicensing, selling, reselling or making an Item available to a third party except as expressly contemplated. Deliver a flattened synchronized video, not raw stock files or recoverable music/SFX stems. |
| Ownership and warranty | Download grants a non-exclusive license, not ownership. User Terms §13 leaves evaluation of third-party components/rights to the user; §17 provides Items “as is” without non-infringement warranty. |
| Platform claims | The music license warns YouTube claims may occur and directs users to contact Mixkit. A claim-handling delay remains release risk even for licensed use. |
| Territory / duration | The reviewed short-form licenses do not state an explicit territory or fixed expiry. Do not infer “worldwide/perpetual”; preserve the downloaded license and evidence, and require owner/legal acceptance for release channels. |

## Selection and release gates

1. Owner listens to A/B/C and selects the exact music Candidate/hash.
2. Record the selected source and edited derivative separately in the Asset
   Usage Manifest; preserve catalogue, download and license evidence.
3. Keep Music, SFX and optional Ambience as distinct Audio Lanes. Deliver only
   synchronized rendered outputs to the client; raw Mixkit files stay internal.
4. Issue #14 supplies the Transition Beats before final SFX placement. Issue #6
   owns final ducking, mix, loudness/true-peak policy and release evidence.
5. Owner/legal approves the exact Rights Grant and channels. Candidate research
   is not release authorization.

## Open decisions

- Owner choice: A, **B recommended**, or C.
- Whether the optional soft impact survives a real Transition Beat audition.
- Whether opening office ambience is needed after music and transitions are in
  place; no ambience Candidate is justified yet.
- Final release channels and loudness/true-peak policy remain unset.
