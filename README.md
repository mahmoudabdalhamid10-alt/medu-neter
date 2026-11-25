# Medu Neter — the Hieroglyph Typewriter

Type modern English and watch it become 3,000-year-old Egyptian hieroglyphs, with
Egyptological transliteration, curated translations of common phrases, audio
pronunciation, a royal cartouche for your name, and a shareable card image.

**Live demo:** https://mahmoudabdalhamid10-alt.github.io/medu-neter/

## Features
- Letter-by-letter hieroglyph typewriter (Manuel de Codage uniliterals → Unicode Egyptian Hieroglyphs)
- Curated phrase translations for common modern phrases
- Conventional Egyptological transliteration under every output
- "Listen" button: Web Speech API reads the transliteration aloud (Arabic voice preferred)
- Name cartouche generator
- One-click share card (1200×630 PNG, drawn client-side on Canvas)
- Alphabet guide with Gardiner sign numbers

## Built with Kiro
This project was developed with [Kiro](https://kiro.dev) (agentic AI IDE/CLI):
- Spec-driven development: see [`.kiro/specs/medu-neter/`](.kiro/specs/medu-neter/) for requirements (EARS notation), design, and task list.
- Steering: [`.kiro/steering/product.md`](.kiro/steering/product.md) guides the agent's code style and product tone.
- Kiro implemented the transliteration strip, phrase dictionary, and audio playback from the spec.

## Tech
Vanilla HTML/CSS/JS. No frameworks, no build step, no dependencies, fully client-side.

## License
MIT — see [LICENSE](LICENSE).
