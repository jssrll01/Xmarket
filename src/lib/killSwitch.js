import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Keys blocked in Xadmin Kill Switches for one scope, for example 'payment'.
export function useBlocked(scope) {
  const [blocked, setBlocked] = useState(() => new Set());
  useEffect(() => {
    let dead = false;
    const load = async () => {
      try {
        const { data } = await supabase.rpc('kill_switch_public');
        if (!dead && Array.isArray(data)) setBlocked(new Set(data.filter((r) => r.scope === scope).map((r) => r.key)));
      } catch (e) { /* keep the last known list */ }
    };
    load();
    const t = setInterval(load, 30000);
    const vis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', vis);
    return () => { dead = true; clearInterval(t); document.removeEventListener('visibilitychange', vis); };
  }, [scope]);
  return { blocked };
}

// Xadmin saves payment switches as gcash, maya and gotyme. Checkout names can be "GCash", "Maya", "Bank transfer".
export function payBlocked(blocked, p) {
  const t = (String(p.id || '') + ' ' + String(p.label || '')).toLowerCase();
  if (t.includes('wallet')) return false;
  const key = t.includes('gcash') ? 'gcash' : t.includes('maya') ? 'maya' : (t.includes('gotyme') || t.includes('bank')) ? 'gotyme' : null;
  return !!key && blocked.has(key);
}
