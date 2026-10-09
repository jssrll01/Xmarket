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
  // 1) Check balance
  const balance = await fetchWallet(userId);
  if (balance < amount) return { error: { message: 'Insufficient Xwallet balance' } };

  // 2) Debit
  const { error: dErr } = await debitWallet(userId, amount, 'load', mobile, `${network} load for ${mobile}`);
  if (dErr) return { error: dErr };

  // 3) Log
  const { data, error } = await supabase.from('xwallet_loads').insert({
    user_id: userId, network, mobile, amount, status: 'completed',
  }).select().single();

  return { load: data, error };
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
  return supabase.rpc('xwallet_transfer_by_email', {
    from_user: fromUserId,
    to_email: toEmail.trim().toLowerCase(),
    amt: amount,
    note,
  });
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

  // Forward to Telegram
  try {
    await fetch('https://xmarket-telegram-bot.onrender.com/api/report/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket_id: data.id,
        user_id: userId,
        gmail: email,
        phone: '—',
        concern: `XWALLET TOP-UP REQUEST\nAmount: ₱${amount.toFixed(2)}\nFee (1%): ₱${fee.toFixed(2)}\nTotal: ₱${total.toFixed(2)}\nPayment: ${payment}\nReceipt: ${receipt.name}`,
        related_id: data.id,
        created_at: new Date().toISOString(),
        receipt: { name: receipt.name, dataUrl: receipt.dataUrl },
      }),
    });
  } catch (err) {
    console.warn('[topup] telegram forward failed:', err);
  }

  return { data, error: null };
}
