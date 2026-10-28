import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Copy, Check, RefreshCw, ChevronDown, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

const PAGE = 10;
const TABS = [
  ['all', 'All', null],
  ['preparing', 'Preparing', ['pending', 'paid', 'processing']],
  ['shipped', 'Shipped', ['shipped']],
  ['delivered', 'Delivered', ['delivered', 'completed']],
  ['cancelled', 'Cancelled', ['cancelled']],
];
const LABEL = { pending: 'Pending', paid: 'Paid', processing: 'Preparing', shipped: 'Shipped', delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled' };
const TONE = { pending: ['#B45309', '#FEF3C7'], paid: ['#1D4ED8', '#DBEAFE'], processing: ['#1D4ED8', '#DBEAFE'], shipped: ['#6D28D9', '#EDE9FE'], delivered: ['#047857', '#D1FAE5'], completed: ['#047857', '#D1FAE5'], cancelled: ['#B91C1C', '#FEE2E2'] };
const RANK = { pending: 0, paid: 1, processing: 1, shipped: 2, delivered: 3, completed: 3 };
const norm = (s) => String(s || 'pending').toLowerCase();
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const when = (d) => (d ? new Date(d).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }) : '');
const orderTotal = (o) => Math.max(0, (Number(o.subtotal) || 0) - (Number(o.discount) || 0)) + (Number(o.shipping_fee) || 0);
const imgOf = (p) => {
  const c = [p.image_url, p.image, p.thumbnail, p.main_image, Array.isArray(p.images) ? p.images[0] : null, Array.isArray(p.image_urls) ? p.image_urls[0] : null];
  return c.find((x) => typeof x === 'string' && x) || null;
};
const muted = { fontSize: 12, color: 'var(--muted)' };

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    try {
      const a = document.createElement('textarea');
      a.value = t; a.style.position = 'fixed'; a.style.opacity = '0';
      document.body.appendChild(a); a.select();
      const ok = document.execCommand('copy'); document.body.removeChild(a); return ok;
    } catch (e2) { return false; }
  }
}

function CopyBtn({ text, label }) {
  const [done, setDone] = useState(false);
  const go = async (e) => {
    e.stopPropagation();
    if (await copyText(text)) { setDone(true); setTimeout(() => setDone(false), 1500); }
  };
  return (
    <button type="button" onClick={go} aria-label={'Copy ' + text}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid var(--border)', background: '#fff', borderRadius: 8, padding: '4px 9px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
      {done ? <Check size={13} /> : <Copy size={13} />}{done ? 'Copied' : label || 'Copy'}
    </button>
  );
}

function Badge({ status }) {
  const t = TONE[status] || ['#334155', '#E2E8F0'];
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: t[0], background: t[1] }}>{LABEL[status] || status}</span>;
}

function Shipment({ o, sh }) {
  const st = norm(o.status);
  const box = (bg, bd) => ({ background: bg, border: '1px solid ' + bd, borderRadius: 12, padding: 12, marginTop: 12 });
  if (st === 'cancelled') return <div style={box('#FEF2F2', '#FECACA')}><b>Order cancelled</b><div style={muted}>No shipment will be made for this order.</div></div>;
  if (sh && sh.tracking_number) return (
    <div style={box('#EFF6FF', '#BFDBFE')}>
      <div style={muted}>Tracking number</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, fontWeight: 800, wordBreak: 'break-all' }}>{sh.tracking_number}</span>
        <CopyBtn text={sh.tracking_number} />
      </div>
      <div style={{ ...muted, marginTop: 6 }}>
        {sh.carrier ? 'Carrier: ' + sh.carrier + ' · ' : ''}Status: {LABEL[st] || st}{sh.tracking_updated_at ? ' · Updated ' + when(sh.tracking_updated_at) : ''}
      </div>
      {sh.customer_note && <div style={{ marginTop: 8, fontSize: 13 }}>{sh.customer_note}</div>}
    </div>
  );
  if (st === 'delivered' || st === 'completed') return <div style={box('#ECFDF5', '#A7F3D0')}><b>Delivered</b></div>;
  if (st === 'shipped') return <div style={box('#F5F3FF', '#DDD6FE')}><b>Shipped</b><div style={muted}>Your tracking number will appear here once it is added.</div></div>;
  return (
    <div style={box('#FFFBEB', '#FDE68A')}>
      <b style={{ fontSize: 15 }}>Please wait for shipment</b>
      <div style={muted}>Your tracking number will appear here once your order has been prepared for shipment.</div>
    </div>
  );
}

