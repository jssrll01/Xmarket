import { supabase } from './supabase';
import { transferByEmail } from './xwallet';

const balance = async (id) => {
  try {
    const { data } = await supabase.from('profiles').select('xwallet_balance').eq('id', id).single();
    return data ? Number(data.xwallet_balance) : null;
  } catch (e) { return null; }
};

// Uses your existing PIN-protected transfer. Success is confirmed by the balance actually dropping.
export async function sendByEmail(email, amount, note) {
  const { data } = await supabase.auth.getUser();
  const u = data && data.user;
  if (!u) return { ok: false, error: 'Please sign in.' };
  const before = await balance(u.id);
  let r;
  try { r = await transferByEmail(u.id, email, Number(amount), note || null); }
  catch (e) { return { ok: false, error: (e && e.message) || 'Transfer failed.' }; }
  const msg = r && ((r.error && r.error.message) || (typeof r.error === 'string' ? r.error : '') || r.message);
  if (r && (r.ok === false || r.error)) return { ok: false, error: msg || 'Transfer failed.' };
  const after = await balance(u.id);
  if (before != null && after != null && !(after < before)) return { ok: false, error: msg || 'The transfer was not completed.' };
  return { ok: true };
}
