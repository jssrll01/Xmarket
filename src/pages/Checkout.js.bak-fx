import { money } from '../lib/currency';
import { useVip } from '../lib/vip';
import { useCfg, loadPayments, loadDeliveries } from '../lib/cfg';
import { useBlocked, payBlocked } from '../lib/killSwitch';
import { rpcPin } from '../lib/pinBus';
import { getShippingFeeSync, fetchShippingTiers } from '../lib/shipping';
import OrderTotals from '../components/OrderTotals';
import { itemDiscount, loadDiscountRules } from '../lib/discount';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X, CheckCircle2, Upload, Zap, MapPin, ChevronRight } from 'lucide-react';
import AddressBook from '../components/AddressBook';
import { fetchAddresses, addressLine } from '../lib/addresses';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { validatePromo, computeDiscount, redeemPromo } from '../lib/promos';
import { redeemXcard } from '../lib/xcards';
import { supabase } from '../lib/supabase';
import StockModal from '../components/StockModal';
import { isOutOfStock } from '../lib/stock';
import { fetchWallet } from '../lib/xwallet';

const CLD_CLOUD = 'bvw3okdf';
const CLD_PRESET = 'xmarket_receipts';

const PAYMENTS_FALLBACK = [
  { id: 'gcash', label: 'GCash',
    note: 'Send payment to GCash number 09454408496 (JE*****L C.). Upload your receipt screenshot after payment. Scan the QR below.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593677/GCash-MyQR-28092026184016.PNG.jpg' },
  { id: 'maya', label: 'Maya',
    note: 'Send payment to Maya number 09454408496 (JE*****L C.). Upload your receipt screenshot after payment. Scan the QR below.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790593882/myqr_1790592093301.jpg' },
  { id: 'gotyme', label: 'Bank transfer',
    note: 'Transfer to: Gotyme Bank | Account Name: Jessrell Custodio | Account No: 0152 4915 7462. Send us a screenshot of the transfer confirmation.',
    qr: 'https://res.cloudinary.com/bvw3okdf/image/upload/v1790592841/Screenshot_20260928_183617_GoTyme_PH.jpg' },
  { id: 'xwallet', label: 'Xwallet Balance',
    note: 'Pay instantly with your Xwallet balance. Order will process immediately.' },
];

