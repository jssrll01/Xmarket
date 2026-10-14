import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  { name: 'Shop on XMARKET', items: [
    { t: '[New to XMARKET] How do I create an XMARKET account?', slug: 'create-account' },
    { t: '[Shopping] How do I search for products?', slug: 'search-products' },
    { t: '[Shopping] How do I search for a specific shop?', slug: 'search-shop' },
    { t: '[Shopping] How do I view product details?', slug: 'view-product-details' },
    { t: '[Shopping] How do I add an item to my cart?', slug: 'add-to-cart' },
    { t: '[Shopping] How do I place an order?', slug: 'place-order' },
    { t: '[Shopping] How do I buy multiple products?', slug: 'buy-multiple' },
    { t: '[Shopping] How do I save a product for later?', slug: 'save-for-later' },
    { t: '[Shopping] How do I favorite a shop?', slug: 'favorite-shop' },
    { t: '[Shopping] How do I share a product?', slug: 'share-product' },
    { t: '[Shopping] How do I contact a seller?', slug: 'contact-seller' },
    { t: '[Shopping] How do I leave a product review?', slug: 'leave-review' },
    { t: '[Shopping] How do I edit or delete my review?', slug: 'edit-review' },
    { t: '[Shopping] How can I identify trusted sellers?', slug: 'trusted-sellers' },
    { t: '[Shopping] What does a verified seller mean?', slug: 'verified-seller' },
  ]},
  { name: 'Account & Security', items: [
    { t: '[My Account] How do I change my password?', slug: 'change-password' },
    { t: '[My Account] How do I change my email address?', slug: 'change-email' },
    { t: '[My Account] How do I change my phone number?', slug: 'change-phone' },
    { t: '[My Account] How do I change my username?', slug: 'change-username' },
    { t: '[My Account] How do I update my profile information?', slug: 'update-profile' },
    { t: '[My Account] How do I delete my XMARKET account?', slug: 'delete-account' },
    { t: '[Account Recovery] How do I recover my account?', slug: 'recover-account' },
    { t: '[Account Security] How do I secure my XMARKET account?', slug: 'secure-account' },
    { t: '[Account Security] What should I do if someone accessed my account?', slug: 'account-accessed' },
    { t: '[Account Security] What should I do if I receive an unknown verification code?', slug: 'unknown-code' },
    { t: '[Account Security] Why am I being asked to verify my identity?', slug: 'verify-identity' },
  ]},
  { name: 'Orders', items: [
    { t: '[Orders] How do I place an order?', slug: 'orders-place' },
    { t: '[Orders] Where can I view my orders?', slug: 'view-orders' },
    { t: '[Orders] How do I check my order status?', slug: 'check-order-status' },
    { t: '[Orders] How do I track my order?', slug: 'track-order' },
    { t: '[Orders] Can I cancel my order?', slug: 'cancel-order' },
    { t: '[Orders] Why was my order automatically cancelled?', slug: 'auto-cancelled' },
    { t: '[Orders] What happens after I place an order?', slug: 'after-order' },
    { t: '[Orders] Can I change my order after placing it?', slug: 'change-order' },
    { t: '[Orders] Can I change my delivery address after ordering?', slug: 'change-address' },
    { t: '[Orders] What should I do if I ordered the wrong product?', slug: 'wrong-product-order' },
    { t: '[Orders] What should I do if my order is delayed?', slug: 'order-delayed' },
    { t: '[Orders] What should I do if my order has not arrived?', slug: 'order-not-arrived' },
    { t: '[Orders] What should I do if my order says delivered but I did not receive it?', slug: 'marked-delivered' },
    { t: '[Orders] What should I do if I received the wrong product?', slug: 'received-wrong' },
    { t: '[Orders] What should I do if an item is missing from my order?', slug: 'missing-item' },
  ]},
  { name: 'Shipping & Delivery', items: [
    { t: '[Shipping] What delivery options are available?', slug: 'delivery-options' },
    { t: '[Shipping] How much is the delivery fee?', slug: 'delivery-fee' },
    { t: '[Shipping] How long will my order take to arrive?', slug: 'delivery-time' },
    { t: '[Shipping] What is the estimated delivery date?', slug: 'eta' },
    { t: '[Shipping] How can I track my parcel?', slug: 'track-parcel' },
    { t: '[Shipping] What does my tracking status mean?', slug: 'tracking-status' },
    { t: '[Shipping] Why has my tracking information not updated?', slug: 'tracking-not-updated' },
    { t: '[Shipping] What happens if the courier cannot deliver my order?', slug: 'courier-cannot-deliver' },
    { t: '[Shipping] Can someone else receive my parcel?', slug: 'someone-else-receive' },
    { t: '[Shipping] What should I do if my parcel is damaged?', slug: 'parcel-damaged' },
    { t: '[Shipping] What should I do if my parcel is lost?', slug: 'parcel-lost' },
    { t: '[Shipping] What should I do if my parcel is returned to the seller?', slug: 'parcel-returned' },
  ]},
  { name: 'Payments', items: [
    { t: '[Payments] What payment methods are available on XMARKET?', slug: 'payment-methods' },
    { t: '[Payments] How do I pay for my order?', slug: 'pay-order' },
    { t: '[Payments] Why did my payment fail?', slug: 'payment-failed' },
    { t: '[Payments] Why was my payment declined?', slug: 'payment-declined' },
    { t: '[Payments] My payment was deducted but my order was not confirmed. What should I do?', slug: 'deducted-no-order' },
    { t: '[Payments] Can I change my payment method after ordering?', slug: 'change-payment' },
    { t: '[Payments] Where can I view my payment history?', slug: 'payment-history' },
    { t: '[Payments] Are my payment details secure?', slug: 'payment-secure' },
    { t: '[Payments] What should I do if I was charged twice?', slug: 'charged-twice' },
    { t: '[Payments] Why is my payment still processing?', slug: 'payment-processing' },
    { t: '[Payments] Can I pay using multiple payment methods?', slug: 'multiple-payments' },
  ]},
  { name: 'Vouchers & Promotions', items: [
    { t: '[Vouchers] What is an XMARKET voucher?', slug: 'voucher-what' },
    { t: '[Vouchers] How do I claim a voucher?', slug: 'voucher-claim' },
    { t: '[Vouchers] How do I use a voucher?', slug: 'voucher-use' },
    { t: "[Vouchers] Why can't I use my voucher?", slug: 'voucher-cant-use' },
    { t: '[Vouchers] Why did my voucher expire?', slug: 'voucher-expired' },
    { t: '[Vouchers] How many times can I use a voucher?', slug: 'voucher-uses' },
    { t: '[Vouchers] Can I combine multiple vouchers?', slug: 'voucher-combine' },
    { t: '[Vouchers] Can vouchers be transferred to another account?', slug: 'voucher-transfer' },
    { t: '[Promotions] Where can I find current XMARKET promotions?', slug: 'promos-find' },
    { t: '[Promotions] What are Flash Deals?', slug: 'flash-deals' },
    { t: '[Promotions] What are Limited-Time Deals?', slug: 'limited-time-deals' },
    { t: '[Promotions] What are XMARKET exclusive deals?', slug: 'exclusive-deals' },
    { t: '[Promotions] Why is a promotion unavailable for my order?', slug: 'promo-unavailable' },
  ]},
  { name: 'Returns & Refunds', items: [
    { t: "[Returns] What is XMARKET's return policy?", slug: 'return-policy' },
    { t: '[Returns] What products can be returned?', slug: 'returnable-products' },
    { t: '[Returns] What products cannot be returned?', slug: 'non-returnable' },
    { t: '[Returns] How do I request a return?', slug: 'request-return' },
    { t: '[Returns] How do I request a refund?', slug: 'request-refund' },
    { t: '[Returns] What reasons are eligible for a return or refund?', slug: 'return-reasons' },
    { t: '[Returns] What evidence should I provide for a return/refund request?', slug: 'return-evidence' },
    { t: '[Returns] What should I do if I received a defective product?', slug: 'defective-product' },
    { t: '[Returns] What should I do if I received the wrong product?', slug: 'received-wrong-return' },
    { t: '[Returns] What should I do if an item is missing?', slug: 'missing-item-return' },
    { t: '[Returns] What should I do if I received a damaged parcel?', slug: 'damaged-parcel' },
    { t: '[Returns] What should I do if my order never arrived?', slug: 'never-arrived' },
    { t: '[Returns] How do I check my return/refund status?', slug: 'check-refund-status' },
    { t: '[Returns] Can I cancel a return/refund request?', slug: 'cancel-refund-request' },
    { t: '[Refunds] How long does a refund take?', slug: 'refund-duration' },
    { t: '[Refunds] Where will my refund be sent?', slug: 'refund-destination' },
    { t: '[Refunds] Why have I not received my refund yet?', slug: 'refund-not-received' },
  ]},
  { name: 'Chat & Communication', items: [
    { t: '[Chat] How do I chat with a seller?', slug: 'chat-seller' },
    { t: '[Chat] How do I send photos through XMARKET Chat?', slug: 'chat-photos' },
    { t: '[Chat] Can I send videos through Chat?', slug: 'chat-videos' },
    { t: '[Chat] What should I do if a seller is unresponsive?', slug: 'seller-unresponsive' },
    { t: '[Chat] What should I do if a buyer is unresponsive?', slug: 'buyer-unresponsive' },
    { t: '[Chat] How do I report inappropriate messages?', slug: 'report-messages' },
    { t: '[Chat] How do I block another user?', slug: 'block-user' },
    { t: "[Chat] Why can't I send a message?", slug: 'cant-send-message' },
  ]},
  { name: 'Technical Support', items: [
    { t: '[Technical Issues] What should I do if XMARKET is not loading?', slug: 'tech-not-loading' },
    { t: '[Technical Issues] What should I do if I see a blank page?', slug: 'tech-blank-page' },
    { t: '[Technical Issues] Why is the XMARKET app crashing?', slug: 'tech-crashing' },
    { t: "[Technical Issues] Why can't I log in?", slug: 'tech-cant-login' },
    { t: '[Technical Issues] Why am I unable to place an order?', slug: 'tech-cant-order' },
    { t: '[Technical Issues] Why is my cart not updating?', slug: 'tech-cart' },
    { t: "[Technical Issues] Why can't I upload a product image?", slug: 'tech-upload-image' },
    { t: "[Technical Issues] Why isn't my payment page loading?", slug: 'tech-payment-page' },
    { t: '[Technical Issues] How do I report a technical problem?', slug: 'tech-report' },
    { t: '[Technical Issues] What information should I provide when reporting an error?', slug: 'tech-info' },
  ]},
  { name: 'General', items: [
    { t: '[General] What is XMARKET?', slug: 'general-what' },
    { t: '[General] Is XMARKET available in my area?', slug: 'general-area' },
    { t: '[General] Is XMARKET available on mobile devices?', slug: 'general-mobile' },
    { t: '[General] How do I contact XMARKET Support?', slug: 'general-contact' },
    { t: '[General] How do I report a seller?', slug: 'general-report-seller' },
    { t: '[General] How do I report a product?', slug: 'general-report-product' },
    { t: '[General] How do I report suspicious activity?', slug: 'general-report-suspicious' },
    { t: '[General] How does XMARKET protect buyers?', slug: 'general-protect-buyers' },
    { t: '[General] How does XMARKET protect sellers?', slug: 'general-protect-sellers' },
    { t: '[General] How can I provide feedback about XMARKET?', slug: 'general-feedback' },
  ]},
];

