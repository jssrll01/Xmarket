import { supabase } from './supabase';

let _cached = null;
let _fetchedAt = 0;

export async function getFeeConfig() {
  if (_cached && Date.now() - _fetchedAt < 60000) return _cached;
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'transaction_fee')
      .maybeSingle();
    _cached = data?.value || { enabled: false, percent: 0, min_fee: 0, max_fee: null };
    _fetchedAt = Date.now();
  } catch {
    _cached = { enabled: false, percent: 0, min_fee: 0, max_fee: null };
  }
  return _cached;
}

export function calcFee(amount, cfg) {
  if (!cfg || !cfg.enabled) return 0;
  const pct = Number(cfg.percent || 0) / 100;
  let fee = Number(amount || 0) * pct;
  if (cfg.min_fee != null) fee = Math.max(fee, Number(cfg.min_fee));
  if (cfg.max_fee != null) fee = Math.min(fee, Number(cfg.max_fee));
  return Math.round(fee * 100) / 100;
}
