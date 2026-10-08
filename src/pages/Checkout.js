import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X, CheckCircle2, Upload, Zap, Wand2 } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { supabase } from '../lib/supabase';

const ORDER_API = 'https://xmarket-telegram-bot.onrender.com/api/order';
const RECEIPT_API = 'https://xmarket-telegram-bot.onrender.com/api/receipt';

const PAYMENTS = [
  { id: 'gcash', label: 'GCash',
    note: 'Send payment to GCash number 09454408496 (JE*****L C.). Upload your receipt screenshot after payment. Scan the QR below.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593677/GCash-MyQR-28092026184016.PNG.jpg' },
  { id: 'maya', label: 'Maya',
    note: 'Send payment to Maya number 09454408496 (JE*****L C.). Upload your receipt screenshot after payment. Scan the QR below.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593882/myqr_1790592093301.jpg' },
  { id: 'gotyme', label: 'Bank Transfer [Gotyme]',
    note: 'Transfer to: Gotyme Bank | Account Name: Jessrell Custodio | Account No: 0152 4915 7462. Send us a screenshot of the transfer confirmation.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790592841/Screenshot_20260928_183617_GoTyme_PH.jpg' },
];

const DELIVERIES = [
  { id: 'pickup', label: 'Pick-up [anytime]',
    note: 'Pick up at XMARKET, Poblacion, San Pascual, Batangas. Open anytime. Please bring your order number.' },
  { id: 'meetup', label: 'Meet-up [3-7 days]',
    note: 'Meet-Up with us within 3-7 days. Delivery fee is computed at ₱15 per kilometer from the warehouse.' },
  { id: 'express', label: 'Express [Lalamove]',
    note: "Same-day or next-day delivery via Lalamove. Actual fee is charged based on Lalamove's live quotation at checkout. (Buyer will shoulder the delivery fee of Lalamove)" },
  { id: 'instant', label: 'Instant [Applicable for digital products only]',
    instantOnly: true,
    note: 'Instant Delivery for digital products — no delivery fee. You will receive your product immediately after payment confirmation.' },
];

function InfoNote({ text }) {
  return (
    <div style={{
      marginTop: 10, padding: 10,
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      fontSize: 12, color: "#000000", lineHeight: 1.5,
      display: 'flex', gap: 8, alignItems: 'flex-start'
    }}>
      <AlertCircle size={14} color="#000000" style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{text}</span>
    </div>
  );
}

