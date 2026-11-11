import { supabase } from './supabase';

export async function fetchAddresses(userId) {
  const { data } = await supabase.from('user_addresses').select('*')
    .eq('user_id', userId).order('is_default', { ascending: false }).order('updated_at', { ascending: false });
  return data || [];
}

export async function saveAddress(userId, a) {
  if (!/^[0-9]{4}$/.test(String(a.postal_code || '').trim())) return { data: null, error: { message: 'Postal code is required (4 digits).' } };
  const row = {
    full_name: a.full_name.trim(), phone: a.phone.trim(), address: a.address.trim(),
    barangay: a.barangay.trim(), city: a.city.trim(), province: a.province.trim(),
    postal_code: (a.postal_code || '').trim() || null, landmark: (a.landmark || '').trim() || null,
    label: a.label || null, is_default: !!a.is_default,
  };
  const q = a.id
    ? supabase.from('user_addresses').update(row).eq('id', a.id)
    : supabase.from('user_addresses').insert({ ...row, user_id: userId });
  const { data, error } = await q.select().single();
  return { data, error: error ? { message: error.message } : null };
}

export async function deleteAddress(id) {
  const { error } = await supabase.from('user_addresses').delete().eq('id', id);
  return { error: error ? { message: error.message } : null };
}

export const addressLine = (a) => [a.barangay, a.city, a.province, a.postal_code].filter(Boolean).join(', ');
