import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { money } from '../lib/currency';
import { Card, field, pri, ghost } from '../components/prefs/PrefUi';

const COLOR = { open: '#D97706', paid: '#059669', cancelled: '#64748B', expired: '#64748B' };

export default function RequestMoney() {
  const nav = useNavigate();
  const [amt, setAmt] = useState('');
  const [note, setNote] = useState('');
  const [rows, setRows] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('request_money_mine');
    setRows(Array.isArray(data) ? data : []);
  }, []);
  useEffect(() => { load(); }, [load]);
  const link = (t) => window.location.origin + '/pay/' + t;
  const copy = async (t) => {
    try { await navigator.clipboard.writeText(link(t)); setMsg('Link copied.'); } catch (e) { setMsg(link(t)); }
  };
  const share = async (t) => {
    try {
      if (navigator.share) { await navigator.share({ title: 'Payment request', text: 'Please send me money on XMARKET Xwallet', url: link(t) }); return; }
    } catch (e) { return; }
    copy(t);
  };
  const create = async () => {
    setBusy(true); setMsg('');
    const { data, error } = await supabase.rpc('request_money_create', { p_amount: Number(amt), p_note: note || null });
    setBusy(false);
    if (error || !data || !data.ok) { setMsg((data && data.error) || (error && error.message) || 'Could not create the link.'); return; }
    setAmt(''); setNote('');
    await load();
    share(data.token);
  };
  const close = async (t, status) => { await supabase.rpc('request_money_close', { p_token: t, p_status: status }); load(); };
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/'))}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Request money</h2>
      </div>
      <Card title="New request">
        <div style={{ fontSize: 13, color: 'var(--muted, #64748B)', marginBottom: 10 }}>Create a link and send it to anyone with an XMARKET account. They pay you from their Xwallet with their PIN. Links expire after 7 days.</div>
        <input style={{ ...field, marginBottom: 8 }} type="number" inputMode="decimal" placeholder="Amount (PHP)" value={amt} onChange={(e) => setAmt(e.target.value)} />
        <input style={{ ...field, marginBottom: 10 }} maxLength={120} placeholder="What is it for? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="button" style={pri} disabled={busy || !(Number(amt) >= 1)} onClick={create}>{busy ? 'Creating...' : 'Create and share link'}</button>
        {msg && <div style={{ fontSize: 13, marginTop: 8, wordBreak: 'break-all' }}>{msg}</div>}
      </Card>
      <Card title="My requests">
        {rows && rows.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted, #64748B)' }}>No requests yet.</div>}
        {rows && rows.map((r) => (
          <div key={r.token} style={{ padding: '10px 0', borderTop: '1px solid var(--border, #E2E8F0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <b>{money(r.amount, 'fixed')}</b>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: COLOR[r.status] || '#64748B', padding: '2px 8px', borderRadius: 99 }}>{r.status}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted, #64748B)' }}>{r.note || 'No note'} · {new Date(r.created_at).toLocaleDateString()}</div>
            {r.status === 'open' && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                <button type="button" style={ghost} onClick={() => share(r.token)}>Share</button>
                <button type="button" style={ghost} onClick={() => copy(r.token)}>Copy link</button>
                <button type="button" style={ghost} onClick={() => close(r.token, 'paid')}>Mark received</button>
                <button type="button" style={ghost} onClick={() => close(r.token, 'cancelled')}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
