# Medu Neter — Implementation Tasks

Maps each requirement group in `requirements.md` to concrete implementation tasks.
Completed tasks reflect the state of `index.html`, `app.js`, and `style.css`.

---

## 3.1 Phrase Translation

- [x] REQ-TRANS-01 — Wire `input` event on the textarea to call `render()` and update the glyph output within a single animation frame (< 100 ms).
- [x] REQ-TRANS-02 — Map space characters to two consecutive Unicode spaces in `toHieroglyphs()` to preserve word boundaries.
- [x] REQ-TRANS-03 — Pass newline characters through unchanged in `toHieroglyphs()` to preserve multi-line structure.
- [x] REQ-TRANS-04 — Silently drop unmapped characters (punctuation, digits, symbols) by returning an empty string for unrecognised input.
- [x] REQ-TRANS-05 — Normalise lookup in `toHieroglyphs()` to try `ch.toLowerCase()` as a fallback so case variants map to the same glyph.
- [x] REQ-TRANS-06 — Render the Eye-of-Ra placeholder (`𓂀`) in the output panel when the translated string is empty or all-whitespace.
- [x] REQ-TRANS-07 — Keep Copy and Download buttons in `disabled` state while `glyphs.trim()` is falsy; re-enable as soon as translatable content exists.
- [x] REQ-TRANS-08 — Attach click handlers to `.preset` buttons that set `input.value` to the preset text and immediately call `render()`.
- [x] PHRASES dictionary — Add a `PHRASES` constant mapping 27 common modern English phrases (greetings, thanks, love, emotions, cosmology) to historically attested Egyptian renderings with Egyptological transliterations. `render()` performs a case-insensitive, trimmed exact-match lookup before falling back to the letter-by-letter pipeline. A `.phrase-note` element displays a brief scholarly context note when a phrase is recognised. Six preset-phrase buttons expose representative entries for one-click demos.

---

## 3.2 Hieroglyph Rendering

- [x] REQ-GLYPH-01 — Set `font-size: 52px` on `.glyphs` and `font-size: 44px` on the cartouche `.glyphs` override in `style.css`; both exceed the 44 px minimum.
- [x] REQ-GLYPH-02 — Declare `<link rel="preconnect">` hints for `fonts.googleapis.com` and `fonts.gstatic.com` before the stylesheet link in `index.html`.
- [x] REQ-GLYPH-03 — Add `aria-live="polite"` to the `#output` element so screen readers announce translation updates without interrupting typing.
- [x] REQ-GLYPH-04 — Populate `UNILITERALS` with all 26 canonical MdC uniliteral signs plus modern-Latin approximations for `c`, `o`, `v`, `j`, and `e`.
- [x] REQ-GLYPH-05 — Call `render()` on page load (after DOM constants are declared) so the Eye-of-Ra placeholder appears immediately on an empty textarea.

---

## 3.3 Audio Playback

- [x] REQ-AUDIO-01 — Implement a "Listen" button that uses `SpeechSynthesisUtterance` to speak the transliterated consonant sequence aloud, left to right. Prefers an Arabic voice (phonetically closest to Ancient Egyptian) and falls back to any available voice.
- [x] REQ-AUDIO-02 — SpeechSynthesis skips signs that produce no transliteration output; unmapped characters are absent from the spoken string, so playback continues without error or interruption.
- [x] REQ-AUDIO-03 — `render()` calls `stopSpeech()` (`window.speechSynthesis.cancel()`) on every input change, halting any in-progress utterance before a new one is queued.
- [x] REQ-AUDIO-04 — Playback is bound exclusively to the "Listen" button click event; `render()` and page load never call `speak()`.
- [x] REQ-AUDIO-05 — When `window.speechSynthesis` is absent, the "Listen" button remains visible but `disabled` with a tooltip; all other features continue unaffected.

---

## 3.4 Transliteration Display

- [x] REQ-TRANSLIT-01 — Add a transliteration output element (e.g. `<p id="translit">`) beneath the hieroglyph panel; populate it with MdC ASCII consonant values (`H`, `x`, `S`, `T`, `D`, etc.) inside `render()`.
- [x] REQ-TRANSLIT-02 — Omit unmapped characters from the transliteration string, consistent with `toHieroglyphs()` behaviour.
- [x] REQ-TRANSLIT-03 — Style the transliteration line with `color: var(--gold)` and `letter-spacing: 2px` (minimum) in `style.css`.
- [x] REQ-TRANSLIT-04 — Clear the transliteration element to an empty string when `input.value` is empty; never show stale output.

---

## 3.5 Name Cartouche Generator

- [x] REQ-CART-01 — Render `toHieroglyphs(text.split('\n')[0].slice(0, 24))` into `#cartouche-text` inside `render()` so the cartouche always reflects the first line, capped at 24 characters.
- [x] REQ-CART-02 — Style `.cartouche` with `border: 6px solid var(--gold)`, `border-radius: 999px`, and a `::after` pseudo-element of `width: 12px; background: var(--gold)` to form the knotted-rope terminal bar.
- [x] REQ-CART-03 — Update `#cartouche-text` in the same `render()` call that updates `#output` so both panels are always in sync.
- [x] REQ-CART-04 — Leave the `.cartouche` border visible even when `#cartouche-text` is empty; the shell persists regardless of input state.
- [x] REQ-CART-05 — Include a `<p class="explain">` paragraph in `index.html` explaining the pharaonic *shen*-ring and its protective role.

