import { supabase } from './supabase';

// Backend forwarding — server should have the actual bot tokens
const REPORT_API = 'https://xmarket-telegram-bot.onrender.com/api/report';

/**
 * Submit a report. Writes to Supabase + forwards to the backend
 * which pushes to the correct Telegram bot.
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

  // 2) Forward to backend → Telegram bot
  try {
    await fetch(`${REPORT_API}/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket_id: data.id,
        user_id: userId,
        gmail, phone, concern,
        related_id: relatedId || null,
        created_at: data.created_at,
      }),
    });
  } catch (err) {
    // Non-fatal — the ticket is still in the DB
    console.warn('[report] backend forward failed:', err);
  }

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
