import { supabase } from './supabase';

export async function fetchWallet(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('xwallet_balance')
    .eq('id', userId)
    .maybeSingle();
  return Number(data?.xwallet_balance) || 0;
}

export async function fetchWalletTxns(userId, limit = 50) {
  const { data } = await supabase
    .from('xwallet_txns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function creditWallet(userId, amount, type = 'topup', reference = null, note = null) {
  return supabase.rpc('xwallet_credit', {
    uid: userId,
    amt: amount,
    ttype: type,
    ref: reference,
    nt: note,
  });
}

export async function debitWallet(userId, amount, type = 'purchase', reference = null, note = null) {
  return supabase.rpc('xwallet_debit', {
    uid: userId,
    amt: amount,
    ttype: type,
    ref: reference,
    nt: note,
  });
}

export async function transferToUser(fromUserId, toUserId, amount, note = null) {
  // Debit sender first, then credit receiver
  const { error: dErr } = await debitWallet(fromUserId, amount, 'transfer_out', toUserId, note);
  if (dErr) return { error: dErr };
  const { error: cErr } = await creditWallet(toUserId, amount, 'transfer_in', fromUserId, note);
  return { error: cErr };
}

export async function lookupUserByUsername(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, first_name, last_name')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle();
  return { user: data, error };
}
