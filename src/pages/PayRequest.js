import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { money } from '../lib/currency';
import { sendByEmail } from '../lib/sendMoney';
import { Card, pri } from '../components/prefs/PrefUi';

export default function PayRequest() {
  const { token } = useParams();
  const nav = useNavigate();
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    supabase.rpc('request_money_get', { p_token: token }).then(({ data, error }) => {
      if (error || !data || !data.ok) { setErr((data && data.error) || (error && error.message) || 'Request not found.'); setR(false); }
      else setR(data);
    });
  }, [token]);
  const pay = async () => {
    setBusy(true); setErr('');
    const res = await sendByEmail(r.requester_email, r.amount, 'Payment request ' + token);
    if (!res.ok) { setErr(res.error); setBusy(false); return; }
    await supabase.rpc('request_money_mark_paid', { p_token: token });
    setDone(true); setBusy(false);
  };
  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100, maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 800 }}>Payment request</h2>
      {r === null && <p>Loading...</p>}
      {r === false && <Card><div style={{ color: '#DC2626' }}>{err}</div></Card>}
      {r && (
        <Card>
          <div style={{ fontSize: 13, color: 'var(--muted, #64748B)' }}>{r.requester_name} is requesting</div>
          <div style={{ fontSize: 34, fontWeight: 900, margin: '4px 0' }}>{money(r.amount, 'fixed')}</div>
          {r.note && <div style={{ marginBottom: 10 }}>"{r.note}"</div>}
          {done && <div style={{ color: '#059669', fontWeight: 800 }}>Paid. Thank you!</div>}
          {!done && r.status !== 'open' && <div style={{ fontWeight: 700 }}>This request is {r.status}.</div>}
          {!done && r.status === 'open' && r.is_mine && <div style={{ fontWeight: 700 }}>This is your own request. Send the link to the person who should pay.</div>}
          {!done && r.status === 'open' && !r.is_mine && r.requester_email && (
            <button type="button" style={{ ...pri, width: '100%' }} disabled={busy} onClick={pay}>{busy ? 'Processing...' : 'Pay ' + money(r.amount, 'fixed')}</button>
          )}
          {err && <div style={{ color: '#DC2626', fontSize: 13, marginTop: 8 }}>{err}</div>}
          <button type="button" className="link" style={{ color: '#2563EB', fontWeight: 700, marginTop: 10 }} onClick={() => nav('/')}>Back to XMARKET</button>
        </Card>
      )}
    </div>
  );
}
