import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchCart, addToCart, updateQty, removeItem, clearCart } from './lib/cart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { items } = await fetchCart(user.id);
    setItems(items);
    setLoading(false);
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  const dispatch = useCallback(async (action) => {
    if (!user) {
      console.warn('[cart] blocked: not signed in');
      return { requiresAuth: true };
    }

    switch (action.type) {
      case 'ADD': {
      // STOCK GUARD: fetch product, refuse if out of stock
      const productId = action.payload?.product_id;
      const qty = Number(action.payload?.quantity || 1);
      if (productId) {
        try {
          const { supabase } = await import('./lib/supabase');
          const { data: prod } = await supabase
            .from('products')
            .select('stock, name')
            .eq('id', productId)
            .maybeSingle();
          const stock = Number(prod?.stock || 0);
          if (stock <= 0) {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('xmarket:out-of-stock', {
                detail: { name: prod?.name || 'Product' }
              }));
            }
            return; // block add
          }
          if (qty > stock) {
            action.payload.quantity = stock;
          }
        } catch (e) {
          console.warn('stock check failed:', e);
        }
      }

        const p = action.payload;
        await addToCart(user.id, p.product_id, p.variant || '', p.quantity || 1);
      break;
    }
      case 'REMOVE':
        await removeItem(action.payload);
        break;
      case 'INCREASE': {
        const it = items.find(i => i.rowId === action.payload);
        if (it) await updateQty(it.rowId, it.quantity + 1);
        break;
      }
      case 'DECREASE': {
        const it = items.find(i => i.rowId === action.payload);
        if (it) await updateQty(it.rowId, it.quantity - 1);
        break;
      }
      case 'CLEAR':
        await clearCart(user.id);
        break;
      default:
        break;
    }
    await reload();
    return { ok: true };
  }, [user, items, reload]);

  return (
    <CartContext.Provider value={{ items, dispatch, loading, reload }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
