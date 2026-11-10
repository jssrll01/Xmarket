import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';

const norm = (n) => String(n || '').replace(/^@/, '').trim().toLowerCase();

/* ---- other people's badges, looked up by username (batched, cached 60s) ---- */
const TTL = 60000;
const cache = new Map();
const subs = new Set();
const waiting = new Set();
let timer = null;

async function flush() {
  timer = null;
  const names = [...waiting];
  waiting.clear();
  for (let i = 0; i < names.length; i += 100) {
    const chunk = names.slice(i, i + 100);
    let map = {};
    try {
      const { data, error } = await supabase.rpc('perk_flags', { p_names: chunk });
      if (!error && data && typeof data === 'object' && !Array.isArray(data)) map = data;
    } catch (e) { /* offline: no badges */ }
    const t = Date.now();
    chunk.forEach((n) => cache.set(n, { t, f: map[n] || null }));
  }
  subs.forEach((fn) => fn());
}

export function usePerkFlags(username) {
  const n = norm(username);
  const [, tick] = useState(0);
  useEffect(() => {
    if (!n) return undefined;
    const fn = () => tick((x) => x + 1);
    subs.add(fn);
    const hit = cache.get(n);
    if (!hit || Date.now() - hit.t > TTL) {
      waiting.add(n);
      if (!timer) timer = setTimeout(flush, 120);
    }
    return () => { subs.delete(fn); };
  }, [n]);
  const hit = n ? cache.get(n) : null;
  return hit ? hit.f : null;
}

/* ---- my own perks (booster, verified...) ---- */
const mine = { uid: null, t: 0, data: null, p: null };
function fetchMine(uid, force) {
  if (mine.uid !== uid) { mine.uid = uid; mine.data = null; mine.t = 0; mine.p = null; }
  if (!force && mine.data && Date.now() - mine.t < 30000) return Promise.resolve(mine.data);
  if (!force && mine.p) return mine.p;
  const p = supabase.rpc('my_perks').then(({ data }) => {
    if (data && typeof data === 'object') { mine.data = data; mine.t = Date.now(); }
    return mine.data;
  }).finally(() => { if (mine.p === p) mine.p = null; });
  mine.p = p;
  return p;
}

export function useMyPerks() {
  const { user } = useAuth();
  const uid = user ? user.id : null;
  const [data, setData] = useState(uid && mine.uid === uid ? mine.data : null);
  useEffect(() => {
    if (!uid) { setData(null); return undefined; }
    let alive = true;
    const run = (force) => fetchMine(uid, force).then((d) => { if (alive) setData(d); });
    run(false);
    const h = () => run(true);
    window.addEventListener('xmarket:perks-changed', h);
    return () => { alive = false; window.removeEventListener('xmarket:perks-changed', h); };
  }, [uid]);
  return data;
}
