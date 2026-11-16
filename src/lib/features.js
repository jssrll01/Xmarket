import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const cache = { at: 0, data: null, p: null };

export function loadFeatures() {
  if (cache.data && Date.now() - cache.at < 60000) return Promise.resolve(cache.data);
  if (!cache.p) {
    cache.p = Promise.resolve(supabase.rpc('features_public')).then(({ data }) => {
      cache.data = data || {}; cache.at = Date.now(); cache.p = null; return cache.data;
    }, () => { cache.p = null; return {}; });
  }
  return cache.p;
}

export function useFeatures() {
  const [f, setF] = useState(cache.data);
  useEffect(() => {
    let alive = true;
    loadFeatures().then((d) => { if (alive) setF(d); });
    return () => { alive = false; };
  }, []);
  return {
    ready: f !== null,
    on: (k) => !!(f && f[k] && f[k].on),
    cfg: (k) => (f && f[k] && f[k].cfg) || {},
  };
}
