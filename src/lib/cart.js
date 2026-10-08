import { supabase } from './supabase';

try { localStorage.removeItem('xmarket_cart_v1'); } catch {}

export async function fetchCart(userId) {
  // Step 1: get cart rows
  const { data: rows, error: e1 } = await supabase
    .from('cart_items')
    .select('id, product_id, variant, quantity')
    .eq('user_id', userId);
  if (e1 || !rows || rows.length === 0) return { error: e1, items: [] };

  // Step 2: get the products for those rows
  const productIds = [...new Set(rows.map(r => r.product_id))];
  const { data: products, error: e2 } = await supabase
    .from('products')
    .select('id, legacy_id, name, price, original_price, images, store, verified, variants, instant, preorder')
    .in('id', productIds);
  if (e2) return { error: e2, items: [] };

  const byId = new Map((products || []).map(p => [p.id, p]));

  return {
    error: null,
    items: rows.map(row => {
      const p = byId.get(row.product_id) || {};
      const price = Number(p.price) || 0;
      const original = Number(p.original_price) || price;
      return {
        id: p.legacy_id ?? row.product_id,
        rowId: row.id,
        product_id: row.product_id,
        name: p.name || 'Unknown product',
        price,
        originalPrice: original,
        images: Array.isArray(p.images) ? p.images : [],
        store: p.store || '',
        verified: !!p.verified,
        variants: p.variants || [],
        variant: row.variant || '',
        quantity: Number(row.quantity) || 1,
        instant: !!p.instant,
        preorder: !!p.preorder,
      };
    }),
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
