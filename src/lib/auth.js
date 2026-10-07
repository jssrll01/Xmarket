import { supabase } from './supabase';

export async function signUp(form) {
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        username: form.username,
        first_name: form.firstName,
        middle_name: form.middleName,
        last_name: form.lastName,
        phone: form.phone,
        date_of_birth: form.dateOfBirth,
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