---

## 3.6 Share-Card Generation

- [x] REQ-CARD-01 — On "Download cartouche card" click, create an off-screen `<canvas>` (1200 × 630), render the card, call `canvas.toDataURL('image/png')`, and trigger a download via a synthesised `<a>` click with `download="cartouche.png"`.
- [x] REQ-CARD-02 — Fill the canvas with a linear gradient (`#2b1d0e` → `#1a1108`), stroke a 6 px gold border inset 30 px, then draw the hieroglyphs at 110 px, Latin name at 36 px gold, and attribution at 28 px.
- [x] REQ-CARD-03 — Use `CanvasRenderingContext2D` exclusively; no server call, no third-party image service.
- [x] REQ-CARD-04 — The Download button is gated by `glyphs.trim()` (REQ-TRANS-07), so it is always disabled when there is nothing to render.
- [x] REQ-CARD-05 — Canvas dimensions are 1200 × 630 with an opaque background, meeting OG image requirements.

---

## 3.7 Uniliteral Alphabet Reference

- [x] REQ-ALPHA-01 — Build the `GARDINER` lookup table in `app.js` and populate `#alphabet` with one `.sign` cell per unique code, showing the glyph, Latin letter, and Gardiner number.
- [x] REQ-ALPHA-02 — Track seen Gardiner codes in a `Set` and skip duplicates so signs shared by multiple Latin letters (e.g. `s`/`z` → O34) appear only once.
- [x] REQ-ALPHA-03 — Style `.sign` with a gold-tinted border (`rgba(--gold, 0.35)`), `border-radius: 10px`, and `.sign-glyph` at `font-size: 2rem` in `style.css`.
- [x] REQ-ALPHA-04 — Include a `<p class="explain">` in the guide section of `index.html` describing uniliteral signs and their role for learners.

---

## 3.8 Time-Machine UI Theme

- [x] REQ-THEME-01 — Define `--sand: #e8d5a3`, `--gold: #c9a227`, `--dark: #1a1108`, `--darker: #120b04` on `:root`; use only these variables for all colour references.
- [x] REQ-THEME-02 — Include `repeating-linear-gradient(0deg, transparent 0 34px, rgba(201,162,39,0.03) 34px 35px)` in the `body` background-image for horizontal register lines.
- [x] REQ-THEME-03 — Include `radial-gradient(ellipse at 50% -20%, rgba(201,162,39,0.12), transparent 60%)` in the `body` background-image for the torchlight glow.
- [x] REQ-THEME-04 — Set `font-family: 'Cinzel', serif` on `body` so all heading and label text uses the monumental typeface.
- [x] REQ-THEME-05 — Style buttons with `background: var(--gold); color: var(--dark)`, add `transform: translateY(-1px)` and `box-shadow` on `:hover:not(:disabled)`, and `opacity: 0.4; cursor: not-allowed` when `disabled`.
- [x] REQ-THEME-06 — Set `<title>Medu Neter — the Hieroglyph Typewriter</title>` and `<meta name="description">` in `index.html`.
- [x] REQ-THEME-07 — Render `𓂀` in a `.ankh` element styled at `font-size: 64px` in the page header.
- [x] REQ-THEME-08 — Display `𓆓 Medu Neter — words of the gods, typed by mortals 𓆓` in the `<footer>`.
- [x] REQ-THEME-09 — Style `textarea` with `background: rgba(232,213,163,0.06)`, `border: 1px solid rgba(201,162,39,0.4)`, and `outline: 1px solid var(--gold)` on `:focus`.
- [x] REQ-THEME-10 — Constrain `.tomb` to `max-width: 760px; margin: 0 auto` in `style.css`.

---

## 4. Non-Functional Requirements

- [x] REQ-NF-01 — Translation pipeline is synchronous DOM text assignment with no debounce; completes well within 100 ms on any mid-range device.
- [ ] REQ-NF-02 — *(Optional polish)* Run a WCAG 2.1 AA colour-contrast audit to confirm all text/background pairings meet 4.5:1; verify every form control has an associated `<label>` and `aria-live` regions are correct.
- [x] REQ-NF-03 — Vanilla JS with no build step or polyfills; compatible with current stable Chrome, Firefox, Safari, and Edge.
- [x] REQ-NF-04 — No backend, no fetch calls, no cookies or storage; works from `file://` with no network beyond font loading.
- [x] REQ-NF-05 — `<link rel="preconnect">` hints appear before the stylesheet `<link>` in `index.html`; only *Noto Sans Egyptian Hieroglyphs* and *Cinzel* are loaded.
- [x] REQ-NF-06 — MIT licence attribution is visible in the lore section and the footer; `app.js` header comments identify the project and its purpose.

---

## Notes

**All requirements implemented.**
- REQ-AUDIO-01–05: Audio playback is complete. The "Listen" button uses `SpeechSynthesisUtterance` to speak the transliteration, preferring an Arabic voice and degrading gracefully when speech synthesis is unavailable.
- PHRASES dictionary: 27 curated phrase translations with historically grounded Egyptian renderings and scholarly notes are live. The letter-by-letter fallback applies to all other input.
- REQ-NF-02: Marked optional pending an explicit accessibility audit pass.
