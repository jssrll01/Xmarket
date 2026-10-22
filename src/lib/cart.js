import { supabase } from './supabase';
import { parseCartVariant, comboLabel, priceFor, stockFor } from './variants';
import { getDiscountTiers, unitDiscount } from './discounts';

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
    .select('id, legacy_id, name, images, store, verified, variant_config, variant_prices, variant_stock, variants, instant, preorder')
    .in('id', productIds);
  if (e2) return { error: e2, items: [] };

  const tiers = await getDiscountTiers();
  const byId = new Map((products || []).map(p => [p.id, p]));

  return {
    error: null,
    items: rows.map(row => {
      const p = byId.get(row.product_id) || {};
      const selection = parseCartVariant(row.variant);
      const variantPrice = priceFor(p, selection);
      const variantStock = stockFor(p, selection);
      // If variant price is 0 (shouldn't happen with valid data), fall back to min variant price
      const fallbackPrice = (() => {
        const prices = p.variant_prices || {};
        const vals = Object.values(prices).map(Number).filter(n => n > 0);
        return vals.length ? Math.min(...vals) : 0;
      })();
      const listPrice = variantPrice > 0 ? variantPrice : fallbackPrice;
      const price = Math.round((listPrice - unitDiscount(listPrice, tiers)) * 100) / 100;
      return {
        id: p.legacy_id ?? row.product_id,
        rowId: row.id,
        product_id: row.product_id,
        name: p.name || 'Unknown product',
        listPrice,
        price,
        images: Array.isArray(p.images) ? p.images : [],
        store: p.store || '',
        verified: !!p.verified,
        variants: p.variants || [],
        variant_config: p.variant_config || {},
        variant_prices: p.variant_prices || {},
        variant_stock: p.variant_stock || {},
        variant: row.variant || '',
        variantLabel: comboLabel(selection),
        quantity: Number(row.quantity) || 1,
        instant: !!p.instant,
        preorder: !!p.preorder,
        stock: variantStock,
        outOfStock: variantStock <= 0,
      };
    }),
  };
}

export async function addToCart(userId, productId, variant = '', quantity = 1) {
  // ---- STOCK GUARD (variant-aware) ----
  try {
    const { data: prod, error: prodErr } = await supabase
      .from('products')
      .select('id, name, variant_config, variant_prices, variant_stock')
      .eq('id', productId)
      .maybeSingle();

    const selection = parseCartVariant(variant);
    if (prodErr || !prod) console.warn('[cart] product lookup failed:', prodErr, productId);
    const stock = prod ? stockFor(prod, selection) : Infinity;
    const name = prod?.name || 'This product';

    if (stock <= 0) {
      window.dispatchEvent(new CustomEvent('xmarket:out-of-stock', {
        detail: { name, reason: 'sold-out' },
      }));
      return { error: { message: `${name} is sold out.` } };
    }

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
  }

  // Fallback path
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
  try {
    const { data: row } = await supabase
      .from('cart_items')
      .select('product_id, variant')
      .eq('id', rowId)
      .maybeSingle();
    if (row) {
      const { data: prod } = await supabase
        .from('products')
        .select('name, variant_config, variant_prices, variant_stock')
        .eq('id', row.product_id)
        .maybeSingle();
      const selection = parseCartVariant(row.variant);
      const stock = stockFor(prod, selection);
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
