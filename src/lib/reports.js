import { supabase } from './supabase';

/**
 * Submit a report. Writes to Supabase + forwards to the backend
 */
export async function submitReport({ userId, category, gmail, phone, concern, relatedId }) {
  // 1) Persist to Supabase
  const { data, error } = await supabase
    .from('report_tickets')
    .insert({
      user_id: userId,
      category,
      gmail,
      phone,
      concern,
      related_id: relatedId || null,
    })
    .select()
    .single();

  if (error) return { error };


  return { ticket: data, error: null };
}

/**
 * Fetch the current user's tickets.
 */
export async function fetchMyReports(userId) {
  const { data, error } = await supabase
    .from('report_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { items: data || [], error };
}

export const REPORT_CATEGORIES = [
  { id: 'bug',      label: 'Bug & Technical' },
  { id: 'order',    label: 'Order & Product' },
  { id: 'shop',     label: 'Shop / Seller' },
  { id: 'content',  label: 'Content & Review' },
  { id: 'security', label: 'Account Security' },
];
