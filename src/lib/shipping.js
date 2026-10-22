import { supabase } from './supabase';

// Default static fallback tiers if offline or loading
const DEFAULT_SHIPPING_TIERS = [
  { max: 99.99, fee: 25 },
  { max: 199.99, fee: 20 },
  { max: 299.99, fee: 19 },
  { max: 499.99, fee: 18 },
  { max: 999.99, fee: 16 },
  { max: 1499.99, fee: 14 },
  { max: 1999.99, fee: 12 },
  { max: 2999.99, fee: 10 },
  { max: 4999.99, fee: 8 },
  { max: 7499.99, fee: 6 },
  { max: 9999.99, fee: 5 },
  { max: Infinity, fee: 3 },
];

let cachedTiers = null;
let lastFetch = 0;

export async function fetchShippingTiers() {
  const now = Date.now();
  if (cachedTiers && now - lastFetch < 60000) {
    return cachedTiers;
  }
  try {
    const { data, error } = await supabase
      .from('shipping_rate_rules')
      .select('max_subtotal, shipping_fee')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      cachedTiers = data.map(r => ({
        max: Number(r.max_subtotal),
        fee: Number(r.shipping_fee)
      }));
      lastFetch = now;
      return cachedTiers;
    }
  } catch (e) {
    // Fallback on network/db error
  }
  return DEFAULT_SHIPPING_TIERS;
}

export function getShippingFeeSync(subtotal, tiers = DEFAULT_SHIPPING_TIERS) {
  const num = Number(subtotal);
  if (isNaN(num) || num <= 0) {
    return 0;
  }
  for (const tier of tiers) {
    if (num <= tier.max) {
      return tier.fee;
    }
  }
  return tiers[tiers.length - 1]?.fee || 3;
}

export async function getShippingFee(subtotal) {
  const tiers = await fetchShippingTiers();
  return getShippingFeeSync(subtotal, tiers);
}
