// Xautomated Support — two-stage matcher.
// Stage 1: score each category by its `triggers`.
// Stage 2: score only the top-K categories' intents with full keyword matching.

import { categoryMap, FALLBACK } from './index';

const STOPWORDS = new Set([
  'a','an','the','is','are','am','was','were','be','been','being',
  'do','does','did','can','could','will','would','should','shall',
  'i','me','my','we','our','you','your','it','its','he','she','they','them',
  'to','of','in','on','at','for','with','from','by','about','as','into','onto',
  'and','or','but','if','then','so','than','that','this','these','those',
  'how','what','when','where','why','who','which','whom',
  'have','has','had','get','got','please','need','want',
]);

const THRESHOLD = 2;
const TRIGGER_BONUS = 2;

export function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t));
}

function scoreKeywords(rawText, tokens, keywords) {
  let score = 0;
  const lower = (rawText || '').toLowerCase();
  for (const kw of keywords || []) {
    if (!kw) continue;
    const k = kw.toLowerCase();
    if (k.includes(' ')) {
      if (lower.includes(k)) score += 6;
    } else {
      if (tokens.includes(k)) score += 4;
      else if (tokens.some(t => t.startsWith(k) || k.startsWith(t))) score += 1;
    }
  }
  return score;
}

function scoreTriggers(rawText, triggers) {
  let score = 0;
  const lower = (rawText || '').toLowerCase();
  for (const t of triggers || []) {
    if (t && lower.includes(t.toLowerCase())) score += TRIGGER_BONUS;
  }
  return score;
}

export function pickBest(rawText) {
  const tokens = tokenize(rawText);
  if (!tokens.length) return { intent: FALLBACK, score: 0, fallback: true };

  // Score EVERY intent. Category triggers only add a bonus; they no longer gate.
  let best = null, bestScore = 0;
  for (const c of categoryMap) {
    const bonus = scoreTriggers(rawText, c.triggers) > 0 ? TRIGGER_BONUS : 0;
    for (const intent of c.intents) {
      const base = scoreKeywords(rawText, tokens, intent.keywords);
      if (base <= 0) continue;
      const total = base + bonus;
      if (total > bestScore) { bestScore = total; best = intent; }
    }
  }

  if (!best || bestScore < THRESHOLD) {
    return { intent: FALLBACK, score: bestScore, fallback: true };
  }
  return { intent: best, score: bestScore, fallback: false };
}
