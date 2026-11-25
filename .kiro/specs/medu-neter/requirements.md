# Medu Neter: Voices of the Nile — Requirements

**Project:** Medu Neter — the Hieroglyph Typewriter  
**Kiroween 2026 category:** Resurrection  
**Spec version:** 1.0  

---

## 1. Overview

Medu Neter ("words of the gods" in Ancient Egyptian) is a single-page web application that translates modern Latin-script text into Egyptian hieroglyphs using the Manuel de Codage uniliteral alphabet rendered in Unicode. The application renders glyphs in real time, generates a styled name cartouche, displays a full uniliteral alphabet reference, produces a downloadable share card, and immerses the user in a tomb-wall aesthetic throughout.

---

## 2. Definitions

| Term | Meaning |
|---|---|
| **Uniliteral sign** | An Egyptian hieroglyph that represents a single consonant phoneme, the basic alphabet of the script |
| **Manuel de Codage (MdC)** | The standard ASCII encoding for Egyptian hieroglyphs used by Egyptologists |
| **Gardiner code** | The alphanumeric identifier (e.g. G1, M17) assigned to each sign in Gardiner's *Sign List* |
| **Cartouche** | The oval *shen*-ring enclosure used by pharaohs to protect a royal name |
| **Transliteration** | The representation of hieroglyphic phonemes using modern diacritical Latin characters |
| **Share card** | A downloadable 1200 × 630 PNG image showing the user's hieroglyphs, Latin name, and app attribution |
| **Time-machine theme** | The tomb-interior visual design — dark papyrus palette, gold borders, horizontal register lines, Cinzel typeface — that evokes an ancient Egyptian tomb wall |
| **Preset** | A one-click sample name (Cleopatra, Tutankhamun, Ramses, Nefertiti) that pre-fills the input |

---

## 3. Requirements

### 3.1 Phrase Translation

**REQ-TRANS-01**  
When the user types or modifies text in the input textarea, the system shall convert every Latin character to its corresponding MdC uniliteral hieroglyph within 100 ms and display the result in the hieroglyph output panel without any explicit submit action.

**REQ-TRANS-02**  
When the input contains a space character, the system shall render two consecutive Unicode space characters in the hieroglyph output so that word boundaries remain visually distinct.

**REQ-TRANS-03**  
When the input contains a newline character, the system shall emit a newline in the hieroglyph output, preserving multi-line structure.

**REQ-TRANS-04**  
When the input contains a character that has no uniliteral mapping (punctuation, digits, symbols), the system shall silently omit that character from the hieroglyph output rather than substituting a placeholder or showing an error.

**REQ-TRANS-05**  
When the mapping table assigns the same Unicode code point to both a lowercase and an uppercase Latin letter (e.g. `s` and `z` both map to the bolt sign O34), the system shall accept either form without error and render the same glyph for each.

**REQ-TRANS-06**  
When the input is empty or produces only whitespace after translation, the system shall display the Eye-of-Ra glyph (𓂀, U+13000+) as a default placeholder in the output panel.

**REQ-TRANS-07**  
While the input is empty, the system shall keep the Copy and Download action buttons in a disabled state.

**REQ-TRANS-08**  
When the user clicks a preset button, the system shall replace the textarea contents with the preset text and immediately trigger the same translation pipeline as a manual keystroke.

---

### 3.2 Hieroglyph Rendering

**REQ-GLYPH-01**  
The system shall render all hieroglyph output using the *Noto Sans Egyptian Hieroglyphs* font loaded from Google Fonts, at a minimum computed size of 44 px so that individual sign details remain legible on standard-density displays.

**REQ-GLYPH-02**  
The system shall load *Noto Sans Egyptian Hieroglyphs* via a `<link rel="preconnect">` hint to `fonts.googleapis.com` and `fonts.gstatic.com` to reduce render-blocking latency on first load.

**REQ-GLYPH-03**  
The hieroglyph output panel shall be wrapped in an element with `aria-live="polite"` so that screen readers announce translation updates without interrupting the user mid-keystroke.

**REQ-GLYPH-04**  
The system shall support the full 26 MdC uniliteral signs (G1, M17, Z4, G43, D58, Q3, I9, G17, N35, D21, E23, O4, V28, F32, R8, O34, M8, N29, V31, W11, X1, V13, D46, I10) plus practical modern-Latin approximations for `c`, `o`, `v`, `j`, and `e`.

**REQ-GLYPH-05**  
When the page loads with an empty textarea, the system shall display the Eye-of-Ra glyph (𓂀) in the output panel as the initial visual state before the user types.

---

### 3.3 Audio Playback

