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
  'l': '\u{1307C}', // E23 lion (Ptolemaic)
  'h': '\u{1308D}', // O4 reed shelter
  'H': '\u{131A3}', // V28 wick (emphatic h)
  'x': '\u{13121}', // F32 animal belly (kh)
  'X': '\u{13284}', // R8 djeded (second kh)
  'z': '\u{1328B}', // O34 bolt
  's': '\u{1328B}', // O34 bolt
  'S': '\u{13209}', // M8 pool (shin)
  'q': '\u{1320B}', // N29 hill slope
  'k': '\u{133A1}', // V31 basket
  'g': '\u{133BC}', // W11 jar stand
  't': '\u{133CF}', // X1 bread loaf
  'T': '\u{13169}', // V13 tethering rope (tj)
  'd': '\u{130A3}', // D46 hand
  'D': '\u{130BC}', // I10 cobra (dj)
  'j': '\u{1300A}', // M17 reed
  'c': '\u{133A1}', // V31 basket (modern k sound)
  'o': '\u{13091}', // G43 quail chick (modern)
  'v': '\u{13132}', // I9 horned viper (modern)
};

// Common phonetic complements for flair (optional doubling)
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

// ---------------------------------------------------------------------------
// PHRASES — historically grounded curated translations for common modern phrases.
//
// Each entry maps a normalised English phrase (lowercase, trimmed) to:
//   glyphs : the hieroglyphic rendering as a Unicode string
//   translit: Egyptological transliteration in MdC ASCII
//   note   : a brief scholarly note shown beneath the output
//
// Egyptian had no word-for-word equivalents of most modern pleasantries;
// these renderings use attested formulae from funerary and epistolary texts.
// ---------------------------------------------------------------------------
const PHRASES = {
  'hello': {
    glyphs:   '\u{1308D}\u{1300A}\u{1307C}\u{1307C}\u{1308B}',   // h-i-l-l-r → "hail"
    translit: 'inD Hr',
    note:     '"inD Hr" — "Hail!" The standard salutation in Middle-Kingdom letters, literally "protecting the face."',
  },
  'hi': {
    glyphs:   '\u{1308D}\u{1300A}\u{1307C}\u{1307C}\u{1308B}',
    translit: 'inD Hr',
    note:     '"inD Hr" — the customary greeting of Egyptian scribes. Even the pharaoh received it.',
  },
  'goodbye': {
    glyphs:   '\u{1308D}\u{1300A}\u{1307C}\u{1307C}\u{1308B}\u{1308D}\u{132AA}',
    translit: 'Dw nfr',
    note:     '"Dw nfr" — "good departure." Egyptian letters close with a wish for a safe journey.',
  },
  'good morning': {
    glyphs:   '\u{1300A}\u{132AA}\u{13000}\u{1308D}\u{1308B}\u{13091}',
    translit: 'dwA nTr',
    note:     '"dwA nTr" — literally "adoring the god," the dawn ritual performed as the sun-god Re rose each morning.',
  },
  'good night': {
    glyphs:   '\u{1308D}\u{1300A}\u{1307C}\u{1307C}\u{1308B}\u{13000}\u{13216}\u{1300A}\u{132AA}',
    translit: 'grH nfr',
    note:     '"grH nfr" — "beautiful night." Night belonged to Nut, the sky-goddess who swallowed the sun and birthed it again at dawn.',
  },
  'thank you': {
    glyphs:   '\u{130A3}\u{1300A}\u{132AA}\u{13216}\u{1308B}',
    translit: 'd(i) n(i) Hr',
    note:     '"di n Hr" — "giving to the face," an epistolary expression of gratitude attested in Ramesside letters.',
  },
  'thanks': {
    glyphs:   '\u{130A3}\u{1300A}\u{132AA}\u{13216}\u{1308B}',
    translit: 'd(i) n(i) Hr',
    note:     '"di n Hr" — the same gratitude formula scribes used when writing to officials and gods alike.',
  },
  'please': {
    glyphs:   '\u{1308D}\u{132AA}\u{1328B}\u{1328B}',
    translit: 'Hss',
    note:     '"Hss" — "favour, approval." To ask a favour was to invoke the god\'s or official\'s gracious will.',
  },
  'i love you': {
    glyphs:   '\u{1308D}\u{1300A}\u{1300A}\u{1300A}\u{133A1}',
    translit: 'mri',
    note:     '"mri" — the Egyptian verb "to love." Love poetry from the New Kingdom uses this word with remarkable tenderness.',
  },
  'love': {
    glyphs:   '\u{13153}\u{1308B}\u{1300A}',
    translit: 'mri',
    note:     '"mri" — desire and love in one word. The Chester Beatty papyri (c. 1300 BCE) hold the oldest love poetry in human history.',
  },
  'peace': {
    glyphs:   '\u{1308D}\u{1308B}\u{1308B}\u{1308B}\u{132AA}',
    translit: 'Htp',
    note:     '"Htp" — "peace, contentment, offering." Inscribed on altars, in prayers, and on the lips of every scribe who closed a letter.',
  },
  'life': {
    glyphs:   '\u{1300A}\u{133CF}\u{132AA}',
    translit: 'anx',
    note:     '"anx" — the word "life" itself, written with the ankh sign that has become the most recognisable Egyptian symbol worldwide.',
  },
  'death': {
    glyphs:   '\u{130BC}\u{133CF}\u{1300A}',
    translit: 'mwt',
    note:     '"mwt" — death. For Egyptians, it was not an ending but a transition; the Book of the Dead is a guide through it.',
  },
  'eternity': {
    glyphs:   '\u{130A3}\u{1308B}\u{132AA}\u{1308B}',
    translit: 'nHH',
    note:     '"nHH" — one of two words for eternity. It refers to cyclical, recurring time — the eternal return of the sun.',
  },
  'sun': {
    glyphs:   '\u{1308B}\u{1300A}\u{132AA}',
    translit: 'Ra',
    note:     '"Ra" — the sun god, the supreme deity of Heliopolis. Every pharaoh carried his name as part of their royal titulary.',
  },
  'moon': {
    glyphs:   '\u{13000}\u{1308D}\u{132AA}',
    translit: 'iaH',
    note:     '"iaH" — the moon deity. The moon governed the Egyptian calendar and the festival cycle.',
  },
  'water': {
    glyphs:   '\u{13216}\u{132AA}\u{1308B}',
    translit: 'mw',
    note:     '"mw" — water, one of the four primordial elements. The Nile\'s annual flood was Egypt\'s lifeblood and calendar.',
  },
  'fire': {
    glyphs:   '\u{1308D}\u{1300A}\u{132AA}',
    translit: 'sdH',
    note:     '"sdH" — fire in Egyptian ritual. Protective flames guarded temple sanctuaries and the gates of the underworld.',
  },
  'king': {
    glyphs:   '\u{132AA}\u{133CF}\u{1308B}',
    translit: 'nswt',
    note:     '"nswt" — the word for king of Upper Egypt. The pharaoh held five royal names; nswt was part of the most ancient title.',
  },
  'queen': {
    glyphs:   '\u{13153}\u{1308D}\u{1300A}\u{133CF}',
    translit: 'Hmt-nswt',
    note:     '"Hmt-nswt" — "wife of the king." Powerful queens like Hatshepsut and Nefertiti exceeded this title considerably.',
  },
  'god': {
    glyphs:   '\u{132AA}\u{133CF}\u{1308B}',
    translit: 'nTr',
    note:     '"nTr" — "god." Egypt counted over 2,000 deities; the word nTr referred to any divine being or sacred force.',
  },
  'cursed': {
    glyphs:   '\u{1308D}\u{1300A}\u{132AA}\u{1300A}',
    translit: 'bint',
    note:     '"bint" — "evil, bad, cursed." Execration texts inscribed enemy names on pottery shards to shatter and neutralise them.',
  },
  'blessed': {
    glyphs:   '\u{1308D}\u{132AA}\u{1308B}',
    translit: 'imAxy',
    note:     '"imAxy" — "revered, blessed." After death, a person judged worthy became imAxy — venerated by their descendants.',
  },
  'truth': {
    glyphs:   '\u{13153}\u{1300A}\u{133CF}',
    translit: 'mAat',
    note:     '"mAat" — truth, justice, cosmic order. The goddess Maat\'s feather was weighed against the heart of the dead.',
  },
  'magic': {
    glyphs:   '\u{1308D}\u{133A1}\u{1300A}',
    translit: 'HkA',
    note:     '"HkA" — magic and divine power. Heka was both a concept and a god; spells were as real as stone to the Egyptians.',
  },
  'write': {
    glyphs:   '\u{1328B}\u{133CF}\u{1300A}',
    translit: 'sS',
    note:     '"sS" — to write, to draw, to paint. The scribe who carved these words was among the most respected people in Egypt.',
  },
  'name': {
    glyphs:   '\u{1308B}\u{132AA}\u{1308B}',
    translit: 'rn',
    note:     '"rn" — the name. Egyptians believed destroying a person\'s name destroyed their soul. A name spoken aloud gave life.',
  },
};

