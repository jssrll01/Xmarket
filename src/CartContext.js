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
