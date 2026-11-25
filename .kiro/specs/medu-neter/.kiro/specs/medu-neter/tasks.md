# Medu Neter — Implementation Tasks

Maps each requirement group in `requirements.md` to concrete implementation tasks.
Completed tasks reflect the state of `index.html`, `app.js`, and `style.css`.

---

## 3.1 Phrase Translation

- [x] REQ-TRANS-01 — Wire `input` event on the textarea to call `render()` and update the glyph output within a single animation frame (< 100 ms).
- [ ] - [x] REQ-TRANS-02 — Map space characters to two consecutive Unicode spaces in `toHieroglyphs()` to preserve word boundaries.
- [ ] - [x] REQ-TRANS-03 — Pass newline characters through unchanged in `toHieroglyphs()` to preserve multi-line structure.
- [ ] - [x] REQ-TRANS-04 — Silently drop unmapped characters (punctuation, digits, symbols) by returning an empty string for unrecognised input.
- [ ] - [x] REQ-TRANS-05 — Normalise lookup in `toHieroglyphs()` to try `ch.toLowerCase()` as a fallback so case variants map to the same glyph.
- [ ] - [x] REQ-TRANS-06 — Render the Eye-of-Ra placeholder (`𓂀`) in the output panel when the translated string is empty or