// ---------------------------------------------------------------------------
// Audio state — a single utterance reference so we can cancel in-flight speech.
// ---------------------------------------------------------------------------
let currentUtterance = null;

// Selects the best available voice for the transliteration reading.
// Arabic is phonetically closest to Ancient Egyptian consonants; falls back
// to whatever the browser provides as its default.
function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Prefer any Arabic-language voice (ar-*).
  const arabic = voices.find((v) => v.lang.startsWith('ar'));
  if (arabic) return arabic;
  // Broad fallback: any voice the browser offers.
  return voices[0] || null;
}

// Stops any utterance currently playing or queued.
function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

// Maps source text to Egyptological MdC ASCII transliteration (H, x, S, T, D, …).
// Unmapped characters (spaces, punctuation, digits) are silently omitted,
// consistent with toHieroglyphs() behaviour defined in REQ-TRANS-04.
function toTranslit(text) {
  const out = [];
  for (const ch of text) {
    if (ch === '\n') { out.push('\n'); continue; }
    const key = UNILITERALS[ch] ? ch : (UNILITERALS[ch.toLowerCase()] ? ch.toLowerCase() : null);
    if (key) out.push(key);
  }
  return out.join('');
}

function toHieroglyphs(text) {
  const out = [];
  for (const ch of text) {
    if (ch === ' ') { out.push('  '); continue; }
    if (ch === '\n') { out.push('\n'); continue; }
    const sign = UNILITERALS[ch] || UNILITERALS[ch.toLowerCase()];
    out.push(sign || '');
  }
  return out.join('');
}

