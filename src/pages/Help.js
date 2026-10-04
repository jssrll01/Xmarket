import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I place an order?',
    a: 'Browse products on the Home page, tap Add to Cart, then go to your Cart and tap Proceed to Checkout. Fill in your delivery information and choose a payment and delivery method.' },
  { q: 'What payment methods do you accept?',
    a: 'We accept GCash, Maya, and Bank Transfer (Gotyme). Each payment method shows a QR code and account details on the Checkout page. Send us your payment receipt via the upload option.' },
  { q: 'How long is delivery?',
    a: 'Pre-order: 7-14 days. Meet-up: 3-7 days. Express (Lalamove): same-day or next-day. Instant Delivery (digital products only): immediate.' },
  { q: 'What is Instant Delivery?',
    a: 'Instant Delivery is available for digital products like courses and apps. There is no delivery fee, and you receive the product immediately after payment confirmation.' },
  { q: 'How do I upload my payment receipt?',
    a: 'After choosing a payment method on the Checkout page, tap the Upload Payment Receipt button. Attach your screenshot and submit.' },
  { q: 'Do you offer vouchers?',
    a: 'Yes — seasonal vouchers and promo codes appear on the Home banner. Check back often for limited-time deals.' },
  { q: 'How do I know my order was received?',
    a: 'After placing an order, you will see an Order Placed confirmation screen with a unique Order ID. We also receive your order details instantly.' },
  { q: 'Can I cancel my order?',
    a: 'Orders can be cancelled before shipment. Contact us via phone at +63 9454408496 as soon as possible.' },
  { q: 'Are the products guaranteed?',
    a: 'Every product is backed by our support team. If you encounter any issue with a digital product, reach out and we will resolve it.' },
  { q: 'How do I contact support?',
    a: 'You can call us at +63 9454408496 or send us a message through our Facebook page. Support hours are 9 AM to 9 PM daily.' },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ padding: 16, marginBottom: 10 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
          cursor: 'pointer'
        }}>
        <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14 }}>
          {item.q}
        </div>
        <ChevronDown
          size={18}
          color="#00d4ff"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease'
          }} />
      </div>
      {open && (
        <div style={{
          fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6,
          marginTop: 12, paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          animation: 'fadeIn 0.2s ease'
        }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1 && document.referrer) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={goBack} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 12 }}>Help Center</h2>
      {faqs.map((f, i) => <FAQItem key={i} item={f} />)}
    </div>
  );
}
