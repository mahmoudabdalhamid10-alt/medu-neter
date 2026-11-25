# Medu Neter — Architecture & Design

**Spec version:** 1.0  
**App version:** current (index.html + app.js + style.css)  
**Scope:** client-side only, no build step, single-page application

---

## 1. Overview

Medu Neter is a zero-dependency, single-page web application that translates modern Latin-script text into Unicode Egyptian hieroglyphs in real time. Everything — translation, rendering, cartouche generation, share-card export — happens inside the browser. There is no server, no bundler, no framework, and no persistent storage.

The entry point is `index.html`, which loads one stylesheet (`style.css`) and one script (`app.js`). Google Fonts delivers the two required typefaces (*Noto Sans Egyptian Hieroglyphs*, *Cinzel*) via preconnect-hinted `<link>` tags.

---

## 2. File Structure

```
medu-neter/
├── index.html      — shell markup, semantic structure, font loading
├── app.js          — all runtime logic (data, translation, UI, canvas)
└── style.css       — CSS custom properties, layout, tomb theme
```

No build artifacts, no `node_modules`, no transpilation. The app can be opened directly from the filesystem (`file://`) or served from any static host.

---

## 3. Component Breakdown

The app has no component framework. "Components" here means distinct HTML sections owned by corresponding JS responsibilities.

### 3.1 Header (static HTML)

**Markup:** `<header>` inside `.tomb`  
**Owns:** decorative Eye-of-Ra icon (`.ankh`), app title, subtitle, tagline.  
**JS involvement:** none — purely presentational.

---

### 3.2 Writer Panel

**Markup:** `<section class="writer">`  
**Elements:**
- `#latin` — `<textarea>` where the user types
- `.presets` — four preset `<button>` elements (`data-text` attribute carries the value)
- `#output` — `<div class="glyphs" aria-live="polite">` showing the live hieroglyph translation
- `.actions` — Copy and Download buttons

**JS responsibilities:**
- Listen to `input` events on `#latin` → call `render()`
- Listen to `click` on each `.preset` → set `input.value`, call `render()`
- Manage disabled state of Copy and Download buttons based on whether translated output is non-empty

---

### 3.3 Cartouche Panel

**Markup:** `<section class="cartouche-wrap">`  
**Elements:**
- `#cartouche` / `#cartouche-text` — live hieroglyph oval display

**JS responsibilities:**
- Updated inside the same `render()` call as `#output`
- Source text is capped at the first line of input, truncated to 24 characters

**CSS responsibilities:**
- `border-radius: 999px` on `.cartouche` renders the oval shen-ring
- `::after` pseudo-element adds the rectangular terminal bar on the right edge, representing the knotted rope end of the cartouche

---

### 3.4 Alphabet Reference

**Markup:** `<section class="guide">` → `<div id="alphabet" class="alphabet">`  
**Elements:** generated `<div class="sign">` cells, each containing `.sign-glyph`, `.sign-letter`, `.sign-code` spans.

**JS responsibilities:**
- Runs once on page load
- Iterates `GARDINER` table, deduplicates by Gardiner code using a `Set`, emits one cell per unique sign
- Writes directly to `alphaEl.innerHTML`

---

### 3.5 Lore Section (static HTML)

**Markup:** `<section class="lore">`  
**Owns:** historical context paragraph, MIT/Kiroween attribution.  
**JS involvement:** none.

---

### 3.6 Share-Card Generator

**Triggered by:** click on `#download-btn`  
**Output:** 1200 × 630 PNG downloaded as `cartouche.png`

**JS responsibilities (all in the click handler):**
1. Create an off-screen `<canvas>` (never appended to the DOM)
2. Draw background gradient (`#2b1d0e` → `#1a1108`)
3. Draw 6 px gold border inset 30 px from each edge
4. Render hieroglyphs at 110 px (first line, capped 24 chars) centred at y = 280
5. Render Latin name at 36 px centred at y = 430
6. Render attribution line at 28 px centred at y = 520
7. Export via `canvas.toDataURL('image/png')` → synthesise `<a download>` → `.click()`