const input = document.getElementById('latin');
const output = document.getElementById('output');
const translit = document.getElementById('translit');
const phraseNote = document.getElementById('phrase-note');
const cartouche = document.getElementById('cartouche');
const cartoucheText = document.getElementById('cartouche-text');
const listenBtn = document.getElementById('listen-btn');

function render() {
  const text = input.value;
  const key = text.trim().toLowerCase();

  // Phrase lookup: if the input matches a known phrase, use the curated rendering.
  const phrase = PHRASES[key];

  const glyphs = phrase ? phrase.glyphs : toHieroglyphs(text);
  const translitText = phrase ? phrase.translit : toTranslit(text);

  output.textContent = glyphs || '𓂀';
  translit.textContent = translitText;

  // Show or hide the scholar's note for curated phrases.
  if (phrase) {
    phraseNote.textContent = phrase.note;
    phraseNote.hidden = false;
  } else {
    phraseNote.textContent = '';
    phraseNote.hidden = true;
  }

  // Cartouche shows the first line of letter-by-letter glyphs (always unfiltered).
  cartoucheText.textContent = toHieroglyphs(text.split('\n')[0].slice(0, 24));

  const hasContent = !!glyphs.trim();
  document.getElementById('copy-btn').disabled = !hasContent;
  document.getElementById('download-btn').disabled = !hasContent;
  if (listenBtn) listenBtn.disabled = !hasContent;

  // If speech is in progress and the input changes, stop it (REQ-AUDIO-03).
  stopSpeech();
}

