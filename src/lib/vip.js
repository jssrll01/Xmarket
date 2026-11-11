import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';

export const VIP_PRICE = 249;
export const VIP_DAYS = 30;
const EVT = 'xmarket:vip-changed';
const cache = { uid: null, at: 0, data: null };
let inflight = null;

export function fetchVipStatus(uid, force = false) {
  if (!uid) return Promise.resolve(null);
  if (!force && cache.uid === uid && cache.data && Date.now() - cache.at < 30000) return Promise.resolve(cache.data);
  if (!force && inflight && inflight.uid === uid) return inflight.p;
  const p = supabase.rpc('vip_status').then(({ data, error }) => {
    if (error || !data) return cache.uid === uid ? cache.data : null;
    cache.uid = uid; cache.at = Date.now(); cache.data = data;
    return data;
  }).finally(() => { if (inflight && inflight.p === p) inflight = null; });
  inflight = { uid, p };
  return p;
}

export async function purchaseVip() {
  const { data, error } = await supabase.rpc('vip_purchase');
  if (error) return { data: null, error: { message: error.message } };
  cache.at = 0;
  window.dispatchEvent(new Event(EVT));
  return { data, error: null };
}

export async function fetchVipHistory(uid) {
  const { data } = await supabase.from('vip_memberships').select('*')
    .eq('user_id', uid).order('created_at', { ascending: false });
  return data || [];
}

const isLive = (s) => !!(s && s.active && s.expires_at && new Date(s.expires_at).getTime() > Date.now());

export function useVip() {
  const { user } = useAuth();
  const uid = user?.id || null;
  const [status, setStatus] = useState(cache.uid === uid ? cache.data : null);
  const [loading, setLoading] = useState(!!uid && !(cache.uid === uid && cache.data));

  const refresh = useCallback(
    () => fetchVipStatus(uid, true).then((s) => { setStatus(s); return s; }),
    [uid]
  );

  useEffect(() => {
    let alive = true;
    if (!uid) { setStatus(null); setLoading(false); return undefined; }
    fetchVipStatus(uid).then((s) => { if (alive) { setStatus(s); setLoading(false); } });
    const onChange = () => { fetchVipStatus(uid, true).then((s) => { if (alive) setStatus(s); }); };
    window.addEventListener(EVT, onChange);
    return () => { alive = false; window.removeEventListener(EVT, onChange); };
  }, [uid]);

  return { isVip: isLive(status), status, loading, refresh };
}
