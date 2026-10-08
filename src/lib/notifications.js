import { supabase } from './supabase';

export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, type, read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return { error, items: [] };
  return { error: null, items: data || [] };
}

export async function markAsRead(id) {
  return supabase.from('notifications').update({ read: true }).eq('id', id);
}

export async function markAllAsRead(userId) {
  return supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
}

export async function unreadCount(userId) {
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
  return count || 0;
}
