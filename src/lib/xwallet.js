import { supabase } from './supabase';
import { askPin, showReceipt } from './pinBus';

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
    uid: userId, amt: amount, ttype: type, ref: reference, nt: note,
  });
}

export async function debitWallet(userId, amount, type = 'purchase', reference = null, note = null) {
  return supabase.rpc('xwallet_debit', {
    uid: userId, amt: amount, ttype: type, ref: reference, nt: note,
  });
}

// ============================================================
// TOP-UP REQUESTS (pending until admin approves)
// ============================================================
export async function createTopupRequest(userId, amount, reference = null, receiptUrl = null) {
  return supabase.from('xwallet_topups').insert({
    user_id: userId,
    amount,
    reference,
    receipt_url: receiptUrl,
    status: 'pending',
  }).select().single();
}

export async function fetchMyTopups(userId) {
  const { data } = await supabase
    .from('xwallet_topups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

// ============================================================
// BUY LOAD
// ============================================================
export async function buyLoad(userId, network, mobile, amount) {
  const pin = await askPin();
  if (pin === null) return { error: { message: 'Cancelled' } };
  const { data, error } = await supabase.rpc('buy_load', {
    p_network: network, p_mobile: mobile, p_amount: Number(amount), p_pin: pin,
  });
  if (error) return { error: { message: error.message } };
  if (data && data.error) return { error: { message: data.error } };
  if (data && data.receipt) showReceipt(data.receipt);
  return { load: data, error: null };
}

export async function fetchMyLoads(userId) {
  const { data } = await supabase
    .from('xwallet_loads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

// ============================================================
// TRANSFER BY EMAIL
// ============================================================
export async function transferByEmail(fromUserId, toEmail, amount, note = null) {
  const pin = await askPin();
  if (pin === null) return { data: { error: 'Cancelled' }, error: null };
  const res = await supabase.rpc('xwallet_transfer_by_email', {
    from_user: fromUserId,
    to_email: toEmail.trim().toLowerCase(),
    amt: amount,
    note,
    p_pin: pin,
  });
  if (res.data && res.data.receipt) showReceipt(res.data.receipt);
  return res;
}

// Legacy - kept for compatibility
export async function lookupUserByUsername(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, first_name, last_name')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle();
  return { user: data, error };
}


export async function submitTopupBilling({ userId, email, amount, payment, fee, total, receipt }) {
  const { data, error } = await supabase.rpc('submit_topup_billing', {
    in_user: userId,
    in_email: email,
    in_amount: amount,
    in_payment: payment,
    in_fee: fee,
    in_total: total,
    in_receipt: receipt,
  });
  if (error) return { error };
  if (data?.error) return { error: { message: data.error } };

  return { data, error: null };
}

export async function requestWithdrawal({ method, amount, accountName, accountNumber, bankName, ref }) {
  const pin = await askPin();
  if (pin === null) return { error: { message: 'Cancelled' } };
  const { data, error } = await supabase.rpc('xwallet_request_withdrawal', {
    p_method: method, p_amount: Number(amount), p_account_name: accountName,
    p_account_number: accountNumber, p_bank_name: bankName || null, p_ref: ref || null, p_pin: pin,
  });
  if (error) return { error: { message: error.message } };
  if (data && data.ok === false) return { error: { message: data.error || 'Request failed' } };
  if (data && data.receipt) showReceipt(data.receipt);
  return { data, error: null };
}

export async function fetchMyWithdrawals(userId) {
  const { data } = await supabase.from('xwallet_withdrawals').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
  return data || [];
}

export async function fetchInterestSummary() {
  const { data } = await supabase.rpc('xwallet_interest_summary');
  return data || null;
}

export async function fetchMyInterestLog(userId, limit = 30) {
  const { data } = await supabase.from('xwallet_interest_log').select('*')
    .eq('user_id', userId).order('day', { ascending: false }).limit(limit);
  return data || [];
}
