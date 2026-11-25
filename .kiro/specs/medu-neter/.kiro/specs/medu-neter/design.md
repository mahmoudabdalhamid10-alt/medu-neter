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
