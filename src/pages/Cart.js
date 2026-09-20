import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../CartContext';

export default function Cart() {
  const { items, dispatch } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0);
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text)' }}>
        <ShoppingCart size={64} color="#00d4ff" />
        <h2 style={{ marginTop: 12 }}>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: 16, padding: '12px 24px' }}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 100, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 16 }}>Shopping Cart</h2>

      {items.map(i => (
        <div key={i.id + (i.variant || '')} className="card"
          style={{ padding: 12, marginBottom: 8, display: 'flex', gap: 12 }}>
          <img src={i.images[0]} alt={i.name}
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold' }}>{i.name}</div>
            {i.variant && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Variant: {i.variant}</div>}
            <div style={{ color: '#00d4ff', fontWeight: 'bold', marginTop: 4 }}>₱{i.price}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <button onClick={() => dispatch({ type: 'DECREASE', payload: i.id })} className="btn-ghost" style={{ padding: 6 }}>
                <Minus size={14} />
              </button>
              <span>{i.quantity}</span>
              <button onClick={() => dispatch({ type: 'INCREASE', payload: i.id })} className="btn-ghost" style={{ padding: 6 }}>
                <Plus size={14} />
              </button>
              <button onClick={() => dispatch({ type: 'REMOVE', payload: i.id })}
                style={{ marginLeft: 'auto', color: '#ff3d71', background: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₱{subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e539ff' }}><span>Discount</span><span>-₱{discount}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}><span>Shipping Fee</span><span>SF will be added on the order confirmation</span></div>
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
          <span>Total</span><span style={{ color: '#00d4ff' }}>₱{total}</span>
        </div>
      </div>

      <button onClick={() => navigate('/checkout')} className="btn-primary"
        style={{ width: '100%', padding: 14, marginTop: 12, fontSize: 16 }}>
        Proceed to Checkout
      </button>
    </div>
  );
}
