import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, XCircle, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../CartContext';
import { useToast } from '../components/Toast';
import {
  fetchOrder, fetchOrderItems, cancelOrder, confirmReceipt, reorder,
  cancelOrderWithReason
} from '../lib/orders';

const STEPS = ['pending', 'processing', 'shipped', 'delivered', 'completed'];
const LABELS = {
  pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
  delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled'
};

const CANCEL_REASONS = [
  'Changed my mind',
  'Ordered by mistake',
  'Incorrect item or quantity',
  'Incorrect delivery address',
  'Incorrect contact information',
  'Duplicate order',
  'Other',
];

export default function OrderDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { reload: reloadCart } = useCart();
  const { show: showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cancel modal state
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!authLoading && !user) nav('/signin', { replace: true });
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    Promise.all([fetchOrder(user.id, id), fetchOrderItems(id)]).then(([o, i]) => {
      if (!alive) return;
      setOrder(o.order);
      setItems(i.items);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [user, id]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) nav(-1);
    else nav('/orders', { replace: true });
  };

  if (authLoading) return null;
  if (!user) return null;

  const submitCancel = async () => {
    setBusy(true);
    const { error } = await cancelOrderWithReason(order.id, reason, note, user.id);
    setBusy(false);
    if (error) { showToast(error.message); return; }
    setOrder({ ...order, status: 'cancelled', cancel_reason: reason, cancel_note: note });
    setShowCancel(false);
    showToast('Order cancelled');
  };

  const onConfirm = async () => {
    setBusy(true);
    const { error } = await confirmReceipt(order.id);
    setBusy(false);
    if (error) { showToast(error.message); return; }
    setOrder({ ...order, status: 'completed' });
    showToast('Order confirmed. Thanks!');
  };

  const onReorder = async () => {
    setBusy(true);
    const { error } = await reorder(user.id, items);
    setBusy(false);
    if (error) { showToast(error.message); return; }
    await reloadCart();
    showToast('Items added to cart');
    nav('/cart');
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>;
  if (!order) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p>Order not found.</p>
      <button className="btn-primary" onClick={goBackSafe} style={{ padding: '10px 20px' }}>Go back</button>
    </div>
  );

  const stepIndex = STEPS.indexOf(order.status);
  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const total = Number(order.total) || 0;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>

      <h2 style={{ marginBottom: 4 }}>Order #{order.order_code}</h2>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
        {new Date(order.created_at).toLocaleString()}
      </div>

      {order.status !== 'cancelled' && (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Order Timeline</h3>
          {STEPS.filter(s => s !== 'completed').map((s, i) => {
            const active = i <= stepIndex || order.status === 'completed';
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: active ? 'var(--primary)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Package size={12} color="#fff" />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: active ? 700 : 400, color: active ? 'var(--text)' : 'var(--muted)' }}>
                  {LABELS[s]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="card" style={{ padding: 16, marginBottom: 12, border: '1px solid #FEE2E2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <XCircle size={18} color="#DC2626" />
            <div style={{ fontWeight: 800, color: '#DC2626' }}>Order cancelled</div>
          </div>
          {order.cancel_reason && (
            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>
              <b>Reason:</b> {order.cancel_reason}
            </div>
          )}
          {order.cancel_note && (
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              <b>Note:</b> {order.cancel_note}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Items</h3>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span>{it.name}{it.variant ? ` (${it.variant})` : ''} × {it.quantity}</span>
            <span>₱{(Number(it.price) || 0) * (Number(it.quantity) || 1)}</span>
          </div>
        ))}
        <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Subtotal</span><span>₱{subtotal}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--primary)' }}>
            <span>Discount</span><span>-₱{discount}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, marginTop: 8 }}>
          <span>Total</span><span>₱{total}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {order.status === 'pending' && (
          <button onClick={() => setShowCancel(true)} disabled={busy}
            className="btn-ghost"
            style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#DC2626', borderColor: '#DC2626' }}>
            <XCircle size={14} /> Cancel order
          </button>
        )}
        {(order.status === 'shipped' || order.status === 'delivered') && (
          <button onClick={onConfirm} disabled={busy} className="btn-primary"
            style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <CheckCircle2 size={14} /> Confirm receipt
          </button>
        )}
        <button onClick={onReorder} disabled={busy} className="btn-ghost"
          style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <RotateCcw size={14} /> Buy again
        </button>
      </div>

      {/* CANCEL MODAL */}
      {showCancel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setShowCancel(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{
              width: '100%', background: 'var(--bg, #fff)',
              padding: 20, borderRadius: '20px 20px 0 0',
              maxHeight: '85vh', overflowY: 'auto',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertCircle size={18} color="#DC2626" />
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Cancel order?</h3>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>
              This cannot be undone. Please tell us why:
            </p>

            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Reason</label>
            <select value={reason} onChange={e => setReason(e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }}>
              {CANCEL_REASONS.map(r => <option key={r}>{r}</option>)}
            </select>

            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Any extra details…"
              style={{ width: '100%', padding: 10, marginTop: 6, marginBottom: 12, minHeight: 80, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowCancel(false)} className="btn-ghost" style={{ flex: 1, padding: 12 }}>
                Keep order
              </button>
              <button onClick={submitCancel} disabled={busy}
                style={{
                  flex: 1, padding: 12, fontSize: 13, fontWeight: 700, borderRadius: 10,
                  background: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer',
                  opacity: busy ? 0.6 : 1,
                }}>
                {busy ? 'Cancelling…' : 'Confirm cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
