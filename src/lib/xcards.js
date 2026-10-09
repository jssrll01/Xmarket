import { supabase } from './supabase';
import { debitWallet } from './xwallet';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'XC';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function purchaseXcard(userId, value) {
  // 1) Debit Xwallet
  const { error: dErr } = await debitWallet(
    userId, value, 'giftcard_purchase', null, `Purchased ₱${value} Xcard`
  );
  if (dErr) return { error: dErr };

  // 2) Generate the Xcard
  const code = generateCode();
  const { data, error } = await supabase
    .from('xcards')
    .insert({
      code,
      value,
      purchased_by: userId,
      purchased_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { card: data, error };
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
  const cleaned = code.trim().toUpperCase();
  const { data: card, error } = await supabase
    .from('xcards')
    .select('*')
    .eq('code', cleaned)
    .eq('active', true)
    .maybeSingle();
  if (error) return { error };
  if (!card) return { error: 'Invalid or unknown Xcard' };
  if (card.redeemed_by) return { error: 'Xcard already redeemed' };

  const { error: uErr } = await supabase
    .from('xcards')
    .update({ redeemed_by: userId, redeemed_at: new Date().toISOString(), active: false })
    .eq('id', card.id);
  if (uErr) return { error: uErr };

  return { card, error: null };
}
