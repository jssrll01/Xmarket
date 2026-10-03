import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'xmarket_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

function saveCart(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const initialState = loadCart();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.payload.id && i.variant === action.payload.variant);
      if (existing) {
        return { items: state.items.map(i =>
          (i.id === action.payload.id && i.variant === action.payload.variant)
            ? { ...i, quantity: i.quantity + 1 } : i
        )};
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.payload) };
    case 'INCREASE':
      return { items: state.items.map(i =>
        i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
      )};
    case 'DECREASE':
      return { items: state.items.map(i =>
        i.id === action.payload && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 } : i
      )};
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    saveCart(state);
  }, [state]);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
