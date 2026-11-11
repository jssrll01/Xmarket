import { supabase } from './supabase';

export async function fetchOrder(userId, orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('buyer_id', userId)
    .maybeSingle();
  if (error) return { error, order: null };
  return { error: null, order: data };
}

export async function fetchOrderItems(orderId) {
  const { data, error } = await supabase
    .from('order_items')
    .select('id, product_id, name, price, quantity, variant')
    .eq('order_id', orderId);
  if (error) return { error, items: [] };
  return { error: null, items: data || [] };
}

export async function cancelOrder(orderId) {
  return supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
    .eq('status', 'pending');
}

export async function confirmReceipt(orderId) {
  return supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderId)
    .in('status', ['shipped', 'delivered']);
}

export async function reorder(userId, items) {
  const rows = items.map(it => ({
    user_id: userId,
    product_id: it.product_id,
    variant: it.variant || '',
    quantity: it.quantity || 1,
  }));
  const { error } = await supabase.from('cart_items').insert(rows);
  return { error };
}


export async function cancelOrderWithReason(orderId, reason, note, userId) {
  return supabase
    .from('orders')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
      cancel_note: note || null,
    })
    .eq('id', orderId)
    .eq('buyer_id', userId);
}