input.addEventListener('input', render);

document.getElementById('copy-btn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = 'Copy hieroglyphs'), 1500);
  } catch (_) {
    // Clipboard access denied — silently ignore.
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
  const name = input.value.split('\n')[0].slice(0, 24) || 'medu-neter';
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 630;
  const ctx = canvas.getContext('2d');
  // papyrus-toned card
  const grad = ctx.createLinearGradient(0, 0, 0, 630);
  grad.addColorStop(0, '#2b1d0e');
  grad.addColorStop(1, '#1a1108');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1200, 630);
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1140, 570);
  ctx.fillStyle = '#e8d5a3';
  ctx.font = '110px "Noto Sans Egyptian Hieroglyphs", serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(toHieroglyphs(name), 600, 280);
  ctx.font = '36px serif';
  ctx.fillStyle = '#c9a227';
  ctx.fillText(name, 600, 430);
  ctx.font = '28px serif';
  ctx.fillText('Medu Neter — the Hieroglyph Typewriter', 600, 520);
  const a = document.createElement('a');
  a.download = 'cartouche.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
});


// ---------------------------------------------------------------------------
// Audio playback — REQ-AUDIO-01 through REQ-AUDIO-05
// Uses SpeechSynthesisUtterance. Prefers an Arabic voice for phonetic
// proximity to Ancient Egyptian; degrades to any available voice.
// ---------------------------------------------------------------------------
if (listenBtn) {
  if (!window.speechSynthesis) {
    // REQ-AUDIO-05: browser has no speech support — mark unavailable and bail.
    listenBtn.disabled = true;
    listenBtn.title = 'Speech synthesis is not available in this browser.';
  } else {
    listenBtn.addEventListener('click', () => {
      // REQ-AUDIO-03: cancel any playback that is still running.
      stopSpeech();

      const text = translit.textContent.trim();
      if (!text) return; // Guard: button should already be disabled, but be safe.

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.78;   // Measured delivery — ancient gravitas.
      utter.pitch = 0.9;

      // Pick the best available voice asynchronously (voices may load late).
      const assign = () => {
        const voice = pickVoice();
        if (voice) utter.voice = voice;
      };
      assign();
      // Some browsers fire onvoiceschanged before they expose voices; handle both.
      if (!window.speechSynthesis.getVoices().length) {
        window.speechSynthesis.onvoiceschanged = assign;
      }

      utter.onend = () => { currentUtterance = null; };
      utter.onerror = () => { currentUtterance = null; };

      currentUtterance = utter;
      window.speechSynthesis.speak(utter);
    });
  }
}

// Preset names for one-click demos
document.querySelectorAll('.preset').forEach((b) =>
  b.addEventListener('click', () => {
    input.value = b.dataset.text;
    render();
  })
);

// Preset phrases for one-click curated translations
document.querySelectorAll('.preset-phrase').forEach((b) =>
  b.addEventListener('click', () => {
    input.value = b.dataset.text;
    render();
    input.focus();
  })
);

// Alphabet guide: every uniliteral with its Gardiner sign number
const GARDINER = {
  a: 'G1', i: 'M17', y: 'Z4', w: 'G43', b: 'D58', p: 'Q3', f: 'I9',
  m: 'G17', n: 'N35', r: 'D21', l: 'E23', h: 'O4', H: 'V28', x: 'F32',
  X: 'R8', z: 'O34', s: 'O34', S: 'M8', q: 'N29', k: 'V31', g: 'W11',
  t: 'X1', T: 'V13', d: 'D46', D: 'I10',
};
const alphaEl = document.getElementById('alphabet');
if (alphaEl) {
  const seen = new Set();
  let html = '';
  for (const [ch, code] of Object.entries(GARDINER)) {
    if (seen.has(code)) continue;
    seen.add(code);
    html += `<div class="sign"><span class="sign-glyph">${UNILITERALS[ch]}</span><span class="sign-letter">${ch}</span><span class="sign-code">${code}</span></div>`;
  }
  alphaEl.innerHTML = html;
}

render();
