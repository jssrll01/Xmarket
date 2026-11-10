import React, { useEffect, useState } from 'react';
import HubSearch from './HubSearch';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Carousel, XF_CSS, peso, useMe, XfSkel, Desc } from './xfUi';

const Head = ({ title, sub, nav }) => (
  <header className="xf-head">
    <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
    <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
  </header>
);

export default function PriceDrops() {
  const nav = useNavigate();
  const { user, me, reload } = useMe();
  const [items, setItems] = useState(null);
  const [note, setNote] = useState('');
  const [q, setQ] = useState('');
  const hit = (s) => !q.trim() || String(s || '').toLowerCase().includes(q.trim().toLowerCase());
  const load = async () => {
    const { data } = await supabase.from('price_drops').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);
  const purchase = async (d) => {
    if (!user) { nav('/signin'); return; }
    const fresh = await reload();
    if (Number((fresh && fresh.xwallet_balance) || 0) < Number(d.price)) {
      setNote(d.id); return;
    }
    nav('/price-drops/' + d.id + '/buy');
  };
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <Head title="Digital Price Drops" sub="Limited items. 1 stock each. Pay with Xwallet." nav={nav} />
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(me && me.xwallet_balance)}</b></div>
      <HubSearch value={q} onChange={setQ} placeholder="Search price drops" />
      {items === null && <XfSkel kind="cards" />}
      {items && !items.length && <div className="xf-card xf-empty">No price drops right now. Check back soon.</div>}
      {items && items.length > 0 && !items.some((d) => hit(d.title)) && <div className="xf-card xf-empty">No matches.</div>}
      {(items || []).filter((d) => hit(d.title)).map((d) => {
        const out = d.stock < 1 || d.status !== 'active';
        return (
          <div className="xf-card" key={d.id}>
            <Carousel images={d.images} h={220} />
            <div className="xf-body">
              <h3>{d.title}</h3>
              <Desc text={d.description} />
              <div className="xf-price">{peso(d.price)}</div>
              {out && <div className="xf-meta">Sold out</div>}
              {note === d.id && <div className="xf-warn">Not enough Xwallet balance. You need {peso(d.price - Number((me && me.xwallet_balance) || 0))} more. <button style={{ fontWeight: 700, color: '#2563EB', textDecoration: 'underline' }} onClick={() => nav('/xwallet/topup')}>Top up</button></div>}
              <button className="xf-btn" disabled={out} onClick={() => purchase(d)}>{out ? 'Sold out' : 'Purchase'}</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const STEPS = ['Checking your details', 'Verifying password', 'Reserving the item', 'Deducting Xwallet balance'];

export function PriceDropBuy() {
  const nav = useNavigate();
  const { id } = useParams();
  const { user, me } = useMe();
  const [d, setD] = useState(undefined);
  const [f, setF] = useState({ first: '', last: '', email: '', phone: '', pw: '', pw2: '', sign: '' });
  const [init, setInit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(-1);
  const [err, setErr] = useState('');
  useEffect(() => {
    supabase.from('price_drops').select('*').eq('id', id).single().then(({ data }) => setD(data || null));
  }, [id]);
  useEffect(() => {
    if (me && !init) {
      setF((p) => ({ ...p, first: me.first_name || '', last: me.last_name || '', email: me.email || (user && user.email) || '', phone: me.phone || '' }));
      setInit(true);
    }
  }, [me, init, user]);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  if (d === undefined || !me) return <div className="xf"><style>{XF_CSS}</style><XfSkel kind="form" /></div>;
  if (!d || d.stock < 1 || d.status !== 'active') {
    return <div className="xf"><style>{XF_CSS}</style><Head title="Unavailable" nav={nav} /><div className="xf-card xf-empty">This item is no longer available.</div></div>;
  }
  const bal = Number(me.xwallet_balance || 0);
  const short = bal < Number(d.price);
  const pwBad = f.pw2 && f.pw !== f.pw2;
  const valid = f.first.trim() && f.last.trim() && f.email.trim() && f.phone.trim() && f.pw.length >= 6 && f.pw === f.pw2 && f.sign === 'AGREE' && !short;
  const verify = async () => {
    setErr(''); setBusy(true); setStep(0);
    const t = setInterval(() => setStep((s) => (s < 2 ? s + 1 : s)), 700);
    const { data, error } = await supabase.rpc('purchase_price_drop', {
      p_drop: d.id, p_first: f.first.trim(), p_last: f.last.trim(), p_email: f.email.trim(), p_phone: f.phone.trim(), p_password: f.pw, p_sign: f.sign,
    });
    clearInterval(t);
    if (error || !data || !data.ok) {
      setBusy(false); setStep(-1);
      setErr((error && error.message) || (data && data.message) || 'Verification failed.');
      return;
    }
    setStep(3);
    setTimeout(() => nav('/price-drops/order/' + data.order_id, { replace: true }), 900);
  };
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <Head title="Confirm purchase" sub={d.title + ' · ' + peso(d.price)} nav={nav} />
      <div className="xf-bal"><span>Xwallet balance</span><b>{peso(bal)}</b></div>
      {short && <div className="xf-warn">Your balance is not enough for this item.</div>}
      <div className="xf-card"><div className="xf-body">
        <label className="xf-lab" style={{ marginTop: 0 }}>First name</label>
        <input className="xf-in" value={f.first} onChange={set('first')} disabled={busy} />
        <label className="xf-lab">Last name</label>
        <input className="xf-in" value={f.last} onChange={set('last')} disabled={busy} />
        <label className="xf-lab">Email address</label>
        <input className="xf-in" type="email" value={f.email} onChange={set('email')} disabled={busy} />
        <label className="xf-lab">Phone number</label>
        <input className="xf-in" type="tel" value={f.phone} onChange={set('phone')} disabled={busy} />
        <label className="xf-lab">Password</label>
        <input className="xf-in" type="password" autoComplete="current-password" placeholder="Your account password" value={f.pw} onChange={set('pw')} disabled={busy} />
        <label className="xf-lab">Confirm password</label>
        <input className={'xf-in' + (pwBad ? ' bad' : '')} type="password" autoComplete="current-password" placeholder="Enter it again" value={f.pw2} onChange={set('pw2')} disabled={busy} />
        {pwBad && <div className="xf-warn">Passwords do not match.</div>}
        <label className="xf-lab">Sign the purchase</label>
        <input className="xf-in" placeholder='Type exactly "AGREE"' value={f.sign} onChange={set('sign')} disabled={busy} autoCapitalize="characters" />
        {err && <div className="xf-warn">{err}</div>}
        {busy && (
          <div className="xf-steps">
            {STEPS.map((s, k) => <div key={s} className={k < step ? 'done' : k === step ? 'on' : ''}><b>{k < step || step === 3 ? '✓' : ''}</b>{s}</div>)}
          </div>
        )}
        <button className="xf-btn" disabled={!valid || busy} onClick={verify}>{busy ? 'Verifying…' : 'Verify'}</button>
      </div></div>
    </div>
  );
}

export function PriceDropOrder() {
  const nav = useNavigate();
  const { oid } = useParams();
  const [o, setO] = useState(undefined);
  const load = () => supabase.from('price_drop_orders').select('*').eq('id', oid).single().then(({ data }) => setO(data || null));
  useEffect(() => { load(); // eslint-disable-next-line
  }, [oid]);
  if (o === undefined) return <div className="xf"><style>{XF_CSS}</style><XfSkel kind="status" /></div>;
  if (!o) return <div className="xf"><style>{XF_CSS}</style><Head title="Order" nav={nav} /><div className="xf-card xf-empty">Order not found.</div></div>;
  const done = o.status === 'completed';
  return (
    <div className="page-enter xf">
      <style>{XF_CSS}</style>
      <Head title="Purchase processing" sub={o.drop_title} nav={nav} />
      <div className="xf-card"><div className="xf-body xf-center">
        {o.status === 'cancelled' ? <h3>Order cancelled</h3> : done ? <h3>Order completed</h3> : <><div className="xf-spin" /><h3 style={{ marginTop: 16 }}>Your purchase is processing</h3></>}
        <p>{o.status === 'cancelled' ? 'Your Xwallet was refunded.' : done ? 'The developer has contacted you.' : 'Please wait. The developer will send you a message using the information you gave below.'}</p>
        <div style={{ marginTop: 10 }}><span className="xf-pill">{o.status}</span></div>
      </div></div>
      <div className="xf-card"><div className="xf-body">
        <div className="xf-row"><span>Amount paid</span><b>{peso(o.price)}</b></div>
        <div className="xf-row"><span>Name</span><b>{o.first_name} {o.last_name}</b></div>
        <div className="xf-row"><span>Email</span><b>{o.email}</b></div>
        <div className="xf-row"><span>Phone</span><b>{o.phone}</b></div>
        {o.admin_note && <div className="xf-row"><span>Message</span><b>{o.admin_note}</b></div>}
      </div></div>
      <button className="xf-btn ghost" onClick={() => nav('/price-drops')}>Back to Price Drops</button>
    </div>
  );
}
