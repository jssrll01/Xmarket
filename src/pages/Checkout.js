import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { useCart } from '../CartContext';

const PAYMENTS = [
  { id: 'gcash', label: 'GCash',
    note: 'Send payment to GCash number 09454408496 (XMARKET Official). Upload your receipt screenshot after payment. Scan the QR below.',
    showQR: true },
  { id: 'maya', label: 'Maya',
    note: 'Send payment to Maya number 09454408496 (XMARKET Official). Upload your receipt screenshot after payment. Scan the QR below.',
    showQR: true },
  { id: 'gotyme', label: 'Bank Transfer [Gotyme]',
    note: 'Transfer to: Gotyme Bank | Account Name: XMARKET Official | Account No: 0123 4567 8901. Send us a screenshot of the transfer confirmation.',
    showQR: true,
    showQR: true },
];

const DELIVERIES = [
  { id: 'pickup', label: 'Pick-up [anytime]',
    note: 'Pick up at our warehouse: XMARKET Hub, 123 Mabini St., Manila. Open anytime. Please bring your order number.' },
  { id: 'standard', label: 'Standard [3-7 days]',
    note: 'Delivered by our partner courier within 3-7 days. Delivery fee is computed at ₱10 per kilometer from the warehouse.' },
  { id: 'express', label: 'Express [Lalamove]',
    note: 'Same-day or next-day delivery via Lalamove. Actual fee is charged based on Lalamove\'s live quotation at checkout.' },
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
  const [form, setForm] = useState({
    fullName: '', mobile: '', address: '', landmark: '', province: '',
    city: '', barangay: '', instructions: '', note: '',
    payment: 'gcash', delivery: 'standard'
  });
  const [missing, setMissing] = useState([]);

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0);
  const total = subtotal;

  const selectedPayment = PAYMENTS.find(p => p.id === form.payment);
  const selectedDelivery = DELIVERIES.find(d => d.id === form.delivery);

  const LABELS = {
    fullName: 'Full Name', mobile: 'Mobile Number', address: 'Delivery Address',
    landmark: 'Nearest Landmark', province: 'Province', city: 'City / Municipality',
    barangay: 'Barangay', instructions: 'Additional Delivery Instruction'
  };
  const REQUIRED = Object.keys(LABELS);

  const placeOrder = () => {
    const missingFields = REQUIRED.filter(k => !form[k] || !form[k].trim());
    if (missingFields.length > 0) {
      setMissing(missingFields);
      return;
    }
    setMissing([]);
    alert('Order placed successfully!\nTotal: ₱' + total);
    dispatch({ type: 'CLEAR' });
    navigate('/');
  };

  const input = (k, label, type = 'text') => {
    const isErr = missing.includes(k);
    return (
      <div style={{ marginBottom: 10 }}>
        <label>{label} *</label>
        <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)}
          style={{
            width: '100%', padding: 10, marginTop: 4,
            borderColor: isErr ? '#ff3d71' : undefined
          }} />
        {isErr && (
          <div style={{ fontSize: 11, color: '#ff3d71', marginTop: 2 }}>
            This field is required
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 16, paddingBottom: 100, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 16 }}>Checkout</h2>

      {missing.length > 0 && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          padding: 12, marginBottom: 12,
          background: 'rgba(255,61,113,0.12)',
          border: '1px solid #ff3d71',
          borderRadius: 12
        }}>
          <AlertCircle size={18} color="#ff3d71" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#ff3d71', marginBottom: 4 }}>
              Please fill the required fields
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#ffb3c8', lineHeight: 1.6 }}>
              {missing.map(k => <li key={k}>{LABELS[k]}</li>)}
            </ul>
          </div>
          <button onClick={() => setMissing([])}
            style={{ background: 'none', color: '#ff3d71', padding: 0 }}>
            <X size={16} />
          </button>
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
            style={{
              width: '100%', padding: 10, marginTop: 4,
              borderColor: missing.includes('instructions') ? '#ff3d71' : undefined
            }} rows="2" />
          {missing.includes('instructions') && (
            <div style={{ fontSize: 11, color: '#ff3d71', marginTop: 2 }}>
              This field is required
            </div>
          )}
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
        {selectedPayment?.showQR && (
          <div style={{ marginTop: 10, padding: 16, textAlign: 'center', background: '#fff', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#333', fontWeight: 700, marginBottom: 6 }}>SCAN TO PAY</div>
            <div style={{
              width: 160, height: 160, margin: '0 auto',
              background: 'repeating-linear-gradient(45deg,#000 0 6px,#fff 6px 12px)',
              borderRadius: 8
            }} />
            <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>XMARKET Official</div>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Delivery Method</h3>
        {DELIVERIES.map(d => (
          <label key={d.id} style={{ display: 'block', marginBottom: 6, color: 'var(--text)', fontSize: 14 }}>
            <input type="radio" checked={form.delivery === d.id} onChange={() => upd('delivery', d.id)} style={{ marginRight: 8 }} />
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

      <button onClick={placeOrder} className="btn-primary"
        style={{ width: '100%', padding: 14, marginTop: 12, fontSize: 16 }}>
        Place Order
      </button>
    </div>
  );
}
