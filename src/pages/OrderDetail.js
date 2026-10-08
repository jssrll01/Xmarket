import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, XCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../CartContext';
import { useToast } from '../components/Toast';
import { fetchOrder, fetchOrderItems, cancelOrder, confirmReceipt, reorder } from '../lib/orders';

const STEPS = ['pending','processing','shipped','delivered','completed'];
const LABELS = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled' };

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

  const onCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    setBusy(true);
    const { error } = await cancelOrder(order.id);
    setBusy(false);
    if (error) { showToast(error.message); return; }
    setOrder({ ...order, status: 'cancelled' });
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
        <div className="card" style={{ padding: 16, marginBottom: 12, borderLeft: '4px solid #DC2626' }}>
          <div style={{ fontWeight: 800, color: '#DC2626' }}>Order cancelled</div>
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Items</h3>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span>{it.name}{it.variant ? ' (' + it.variant + ')' : ''} × {it.quantity}</span>
            <span>₱{Number(it.price) * it.quantity}</span>
          </div>
        ))}
        <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>Subtotal</span><span>₱{subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--primary)' }}><span>Discount</span><span>-₱{discount}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, marginTop: 8 }}><span>Total</span><span>₱{total}</span></div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Delivery</h3>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }}>
          {order.name}<br/>
          {order.mobile}<br/>
          {order.address}<br/>
          {order.landmark && <>Landmark: {order.landmark}<br/></>}
          {order.barangay}, {order.city}, {order.province}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 10 }}>
          Payment: {order.payment_method}<br/>
          Delivery: {order.delivery_method}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {order.status === 'pending' && (
          <button className="btn-ghost" disabled={busy} onClick={onCancel}
            style={{ flex: 1, padding: 12, color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <XCircle size={16} /> Cancel order
          </button>
        )}
        {(order.status === 'shipped' || order.status === 'delivered') && (
          <button className="btn-primary" disabled={busy} onClick={onConfirm}
            style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <CheckCircle2 size={16} /> Confirm receipt
          </button>
        )}
        <button className="btn-outline" disabled={busy} onClick={onReorder}
          style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <RotateCcw size={16} /> Buy again
        </button>
      </div>
    </div>
  );
}