The canvas is never attached to the DOM, so it has no layout impact. Font availability depends on the browser having already loaded *Noto Sans Egyptian Hieroglyphs* from Google Fonts; if not yet loaded (e.g., slow connection), the canvas will fall back to the browser's default serif.

---

### 3.7 Audio Playback (planned, REQ-AUDIO-*)

**Current state:** not yet implemented in `app.js`.  
**Design intent:**

- A "Speak" button (or equivalent control) triggers playback; no autoplay.
- Playback uses the **Web Speech API** (`SpeechSynthesisUtterance`) to pronounce the MdC transliteration string rather than individual hieroglyph codepoints, since Unicode hieroglyphs have no browser pronunciation.
- The transliteration string is derived by collecting the keys from `UNILITERALS` that matched each character (i.e. the original Latin letters that had a valid mapping), joined with spaces between words.
- If `window.speechSynthesis` is unavailable, the button remains visible but is set to `disabled` with an accessible `title` attribute indicating unavailability.
- When a new translation fires while speech is in progress, `speechSynthesis.cancel()` is called before `speechSynthesis.speak()` to prevent overlap.

---

### 3.8 Transliteration Display (planned, REQ-TRANSLIT-*)

**Current state:** not yet implemented.  
**Design intent:**

- A `<div id="translit">` is rendered beneath `#output`, showing the MdC ASCII representation of the matched characters (e.g. input `"nefertiti"` → transliteration `"n-e-f-e-r-t-i-t-i"` using the keys that produced a hit).
- Styled with `color: var(--gold)` and `letter-spacing: 2px` per the theme convention.
- Cleared when input is empty; characters with no UNILITERALS entry are omitted.

---

## 4. Data Layer

All translation data lives as module-level constants in `app.js`. There is no external data file, no fetch, no import.

### 4.1 `UNILITERALS`

The primary mapping table. Keys are Latin characters (both lowercase and a small set of uppercase case-sensitive MdC codes: `H`, `X`, `S`, `T`, `D`). Values are Unicode code points in the Egyptian Hieroglyphs block (U+13000–U+1342F), expressed as `'\u{...}'` literals.

```
Latin key  → Unicode glyph  (Gardiner code / sign name)
─────────────────────────────────────────────────────────
'a'        → U+13000  G1   vulture (aleph)
'i'/'e'/'j'→ U+1300A  M17  reed
'y'        → U+1300C  Z4   dual strokes
'w'/'u'/'o'→ U+13091  G43  quail chick
'b'        → U+13080  D58  foot
'p'        → U+132AA  Q3   stool
'f'/'v'    → U+13132  I9   horned viper
'm'        → U+13153  G17  owl
'n'        → U+13216  N35  water ripple
'r'        → U+1308B  D21  mouth
'l'        → U+1307C  E23  lion
'h'        → U+1308D  O4   reed shelter
'H'        → U+131A3  V28  wick (emphatic ḥ)
'x'        → U+13121  F32  animal belly (ḫ)
'X'        → U+13284  R8   djeded (second ḫ)
'z'/'s'    → U+1328B  O34  bolt
'S'        → U+13209  M8   pool (š)
'q'        → U+1320B  N29  hill slope
'k'/'c'    → U+133A1  V31  basket
'g'        → U+133BC  W11  jar stand
't'        → U+133CF  X1   bread loaf
'T'        → U+13169  V13  tethering rope (ṯ)
'd'        → U+130A3  D46  hand
'D'        → U+130BC  I10  cobra (ḏ)
```

Characters with no entry in `UNILITERALS` (digits, punctuation, symbols, unmapped letters) produce an empty string and are silently dropped from output.

### 4.2 `GARDINER`

