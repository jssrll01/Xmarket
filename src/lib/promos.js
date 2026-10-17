import { supabase } from './supabase';

export async function validatePromo(code, subtotal, userId) {
  const { data, error } = await supabase.rpc('validate_promo', {
    p_code: String(code || ''), p_subtotal: Number(subtotal) || 0,
  });
  if (error) return { error: error.message };
  if (!data) return { error: 'Invalid promo code' };
  if (data.error) return { error: data.error };
  return { promo: data };
}

export function computeDiscount(promo, subtotal) {
  if (!promo) return 0;
  if (promo.discount_type === 'percent') return subtotal * (Number(promo.discount_value) / 100);
  if (promo.discount_type === 'fixed') return Math.min(Number(promo.discount_value), subtotal);
  return 0;
}

export async function redeemPromo(code, userId, orderId, promoMeta) {
  const cleaned = code.trim().toUpperCase();

  // Standard promo code
  await supabase.rpc('increment_promo_use', { promo_code: cleaned }).catch(() => {});
  if (userId) {
    await supabase.from('promo_redemptions').insert({
      promo_code: cleaned, user_id: userId, order_id: orderId || null,
    });
  }
}

export async function fetchLoyalty(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', userId)
    .maybeSingle();
  return data?.loyalty_points || 0;
}

export async function fetchLoyaltyLedger(userId) {
  const { data } = await supabase
    .from('loyalty_ledger')
    .select('id, delta, reason, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}