export default function Checkout() {
  const { items, dispatch } = useCart();
  const { user, loading: authLoading, profile } = useAuth();
  const { show: showToast } = useToast();
  const navigate = useNavigate();

  const allInstant = items.length > 0 && items.every(i => i.instant);

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', address: '', landmark: '', province: '',
    city: '', barangay: '', instructions: '', note: '',
    payment: 'gcash',
    delivery: 'meetup'
  });
  const [missing, setMissing] = useState([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/signin', { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (allInstant) setForm(f => ({ ...f, delivery: 'instant' }));
  }, [allInstant]);

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const discount = items.reduce((sum, i) => sum + Math.max(0, (Number(i.originalPrice) || 0) - (Number(i.price) || 0)) * (Number(i.quantity) || 1), 0);
  const total = subtotal;

  const autofill = () => {
    if (!profile) {
      showToast('No saved profile information found');
      return;
    }
    setForm(f => ({
      ...f,
      fullName: [profile.first_name, profile.last_name].filter(Boolean).join(' ') || f.fullName,
      mobile: profile.phone || f.mobile,
      email: user?.email || f.email,
      address: profile.delivery_address || f.address,
      landmark: profile.nearest_landmark || f.landmark,
      province: profile.province || f.province,
      city: profile.city || f.city,
      barangay: profile.barangay || f.barangay,
    }));
    showToast('Filled from your account');
  };

  const goBack = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const selectedPayment = PAYMENTS.find(p => p.id === form.payment);
  const selectedDelivery = DELIVERIES.find(d => d.id === form.delivery);

  const availableDeliveries = DELIVERIES.filter(d => {
    if (d.id === 'instant') return allInstant;
    return true;
  });

  const LABELS = {
    fullName: 'Full Name', mobile: 'Mobile Number', email: 'Email Address', address: 'Delivery Address',
    landmark: 'Nearest Landmark', province: 'Province', city: 'City / Municipality',
    barangay: 'Barangay', instructions: 'Additional Delivery Instruction'
  };
  const REQUIRED = Object.keys(LABELS);

  const handleReceipt = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceipt({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const sendReceipt = async () => {
    if (!receipt) return;
    setSendingReceipt(true);
    try {
      await fetch(RECEIPT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId || 'N/A', name: receipt.name, dataUrl: receipt.dataUrl })
      });
      setReceiptSent(true);
    } catch (err) { console.log('Receipt send failed:', err); }
    setSendingReceipt(false);
  };

  const placeOrder = async () => {
    const missingFields = REQUIRED.filter(k => !form[k] || !form[k].trim());
    if (missingFields.length > 0) {
      setMissing(missingFields);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setMissing([]);
    setSending(true);

    const paymentLabel = PAYMENTS.find(p => p.id === form.payment)?.label;
    const deliveryLabel = DELIVERIES.find(d => d.id === form.delivery)?.label;
    const newOrderId = 'XM-' + Date.now().toString().slice(-8);

    // 1) Notify the Telegram bot (existing behavior)
    try {
      await fetch(ORDER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form,
          items: items.map(i => ({
            name: i.name,
            variant: i.variant || null,
            quantity: i.quantity,
            price: i.price,
          })),
          subtotal, discount, total,
          payment: paymentLabel,
          delivery: deliveryLabel,
          orderId: newOrderId,
        }),
      });
    } catch (err) { console.log('Notify failed:', err); }

    // 2) Write the order to Supabase
    try {
      const { data: order, error: oErr } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          order_code: newOrderId,
          name: form.fullName,
          mobile: form.mobile,
          email: form.email,
          address: form.address,
          landmark: form.landmark,
          province: form.province,
          city: form.city,
          barangay: form.barangay,
          instructions: form.instructions,
          subtotal, discount, total,
          payment_method: paymentLabel,
          delivery_method: deliveryLabel,
          status: 'pending',
        })
        .select()
        .single();

      if (oErr) throw oErr;

      // Insert line items
      const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.product_id,
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        variant: i.variant || null,
      }));
      const { error: iErr } = await supabase.from('order_items').insert(orderItems);
      if (iErr) console.log('order_items insert failed:', iErr.message);

      // Increment sold count on each product
      for (const it of items) {
        const { data: prod } = await supabase
          .from('products')
          .select('sold')
          .eq('id', it.product_id)
          .maybeSingle();
        if (prod) {
          await supabase
            .from('products')
            .update({ sold: (prod.sold || 0) + it.quantity })
            .eq('id', it.product_id);
        }
      }

      // Clear the cart
      await dispatch({ type: 'CLEAR' });

    } catch (err) {
      console.log('Supabase order failed:', err);
      showToast('Order sent but not saved. Contact support.');
    }

    setSending(false);
    setOrderId(newOrderId);
    setSuccess(true);
  };

  const input = (k, label, type = 'text') => {
    const isErr = missing.includes(k);
    return (
      <div style={{ marginBottom: 10 }}>
        <label>{label} *</label>
        <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)}
          style={{ width: '100%', padding: 10, marginTop: 4,
            borderColor: isErr ? '#DC2626' : undefined }} />
      </div>
    );
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 24px', color: 'var(--text)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'var(--card)', border: '2px solid var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, animation: 'popIn 0.5s ease'
        }}>
          <CheckCircle2 size={48} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, color: 'var(--text)' }}>
          Order Placed!
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6,
          marginBottom: 24, maxWidth: 320 }}>
          Thank you for shopping at XMARKET. We've received your order and sent the details to our team.
        </p>

        <div className="card" style={{ padding: 16, marginBottom: 24, width: '100%', maxWidth: 320 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>Order ID</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', letterSpacing: 1 }}>{orderId}</div>
          <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-dim)' }}>Total</span>
            <span style={{ fontWeight: 700 }}>₱{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>Payment</span>
            <span style={{ fontWeight: 700 }}>{selectedPayment?.label}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>Delivery</span>
            <span style={{ fontWeight: 700 }}>{selectedDelivery?.label}</span>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 320, marginBottom: 24 }}>
          {!receiptSent ? (
            <>
              <div style={{
                padding: 12, borderRadius: 12, marginBottom: 12,
                background: 'var(--card)', border: '1px solid var(--border)',
                fontSize: 12, color: 'var(--text)', lineHeight: 1.5, textAlign: 'left'
              }}>
                Upload your payment receipt so we can verify and process your order faster.
              </div>
              <label className="btn-outline" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: 12, cursor: 'pointer', width: '100%'
              }}>
                <Upload size={16} />
                {receipt ? receipt.name : 'Upload Payment Receipt'}
                <input type="file" accept="image/*" onChange={handleReceipt} style={{ display: 'none' }} />
              </label>
              {receipt && (
                <button onClick={sendReceipt} disabled={sendingReceipt} className="btn-primary"
                  style={{ width: '100%', padding: 12, marginTop: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {sendingReceipt ? (<><span className="spinner" /> Sending Receipt...</>) : 'Send Receipt'}
                </button>
              )}
            </>
          ) : (
            <>
              <div style={{
                padding: 12, borderRadius: 12, marginBottom: 16,
                background: 'var(--card)', border: '1px solid var(--border)',
                fontSize: 13, color: 'var(--text)', textAlign: 'center'
              }}>
                ✓ Receipt sent. We'll verify and contact you shortly.
              </div>
              <button className="btn-primary" onClick={() => navigate('/')}
                style={{ padding: '14px 32px', fontSize: 15, fontWeight: 700, width: '100%' }}>
                Continue Shopping
              </button>
            </>
          )}
        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 100, color: 'var(--text)' }}>
      {missing.length > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          padding: '14px 16px 16px', background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
          animation: 'slideDown 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#DC2626', marginBottom: 6 }}>
                Please fill the required fields
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--text)', lineHeight: 1.7 }}>
                {missing.map(k => <li key={k}>{LABELS[k]}</li>)}
              </ul>
            </div>
            <button onClick={() => setMissing([])} style={{ background: 'transparent', color: 'var(--muted)', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={goBack} className="icon-btn"><ArrowLeft size={20} /></button>
        <button onClick={autofill} className="btn-ghost"
          style={{ padding: '8px 14px', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
          <Wand2 size={14} /> Autofill
        </button>
      </div>
      <h2 style={{ marginBottom: 16 }}>Checkout</h2>

      {allInstant && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center',
          padding: 12, marginBottom: 12, background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 12
        }}>
          <Zap size={18} color="var(--primary)" />
          <div style={{ fontSize: 12.5, color: 'var(--text)' }}>
            Your cart contains <b>digital products</b>. Instant Delivery will be used — no fee.
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Delivery Information</h3>
        {input('fullName', 'Full Name')}
        {input('mobile', 'Mobile Number', 'tel')}
        {input('email', 'Email Address', 'email')}
        {input('address', 'Delivery Address')}
        {input('landmark', 'Nearest Landmark')}
        {input('province', 'Province')}
        {input('city', 'City / Municipality')}
        {input('barangay', 'Barangay')}
        <div style={{ marginBottom: 10 }}>
          <label>Additional Delivery Instruction *</label>
          <textarea value={form.instructions} onChange={e => upd('instructions', e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4,
              borderColor: missing.includes('instructions') ? '#DC2626' : undefined }} rows="2" />
        </div>
        <div>
          <label>Note (optional)</label>
          <textarea value={form.note} onChange={e => upd('note', e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4 }} rows="2" />
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Mode of Payment</h3>
        {PAYMENTS.map(p => (
          <label key={p.id} style={{ display: 'block', marginBottom: 6, color: 'var(--text)', fontSize: 14 }}>
            <input type="radio" checked={form.payment === p.id} onChange={() => upd('payment', p.id)} style={{ marginRight: 8 }} />
            {p.label}
          </label>
        ))}
        {selectedPayment && <InfoNote text={selectedPayment.note} />}
        {selectedPayment?.qr && (
          <div style={{ marginTop: 10, padding: 16, textAlign: 'center', background: 'var(--card)', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 700, marginBottom: 8 }}>SCAN TO PAY</div>
            <img src={selectedPayment.qr} alt="QR code"
              style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }} />
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Delivery Method</h3>
        {availableDeliveries.map(d => (
          <label key={d.id} style={{
            display: 'block', marginBottom: 6, fontSize: 14,
            color: allInstant && d.id !== 'instant' ? 'var(--text-dim)' : 'var(--text)',
            opacity: allInstant && d.id !== 'instant' ? 0.5 : 1
          }}>
            <input type="radio"
              checked={form.delivery === d.id}
              disabled={allInstant && d.id !== 'instant'}
              onChange={() => { if (!allInstant) upd('delivery', d.id); }}
              style={{ marginRight: 8 }} />
            {d.label}
          </label>
        ))}
        {selectedDelivery && <InfoNote text={selectedDelivery.note} />}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Order Summary</h3>
        {items.map(i => (
          <div key={i.rowId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>{i.name} × {i.quantity}</span>
            <span>₱{(Number(i.price) || 0) * (Number(i.quantity) || 1)}</span>
          </div>
        ))}
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₱{subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}><span>Discount</span><span>-₱{discount}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}><span>Shipping Fee</span><span>SF will be added on the order confirmation</span></div>
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
          <span>Total</span><span>₱{total}</span>
        </div>
      </div>

      <button onClick={placeOrder} disabled={sending} className="btn-primary"
        style={{
          width: '100%', padding: 14, marginTop: 12, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
        {sending ? (<><span className="spinner" /> Placing Order...</>) : 'Place Order'}
      </button>
    </div>
  );
}