A secondary table mapping Latin keys to Gardiner sign codes (e.g. `'a': 'G1'`). Used exclusively by the alphabet-reference renderer. It intentionally omits the modern-Latin approximations (`c`, `o`, `v`, `j`, `e`) since those are convenience aliases, not canonical MdC signs.

### 4.3 `VOWELS` (unused at runtime)

A `Set` of vowel characters defined in the file but not currently consumed by any function. Reserved for future phonetic complement or vowel-highlighting features.

---

## 5. Data Flow

```
User keystroke
      │
      ▼
input#latin  ──(input event)──► render()
                                    │
                      ┌─────────────┼──────────────────┐
                      ▼             ▼                   ▼
              toHieroglyphs()   first line        button state
                (full text)     (≤24 chars)      copy / download
                      │             │
                      ▼             ▼
               #output.textContent  #cartouche-text.textContent
               (or '𓂀' if empty)
```

**Preset click path:**
```
.preset button click
      │
      ▼
input.value = button.dataset.text
      │
      ▼
render()  ── (same path as above)
```

**Copy path:**
```
#copy-btn click
      │
      ▼
navigator.clipboard.writeText(output.textContent)
      │
      ▼
button text → 'Copied!' for 1500 ms → restore
```

**Download path:**
```
#download-btn click
      │
      ▼
create off-screen Canvas (1200×630)
      │
      ▼
draw gradient + border + glyphs + latin + attribution
      │
      ▼
canvas.toDataURL('image/png')
      │
      ▼
synthesise <a download="cartouche.png"> → .click()
```

**Alphabet render (one-shot on load):**
```
page load
      │
      ▼
iterate GARDINER entries
      │
      ▼
deduplicate by Gardiner code (Set)
      │
      ▼
alphaEl.innerHTML = generated sign-cell HTML
```

---

## 6. Translation Algorithm

`toHieroglyphs(text: string): string`

```
for each character ch in text:
  if ch === ' '  → emit two space characters (preserve word boundary)
  if ch === '\n' → emit newline
  else:
    look up UNILITERALS[ch]
    if not found, try UNILITERALS[ch.toLowerCase()]
    if still not found, emit '' (silent drop)
```

Complexity: O(n) where n is the number of characters. The 100 ms latency budget (REQ-NF-01) is comfortably met for any realistic user input length.

The case-fallback (`ch.toLowerCase()`) means that most uppercase input is handled gracefully. The only uppercase letters that produce *different* glyphs from their lowercase counterparts are the five MdC case-sensitive codes: `H`, `X`, `S`, `T`, `D`. All others fall through to their lowercase equivalents.

---

## 7. CSS Architecture

### 7.1 Custom Properties

Defined on `:root`:

| Property  | Value     | Semantic role                              |
|-----------|-----------|--------------------------------------------|
| `--sand`  | `#e8d5a3` | Primary text, glyph output, input foreground |
| `--gold`  | `#c9a227` | Accents, borders, headings, button fill   |
| `--dark`  | `#1a1108` | Body background, button foreground text   |
| `--darker`| `#120b04` | Body root background                       |

### 7.2 Background Layers

The `body` background is a two-layer composite:
1. **Radial glow** — `radial-gradient(ellipse at 50% -20%, rgba(201,162,39,0.12), transparent 60%)` — torchlight effect from above.
2. **Register lines** — `repeating-linear-gradient(0deg, transparent 0 34px, rgba(201,162,39,0.03) 34px 35px)` — evokes horizontal text registers on a tomb wall.

### 7.3 Layout

`.tomb` constrains content to `max-width: 760px`, centred with `margin: 0 auto`. This keeps the columnar, scroll-like feel appropriate to papyrus-document conventions.

### 7.4 Cartouche Shape

The shen-ring oval is achieved with `border-radius: 999px` on `.cartouche`. The terminal bar (knotted rope end) is the `::after` pseudo-element: `position: absolute; right: -6px; width: 12px; background: var(--gold)` spanning the full height.

