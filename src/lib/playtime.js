import { supabase } from './supabase';

export const fmt = (n) => Number(n || 0).toLocaleString('en-PH');
export const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const newKey = () => (window.crypto && window.crypto.randomUUID)
  ? window.crypto.randomUUID()
  : 'k' + Date.now() + Math.random().toString(36).slice(2);

// One idempotency key per user action; a retry re-sends the SAME key, so it can never pay twice.
async function call(name, args) {
  let last = null;
  for (let i = 0; i < 2; i++) {
    const { data, error } = await supabase.rpc(name, args);
    if (!error && data) return data;
    last = error;
  }
  return { ok: false, error: 'network', message: (last && last.message) || 'Request failed. Please try again.' };
}

export const fetchStatus = () => call('playtime_status', {});
export const play = (game, tier) => call('playtime_play', { p_game: game, p_tier: tier || null, p_idem: newKey() });
export const exchange = (points) => call('playtime_exchange', { p_points: points, p_idem: newKey() });

export async function fetchHistory(limit = 50) {
  const { data } = await supabase.from('playtime_txns').select('*').order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

export const playMini = (game, choice) => call('playtime_mini', { p_game: game, p_choice: choice, p_idem: newKey() });

