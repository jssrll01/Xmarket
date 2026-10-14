import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchCart, addToCart, updateQty, removeItem, clearCart } from './lib/cart';

const CartContext = createContext();
const LS_KEY = 'xmarket_cart_v2';

function readLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}
function writeLS(items) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items || [])); } catch {}
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => readLS());
  const [loading, setLoading] = useState(false);
  const syncing = useRef(false);

  const reload = useCallback(async () => {
    if (!user) {
      setItems([]); writeLS([]);
      return;
    }
    setLoading(true);
    const { items: fresh } = await fetchCart(user.id);
    setItems(fresh);
    writeLS(fresh);
    setLoading(false);
  }, [user]);

  // Initial + on-user-change: hydrate from LS first, then pull fresh from Supabase.
  useEffect(() => {
    // LS already loaded at first render — no flash.
    reload();
  }, [reload]);

  // Backfill item variants from product data (variant_label etc.) — done inside fetchCart.

  const dispatch = useCallback(async (action) => {
    if (!user) {
      return { requiresAuth: true };
    }

    // ── OPTIMISTIC: patch local state immediately ──
    const applyOptimistic = (updater) => {
      setItems((prev) => {
        const next = updater(prev);
        writeLS(next);
        return next;
      });
    };

    switch (action.type) {
      case 'ADD': {
        const p = action.payload;
        // Optimistic insert or increment
        applyOptimistic((prev) => {
          const existing = prev.find(
            (it) => it.product_id === p.product_id && (it.variant || '') === (p.variant || '')
          );
          if (existing) {
            return prev.map((it) =>
              it.product_id === p.product_id && (it.variant || '') === (p.variant || '')
                ? { ...it, quantity: it.quantity + (p.quantity || 1) }
                : it
            );
          }
          return prev.concat([{
            product_id: p.product_id,
            name: p.name || 'Adding…',
            price: p.price || 0,
            originalPrice: p.original_price || p.price || 0,
            images: p.images || [],
            store: p.store || '',
            verified: !!p.verified,
            variant: p.variant || '',
            quantity: p.quantity || 1,
            instant: !!p.instant,
            preorder: !!p.preorder,
            stock: p.stock ?? 999,
            outOfStock: false,
            rowId: 'tmp_' + Math.random().toString(36).slice(2),
            _pending: true,
          }]);
        });
        await addToCart(user.id, p.product_id, p.variant || '', p.quantity || 1);
        break;
      }

      case 'REMOVE': {
        const rowId = action.payload;
        applyOptimistic((prev) => prev.filter((it) => it.rowId !== rowId));
        await removeItem(rowId);
        break;
      }

      case 'INCREASE': {
        const rowId = action.payload;
        applyOptimistic((prev) =>
          prev.map((it) => it.rowId === rowId ? { ...it, quantity: it.quantity + 1 } : it)
        );
        const it = items.find((i) => i.rowId === rowId);
        if (it) await updateQty(rowId, it.quantity + 1);
        break;
      }

      case 'DECREASE': {
        const rowId = action.payload;
        const it = items.find((i) => i.rowId === rowId);
        const nextQty = Math.max(1, (it?.quantity || 1) - 1);
        if ((it?.quantity || 1) <= 1) {
          applyOptimistic((prev) => prev.filter((x) => x.rowId !== rowId));
          await removeItem(rowId);
        } else {
          applyOptimistic((prev) =>
            prev.map((x) => x.rowId === rowId ? { ...x, quantity: nextQty } : x)
          );
          await updateQty(rowId, nextQty);
        }
        break;
      }

      case 'SET_QTY': {
        const { rowId, quantity } = action.payload;
        const q = Math.max(1, Number(quantity) || 1);
        applyOptimistic((prev) =>
          prev.map((x) => x.rowId === rowId ? { ...x, quantity: q } : x)
        );
        await updateQty(rowId, q);
        break;
      }

      case 'CLEAR': {
        applyOptimistic(() => []);
        await clearCart(user.id);
        break;
      }

      default:
        return { ok: true };
    }

    // Background sync to get authoritative rowIds, stock flags, etc.
    if (syncing.current) return { ok: true };
    syncing.current = true;
    try {
      const { items: fresh } = await fetchCart(user.id);
      setItems(fresh);
      writeLS(fresh);
    } catch {}
    syncing.current = false;
    return { ok: true };
  }, [user, items]);

  return (
    <CartContext.Provider value={{ items, dispatch, loading, reload }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
