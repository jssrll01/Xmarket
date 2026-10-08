import { supabase } from './supabase';

export async function signUp(form) {
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
  return { data, error };
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
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
