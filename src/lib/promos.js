import { supabase } from './supabase';

export async function validatePromo(code, subtotal, userId) {
  const cleaned = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', cleaned)
    .eq('active', true)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: 'Invalid promo code' };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { error: 'Code expired' };
  if (data.max_uses && data.used_count >= data.max_uses) return { error: 'Code usage limit reached' };
  if (data.min_spend && subtotal < Number(data.min_spend)) return { error: `Minimum spend ₱${data.min_spend}` };

  // Per-user check
  if (userId) {
    const { count } = await supabase
      .from('promo_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('promo_code', cleaned)
      .eq('user_id', userId);
    const limit = data.per_user_limit || 1;
    if ((count || 0) >= limit) {
      return { error: 'You already used this code' };
    }
  }

  return { promo: data };
}

export function computeDiscount(promo, subtotal) {
  if (!promo) return 0;
  if (promo.discount_type === 'percent') return subtotal * (Number(promo.discount_value) / 100);
  if (promo.discount_type === 'fixed') return Math.min(Number(promo.discount_value), subtotal);
  return 0;
}

export async function redeemPromo(code, userId, orderId) {
  const cleaned = code.trim().toUpperCase();
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
