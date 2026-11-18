import { supabase } from './supabase';

const RK = 'xm_recent_searches';
const logged = new Set();

export const getRecent = () => { try { return JSON.parse(localStorage.getItem(RK)) || []; } catch (e) { return []; } };
const saveRecent = (a) => { try { localStorage.setItem(RK, JSON.stringify(a.slice(0, 8))); } catch (e) {} };
export const clearRecent = () => saveRecent([]);

export async function logSearch(term) {
  const t = String(term || '').trim().toLowerCase();
  if (t.length < 3 || t.length > 60) return;
  saveRecent([t, ...getRecent().filter((x) => x !== t)]);
  if (logged.has(t)) return;
  logged.add(t);
  try { await supabase.from('search_log').insert({ term: t }); } catch (e) {}
}

export async function fetchTrending() {
  try {
    const { data, error } = await supabase.rpc('search_trending');
    if (error || !Array.isArray(data) || !data.length) return null;
    return data.map((r) => (typeof r === 'string' ? r : r.term)).filter(Boolean);
  } catch (e) { return null; }
}