const DELIVERIES_FALLBACK = [
  { id: 'doortodoor', label: 'Door to door',
    note: 'Delivered straight to your door. The shipping fee is shown in your order summary.' },
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
  const PAYMENTS = useCfg(() => loadPayments('checkout'), PAYMENTS_FALLBACK);
  const { blocked: blockedPay } = useBlocked('payment');
  const OPEN_PAYMENTS = PAYMENTS.filter((p) => !payBlocked(blockedPay, p));
  const DELIVERIES_ALL = useCfg(loadDeliveries, DELIVERIES_FALLBACK);
  const { blocked: blockedDel } = useBlocked('delivery');
  const DELIVERIES = DELIVERIES_ALL.filter((d) => !blockedDel.has(d.id));
  const { items, dispatch } = useCart();
  const { user, loading: authLoading, profile } = useAuth();
  const { show: showToast } = useToast();
  const navigate = useNavigate();

  const allInstant = items.length > 0 && items.every(i => i.instant);

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', address: '', landmark: '', province: '',
    city: '', barangay: '', postalCode: '', instructions: '', note: '',
    payment: 'gcash',
    delivery: 'doortodoor'
  });
  const [missing, setMissing] = useState([]);
  const [sending, setSending] = useState(false);
  const [xwalletBalance, setXwalletBalance] = useState(0);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placed, setPlaced] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [gift, setGift] = useState({ on: false, email: '', message: '' });
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [xcardInput, setXcardInput] = useState('');
  const [xcardValue, setXcardValue] = useState(0);
  const [xcardId, setXcardId] = useState(null);
  const [xcardError, setXcardError] = useState('');
  const [promoError, setPromoError] = useState('');
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  const [discountTiers, setDiscountTiers] = useState([]);
  useEffect(() => {
    let alive = true;
    loadDiscountRules().then(t => { if (alive) setDiscountTiers(t); }).catch(err => console.error('Unable to load discount rules:', err));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchWallet(user.id).then(setXwalletBalance);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/signin', { replace: true });
  }, [user, authLoading, navigate]);

  // COD only valid for pickup/meetup — reset to gcash if user switches away
  // Delivery logic:
  //  - If every item is instant → force 'instant' delivery, force non-COD payment
  //  - If NOT all instant but delivery is currently 'instant' → reset to 'meetup'
  useEffect(() => {
    if (allInstant) {
      if (form.delivery !== 'instant') {
        setForm(f => ({ ...f, delivery: 'instant', payment: f.payment }));
      }
    } else if (form.delivery === 'instant') {
      setForm(f => ({ ...f, delivery: 'doortodoor' }));
    }
  }, [allInstant, form.delivery]);


  useEffect(() => {
    if (allInstant) setForm(f => ({ ...f, delivery: 'instant' }));
  }, [allInstant]);

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const [shipTiers, setShipTiers] = useState(null);
  const { isVip } = useVip();
  useEffect(() => { fetchShippingTiers().then(setShipTiers); }, []);
  const productDiscount = items.reduce((t, i) => t + itemDiscount(i.price, i.quantity, discountTiers), 0);
  const promoDiscount = computeDiscount(promo, subtotal - productDiscount);
  const xcardDiscount = Math.min(xcardValue, Math.max(0, subtotal - productDiscount - promoDiscount));
  const discount = productDiscount + promoDiscount + xcardDiscount;
  const shipping = form.delivery === 'doortodoor' ? (isVip ? 0 : getShippingFeeSync(subtotal, shipTiers || undefined)) : (form.delivery === 'instant' ? 0 : null);
  const total = Math.max(0, subtotal - discount) + (shipping || 0);

  const [addrId, setAddrId] = useState(null);
  const [addrView, setAddrView] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const applyAddress = (a) => {
    setAddrId(a.id); setAddrView(a);
    setForm(f => ({ ...f, fullName: a.full_name, mobile: a.phone, address: a.address, landmark: a.landmark || '',
      province: a.province, city: a.city, barangay: a.barangay, postalCode: a.postal_code || '' }));
    try { localStorage.setItem('xm_ship_addr', a.id); } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    if (!user) return;
    fetchAddresses(user.id).then(list => {
      if (!list.length) return;
      let saved = null;
      try { saved = localStorage.getItem('xm_ship_addr'); } catch (e) { /* ignore */ }
      applyAddress(list.find(x => x.id === saved) || list.find(x => x.is_default) || list[0]);
    });
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user?.email) setForm(f => (f.email ? f : { ...f, email: user.email }));
  }, [user]);

  const goBack = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };

  const upd = (k, v) => setForm({ ...form, [k]: v });

  useEffect(() => {
    if (OPEN_PAYMENTS.length && !OPEN_PAYMENTS.some((p) => p.id === form.payment)) {
      setForm((f) => ({ ...f, payment: OPEN_PAYMENTS[0].id }));
    }
    // eslint-disable-next-line
  }, [OPEN_PAYMENTS.map((p) => p.id).join(','), form.payment]);
  const selectedPayment = OPEN_PAYMENTS.find(p => p.id === form.payment);
  useEffect(() => {
    if (allInstant || !DELIVERIES.length || DELIVERIES.some((d) => d.id === form.delivery)) return;
    const next = DELIVERIES.find((d) => d.id !== 'instant') || DELIVERIES[0];
    setForm((f) => ({ ...f, delivery: next.id }));
  }, [DELIVERIES, form.delivery, allInstant]);
  const selectedDelivery = DELIVERIES.find(d => d.id === form.delivery);

  const availableDeliveries = DELIVERIES.filter(d => {
    if (d.id === 'instant') return allInstant;
    return true;
  });

  const LABELS = {
    fullName: 'Full Name', mobile: 'Mobile Number', email: 'Email Address', address: 'Delivery Address',
    landmark: 'Nearest Landmark', province: 'Province', city: 'City / Municipality',
    barangay: 'Barangay', postalCode: 'Postal Code'
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
      setReceiptSent(true);
    } catch (err) { console.log('Receipt send failed:', err); }
    setSendingReceipt(false);
  };

  const applyPromo = async () => {
    if (promo) {
      setPromoError('A coupon is already applied. Remove it first.');
      return;
    }
    setPromoError('');
    const { promo: p, error } = await validatePromo(promoInput, subtotal, user?.id);
    if (error) { setPromoError(error); setPromo(null); return; }
    setPromo(p);
    showToast('Promo applied');
  };

  const removePromo = () => {
    setPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const applyXcard = async () => {
    setXcardError('');
    const code = xcardInput.trim().toUpperCase();
    if (!code) { setXcardError('Enter a code'); return; }
    const { card, error } = await redeemXcard(code, user?.id);
    if (error) { setXcardError(error); setXcardValue(0); setXcardId(null); return; }
    setXcardValue(Number(card.value) || 0);
    setXcardId(card.id);
    showToast(`Xcard ${money(card.value, 'raw')} applied`);
  };

    const placeOrder = async () => {
      // STOCK GUARD — verify every cart item is still in stock
      try {
        const ids = items.map(i => i.product_id).filter(Boolean);
        if (ids.length > 0) {
          const { data: prods } = await supabase
            .from('products')
            .select('id, stock, name')
            .in('id', ids);
          const outNames = (prods || [])
            .filter(p => isOutOfStock(p))
            .map(p => p.name || 'a product');
          if (outNames.length > 0) {
            setOrderError(`Cannot checkout — out of stock: ${outNames.join(', ')}. Remove them from your cart and try again.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      } catch (e) {
        console.warn('checkout stock guard failed:', e);
      }

    if (sending) return;
    if (form.payment === 'xwallet' && xwalletBalance < total) {
      showToast('Insufficient Xwallet balance');
      return;
    }
    setSending(true);
    try {
      // Base required fields
      const requiredFields = ['fullName', 'mobile', 'email'];
      if (gift.on) requiredFields.push('address', 'province', 'city', 'barangay', 'postalCode');
      if (gift.on && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((gift.email || '').trim())) {
        showToast("Enter your friend's XMARKET email for the gift");
        return;
      }
      if (form.delivery === 'express' || form.delivery === 'doortodoor') {
        requiredFields.push('address', 'province', 'city', 'barangay', 'postalCode');
      }
      const missingFields = requiredFields.filter(k => !form[k] || !form[k].trim());

      // Receipt required for GCash/Maya/GoTyme
      const needsReceipt = ['gcash', 'maya', 'gotyme'].includes(form.payment);
      if (needsReceipt && !receipt) {
        showToast('Please upload your payment receipt');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (missingFields.length > 0) {
        setMissing(missingFields);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setMissing([]);

      const paymentLabel = OPEN_PAYMENTS.find(p => p.id === form.payment)?.label;
      const deliveryLabel = DELIVERIES.find(d => d.id === form.delivery)?.label;
      const newOrderId = 'XM-' + Date.now().toString().slice(-8);

      // 2) Write the order securely via RPC
      try {
        const payloadItems = items.map(i => ({
          product_id: i.product_id,
          quantity: Number(i.quantity) || 1,
          variant: i.variant || ''
        }));

        const { data: res, error: oErr } = await rpcPin('create_order', {
          p_order_code: newOrderId,
          p_items: payloadItems,
          p_shipping: form,
          p_payment: form.payment === 'xwallet' ? 'xwallet' : paymentLabel,
          p_delivery: deliveryLabel,
          p_promo_code: null,
          p_xcard_code: xcardInput || null,
          p_gift: gift.on ? gift : null
        });

        if (oErr) throw oErr;
        if (!res || !res.ok) throw new Error(res?.error || 'Failed to place order');
        setPlaced({ subtotal: Number(res.subtotal) || 0, discount: Number(res.discount) || 0, shipping: Number(res.shipping) || 0 });

// Upload receipt straight to Cloudinary (unsigned) and save the link on the order
        if (receipt?.dataUrl) {
          try {
            const fd = new FormData();
            fd.append('file', receipt.dataUrl);
            fd.append('upload_preset', CLD_PRESET);
            fd.append('folder', 'Xmarket/OrderReceipts');
            const up = await fetch('https://api.cloudinary.com/v1_1/' + CLD_CLOUD + '/image/upload', { method: 'POST', body: fd });
            const upj = await up.json().catch(() => ({}));
            if (!up.ok || !upj.secure_url) throw new Error(upj?.error?.message || 'Receipt upload failed');
            const { data: rr, error: rErr } = await supabase.rpc('set_order_receipt', { p_order_code: newOrderId, p_url: upj.secure_url });
            if (rErr || !rr?.ok) throw new Error(rErr?.message || rr?.error || 'Could not save receipt');
          } catch (receiptError) {
            console.error('[receipt] Upload failed:', receiptError);
            showToast('Order saved, but receipt upload failed. Contact support before paying again.');
          }
        }

        // Clear the cart
        await dispatch({ type: 'CLEAR' });

      } catch (err) {
        console.log('Supabase order failed:', err);
        showToast('Order could not be saved. Please try again or contact support.');
        throw err;
      }

      setSending(false);
      setOrderId(newOrderId);
      setSuccess(true);
    } catch (err) {
      console.error('[placeOrder] error:', err);
      showToast(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
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
          {placed && (<>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-dim)' }}>Subtotal</span>
              <span style={{ fontWeight: 700 }}>{money(placed.subtotal, 'tofixed')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
              <span style={{ color: 'var(--text-dim)' }}>Discount</span>
              <span style={{ fontWeight: 700 }}>-{money(placed.discount, 'tofixed')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
              <span style={{ color: 'var(--text-dim)' }}>Shipping</span>
              <span style={{ fontWeight: 700 }}>{placed.shipping === 0 ? 'FREE' : money(placed.shipping, 'tofixed')}</span>
            </div>
          </>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>Total</span>
            <span style={{ fontWeight: 800 }}>{money(placed ? (Math.max(0, placed.subtotal - placed.discount) + placed.shipping) : Number(total), 'tofixed')}</span>
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
        <button className="btn-primary" onClick={() => navigate("/")}
          style={{ padding: "14px 32px", fontSize: 15, fontWeight: 700, width: "100%", maxWidth: 320, marginBottom: 12 }}>
          Continue Shopping
        </button>
        </div>

      </div>
    );
  }

  return (
    <>
      {orderError && (
        <div style={{
          padding: 12, margin: '12px 16px',
          background: '#FEE2E2', color: '#991B1B',
          border: '1px solid #FCA5A5', borderRadius: 12,
          fontSize: 13.5, fontWeight: 600, lineHeight: 1.5,
        }}>
          {orderError}
        </div>
      )}
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
        <span />
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

      <div className="card" onClick={() => setPickerOpen(true)}
        style={{ padding: 14, marginBottom: 12, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
          border: missing.some(k => ['address', 'province', 'city', 'barangay', 'fullName', 'mobile'].includes(k)) ? '1px solid #DC2626' : undefined }}>
        <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {addrView ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{addrView.full_name} <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: 13 }}>{addrView.phone}</span></div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>{addrView.address}<br />{addressLine(addrView)}</div>
              {addrView.is_default && <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10.5, padding: '1px 7px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 3 }}>Default</span>}
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>Add delivery address</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{allInstant ? 'Required for contact details' : 'Tap to add where we should deliver'}</div>
            </>
          )}
        </div>
        <ChevronRight size={18} color="var(--muted)" />
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Order Details</h3>
        {input('email', 'Email Address', 'email')}
        <div>
          <label>Note (optional)</label>
          <textarea value={form.note} onChange={e => upd('note', e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 4 }} rows="2" />
        </div>
      </div>

      {pickerOpen && (
        <AddressBook mode="select" selectedId={addrId}
          onClose={() => setPickerOpen(false)}
          onSelect={(a) => { applyAddress(a); setPickerOpen(false); }} />
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Mode of Payment</h3>
        {OPEN_PAYMENTS.map(p => {
          const isCodDisabled = false;
          return (
            <label key={p.id} style={{
              display: 'block', marginBottom: 6, fontSize: 14,
              color: isCodDisabled ? 'var(--text-dim)' : 'var(--text)',
              opacity: isCodDisabled ? 0.4 : 1,
              cursor: isCodDisabled ? 'not-allowed' : 'pointer',
            }}>
              <input type="radio"
                checked={form.payment === p.id}
                disabled={isCodDisabled}
                onChange={() => { if (!isCodDisabled) upd('payment', p.id); }}
                style={{ marginRight: 8 }} />
              {p.id === 'xwallet'
                ? `Xwallet Balance (${money(xwalletBalance, 'tofixed')})`
                : p.label}
            </label>
          );

        })}
        {OPEN_PAYMENTS.length === 0 && <InfoNote text="No payment method is available right now. Please try again later." />}
        {selectedPayment && <InfoNote text={selectedPayment.note} />}
        {selectedPayment?.qr && (
          <div style={{ marginTop: 10, padding: 16, textAlign: 'center', background: 'var(--card)', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 700, marginBottom: 8 }}>SCAN TO PAY</div>
            <img decoding="async" src={selectedPayment.qr} alt="QR code"
              style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }} />
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Delivery Method</h3>
        {availableDeliveries.map(d => {
          const isDisabled = allInstant && d.id !== 'instant';
          return (
            <label key={d.id} style={{
              display: 'block', marginBottom: 6, fontSize: 14,
              color: isDisabled ? 'var(--text-dim)' : 'var(--text)',
              opacity: isDisabled ? 0.4 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}>
              <input type="radio"
                checked={form.delivery === d.id}
                disabled={isDisabled}
                onChange={() => { if (!isDisabled) upd('delivery', d.id); }}
                style={{ marginRight: 8 }} />
              {d.label}
            </label>
          );
        })}
        {selectedDelivery && <InfoNote text={selectedDelivery.note} />}
      </div>

      {['gcash', 'maya', 'gotyme'].includes(form.payment) && (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h3 style={{ marginBottom: 8 }}>Payment Receipt</h3>
          <style>{`
.gf{margin:12px 0;border-radius:16px;border:1px solid #BFDBFE;background:linear-gradient(135deg,#fff,#EFF6FF);overflow:hidden}
.gf-top{display:flex;align-items:center;gap:12px;padding:14px;cursor:pointer}
.gf-ic{width:40px;height:40px;border-radius:12px;background:#DBEAFE;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none}
.gf-t{flex:1}.gf-t b{display:block;font-size:14.5px;color:#0F172A}.gf-t span{font-size:12px;color:#64748B}
.gf-sw{width:46px;height:26px;border-radius:99px;background:#CBD5E1;position:relative;transition:background .25s;flex:none}
.gf-sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.25);transition:transform .25s}
.gf-sw.on{background:#2563EB}.gf-sw.on::after{transform:translateX(20px)}
.gf-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s ease}
.gf-body.open{grid-template-rows:1fr}
.gf-in{overflow:hidden;min-height:0}
.gf-pad{padding:0 14px 14px}
.gf-lab{display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#64748B;margin:10px 0 5px}
.gf-inp{width:100%;padding:11px 12px;border-radius:12px;border:1px solid #CBD5E1;font-size:14px;background:#fff}
.gf-note{margin-top:12px;padding:10px 12px;border-radius:12px;border:1px solid #BFDBFE;background:#EFF6FF;color:#1D4ED8;font-size:13px;font-weight:700;line-height:1.45}
@media(prefers-reduced-motion:reduce){.gf-body,.gf-sw,.gf-sw::after{transition:none}}
`}</style>
          <div className="gf">
            <div className="gf-top" onClick={() => setGift({ ...gift, on: !gift.on })} role="switch" aria-checked={gift.on}>
              <div className="gf-ic">🎁</div>
              <div className="gf-t"><b>Send as a gift</b><span>This order is a gift for someone else</span></div>
              <div className={'gf-sw' + (gift.on ? ' on' : '')} />
            </div>
            <div className={'gf-body' + (gift.on ? ' open' : '')}><div className="gf-in"><div className="gf-pad">
              <div style={{ fontSize: 12.5, color: '#64748B' }}>Enter your friend's name, mobile and address above. We deliver to them.</div>
              <div className="gf-lab"><span>Friend's XMARKET email *</span></div>
              <input className="gf-inp" type="email" value={gift.email} onChange={(e) => setGift({ ...gift, email: e.target.value })} placeholder="friend@example.com" autoCapitalize="off" />
              <div className="gf-lab"><span>Gift message (optional)</span><span>{(gift.message || '').length}/120</span></div>
              <input className="gf-inp" value={gift.message} maxLength={120} onChange={(e) => setGift({ ...gift, message: e.target.value })} placeholder="Write a short message" />
              <div className="gf-note">Make sure the selected delivery address is your friend's address, not yours.</div>
            </div></div></div>
          </div>
          <label className="btn-outline" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: 12, cursor: 'pointer', width: '100%', borderRadius: 10
          }}>
            <Upload size={16} />
            {receipt ? receipt.name : 'Upload Payment Receipt'}
            <input type="file" accept="image/*" onChange={handleReceipt} style={{ display: 'none' }} />
          </label>
          {receipt && (
            <button onClick={() => setReceipt(null)}
              style={{
                marginTop: 8, width: '100%', padding: 10, borderRadius: 10,
                background: 'none', border: '1px solid var(--border)',
                color: '#DC2626', fontSize: 12.5, fontWeight: 600, cursor: 'pointer'
              }}>
              Remove Receipt
            </button>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>

        {/* XCARD REDEEM */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, marginTop: 12 }}>
          <input
            type="text"
            placeholder="Xcard code"
            value={xcardInput}
            onChange={e => setXcardInput(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'monospace', letterSpacing: 1 }}
          />
          <button onClick={applyXcard} className="btn-primary"
            style={{ padding: '0 16px', fontSize: 13, borderRadius: 10 }}>
            Apply Gift Card
          </button>
        </div>
        {xcardError && <div style={{ color: '#DC2626', fontSize: 12, marginBottom: 12 }}>{xcardError}</div>}
        {xcardValue > 0 && (
          <div style={{
            marginBottom: 12, padding: '8px 12px',
            background: '#ECFDF5', border: '1px solid #10B981',
            borderRadius: 8, fontSize: 12.5, color: '#065F46', fontWeight: 600,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>✓ Xcard applied: {money(xcardValue, 'raw')} off</span>
            <button onClick={() => { setXcardValue(0); setXcardInput(''); setXcardId(null); }}
              style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
              Remove
            </button>
          </div>
        )}

        <h3 style={{ marginBottom: 8 }}>Order Summary</h3>
        <OrderTotals showItems items={items} subtotal={subtotal} productDiscount={productDiscount} discountTiers={discountTiers} promoDiscount={promoDiscount} xcardDiscount={xcardDiscount} shipping={shipping} total={total} />
      </div>

      <button onClick={placeOrder} disabled={sending} className="btn-primary"
        style={{
          width: '100%', padding: 14, marginTop: 12, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
        {sending ? (<><span className="spinner" /> Placing Order...</>) : 'Place Order'}
      </button>
    </div>
      <StockModal
        open={!!orderError}
        message={orderError}
        onClose={() => setOrderError('')}
      />
    </>
  );
}
