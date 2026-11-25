// Medu Neter — the Hieroglyph Typewriter
// Resurrects the 3,000-year-old Egyptian script as a modern typewriter.
// Mapping: Manuel de Codage uniliteral alphabet -> Unicode Egyptian Hieroglyphs.
//
// Phrase translation (REQ-TRANS): known modern phrases map to curated Egyptian
// renderings with a scholar's note rather than the letter-by-letter fallback.
//
// Audio playback (REQ-AUDIO): the Listen button speaks the transliteration via
// SpeechSynthesisUtterance, preferring an Arabic voice for phonetic proximity.

const UNILITERALS = {
    'a': '\u{13000}', // G1 vulture (aleph)
    'i': '\u{1300A}', // M17 reed
    'y': '\u{1300C}', // Z4 dual strokes
    'e': '\u{1300A}', // M17 reed (approximation for modern spelling)
    'w': '\u{13091}', // G43 quail chick
    'u': '\u{13091}', // G43 quail chick
    'b': '\u{13080}', // D58 foot
    'p': '\u{132AA}', // Q3 stool
    'f': '\u{13132}', // I9 horned viper
    'm': '\u{13153}', // G17 owl
    'n': '\u{13216}', // N35 water ripple
    'r': '\u{1308B}', // D21 mouth
    'l': 
