import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { rpcPin, showReceipt } from '../lib/pinBus';
import { STATUS_INFO, STEPS, calcTotal, myBoostOrders, num, peso } from '../lib/booster';
import { PlatformIcon, QtyField, StatusBadge } from '../components/BoosterBits';
import { CardListSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import '../booster.css';

const when = (d) => new Date(d).toLocaleString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' });

function Steps({ status }) {
  if (status === 'cancelled') return null;
  const at = STEPS.indexOf(status);
  return (
    <div className="bst-steps" aria-label={'Status: ' + status}>
      {STEPS.map((s, i) => (
        <div key={s} className={'bst-step' + (i <= at ? ' on' : '') + (i === at ? ' now' : '')}>
          <i /><span>{STATUS_INFO[s].label}</span>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ o, onEdit }) {
  const canEdit = o.status === 'pending' && Number(o.edit_count) < 5;
  return (
    <div className="bst-card">
      <div className="bst-card-top">
        <PlatformIcon platform={o.platform} size={36} />
        <div className="bst-card-tx"><b>{o.service_name}</b><small>{o.order_no} · {when(o.created_at)}</small></div>
        <StatusBadge status={o.status} />
      </div>
      <Steps status={o.status} />
      <div className="bst-kv"><span>Target</span><b className="bst-trunc">{o.target}</b></div>
      <div className="bst-kv"><span>Quantity</span><b>{num(o.quantity)}</b></div>
      <div className="bst-kv"><span>Total paid</span><b>{peso(o.total_price)}</b></div>
      {o.user_note && <div className="bst-note">Your note: {o.user_note}</div>}
      {o.admin_note && <div className="bst-note admin">From our team: {o.admin_note}</div>}
      {o.status === 'cancelled' && <div className="bst-note admin">{peso(o.total_price)} was refunded to your Xwallet.</div>}
      {canEdit && <button type="button" className="bst-edit" onClick={() => onEdit(o)}>Change quantity or note</button>}
    </div>
  );
}

function EditSheet({ order, onClose, onSaved }) {
  const { show } = useToast();
  const min = order.min_qty;
  const max = order.max_qty;
  const step = max - min >= 1000 ? 100 : 10;
  const [qty, setQty] = useState(String(order.quantity));
  const [note, setNote] = useState(order.user_note || '');
  const [busy, setBusy] = useState(false);

  const nq = Math.floor(Number(qty)) || 0;
  const qtyChanged = nq !== order.quantity;
  const noteChanged = note.trim() !== (order.user_note || '');
  const qtyOk = !qtyChanged || (nq >= min && nq <= max && (order.service_active !== false || nq < order.quantity));
  const newTotal = qtyChanged && qtyOk ? calcTotal(order.unit_price, nq, order.per_qty) : Number(order.total_price);
  const delta = Math.round((newTotal - Number(order.total_price)) * 100) / 100;

  const save = async () => {
    if (busy) return;
    if (!qtyChanged && !noteChanged) { show('Nothing to change.'); return; }
    if (!qtyOk) { show(order.service_active === false ? 'This service is paused, so you can only lower the quantity.' : `Quantity must be between ${num(min)} and ${num(max)}.`); return; }
    setBusy(true);
    const { data, error } = await rpcPin('booster_update_order', {
      p_order: order.id, p_qty: qtyChanged ? nq : null, p_note: noteChanged ? note.trim() : null
    });
    setBusy(false);
    if (error) { show(error.message); return; }
    if (!data || !data.ok) { if (!data || data.error !== 'Cancelled') show((data && data.error) || 'Could not update the order.'); return; }
    onSaved(data);
  };

  return (
    <div className="bst-ov" onClick={() => { if (!busy) onClose(); }}>
      <div className="bst-sheet" role="dialog" aria-modal="true" aria-label="Change order" onClick={(e) => e.stopPropagation()}>
        <div className="bst-sh-head">
          <PlatformIcon platform={order.platform} />
          <div className="bst-sh-tx"><b>{order.service_name}</b><small>{order.order_no} · pending</small></div>
        </div>
        <label className="bst-lbl">Quantity ({num(min)} to {num(max)})</label>
        <QtyField value={qty} onChange={setQty} min={min} max={max} step={step} />
        {qty !== '' && !qtyOk && <div className="bst-err">That quantity is not allowed for this order.</div>}
        <label className="bst-lbl"><span>Note (optional)</span><span>{note.length}/300</span></label>
        <textarea className="bst-in" rows={2} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="bst-total"><span>New total</span><b>{peso(newTotal)}</b></div>
        <div className={'bst-bal' + (delta > 0 ? ' bad' : '')}>
          {delta > 0 ? `${peso(delta)} more will be taken from your Xwallet.` : delta < 0 ? `${peso(-delta)} will be refunded to your Xwallet.` : 'No change in price.'}
        </div>
        <button type="button" className="btn-primary bst-pay" disabled={busy || (!qtyChanged && !noteChanged)} onClick={save}>{busy ? 'Saving…' : 'Save changes'}</button>
        <button type="button" className="bst-edit" disabled={busy} onClick={onClose}>Cancel</button>
        <div className="bst-fine">You can change a pending order up to 5 times. Once our team starts it, it can no longer be changed.</div>
      </div>
    </div>
  );
}

export default function MyBoostOrders() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { show } = useToast();
  const uid = user ? user.id : null;
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [edit, setEdit] = useState(null);

  const load = useCallback(async (first) => {
    try {
      setRows(await myBoostOrders());
      setErr('');
    } catch (e) {
      if (first) setErr(e.message);
    }
  }, []);

  useEffect(() => {
    if (!uid) return undefined;
    load(true);
    const t = setInterval(() => { if (document.visibilityState === 'visible') load(false); }, 12000);
    return () => clearInterval(t);
  }, [uid, load]);

  const saved = (data) => {
    setEdit(null);
    load(false);
    const d = Number(data.delta || 0);
    if (data.unchanged) show('Nothing changed.');
    else if (d > 0 && data.receipt) showReceipt(data.receipt);
    else if (d < 0) show(`Order updated. ${peso(-d)} was refunded to your Xwallet.`);
    else show('Order updated.');
  };

  return (
    <div className="page-enter bst">
      <div className="bst-head">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h2>My Boost Orders</h2>
      </div>
      {authLoading && <CardListSkeleton count={2} />}
      {!authLoading && !user && (
        <div className="bst-empty">Sign in to see your orders.<br /><button type="button" className="btn-primary" style={{ marginTop: 12, padding: '10px 24px' }} onClick={() => nav('/signin')}>Sign in</button></div>
      )}
      {user && err && <div className="bst-empty">{err}</div>}
      {user && !err && rows === null && <CardListSkeleton count={3} />}
      {user && rows && rows.length === 0 && (
        <div className="bst-empty">No boost orders yet.<br /><button type="button" className="btn-primary" style={{ marginTop: 12, padding: '10px 24px' }} onClick={() => nav('/social-booster')}>Browse services</button></div>
      )}
      {user && rows && rows.map((o) => <OrderCard key={o.id} o={o} onEdit={setEdit} />)}
      {edit && <EditSheet order={edit} onClose={() => setEdit(null)} onSaved={saved} />}
    </div>
  );
}
