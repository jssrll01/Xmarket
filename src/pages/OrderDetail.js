import { OrderDetailSkeleton } from '../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, XCircle, CheckCircle2, RotateCcw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../CartContext';
import { useToast } from '../components/Toast';
import {
  fetchOrder, fetchOrderItems, confirmReceipt, reorder
} from '../lib/orders';

const STEPS = ['pending', 'processing', 'shipped', 'delivered', 'completed'];
const LABELS = {
  pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
  delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled'
};


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
  }

  const onWriteReview = () => {
    if (!items.length) return;
    const firstProduct = items.find(i => i.product_id)?.product_id;
    if (!firstProduct) { showToast('No product to review'); return; }
    nav(`/product/${firstProduct}#review`);
  };;

  if (loading) return <OrderDetailSkeleton />;
  if (!order) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p>Order not found.</p>
      <button className="btn-primary" onClick={goBackSafe} style={{ padding: '10px 20px' }}>Go back</button>
    </div>
  );

  const stepIndex = STEPS.indexOf(order.status);
  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping_fee) || 0;
  const total = Math.max(0, subtotal - discount) + shipping;

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
          <span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--primary)' }}>
            <span>Discount</span><span>-₱{discount.toFixed(2)}</span>
          </div>
        )}
        {(
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>Shipping</span><span>₱{shipping.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, marginTop: 8 }}>
          <span>Total</span><span>₱{total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={onWriteReview} disabled={busy || !items.length} className="btn-primary"
          style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Star size={14} /> Write a review
        </button>
        <button onClick={onReorder} disabled={busy} className="btn-ghost"
          style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <RotateCcw size={14} /> Buy again
        </button>
      </div>

    </div>
  );
}
