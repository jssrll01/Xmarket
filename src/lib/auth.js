import { isGmail, logoutCleanup, withDevice, deviceId } from './secure';
import { supabase } from './supabase';

/**
 * Pre-check email + phone against profiles before calling Supabase signUp.
 * Returns { error } if a duplicate is found.
 */
export async function precheckDuplicates({ email, phone }) {
  try {
    const { data, error } = await supabase.rpc('check_duplicate_account', {
      p_email: email || '', p_phone: phone || '',
    });
    if (error || !data) return { error: null };
    if (data.email) {
      return { error: { message: 'An account with this email already exists. Try signing in instead.' } };
    }
    if (data.phone) {
      return { error: { message: 'An account with this phone number already exists.' } };
    }
    return { error: null };
  } catch (e) {
    return { error: null };
  }
}

const withCaptcha = (tok, p) => (tok ? { ...p, options: { ...(p.options || {}), captchaToken: tok } } : p);

export async function signUp(form, captchaToken) {
  if (form && form.email !== undefined && !isGmail(form.email)) return { data: null, error: { message: 'Only @gmail.com email addresses can be used to sign up.' } };
  // Pre-check email + phone for duplicates before hitting auth
  const pre = await precheckDuplicates({ email: form.email, phone: form.phone });
  if (pre.error) return pre;
  const { data, error } = await supabase.auth.signUp(withCaptcha(captchaToken, withDevice({
    email: form.email,
    password: form.password,
    options: {
      data: {
        username: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
      },
    },
  })));
  // Map unfriendly messages to clear ones
  if (error) {
    const m = String(error.message || '');
    if (/already.*registered|already exists|user already/i.test(m)) {
      return { data: null, error: { message: 'An account with this email already exists. Try signing in instead.' } };
    }
    if (/duplicate key|unique_violation|already exists/i.test(m)) {
      return { data: null, error: { message: m } };
    }
    if (/database error/i.test(m)) {
      let why = '';
      try {
        const r = await supabase.rpc('signup_block_reason', { p_email: form.email, p_phone: form.phone, p_device: deviceId() });
        why = (r && r.data) || '';
      } catch (e) { /* ignore */ }
      return { data: null, error: { message: why || 'Signup failed. Please check your details and try again.' } };
    }
  }
  return { data, error };
}

export async function signIn(email, password, captchaToken, opts) {
  const em = String(email || '').trim().toLowerCase();
  const res = await supabase.auth.signInWithPassword({ email: em, password, ...(captchaToken ? { options: { captchaToken } } : {}) });
  if (res.error || (opts && opts.skipCode)) return res;
  let need = false;
  try {
    const r = await supabase.rpc('login_needs_code', { p_device: deviceId() });
    need = !r.error && r.data === true;
  } catch (e) { need = false; }
  if (!need) return res;
  try { await supabase.auth.signOut({ scope: 'local' }); } catch (e) { /* ignore */ }
  const o = await supabase.auth.signInWithOtp({ email: em, options: { shouldCreateUser: false } });
  if (o.error) return { data: null, error: { message: o.error.message || 'Could not send the code. Please try again.' } };
  return { data: null, error: null, needsCode: true, email: em };
}



export async function signOut() {
  await logoutCleanup();
  return supabase.auth.signOut();
}

export async function sendResetCode(email) {
  return supabase.auth.resetPasswordForEmail(String(email || '').trim().toLowerCase());
}

export async function verifyResetCode(email, token) {
  return supabase.auth.verifyOtp({ email: String(email || '').trim().toLowerCase(), token: String(token || '').replace(/\D/g, ''), type: 'recovery' });
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}


// --- New device alert (client-side heuristic) ---
export async function checkNewDevice() {
  try {
    const key = 'xmarket.last-fingerprint';
    const fp = `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}`;
    const last = localStorage.getItem(key);
    localStorage.setItem(key, fp);
    return last && last !== fp;
  } catch {
    return false;
  }
}

export async function verifyLoginCode(email, code) {
  const em = String(email || '').trim().toLowerCase();
  const token = String(code || '').replace(/\D/g, '');
  const res = await supabase.auth.verifyOtp({ email: em, token, type: 'email' });
  if (!res.error) { try { await supabase.rpc('login_trust_device', { p_device: deviceId() }); } catch (e) { /* ignore */ } }
  return res;
}

export async function resendLoginCode(email) {
  return supabase.auth.signInWithOtp({ email: String(email || '').trim().toLowerCase(), options: { shouldCreateUser: false } });
}
