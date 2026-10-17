import { supabase } from './supabase';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'XC';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function purchaseXcard(userId, value) {
  const { data, error } = await supabase.rpc('purchase_xcard', { p_value: value });
  if (error) return { error };
  if (!data || !data.ok) return { error: { message: (data && data.message) || 'Purchase failed' } };
  return { card: data.card, error: null };
}

export async function fetchMyXcards(userId) {
  const { data } = await supabase
    .from('xcards')
    .select('*')
    .eq('purchased_by', userId)
    .order('purchased_at', { ascending: false });
  return data || [];
}

export async function redeemXcard(code, userId) {
  // Use the RPC — it accepts any Xcard regardless of products in cart.
  const { data, error } = await supabase.rpc('redeem_xcard', {
    in_code: code.trim(),
    in_user: userId,
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { card: { id: data.id, value: data.value, code: code.trim().toUpperCase() }, error: null };
}