**REQ-AUDIO-01**  
When the user activates the audio pronunciation feature, the system shall play an audible phonetic reading of the transliterated form of the current input, pronouncing each mapped consonant in left-to-right sequence.

**REQ-AUDIO-02**  
When no audio pronunciation data is available for a given sign, the system shall skip that sign silently rather than producing an error sound or halting playback.

**REQ-AUDIO-03**  
When audio playback is in progress and the user modifies the input, the system shall stop the current playback before starting a new reading to prevent overlapping audio.

**REQ-AUDIO-04**  
The system shall not begin audio playback automatically on page load or on translation update; playback shall only occur in direct response to an explicit user action.

**REQ-AUDIO-05**  
When the browser does not support the Web Audio API or the required audio assets are unavailable, the system shall degrade gracefully: the audio control shall remain visible but indicate the unavailable state, and all other features shall continue to function normally.

---

### 3.4 Transliteration Display

**REQ-TRANSLIT-01**  
When the input contains translatable characters, the system shall display a transliteration line showing the standard Egyptological consonant values (using MdC ASCII representations such as `H`, `x`, `S`, `T`, `D`) beneath or adjacent to the hieroglyph output panel.

**REQ-TRANSLIT-02**  
When the input contains a character with no uniliteral mapping, the system shall omit that character from the transliteration display, consistent with the hieroglyph output behaviour defined in REQ-TRANS-04.

**REQ-TRANSLIT-03**  
The system shall visually distinguish the transliteration line from surrounding body text by applying the gold accent colour (`#c9a227`) and a tracking (letter-spacing) value of at least 2 px, consistent with the existing label style.

**REQ-TRANSLIT-04**  
When the input is empty, the system shall display an empty transliteration line or omit it entirely; it shall not display stale output from a previous input.

---

### 3.5 Name Cartouche Generator

**REQ-CART-01**  
When the input contains at least one translatable character, the system shall render a live cartouche containing the hieroglyphic form of the first line of the input, capped at 24 characters of source text, inside the `.cartouche` element.

**REQ-CART-02**  
The cartouche shall be styled as an oval *shen*-ring border (border-radius: 999px) in gold (`#c9a227`), with a solid rectangular terminal bar on its right edge representing the knotted end of the rope, matching traditional pharaonic cartouche conventions.

**REQ-CART-03**  
When the input changes, the system shall update the cartouche content in the same render cycle as the main hieroglyph output panel, so both displays remain synchronised at all times.

**REQ-CART-04**  
When the input is empty, the system shall display an empty cartouche shell (the border remains visible) rather than removing the cartouche element from the layout.

**REQ-CART-05**  
The cartouche section shall include a short explanatory text describing the historical role of the cartouche so that users unfamiliar with Egyptology understand its cultural significance.

---

### 3.6 Share-Card Generation

**REQ-CARD-01**  
When the user clicks the "Download cartouche card" button and the input is non-empty, the system shall generate a 1200 × 630 pixel PNG image and trigger an immediate browser download with the filename `cartouche.png`.

**REQ-CARD-02**  
The generated card shall contain: (1) a dark gradient background progressing from `#2b1d0e` at the top to `#1a1108` at the bottom; (2) a 6 px gold (`#c9a227`) border inset 30 px from each edge; (3) the hieroglyphic form of the first line of input (capped at 24 source characters) centred horizontally at 110 px in *Noto Sans Egyptian Hieroglyphs*; (4) the original Latin text centred at 36 px in a serif font; (5) the attribution line "Medu Neter — the Hieroglyph Typewriter" at 28 px.

**REQ-CARD-03**  
The system shall render the card using the HTML Canvas 2D API (`CanvasRenderingContext2D`) entirely on the client side; no server-side image generation or external service call shall be made.

**REQ-CARD-04**  
When the input is empty or produces no translatable glyphs, the "Download cartouche card" button shall remain disabled (per REQ-TRANS-07) and no download shall be triggered.

**REQ-CARD-05**  
The share card shall be suitable for use as an Open Graph `og:image` (1200 × 630 px, opaque background) so that users can share it on social platforms without cropping or letterboxing.

---

### 3.7 Uniliteral Alphabet Reference

**REQ-ALPHA-01**  
The system shall render a complete alphabet-reference section displaying every unique uniliteral sign in the GARDINER table, showing: the hieroglyph glyph, the corresponding Latin letter, and the Gardiner sign code, in a responsive grid.

**REQ-ALPHA-02**  
The alphabet grid shall suppress duplicate entries: when two Latin letters share the same Gardiner code (e.g. `s` and `z` both map to O34), the system shall display that sign only once.

**REQ-ALPHA-03**  
Each sign cell in the alphabet grid shall be visually bounded by a gold-tinted border and rounded corners consistent with the tomb-panel aesthetic, and the sign glyph shall be rendered at a minimum of 2 rem so it is legible without zooming.

