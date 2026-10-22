import { supabase } from './supabase';

let _tiers = null, _at = 0, _p = null;

export function getDiscountTiers() {
  if (_tiers && Date.now() - _at < 60000) return Promise.resolve(_tiers);
  if (_p) return _p;
  _p = supabase.rpc('get_discount_tiers')
    .then(({ data, error }) => {
      if (!error && Array.isArray(data)) { _tiers = data; _at = Date.now(); }
      return _tiers || [];
    })
    .catch(() => _tiers || [])
    .finally(() => { _p = null; });
  return _p;
}

// Same math as calculate_unit_discount (no-cost case): round(price*rate)/100, capped
export function unitDiscount(price, tiers) {
  const p = Number(price);
  if (!p || p <= 0 || !tiers) return 0;
  const t = tiers.find((x) => p >= Number(x.min_price) && (x.max_price == null || p < Number(x.max_price)));
  if (!t) return 0;
  const pct = Math.round(p * Number(t.rate_pct)) / 100;
  return Math.max(0, Math.min(pct, Number(t.max_discount)));
}
