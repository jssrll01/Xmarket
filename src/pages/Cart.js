import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import SmartImage from '../components/SmartImage';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { parseCartVariant, comboLabel } from '../lib/variants';

export default function Cart() {
  const { items, dispatch, loading } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const [going, setGoing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/signin', { replace: true });
  }, [user, authLoading, navigate]);

  const subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const originalTotal = items.reduce((s, i) => s + (Number(i.originalPrice) || Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const savings = Math.max(0, originalTotal - subtotal);
  const itemCount = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);

  const handleCheckout = () => {
    if (!items.length) return;
    setGoing(true);
    setTimeout(() => navigate('/checkout'), 300);
  };

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) navigate(-1);
    else navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, flex: 1 }}>
          Cart {itemCount > 0 && <span style={{ color: 'var(--muted)', fontWeight: 500 }}>· {itemCount}</span>}
        </h2>
        {items.length > 0 && (
          <button onClick={() => setConfirmClear(true)} className="icon-btn" title="Clear cart">
            <Trash2 size={16} color="#DC2626" />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <ShoppingCart size={36} color="var(--muted)" style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 800, marginBottom: 4 }}>Your cart is empty</div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
            Add items to get started
          </div>
          <button className="btn-brand" style={{ padding: '12px 20px', borderRadius: 12 }}
            onClick={() => navigate('/')}>
            Browse products
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {items.map((it) => (
              <CartRow
                key={it.rowId}
                item={it}
                onInc={() => dispatch({ type: 'INCREASE', payload: it.rowId })}
                onDec={() => dispatch({ type: 'DECREASE', payload: it.rowId })}
                onRemove={() => setConfirmRemove(it)}
                onOpen={() => navigate(`/product/${it.id || it.product_id}`)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 16, marginBottom: 12 }}>
            <Row label="Subtotal" value={`₱${subtotal.toLocaleString()}`} />
            {savings > 0 && (
              <Row label="You save" value={`-₱${savings.toLocaleString()}`} green />
            )}
            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
            <Row label="Total" value={`₱${subtotal.toLocaleString()}`} bold money />
          </div>

          <button onClick={handleCheckout} disabled={going} className="btn-brand"
            style={{ width: '100%', padding: 16, borderRadius: 14, fontSize: 15, marginBottom: 20 }}>
            {going ? 'Going to checkout…' : `Checkout · ₱${subtotal.toLocaleString()}`}
          </button>
        </>
      )}

      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove item?"
        message={confirmRemove ? `Remove "${confirmRemove.name}" from your cart?` : ''}
        confirmLabel="Remove"
        danger
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => {
          dispatch({ type: 'REMOVE', payload: confirmRemove.rowId });
          showToast?.('Item removed');
          setConfirmRemove(null);
        }}
      />

      <ConfirmDialog
        open={confirmClear}
        title="Clear cart?"
        message="Remove all items from your cart?"
        confirmLabel="Clear"
        danger
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          dispatch({ type: 'CLEAR' });
          showToast?.('Cart cleared');
          setConfirmClear(false);
        }}
      />
    </div>
  );
}

/* ─── Row with swipe-to-delete ─── */
function CartRow({ item, onInc, onDec, onRemove, onOpen }) {
  const startX = useRef(0);
  const startY = useRef(0);
  const [dx, setDx] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const threshold = 80;
  const maxSwipe = 110;

  const variantObj = parseCartVariant(item.variant);
  const variantLabel = comboLabel(variantObj);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setSwiping(false);
  };
  const handleTouchMove = (e) => {
    const x = e.touches[0].clientX - startX.current;
    const y = e.touches[0].clientY - startY.current;
    if (!swiping && Math.abs(y) > Math.abs(x)) return; // vertical scroll wins
    setSwiping(true);
    // left swipe only
    const clamped = Math.min(0, Math.max(-maxSwipe, x));
    setDx(clamped);
  };
  const handleTouchEnd = () => {
    if (dx <= -threshold) {
      onRemove();
    }
    setDx(0);
    setSwiping(false);
  };

  const qty = Number(item.quantity) || 1;
  const line = (Number(item.price) || 0) * qty;

  return (
    <div className="cart-row-wrap">
      {/* swipe background */}
      <div className="cart-row-swipe-bg" aria-hidden="true">
        <Trash2 size={20} />
      </div>

      <div
        className="cart-row"
        style={{ transform: `translateX(${dx}px)`, transition: swiping ? 'none' : 'transform .28s cubic-bezier(.4,0,.2,1)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* thumbnail */}
        <button onClick={onOpen} className="cart-thumb" aria-label={item.name}>
          <SmartImage src={(item.images && item.images[0]) || item.image} alt={item.name} />
          {item.instant && (
            <span className="instant-badge cart-instant"><Zap size={10} /> Instant</span>
          )}
        </button>

        {/* info */}
        <div className="cart-info">
          <button onClick={onOpen} className="cart-name">{item.name}</button>
          {variantLabel && (
            <div className="cart-variant">{variantLabel}</div>
          )}
          <div className="cart-unit money">₱{Number(item.price || 0).toLocaleString()} each</div>

          <div className="cart-qty">
            <button onClick={onDec} className="cart-qty-btn" aria-label="Decrease">
              <Minus size={13} />
            </button>
            <span className="cart-qty-val">{qty}</span>
            <button onClick={onInc} className="cart-qty-btn" aria-label="Increase">
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* line total + delete */}
        <div className="cart-right">
          <div className="cart-line money">₱{line.toLocaleString()}</div>
          <button onClick={onRemove} className="cart-del" aria-label="Remove">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, money }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontWeight: bold ? 800 : 600, fontSize: bold ? 16 : 13 }}>
      <span style={{ color: bold ? 'var(--text)' : 'var(--muted)' }}>{label}</span>
      <span className={money ? 'money' : ''} style={{ color: green ? '#10B981' : undefined }}>{value}</span>
    </div>
  );
}
