import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../CartContext';
import SmartImage from '../components/SmartImage';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export default function Cart() {
  const { items, dispatch } = useCart();
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const [going, setGoing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0);
  const total = subtotal;

  const handleCheckout = () => {
    setGoing(true);
    setTimeout(() => navigate('/checkout'), 500);
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--text)' }}>
        <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
          <ArrowLeft size={20} />
        </button>
        <div className="empty-state">
          <div className="icon-badge">
            <ShoppingCart size={48} color="#000000" />
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Explore our products and find something you love.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 28px' }}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 100, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Shopping Cart</h2>
        <button
          onClick={() => setConfirmRemove({ all: true })}
          className="btn-ghost"
          style={{ padding: '8px 14px', fontSize: 12, color: "#000000" }}>
          Clear All
        </button>
      </div>

      {items.map(i => (
        <div key={i.id + (i.variant || '')} className="card"
          style={{ padding: 12, marginBottom: 10, display: 'flex', gap: 12 }}>
          <SmartImage src={i.images[0]} alt={i.name}
            style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold' }}>{i.name}</div>
            {i.variant && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Variant: {i.variant}</div>}
            <div style={{ color: "#000000", fontWeight: 'bold', marginTop: 4 }}>₱{i.price}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <button onClick={() => dispatch({ type: 'DECREASE', payload: i.id })} className="btn-ghost" style={{ padding: 7 }}>
                <Minus size={14} />
              </button>
              <span>{i.quantity}</span>
              <button onClick={() => dispatch({ type: 'INCREASE', payload: i.id })} className="btn-ghost" style={{ padding: 7 }}>
                <Plus size={14} />
              </button>
              <button
                onClick={() => setConfirmRemove({ item: i })}
                className="btn-ghost"
                style={{
                  marginLeft: 'auto', padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: "#000000", fontSize: 12, fontWeight: 700
                }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₱{subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: "#000000" }}><span>Discount</span><span>-₱{discount}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}><span>Shipping Fee</span><span>SF will be added on the order confirmation</span></div>
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
          <span>Total</span><span style={{ color: "#000000" }}>₱{total}</span>
        </div>
      </div>

      <button onClick={handleCheckout} disabled={going} className="btn-primary"
        style={{
          width: '100%', padding: 14, marginTop: 12, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
        {going ? (<><span className="spinner" /> Proceeding...</>) : 'Proceed to Checkout'}
      </button>

      <ConfirmDialog
        open={!!confirmRemove}
        title={confirmRemove?.all ? 'Clear cart?' : 'Remove item?'}
        message={confirmRemove?.all
          ? 'Are you sure you want to remove all items from your cart?'
          : `Remove "${confirmRemove?.item?.name}" from your cart?`}
        confirmLabel={confirmRemove?.all ? 'Clear All' : 'Remove'}
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => {
          if (confirmRemove?.all) {
            dispatch({ type: 'CLEAR' });
            showToast('Cart cleared');
          } else {
            dispatch({ type: 'REMOVE', payload: confirmRemove.item.id });
            showToast('Item removed');
          }
          setConfirmRemove(null);
        }}
      />
    </div>
  );
}
