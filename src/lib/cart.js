import { supabase } from './supabase';

export async function fetchCart(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, variant, quantity, product:products(id, legacy_id, name, price, original_price, images, store, verified, variants)')
    .eq('user_id', userId);
  if (error) return { error, items: [] };
  return {
    error: null,
    items: (data || []).map(row => ({
      id: row.product?.legacy_id ?? row.product_id,
      rowId: row.id,
      product_id: row.product_id,
      name: row.product?.name,
      price: row.product?.price,
      originalPrice: row.product?.original_price,
      images: row.product?.images || [],
      store: row.product?.store,
      verified: row.product?.verified,
      variants: row.product?.variants || [],
      variant: row.variant || '',
      quantity: row.quantity,
    })),
  };
}

export async function addToCart(userId, productId, variant = '', quantity = 1) {
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('variant', variant)
    .maybeSingle();

  if (existing) {
    return supabase.from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
  }
  return supabase.from('cart_items')
    .insert({ user_id: userId, product_id: productId, variant, quantity });
}

export async function updateQty(rowId, quantity) {
  if (quantity < 1) return removeItem(rowId);
  return supabase.from('cart_items').update({ quantity }).eq('id', rowId);
}

export async function removeItem(rowId) {
  return supabase.from('cart_items').delete().eq('id', rowId);
}

export async function clearCart(userId) {
  return supabase.from('cart_items').delete().eq('user_id', userId);
}
