import { supabase } from './supabase';

let RULES_CACHE = null;
let CACHE_TS = 0;
const TTL = 60 * 1000;

export async function loadDiscountTiers() {
  if (RULES_CACHE && Date.now() - CACHE_TS < TTL) return RULES_CACHE;
  const { data, error } = await supabase
    .from('discount_tiers')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !data) return RULES_CACHE || [];
  RULES_CACHE = data;
  CACHE_TS = Date.now();
  return data;
}

export function computeDiscountForPrice(price, tiers) {
  const p = Number(price);
  if (!p || p <= 0 || !tiers || tiers.length === 0) {
    return { discount: 0, effectivePct: 0, finalPrice: p || 0, tier: null, hasPromo: false };
  }
  const tier = tiers.find(t =>
    p >= Number(t.min_price) && (t.max_price == null || p < Number(t.max_price))
  );
  if (!tier) return { discount: 0, effectivePct: 0, finalPrice: p, tier: null, hasPromo: false };
  const pctDisc = Math.round(p * Number(tier.rate_pct)) / 100;
  const cap = Number(tier.max_discount);
  const discount = Math.max(0, Math.min(pctDisc, cap));
  const finalPrice = Math.max(0, p - discount);
  const effectivePct = p > 0 ? Math.round((discount / p) * 10000) / 100 : 0;
  return { discount, effectivePct, finalPrice, tier, hasPromo: discount > 0 };
}

export function getPromoDisplay(priceNum, tiers) {
  const p = Number(priceNum);
  const arr = tiers || RULES_CACHE || [];
  const result = computeDiscountForPrice(p, arr);
  if (!p || isNaN(p) || p <= 0) {
    return { hasPromo: false, label: 'Great Value', originalPrice: null, discountPercent: 0, finalPrice: p || 0, discountAmount: 0 };
  }
  if (!result.hasPromo) {
    return { hasPromo: false, label: 'XMARKET Deal', originalPrice: p, discountPercent: 0, finalPrice: p, discountAmount: 0 };
  }
  return {
    hasPromo: true,
    originalPrice: p,
    finalPrice: result.finalPrice,
    discountAmount: result.discount,
    discountPercent: result.effectivePct,
    badgeText: `${Math.round(result.effectivePct)}% OFF`,
    label: null,
  };
}
