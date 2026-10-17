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

export async function signUp(form) {
  // Pre-check email + phone for duplicates before hitting auth
  const pre = await precheckDuplicates({ email: form.email, phone: form.phone });
  if (pre.error) return pre;
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        username: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        delivery_address: form.deliveryAddress,
        nearest_landmark: form.nearestLandmark,
        province: form.province,
        city: form.city,
        barangay: form.barangay,
      },
    },
  });
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
      return { data: null, error: { message: 'Signup failed — this email or phone may already be in use.' } };
    }
  }
  return { data, error };
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email: String(email || '').trim().toLowerCase(), password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function sendResetCode(email) {
  return supabase.auth.resetPasswordForEmail(email);
}

export async function verifyResetCode(email, token) {
  return supabase.auth.verifyOtp({ email, token, type: 'recovery' });
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
