import { ListRowsSkeleton } from '../components/Skeleton';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { parseCartVariant, comboLabel } from '../lib/variants';
import YouMayAlsoLike from '../components/YouMayAlsoLike';
import SmartImage from '../components/SmartImage';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export default function Cart() {
  const { items, dispatch } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const [going, setGoing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/signin', { replace: true });
  }, [user, authLoading, navigate]);

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const total = subtotal;

  const handleCheckout = () => {
    setGoing(true);
    setTimeout(() => navigate('/checkout'), 500);
  };

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) navigate(-1);
    else navigate('/', { replace: true });
  };

  if (authLoading) return <ListRowsSkeleton count={5} />;
  if (items.length === 0) {

    return (
      <div style={{ padding: 16 }}>
        <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
          <ArrowLeft size={20} />
        </button>
        <div className="empty-state">
          <div className="icon-badge">
            <ShoppingCart size={48} />
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Explore our products and find something you love.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 28px' }}>
            Start Shopping
          </button>
        </div>

        <YouMayAlsoLike />
      </div>
    );
  }

  const cartIds = items.map(i => i.product_id);

  return (
    <div style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Shopping Cart</h2>
        <button
          onClick={() => setConfirmRemove({ all: true })}
          className="btn-ghost"
          style={{ padding: '8px 14px', fontSize: 12, color: '#DC2626' }}>
          Clear All
        </button>
      </div>

      {items.map(i => (
        <div key={i.rowId} className="card"
          style={{ padding: 12, marginBottom: 10, display: 'flex', gap: 12 }}>
          <SmartImage src={(i.images && i.images[0]) || 'https://via.placeholder.com/64?text=X'} alt={i.name}
            style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0, background: "var(--card)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{i.name}</div>
            {i.variant && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Variant: {comboLabel(parseCartVariant(i.variant))}</div>}
            <div style={{ fontWeight: 800, marginTop: 4 }}>₱{i.price}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <button onClick={() => dispatch({ type: 'DECREASE', payload: i.rowId })} className="btn-ghost" style={{ padding: 7 }}>
                <Minus size={14} />
              </button>
              <span>{i.quantity}</span>
              <button onClick={() => dispatch({ type: 'INCREASE', payload: i.rowId })} className="btn-ghost" style={{ padding: 7 }}>
                <Plus size={14} />
              </button>
              <button
                onClick={() => setConfirmRemove({ item: i })}
                className="btn-ghost"
                style={{
                  marginLeft: 'auto', padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: '#DC2626', fontSize: 12, fontWeight: 700
                }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₱{subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}><span>Shipping Fee</span><span>SF will be added on the order confirmation</span></div>
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
          <span>Total</span><span>₱{total}</span>
        </div>
      </div>

      <button onClick={handleCheckout} disabled={going} className="btn-primary"
        style={{
          width: '100%', padding: 14, marginTop: 12, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
        {going ? (<><span className="spinner" /> Proceeding...</>) : 'Proceed to Checkout'}
      </button>

      <YouMayAlsoLike excludeIds={cartIds} />

      <ConfirmDialog
        open={!!confirmRemove}
        title={confirmRemove?.all ? 'Clear cart?' : 'Remove item?'}
        message={confirmRemove?.all
          ? 'Are you sure you want to remove all items from your cart?'
          : `Remove "${confirmRemove?.item?.name}" from your cart?`}
        confirmLabel={confirmRemove?.all ? 'Clear All' : 'Remove'}
        onCancel={() => setConfirmRemove(null)}
        onConfirm={async () => {
          if (confirmRemove?.all) {
            await dispatch({ type: 'CLEAR' });
            showToast('Cart cleared');
          } else {
            await dispatch({ type: 'REMOVE', payload: confirmRemove.item.rowId });
            showToast('Item removed');
          }
          setConfirmRemove(null);
        }}
      />
    </div>
  );
}
