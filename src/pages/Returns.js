import { money } from '../lib/currency';
import { CardListSkeleton } from '../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { useCfg, loadReturnReasons } from '../lib/cfg';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const REASONS_FALLBACK = [
  'Item is damaged / defective',
  'Item is not as described',
  'Received wrong item',
  'Missing parts or accessories',
  'Changed my mind',
  'Other',
];

export default function Returns() {
  const REASONS = useCfg(loadReturnReasons, REASONS_FALLBACK);
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [rsOpen, setRsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingReturns, setExistingReturns] = useState({});

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      supabase.from('orders').select('id, order_code, total, status, created_at').eq('buyer_id', user.id).order('created_at', { ascending: false }),
      supabase.from('return_requests').select('order_id, status').eq('buyer_id', user.id),
    ]).then(([o, r]) => {
      setOrders((o.data || []).filter(x => x.status === 'delivered' || x.status === 'completed'));
      const map = {};
      (r.data || []).forEach(x => { map[x.order_id] = x.status; });
      setExistingReturns(map);
      setLoading(false);
    });
  }, [user]);

  const submit = async () => {
    if (!activeOrder) return;
    setSubmitting(true);
    const { error } = await supabase.from('return_requests').insert({
      order_id: activeOrder.id,
      buyer_id: user.id,
      reason,
      note: note.trim() || null,
      refund_amount: activeOrder.total,
    });
    setSubmitting(false);
    if (error) { showToast(error.message); return; }
    showToast('Return request submitted');
    setExistingReturns(prev => ({ ...prev, [activeOrder.id]: 'pending' }));
    setActiveOrder(null);
    setNote('');
    setReason(REASONS[0]);
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Returns & Refunds</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Request a return or refund for a delivered order.
      </p>

      {loading ? (
        <CardListSkeleton />
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <Package size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            No delivered orders eligible for return.
          </p>
        </div>
      ) : (
        orders.map(o => (
          <div key={o.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>#{o.order_code}</div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{money(o.total, 'raw')}</div>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10 }}>
              {new Date(o.created_at).toLocaleDateString()}
            </div>
            {existingReturns[o.id] ? (
              <div style={{
                padding: 10, borderRadius: 10,
                background: 'var(--card)', border: '1px solid var(--border)',
                fontSize: 12, color: 'var(--text)',
              }}>
                Return status: <b>{existingReturns[o.id]}</b>
              </div>
            ) : (
              <button onClick={() => setActiveOrder(o)} className="btn-primary"
                style={{ width: '100%', padding: 10, fontSize: 13 }}>
                Request return / refund
              </button>
            )}
          </div>
        ))
      )}

      {activeOrder && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setActiveOrder(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{
              width: '100%', background: 'var(--bg, #fff)',
              padding: 20, borderRadius: '20px 20px 0 0',
              maxHeight: '85vh', overflowY: 'auto',
            }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
              Return #{activeOrder.order_code}
            </h3>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Reason</label>
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => setRsOpen(o => !o)} aria-haspopup="listbox" aria-expanded={rsOpen}
                style={{ width: '100%', textAlign: 'left', padding: '12px 40px 12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: 14, position: 'relative' }}>
                {reason}
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%) rotate(' + (rsOpen ? '180' : '0') + 'deg)', fontSize: 11 }}>▼</span>
              </button>
              {rsOpen && (
                <div role="listbox" style={{ position: 'absolute', left: 0, right: 0, bottom: '100%', marginBottom: 6, zIndex: 50, maxHeight: 260, overflowY: 'auto', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.18)' }}>
                  {REASONS.map(r => (
                    <div key={r} role="option" aria-selected={r === reason} onClick={() => { setReason(r); setRsOpen(false); }}
                      style={{ padding: '12px 14px', fontSize: 14, cursor: 'pointer', fontWeight: r === reason ? 700 : 500, color: r === reason ? 'var(--primary)' : 'var(--text)', borderBottom: '1px solid var(--border)' }}>{r}</div>
                  ))}
                </div>
              )}
            </div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Any extra details…"
              style={{ width: '100%', padding: 10, marginTop: 6, marginBottom: 12, minHeight: 80, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setActiveOrder(null)} className="btn-ghost" style={{ flex: 1, padding: 12 }}>
                Cancel
              </button>
              <button onClick={submit} disabled={submitting} className="btn-primary" style={{ flex: 1, padding: 12 }}>
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
