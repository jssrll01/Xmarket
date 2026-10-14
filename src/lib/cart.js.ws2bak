import { supabase } from './supabase';

try { localStorage.removeItem('xmarket_cart_v1'); } catch {}

export async function fetchCart(userId) {
  const { data: rows, error: e1 } = await supabase
    .from('cart_items')
    .select('id, product_id, variant, quantity')
    .eq('user_id', userId);
  if (e1 || !rows || rows.length === 0) return { error: e1, items: [] };

  const productIds = [...new Set(rows.map(r => r.product_id))];
  const { data: products, error: e2 } = await supabase
    .from('products')
    .select('id, legacy_id, name, price, original_price, images, store, verified, variants, instant, preorder, stock')
    .in('id', productIds);
  if (e2) return { error: e2, items: [] };

  const byId = new Map((products || []).map(p => [p.id, p]));

  return {
    error: null,
    items: rows.map(row => {
      const p = byId.get(row.product_id) || {};
      const price = Number(p.price) || 0;
      const original = Number(p.original_price) || price;
      const stock = Number(p.stock || 0);
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
        stock,
        outOfStock: stock <= 0,
      };
    }),
  };
}

/**
 * Add to cart — with stock guard.
 * Returns { error } if the product is out of stock or the requested qty exceeds stock.
 */
export async function addToCart(userId, productId, variant = '', quantity = 1) {
  // ---- STOCK GUARD ----
  try {
    const { data: prod } = await supabase
      .from('products')
      .select('id, name, stock')
      .eq('id', productId)
      .maybeSingle();

    const stock = Number(prod?.stock || 0);
    const name = prod?.name || 'This product';

    if (stock <= 0) {
      window.dispatchEvent(new CustomEvent('xmarket:out-of-stock', {
        detail: { name, reason: 'sold-out' },
      }));
      return { error: { message: `${name} is sold out.` } };
    }

    // Check if adding would exceed stock
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('variant', variant)
      .maybeSingle();

    const currentQty = Number(existing?.quantity || 0);
    const desiredQty = currentQty + Number(quantity);

    if (desiredQty > stock) {
      const allowed = Math.max(0, stock - currentQty);
      window.dispatchEvent(new CustomEvent('xmarket:out-of-stock', {
        detail: {
          name,
          reason: 'limit',
          message: `Only ${stock} in stock. You already have ${currentQty} in your cart.`,
        },
      }));
      if (allowed <= 0) {
        return { error: { message: `You already have the maximum available stock (${stock}) in your cart.` } };
      }
      // Cap at stock and proceed
      quantity = allowed;
    }

    if (existing) {
      return supabase.from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
    }

    return supabase.from('cart_items')
      .insert({ user_id: userId, product_id: productId, variant, quantity });

  } catch (e) {
    console.warn('addToCart guard error:', e);
    // Fall through and try to add anyway (fail-open so users aren't blocked by transient errors)
  }

  // Fallback path (guard failed to run cleanly)
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
  // Guard against increasing beyond stock
  try {
    const { data: row } = await supabase
      .from('cart_items')
      .select('product_id')
      .eq('id', rowId)
      .maybeSingle();
    if (row) {
      const { data: prod } = await supabase
        .from('products')
        .select('name, stock')
        .eq('id', row.product_id)
        .maybeSingle();
      const stock = Number(prod?.stock || 0);
      if (quantity > stock) {
        window.dispatchEvent(new CustomEvent('xmarket:out-of-stock', {
          detail: {
            name: prod?.name || 'This product',
            reason: 'limit',
            message: `Only ${stock} in stock.`,
          },
        }));
        return { error: { message: `Only ${stock} available.` } };
      }
    }
  } catch (e) { /* fail-open */ }

  return supabase.from('cart_items').update({ quantity }).eq('id', rowId);
}

export async function removeItem(rowId) {
  return supabase.from('cart_items').delete().eq('id', rowId);
}

export async function clearCart(userId) {
  return supabase.from('cart_items').delete().eq('user_id', userId);
}
