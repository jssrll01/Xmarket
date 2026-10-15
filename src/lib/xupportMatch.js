// Xautomated Support — matching engine
// Tokenizes the user message and scores each intent in xupportBrain.js.
// Higher score = better match. Below THRESHOLD => fallback.

import { intents, FALLBACK } from './xupportBrain';

const STOPWORDS = new Set([
  'a','an','the','is','are','am','was','were','be','been','being',
  'do','does','did','can','could','will','would','should','shall',
  'i','me','my','we','our','you','your','it','its','he','she','they','them',
  'to','of','in','on','at','for','with','from','by','about','as','into','onto',
  'and','or','but','if','then','so','than','that','this','these','those',
  'how','what','when','where','why','who','which','whom',
  'have','has','had','get','got','please','help','need','want',
]);

export function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t));
}

function scoreIntent(rawText, tokens, intent) {
  let score = 0;
  const lower = (rawText || '').toLowerCase();

  for (const kw of intent.keywords) {
    if (!kw) continue;
    const k = kw.toLowerCase();
    if (k.includes(' ')) {
      // phrase — big weight if present verbatim
      if (lower.includes(k)) score += 6;
    } else {
      if (tokens.includes(k)) score += 3;
      else if (tokens.some(t => t.startsWith(k) || k.startsWith(t))) score += 1;
    }
  }
  return score;
}

export const THRESHOLD = 3;

export function pickBest(rawText) {
  const tokens = tokenize(rawText);
  if (!tokens.length) return { intent: null, score: 0, fallback: true };

  let best = null;
  let bestScore = 0;
  for (const intent of intents) {
    const s = scoreIntent(rawText, tokens, intent);
    if (s > bestScore) { bestScore = s; best = intent; }
  }

  if (!best || bestScore < THRESHOLD) {
    return { intent: FALLBACK, score: bestScore, fallback: true };
  }
  return { intent: best, score: bestScore, fallback: false };
}
