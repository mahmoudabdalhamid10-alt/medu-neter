# Medu Neter — Product Steering

This file steers Kiro's behaviour when working on the Medu Neter codebase. Read it before making any changes to this project.

---

## Product Vision

Medu Neter ("words of the gods") resurrects a 3,000-year-old script in a modern browser. A person types anything — their name, a curse, a blessing — and reads it instantly in authentic Egyptian hieroglyphs. No app to install, no account to create, no server to call. The whole experience lives in three files.

The app was built for Kiroween 2026 (category: Resurrection). It is released under the MIT licence.

---

## Target Users

**Primary:** Curious adults — history enthusiasts, Egyptology students, language nerds — who have heard of hieroglyphs but never interacted with them directly. They want delight and surprise, not a lecture.

**Secondary:** Social-media sharers who want an unusual, visually striking image of their own name to post. The share-card feature (1200 × 630 PNG) exists for them.

**Tertiary:** Educators and self-learners who use the alphabet-reference section as a teaching aid.

What all three share: they expect the app to feel ancient and mysterious *and* respond instantly. The typewriter effect is the core experience — if it lags, the magic breaks.

---

## Tone & Aesthetic

The app adopts the persona of an ancient Egyptian scribe who has somehow mastered the modern web. Every word should feel like it was carved into stone, then made interactive.

**Writing tone (UI copy, comments, documentation):**
- Spare and declarative. Short sentences. No filler.
- Occasional gravity: "unread for millennia, alive again in your browser."
- Never cute, never corporate, never apologetic.
- Technical comments in `app.js` should be precise and informative, as a senior scribe annotating their papyrus.

**Visual tone (CSS, layout, canvas output):**
- Dark tomb interior: near-black backgrounds (`#120b04`, `#1a1108`), sand-parchment text (`#e8d5a3`), gold accents (`#c9a227`).
- Horizontal register lines and a radial torchlight glow from above — always present, never overpowering.
- Gold borders, rounded-pill buttons, monumental Cinzel headings.
- Nothing blinks, bounces, or slides. Motion is limited to a 1 px button lift on hover.

---

## Coding Conventions

These are non-negotiable constraints for this project. Do not introduce anything that violates them.

### Language & Runtime
- **Vanilla JavaScript only.** No frameworks, no libraries, no imports, no `require`.
- **No build step.** The source files (`index.html`, `app.js`, `style.css`) are the production files. No transpilation, no bundling, no minification pipeline.
- **No external dependencies** beyond the two Google Fonts families already declared (`Noto Sans Egyptian Hieroglyphs`, `Cinzel`). Do not add new `<link>` or `<script>` tags that load from third-party origins.
- **No backend.** No fetch to any API, no WebSocket, no server-side logic. The app must work from `file://` with no network at all (except fonts on first load).
- **No cookies, no localStorage, no sessionStorage, no IndexedDB.** The app is stateless across page loads.

### File Discipline
- All runtime logic lives in `app.js`. No inline `<script>` blocks in `index.html`.
- All styling lives in `style.css`. No inline `style` attributes on elements (canvas draw operations are the only exception).
- `index.html` contains semantic HTML only. No presentational markup.

### JavaScript Style
- Use `const` and `let`; never `var`.
- Module-level data (`UNILITERALS`, `GARDINER`, `VOWELS`) is declared with `const` as plain object/Set literals at the top of the file, before any functions.
- Functions are declared with `function` keyword at the module level; arrow functions are used for inline callbacks only.
- Event listeners are attached after DOM-dependent constants are declared.
- No classes. The app is too small to need them and they add ceremony without clarity.
- Prefer `textContent` over `innerHTML` for user-derived content. Use `innerHTML` only when constructing fixed HTML from trusted internal data (e.g. the alphabet grid).
- Error paths: wrap async operations (`navigator.clipboard.writeText`) in `try/catch`. Do not let unhandled promise rejections surface to the user.

### CSS Style
- All colours are referenced via CSS custom properties defined on `:root` (`--sand`, `--gold`, `--dark`, `--darker`). Never hard-code a hex value in a rule; always use the variable.
- Sizing uses `px` for fixed elements (borders, icons, canvas dimensions), `rem` for type-relative sizing in content areas, and `%` or `auto` for layout widths.
- No CSS preprocessors, no utility-class frameworks.

### RTL Safety
- The app currently renders all output left-to-right. When adding any new text-containing element, do not use `direction: rtl` or `text-align: right` on a container that also holds hieroglyph output — bidi reordering will corrupt glyph sequences.
- If RTL input support is ever added, it must be scoped to the `#latin` textarea only, and glyph output containers must carry an explicit `direction: ltr` override.

### Accessibility
- Every form control has an associated `<label>`.
- Dynamic output regions use `aria-live="polite"`.
- Buttons that may be disabled use the `disabled` attribute, not just reduced opacity.
- Colour contrast for body text must meet WCAG 2.1 AA (4.5:1 minimum). The sand-on-darker combination is ≈ 10.5:1 and must be preserved.

---

## What Kiro Should Never Do Here

- Do not introduce a package manager, a `package.json`, a `node_modules` directory, or any lock file.
- Do not add a `dist/` or `build/` directory.
- Do not add TypeScript, JSX, or any compile-to-JS language.
- Do not add a linter config, a formatter config, or a CI workflow unless explicitly asked.
- Do not add test files unless explicitly asked to write tests.
- Do not modify the existing visual theme without an explicit request to do so. The tomb aesthetic is intentional and load-bearing.
- Do not add tracking pixels, analytics scripts, or any third-party tag.
- Do not add a `manifest.json` or service worker unless explicitly asked to make the app a PWA.