**REQ-ALPHA-04**  
The alphabet section shall include a brief explanatory paragraph describing uniliteral signs and their role in learning the script, so that the reference serves an educational purpose and not just a lookup function.

---

### 3.8 Time-Machine UI Theme

**REQ-THEME-01**  
The application shall apply a dark tomb-interior colour palette throughout, using at minimum: near-black background `#1a1108` / `#120b04`, sand-parchment text `#e8d5a3`, and gold accent `#c9a227` for all interactive highlights, borders, headings, and labels.

**REQ-THEME-02**  
The body background shall include a horizontal-register line pattern (repeating-linear-gradient at 35 px intervals, 3% gold opacity) evoking the register lines found on Egyptian wall reliefs and papyri.

**REQ-THEME-03**  
The body background shall include a radial gold glow centred at the top of the viewport (12% gold opacity) to suggest torchlight or divine light emanating from above, as seen in tomb-painting conventions.

**REQ-THEME-04**  
All heading and label text shall use the *Cinzel* serif typeface (loaded from Google Fonts), which mirrors the monumental inscribed letterforms of classical stone carving, reinforcing the ancient-script aesthetic.

**REQ-THEME-05**  
Interactive buttons shall use gold fill with dark text in their default state, transition to a 1 px upward translate and a gold drop-shadow on hover to suggest the tactile quality of pressing a carved stone key, and display reduced opacity with a `not-allowed` cursor when disabled.

**REQ-THEME-06**  
The page shall carry the `<title>` "Medu Neter — the Hieroglyph Typewriter" and a `<meta name="description">` explaining the app's purpose and its Kiroween 2026 context, to support discoverability and social sharing.

**REQ-THEME-07**  
The application header shall display an Eye-of-Ra (𓂀) symbol as a decorative icon at a minimum of 64 px above the main title, establishing immediate visual and cultural context before the user reads any text.

**REQ-THEME-08**  
The page footer shall display a thematic attribution line ("𓆓 Medu Neter — words of the gods, typed by mortals 𓆓") using the serpent glyph (𓆓, Gardiner I12) as a decorative bookend, consistent with ancient scribal colophon conventions.

**REQ-THEME-09**  
All interactive text inputs shall use a semi-transparent sand-tinted fill and a gold border with reduced opacity in the default state, transitioning to a solid gold outline on focus, ensuring keyboard-navigation focus is always clearly visible.

**REQ-THEME-10**  
The overall page layout shall be constrained to a maximum width of 760 px and horizontally centred, evoking the columnar layout of a papyrus scroll rather than a full-bleed modern web page.

---

## 4. Non-Functional Requirements

**REQ-NF-01 — Performance**  
The translation pipeline (input event → glyph render → cartouche update) shall complete within 100 ms on a mid-range device so that the typewriter effect feels instantaneous.

**REQ-NF-02 — Accessibility**  
The application shall meet WCAG 2.1 Level AA contrast requirements for all body text against the dark background. The hieroglyph output region shall be wrapped in `aria-live="polite"`. All form controls shall have associated `<label>` elements.

**REQ-NF-03 — Browser Compatibility**  
The application shall function correctly in the current stable release of Chrome, Firefox, Safari, and Edge without requiring a build step, transpilation, or polyfills beyond what the browser provides natively.

**REQ-NF-04 — Client-Side Only**  
The application shall operate entirely in the browser with no backend server, no network requests beyond font loading, and no cookies or persistent storage, so that it can be served from a static file host or opened directly from the filesystem.

**REQ-NF-05 — Font Loading**  
The application shall declare `<link rel="preconnect">` hints for `fonts.googleapis.com` and `fonts.gstatic.com` before the stylesheet link, and load only the two required font families (*Noto Sans Egyptian Hieroglyphs* and *Cinzel*) to minimise render-blocking.

**REQ-NF-06 — Open Source**  
The project shall be released under the MIT licence. Attribution shall be visible in the UI (REQ-THEME-08) and noted in the lore section of the page.

---

## 5. Constraints

- The uniliteral mapping is restricted to the 26 canonical MdC signs plus five modern-Latin approximations (`c`, `o`, `v`, `j`, `e`); full Middle-Egyptian multilateral sign support is out of scope.
- Hieroglyph directionality (right-to-left or top-to-bottom reading orders used in original inscriptions) is out of scope; all output is rendered left-to-right in the Unicode block order.
- The share card uses the Canvas 2D API; browsers that block canvas (fingerprinting protection) may produce a blank download — this is an accepted limitation.
- Audio pronunciation assets and their format, encoding, and hosting location are implementation concerns and are not mandated by this requirements document.
