import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X, CheckCircle2, Upload, Zap } from 'lucide-react';
import { useCart } from '../CartContext';

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
    note: 'Same-day or next-day delivery via Lalamove. Actual fee is charged based on Lalamove\'s live quotation at checkout. (Buyer will shoulder the delivery fee of Lalamove)' },
  { id: 'instant', label: 'Instant [Applicable for digital products only]',
    instantOnly: true,
    note: 'Instant Delivery for digital products — no delivery fee. You will receive your product immediately after payment confirmation.' },
];

function InfoNote({ text }) {
  return (
    <div style={{
      marginTop: 10, padding: 10,
      background: 'rgba(0,212,255,0.08)',
      border: '1px solid rgba(0,212,255,0.4)',
      borderRadius: 10,
      fontSize: 12, color: '#cbd2f5', lineHeight: 1.5,
      display: 'flex', gap: 8, alignItems: 'flex-start'
    }}>
      <AlertCircle size={14} color="#00d4ff" style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{text}</span>
    </div>
  );
}

export default function Checkout() {
  const { items, dispatch } = useCart();
  const navigate = useNavigate();

  const allInstant = items.length > 0 && items.every(i => i.instant);

  const [form, setForm] = useState({
    fullName: '', mobile: '', address: '', landmark: '', province: '',
    city: '', barangay: '', instructions: '', note: '',
    payment: 'gcash',
    delivery: allInstant ? 'instant' : 'meetup'
  });
  const [missing, setMissing] = useState([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);

  useEffect(() => {
    if (allInstant && form.delivery !== 'instant') {
      setForm(f => ({ ...f, delivery: 'instant' }));
    }
  }, [allInstant]);

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0);
  const total = subtotal;

  const selectedPayment = PAYMENTS.find(p => p.id === form.payment);
  const selectedDelivery = DELIVERIES.find(d => d.id === form.delivery);

  const availableDeliveries = DELIVERIES.filter(d => {
    if (d.id === 'instant') return allInstant;
    return true;
  });

  const LABELS = {
    fullName: 'Full Name', mobile: 'Mobile Number', address: 'Delivery Address',
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
        body: JSON.stringify({
          orderId: orderId || 'N/A',
          name: receipt.name,
          dataUrl: receipt.dataUrl
        })
      });
      setReceiptSent(true);
    } catch (err) {
      console.log('Receipt send failed:', err);
    }
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

    try {
      await fetch(ORDER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form, items, subtotal, discount, total,
          payment: paymentLabel, delivery: deliveryLabel,
          orderId: newOrderId
        })
      });
    } catch (err) {
      console.log('Notify failed:', err);
    }

    setSending(false);
    setOrderId(newOrderId);
    setSuccess(true);
    dispatch({ type: 'CLEAR' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const input = (k, label, type = 'text') => {
    const isErr = missing.includes(k);
    return (
      <div style={{ marginBottom: 10 }}>
        <label>{label} *</label>
        <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)}
          style={{ width: '100%', padding: 10, marginTop: 4,
            borderColor: isErr ? '#ff3d71' : undefined }} />
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
          background: 'linear-gradient(135deg, #00d4ff33, #7b3ff233)',
          border: '2px solid #00d4ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, boxShadow: '0 0 40px rgba(0,212,255,0.4)',
          animation: 'popIn 0.5s ease'
        }}>
          <CheckCircle2 size={48} color="#00d4ff" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8,
          background: 'linear-gradient(90deg, #00d4ff, #7b3ff2, #e539ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Order Placed!
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6,
          marginBottom: 24, maxWidth: 320 }}>
          Thank you for shopping at XMARKET. We've received your order and sent the details to our team.
        </p>

        <div className="card" style={{ padding: 16, marginBottom: 24, width: '100%', maxWidth: 320 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>Order ID</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#00d4ff', letterSpacing: 1 }}>{orderId}</div>
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
                background: 'rgba(255,214,0,0.08)',
                border: '1px solid rgba(255,214,0,0.4)',
                fontSize: 12, color: '#ffe066', lineHeight: 1.5,
                textAlign: 'left'
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
                  style={{
                    width: '100%', padding: 12, marginTop: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                  {sendingReceipt ? (
                    <>
                      <span className="spinner" /> Sending Receipt...
                    </>
                  ) : 'Send Receipt'}
                </button>
              )}
            </>
          ) : (
            <>
              <div style={{
                padding: 12, borderRadius: 12, marginBottom: 16,
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.4)',
                fontSize: 13, color: '#cbd2f5', textAlign: 'center'
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
          padding: '14px 16px 16px',
          background: 'linear-gradient(180deg, #2a0a1c 0%, rgba(42,10,28,0.95) 100%)',
          borderBottom: '1px solid #ff3d71',
          boxShadow: '0 8px 32px rgba(255,61,113,0.35)',
          animation: 'slideDown 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertCircle size={20} color="#ff3d71" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#ff3d71', marginBottom: 6 }}>
                Please fill the required fields
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#ffb3c8', lineHeight: 1.7 }}>
                {missing.map(k => <li key={k}>{LABELS[k]}</li>)}
              </ul>
            </div>
            <button onClick={() => setMissing([])} style={{ background: 'none', color: '#ff3d71', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 16 }}>Checkout</h2>

      {allInstant && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center',
          padding: 12, marginBottom: 12,
          background: 'rgba(255,214,0,0.1)',
          border: '1px solid rgba(255,214,0,0.5)',
          borderRadius: 12
        }}>
          <Zap size={18} color="#ffd600" />
          <div style={{ fontSize: 12.5, color: '#ffe066' }}>
            Your cart contains <b>digital products</b>. Instant Delivery will be used — no fee.
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Delivery Information</h3>
        {input('fullName', 'Full Name')}
        {input('mobile', 'Mobile Number', 'tel')}
        {input('address', 'Delivery Address')}
        {input('landmark', 'Nearest Landmark')}
        {input('province', 'Province')}
        {input('city', 'City / Municipality')}
        {input('barangay', 'Barangay')}
        <div style={{ marginBottom: 10 }}>
          <label>Additional Delivery Instruction *</label>
          <textarea value={form.instructions} onChange={e => upd('instructions', e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4,
              borderColor: missing.includes('instructions') ? '#ff3d71' : undefined }} rows="2" />
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
          <div style={{ marginTop: 10, padding: 16, textAlign: 'center', background: '#fff', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#333', fontWeight: 700, marginBottom: 8 }}>SCAN TO PAY</div>
            <img src={selectedPayment.qr} alt="QR code"
              style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }} />
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Delivery Method</h3>
        {availableDeliveries.map(d => (
          <label key={d.id}
            style={{
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
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>{i.name} × {i.quantity}</span><span>₱{i.price * i.quantity}</span>
          </div>
        ))}
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₱{subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e539ff' }}><span>Discount</span><span>-₱{discount}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}><span>Shipping Fee</span><span>SF will be added on the order confirmation</span></div>
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
          <span>Total</span><span style={{ color: '#00d4ff' }}>₱{total}</span>
        </div>
      </div>

      <button onClick={placeOrder} disabled={sending} className="btn-primary"
        style={{
          width: '100%', padding: 14, marginTop: 12, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
        {sending ? (
          <>
            <span className="spinner" /> Placing Order...
          </>
        ) : 'Place Order'}
      </button>
    </div>
  );
}