function CategoryBlock({ category, search, isOpen, onToggle }) {
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!search.trim()) return category.items;
    const q = search.toLowerCase();
    return category.items.filter(i => i.t.toLowerCase().includes(q));
  }, [category.items, search]);

  if (items.length === 0) return null;

  const go = (item) => {
    if (item.path) navigate(item.path);
    else if (item.slug) navigate('/help/' + item.slug);
  };
  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };


  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={onToggle}
        className="card"
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
          padding: '16px 18px',
          background: 'none', color: 'var(--text)',
          fontWeight: 700, fontSize: 14.5, textAlign: 'left'
        }}>
        <span>{category.name}</span>
        <ChevronDown size={18} color="#000000"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease'
          }} />
      </button>

      {isOpen && (
        <div style={{ marginTop: 8, animation: 'fadeIn 0.2s ease' }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => go(item)}
              className="card"
              style={{
                width: '100%', padding: 14, marginBottom: 8,
                textAlign: 'left', color: 'var(--text)',
                fontSize: 13, lineHeight: 1.5,
                display: 'flex', alignItems: 'center', gap: 12
              }}>
              <HelpCircle size={15} color="#000000" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.t}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const navigate = useNavigate();
  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ marginBottom: 6 }}>XMARKET Help Center</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 13.5, marginBottom: 20 }}>
        Hello, How Can We Help You?
      </p>

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} style={{
          position: 'absolute', left: 14, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-dim)'
        }} />
        <input
          type="text"
          placeholder="Search for articles, questions, or topics"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '13px 40px 13px 40px' }}
        />
        {search && (
          <button onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', color: 'var(--text-dim)',
              padding: 4, boxShadow: 'none'
            }}>
            <X size={16} />
          </button>
        )}
      </div>

      {CATEGORIES.map((c, i) => (
        <CategoryBlock
          key={i}
          category={c}
          search={search}
          isOpen={openIndex === i || search.trim().length > 0}
          onToggle={() => toggle(i)}
        />
      ))}

      <div className="card" style={{ padding: 22, marginTop: 24, textAlign: 'center' }}>
        <h3 style={{ fontSize: 17, marginBottom: 6 }}>Need More Help?</h3>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
          Do You Have Any Other Questions?
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16 }}>
          We're here to help.
        </p>
        <button onClick={() => navigate('/customer-service')}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle size={16} />
          Chat with XMARKET Support
        </button>
      </div>
    </div>
  );
}
