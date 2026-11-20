import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { money } from '../lib/currency';
import { sendByEmail } from '../lib/sendMoney';
import { Card, field, pri, ghost } from '../components/prefs/PrefUi';

export default function ScheduledTransfers() {
  const nav = useNavigate();
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState('');
  const [note, setNote] = useState('');
  const [when, setWhen] = useState('');
  const [rep, setRep] = useState('none');
  const [rows, setRows] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('sched_list');
    setRows(Array.isArray(data) ? data : []);
  }, []);
  useEffect(() => { load(); }, [load]);
  const create = async () => {
    setBusy(true); setMsg('');
    const { data, error } = await supabase.rpc('sched_create', { p_to: to, p_amount: Number(amt), p_note: note || null, p_run_at: when ? new Date(when).toISOString() : null, p_repeat: rep });
    setBusy(false);
    if (error || !data || !data.ok) { setMsg((data && data.error) || (error && error.message) || 'Could not schedule.'); return; }
    setTo(''); setAmt(''); setNote(''); setWhen(''); setRep('none');
    setMsg('Scheduled. We will notify you when it is due.');
    load();
  };
  const sendNow = async (s) => {
    setMsg('');
    const res = await sendByEmail(s.to_email, s.amount, s.note || 'Scheduled transfer');
    if (!res.ok) { setMsg(res.error); return; }
    await supabase.rpc('sched_done', { p_id: s.id });
    setMsg('Sent ' + money(s.amount, 'fixed') + ' to ' + s.to_email + '.');
    load();
  };
  const cancel = async (s) => { if (window.confirm('Cancel this scheduled transfer?')) { await supabase.rpc('sched_cancel', { p_id: s.id }); load(); } };
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-btn" aria-label="Back" onClick={() => (window.history.state && window.history.state.idx > 0 ? nav(-1) : nav('/'))}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Scheduled transfers</h2>
      </div>
      <Card title="Schedule a transfer">
        <div style={{ fontSize: 13, color: 'var(--muted, #64748B)', marginBottom: 10 }}>We remind you when it is due. You confirm with your PIN, so nobody can move your money without it.</div>
        <input style={{ ...field, marginBottom: 8 }} type="email" placeholder="Recipient email" value={to} onChange={(e) => setTo(e.target.value)} />
        <input style={{ ...field, marginBottom: 8 }} type="number" inputMode="decimal" placeholder="Amount (PHP)" value={amt} onChange={(e) => setAmt(e.target.value)} />
        <input style={{ ...field, marginBottom: 8 }} type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        <select style={{ ...field, marginBottom: 8 }} value={rep} onChange={(e) => setRep(e.target.value)}>
          <option value="none">Just once</option><option value="weekly">Every week</option><option value="monthly">Every month</option>
        </select>
        <input style={{ ...field, marginBottom: 10 }} maxLength={120} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="button" style={pri} disabled={busy || !to || !(Number(amt) >= 1) || !when} onClick={create}>{busy ? 'Saving...' : 'Schedule'}</button>
      </Card>
      {msg && <div style={{ fontSize: 13, margin: '0 4px 12px' }}>{msg}</div>}
      <Card title="Upcoming">
        {rows && rows.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted, #64748B)' }}>Nothing scheduled.</div>}
        {rows && rows.map((s) => (
          <div key={s.id} style={{ padding: '10px 0', borderTop: '1px solid var(--border, #E2E8F0)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>{money(s.amount, 'fixed')} to {s.to_email}</b>
              {s.due && <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: '#DC2626', padding: '2px 8px', borderRadius: 99 }}>DUE</span>}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted, #64748B)' }}>{new Date(s.run_at).toLocaleString()}{s.repeat !== 'none' ? ' · repeats ' + s.repeat : ''}{s.note ? ' · ' + s.note : ''}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button type="button" style={{ ...ghost, background: s.due ? '#2563EB' : '#fff', color: s.due ? '#fff' : 'inherit' }} onClick={() => sendNow(s)}>Send now</button>
              <button type="button" style={ghost} onClick={() => cancel(s)}>Cancel</button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