### 7.5 RTL Considerations

The hieroglyph Unicode block is classified LTR by Unicode; output is rendered left-to-right in all current browsers without explicit `dir` attributes. The app does not currently support RTL text in the input. If RTL input support is added, a `dir="auto"` on `#latin` and explicit `direction: ltr` on `.glyphs` and `.cartouche` would be required to prevent bidi reordering of glyph output.

---

## 8. Error Handling & Graceful Degradation

| Scenario | Behaviour |
|---|---|
| Unmapped character in input | `toHieroglyphs` silently drops it; no error, no placeholder |
| Empty input | `#output` shows `𓂀` (Eye of Ra) as placeholder; both action buttons are disabled |
| Clipboard API unavailable | `navigator.clipboard.writeText` throws; unhandled at present — should be wrapped in try/catch with a fallback `document.execCommand('copy')` in future |
| Canvas fingerprint-blocking | `canvas.toDataURL` returns a blank or throws; download link triggers but PNG is blank — documented limitation |
| `speechSynthesis` unavailable | Speak button (once implemented) stays visible but disabled; all other features unaffected |
| Google Fonts blocked | Hieroglyphs fall back to system serif; Cinzel falls back to system serif; layout is unaffected |
| Canvas font not yet loaded | Share-card hieroglyphs rendered in fallback serif; acceptable since font loading is asynchronous and no font-load event is awaited before canvas draw |

---

## 9. Accessibility

- `#output` carries `aria-live="polite"`: screen readers announce translation updates after the user pauses typing, without interrupting mid-keystroke.
- All form controls (`<textarea>`) have associated `<label>` elements.
- Buttons carry descriptive text labels; disabled state communicated via `disabled` attribute (not just visual opacity).
- Colour contrast: `--sand` (#e8d5a3) on `--darker` (#120b04) ≈ 10.5:1, well above WCAG AA (4.5:1). `--gold` (#c9a227) on `--darker` ≈ 5.8:1, meeting AA for large text; note gold-on-dark body text should be verified per use-case if font size is small.
- No motion beyond `transform: translateY(-1px)` on button hover — no vestibular-unsafe animation.

---

## 10. Performance

| Operation | Cost | Notes |
|---|---|---|
| Translation (`toHieroglyphs`) | O(n) string walk | Synchronous, < 1 ms for typical inputs |
| DOM update (`render`) | Two `textContent` assignments + two `disabled` toggles | Minimal reflow |
| Alphabet render | One `innerHTML` write, runs once | ≈ 25 sign cells |
| Share-card canvas | Off-screen 1200×630 draw + `toDataURL` | ≈ 30–80 ms; triggered only on demand |

No `requestAnimationFrame` throttling is currently applied to the `input` handler; this is acceptable because `toHieroglyphs` is synchronous and cheap. If the app is extended with more expensive rendering (e.g. multilateral signs, RTL layout), debouncing with `requestAnimationFrame` or a 50 ms `setTimeout` should be introduced.

---

## 11. Extension Points

The following areas are designed to accept future additions without structural changes:

| Feature | Where to add |
|---|---|
| New glyph mappings | Add entries to `UNILITERALS` and optionally `GARDINER` |
| Phrase / word-level translation | Add a `PHRASES` dict looked up before the character loop in `toHieroglyphs` |
| Word-level cartouche map | Add a `WORD_MAP` dict for well-known names with canonical hieroglyph spellings |
| Audio pronunciation | Add `speak()` function using `speechSynthesis`, gate on `window.speechSynthesis` check |
| Transliteration display | Add `<div id="translit">` to markup, populate in `render()` from matched keys |
| Dark/light theme toggle | Add a second set of `:root` overrides under a `.light` class on `<body>` |
| RTL output mode | Add `direction: rtl` toggle to `.glyphs` and reverse the `toHieroglyphs` output array |