function Timeline({ o }) {
  const st = norm(o.status), r = RANK[st] ?? 0;
  const steps = st === 'cancelled'
    ? [['Order placed', true, o.created_at], ['Cancelled', true, o.cancelled_at]]
    : [['Order placed', true, o.created_at], ['Preparing order', r >= 1], ['Shipped', r >= 2], ['Delivered', r >= 3]];
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Order progress</div>
      {steps.map(([l, d, t]) => (
        <div key={l} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0' }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: d ? 'var(--primary)' : '#E2E8F0', color: '#fff', fontSize: 11, display: 'grid', placeItems: 'center' }}>{d ? '✓' : ''}</span>
          <span style={{ fontWeight: d ? 700 : 500, color: d ? 'var(--text)' : 'var(--muted)', fontSize: 13 }}>{l}</span>
          {t && <span style={muted}>{when(t)}</span>}
        </div>
      ))}
      <div style={{ ...muted, marginTop: 6 }}>These steps follow XMARKET order status. They are not live courier scans.</div>
    </div>
  );
}

function Row({ k, v, bold }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13, fontWeight: bold ? 800 : 500 }}><span style={{ color: bold ? 'var(--text)' : 'var(--muted)' }}>{k}</span><span>{v}</span></div>;
}

function OrderCard({ o, items, sh, imgs }) {
  const [open, setOpen] = useState(false);
  const st = norm(o.status);
  return (
    <div className="card" style={{ padding: 14, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><b>{o.order_code}</b><CopyBtn text={o.order_code} /></div>
          <div style={muted}>{when(o.created_at)}</div>
        </div>
        <Badge status={st} />
      </div>
      {items.map((it) => (
        <div key={it.id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: 10, background: '#F1F5F9', overflow: 'hidden', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            {imgs[it.product_id] ? <img src={imgs[it.product_id]} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} color="#94A3B8" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{it.name}</div>
            <div style={muted}>{it.variant ? it.variant + ' · ' : ''}Qty {it.quantity} · {peso(it.price)} each</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{peso(Number(it.price) * Number(it.quantity))}</div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontWeight: 800 }}><span>Order total</span><span>{peso(orderTotal(o))}</span></div>
      <Shipment o={o} sh={sh} />
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: 0 }}>
        {open ? 'Hide details' : 'View details'}<ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open && (
        <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          <Row k="Subtotal" v={peso(o.subtotal)} />
          {Number(o.discount) > 0 && <Row k="Discount" v={'− ' + peso(o.discount)} />}
          <Row k="Shipping fee" v={peso(o.shipping_fee)} />
          <Row k="Total" v={peso(orderTotal(o))} bold />
          <Row k="Payment method" v={String(o.payment_method || '—').toUpperCase()} />
          <Row k="Delivery" v={o.delivery_method || '—'} />
          {sh && sh.tracking_number && sh.tracking_added_at && <Row k="Tracking added" v={when(sh.tracking_added_at)} />}
          <Timeline o={o} />
        </div>
      )}
    </div>
  );
}

export default function TrackingOrders() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState({});
  const [ships, setShips] = useState({});
  const [imgs, setImgs] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');
  const [tabKey, setTabKey] = useState('all');
  const [qInput, setQInput] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const shown = useRef(0);

  useEffect(() => { document.title = 'Tracking Orders · XMARKET'; window.scrollTo(0, 0); }, []);
  useEffect(() => { if (!authLoading && !user) nav('/signin', { replace: true }); }, [user, authLoading, nav]);
  useEffect(() => { const t = setTimeout(() => { setSearch(qInput.trim()); setLimit(PAGE); }, 300); return () => clearTimeout(t); }, [qInput]);

  const fetchAll = useCallback(async (silent) => {
    if (!user) return;
    if (!silent && shown.current === 0) setLoading(true);
    try {
      let q = supabase.from('orders')
        .select('id, order_code, status, created_at, cancelled_at, subtotal, discount, shipping_fee, total, payment_method, delivery_method', { count: 'exact' })
        .eq('buyer_id', user.id).order('created_at', { ascending: false }).range(0, limit - 1);
      const tab = TABS.find((t) => t[0] === tabKey);
      if (tab && tab[2]) q = q.in('status', tab[2]);
      const s = search.replace(/[%,()_]/g, '');
      if (s) q = q.ilike('order_code', '%' + s + '%');
      const { data, error, count: n } = await q;
      if (error) throw error;
      const rows = data || [];
      const ids = rows.map((r) => r.id);
      let it = [], sh = [];
      if (ids.length) {
        const [a, b] = await Promise.all([
          supabase.from('order_items').select('id, order_id, product_id, name, price, quantity, variant').in('order_id', ids),
          supabase.from('order_shipments').select('order_id, carrier, tracking_number, customer_note, tracking_added_at, tracking_updated_at').in('order_id', ids),
        ]);
        if (a.error) throw a.error;
        if (b.error) throw b.error;
        it = a.data || []; sh = b.data || [];
      }
      const im = {}; it.forEach((x) => { (im[x.order_id] = im[x.order_id] || []).push(x); });
      const sm = {}; sh.forEach((x) => { sm[x.order_id] = x; });
      setOrders(rows); setCount(n || 0); setItems(im); setShips(sm); setErr('');
      shown.current = rows.length;
      try {
        const pids = [...new Set(it.map((x) => x.product_id).filter(Boolean))];
        if (pids.length) {
          const { data: pr } = await supabase.from('products').select('*').in('id', pids);
          const m = {}; (pr || []).forEach((p) => { const u = imgOf(p); if (u) m[p.id] = u; });
          setImgs(m);
        }
      } catch (e) { /* photos are optional */ }
    } catch (e) {
      setErr('We could not load your orders. Check your connection and try again.');
    } finally { setLoading(false); setRefreshing(false); }
  }, [user, limit, tabKey, search]);

  useEffect(() => { fetchAll(false); }, [fetchAll]);
  useEffect(() => {
    const tick = () => { if (!document.hidden) fetchAll(true); };
    const t = setInterval(tick, 45000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', tick); };
  }, [fetchAll]);

  if (authLoading || !user) return null;
  const goBack = () => { const i = window.history.state && window.history.state.idx; if (typeof i === 'number' && i > 0) nav(-1); else nav('/orders', { replace: true }); };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={goBack} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <button onClick={() => { setRefreshing(true); fetchAll(true); }} className="icon-btn" aria-label="Refresh orders"><RefreshCw size={18} className={refreshing ? 'spin' : ''} /></button>
      </div>
      <h2 style={{ marginBottom: 4 }}>Tracking Orders</h2>
      <p style={{ ...muted, marginBottom: 14 }}>Follow your orders and see tracking numbers once they are added.</p>

      <div style={{ position: 'relative', marginBottom: 10 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 13, color: '#94A3B8' }} />
        <input value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Search by order ID" aria-label="Search by order ID"
          style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px 11px 36px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 14 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => { setTabKey(k); setLimit(PAGE); }} aria-pressed={tabKey === k}
            style={{ whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: '1px solid ' + (tabKey === k ? 'var(--primary)' : 'var(--border)'), background: tabKey === k ? 'var(--primary)' : '#fff', color: tabKey === k ? '#fff' : 'var(--text)' }}>{l}</button>
        ))}
      </div>
      {!loading && !err && <div style={{ ...muted, margin: '6px 0 12px' }}>{count} {count === 1 ? 'order' : 'orders'}</div>}

      {loading ? [1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div className="sk sk-line" style={{ width: '40%', marginBottom: 10 }} /><div className="sk sk-line" style={{ width: '70%', marginBottom: 10 }} /><div className="sk sk-line" style={{ width: '50%' }} />
        </div>
      )) : err ? (
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <p style={{ marginBottom: 12 }}>{err}</p>
          <button onClick={() => fetchAll(false)} style={{ padding: '10px 18px', borderRadius: 999, border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon={Package} title={search || tabKey !== 'all' ? 'No matching orders' : 'No orders yet'}
          message={search || tabKey !== 'all' ? 'Try a different order ID or filter.' : 'When you place an order, it will show up here.'}
          action="Start shopping" onAction={() => nav('/')} />
      ) : (
        <>
          {orders.map((o) => <OrderCard key={o.id} o={o} items={items[o.id] || []} sh={ships[o.id]} imgs={imgs} />)}
          {orders.length < count && <button onClick={() => setLimit((l) => l + PAGE)} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Load more</button>}
        </>
      )}
      <p style={{ ...muted, textAlign: 'center', marginTop: 20 }}>Need help with an order? <a href="/customer-service" onClick={(e) => { e.preventDefault(); nav('/customer-service'); }} style={{ color: 'var(--primary)', fontWeight: 700 }}>Contact support</a></p>
    </div>
  );
}
