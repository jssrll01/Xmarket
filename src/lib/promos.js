import { supabase } from './supabase';

export async function validatePromo(code, subtotal, userId) {
  const cleaned = code.trim().toUpperCase();

  // 1) Try loyalty vouchers first (they have LOYAL* prefix)
  if (cleaned.startsWith('LOYAL')) {
    if (!userId) return { error: 'Sign in to use loyalty vouchers' };
    const { data: v, error } = await supabase
      .from('loyalty_vouchers')
      .select('*')
      .eq('code', cleaned)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { error: error.message };
    if (!v) return { error: 'Invalid loyalty voucher' };
    if (v.redeemed) return { error: 'Voucher already used' };
    if (v.min_spend && subtotal < Number(v.min_spend)) {
      return { error: `Minimum spend ₱${v.min_spend}` };
    }
    // Return a synthetic promo object compatible with computeDiscount()
    return {
      promo: {
        code: v.code,
        discount_type: 'fixed',
        discount_value: v.discount_amount,
        isVoucher: true,
        voucherId: v.id,
      }
    };
  }

  // 2) Fall back to standard promo codes
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

export async function redeemPromo(code, userId, orderId, promoMeta) {
  const cleaned = code.trim().toUpperCase();

  // Loyalty voucher — mark redeemed
  if (promoMeta?.isVoucher && promoMeta.voucherId) {
    await supabase
      .from('loyalty_vouchers')
      .update({ redeemed: true, redeemed_at: new Date().toISOString() })
      .eq('id', promoMeta.voucherId);
    return;
  }

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


export async function fetchLoyaltyVouchers(userId) {
  const { data } = await supabase
    .from('loyalty_vouchers')
    .select('id, code, tier, discount_amount, min_spend, redeemed')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function redeemLoyaltyVoucher(code, userId) {
  const { error } = await supabase
    .from('loyalty_vouchers')
    .update({ redeemed: true, redeemed_at: new Date().toISOString() })
    .eq('code', code)
    .eq('user_id', userId);
  return { error };
}
