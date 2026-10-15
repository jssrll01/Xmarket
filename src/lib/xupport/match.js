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

const TOP_K = 3;
const THRESHOLD = 3;
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
      if (tokens.includes(k)) score += 3;
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

  const ranked = categoryMap
    .map((c) => ({ c, s: scoreTriggers(rawText, c.triggers) }))
    .sort((a, b) => b.s - a.s);

  const shortlist = ranked.slice(0, TOP_K);

  let best = null, bestScore = 0;
  for (const { c } of shortlist) {
    for (const intent of c.intents) {
      const s = scoreKeywords(rawText, tokens, intent.keywords);
      if (s > bestScore) { bestScore = s; best = intent; }
    }
  }

  if (!best || bestScore < THRESHOLD) {
    return { intent: FALLBACK, score: bestScore, fallback: true };
  }
  return { intent: best, score: bestScore, fallback: false };
}
