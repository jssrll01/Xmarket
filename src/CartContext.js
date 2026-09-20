import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return { items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
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
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
