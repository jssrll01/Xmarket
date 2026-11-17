import { CardListSkeleton as LoadSk } from '../../components/Skeleton';
/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import useWallet from './useWallet';
import { Shell, SignIn, Sheet, peso, dt } from './ui';

const hasNfc = typeof window !== 'undefined' && 'NDEFReader' in window;
const newId = () => (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

export default function XwNfcPay() {
  const { user } = useWallet();
  const { show } = useToast();
  const [info, setInfo] = useState(null);
  const [recent, setRecent] = useState([]);
  const [amount, setAmount] = useState('');
  const [scanning, setScanning] = useState(false);
  const [token, setToken] = useState('');
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const ctrl = useRef(null);
  const idem = useRef('');

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('nfc_partner_status');
    setInfo(data || { partner: false });
    if (data && data.partner) {
      const r = await supabase.rpc('nfc_partner_recent', { p_limit: 10 });
      setRecent(r.data || []);
    }
  }, []);
  useEffect(() => { if (user) load(); }, [user, load]);
  useEffect(() => () => { if (ctrl.current) ctrl.current.abort(); }, []);
  if (!user) return <SignIn />;

  const stopScan = () => { if (ctrl.current) ctrl.current.abort(); setScanning(false); };

  const startScan = async () => {
    const amt = Math.round(Number(amount) * 100) / 100;
    if (!(amt >= 1)) return show('Enter an amount of at least ₱1');
    try {
      const ndef = new window.NDEFReader();
      ctrl.current = new AbortController();
      await ndef.scan({ signal: ctrl.current.signal });
      setScanning(true);
      ndef.onreadingerror = () => show('Could not read that card. Try again.');
      ndef.onreading = (ev) => {
        for (const rec of ev.message.records) {
          if (rec.recordType !== 'text') continue;
          const txt = new TextDecoder(rec.encoding || 'utf-8').decode(rec.data);
          if (txt.indexOf('XM1:') === 0) {
            ctrl.current.abort();
            setScanning(false);
            idem.current = newId();
            setPin('');
            setToken(txt.slice(4));
            return;
          }
        }
        show('This is not an Xmarket card.');
      };
    } catch (e) {
      setScanning(false);
      show('Could not start NFC. Turn NFC on and allow it for this site.');
    }
  };

  const pay = async () => {
    if (!/^\d{4}$/.test(pin)) return show('Enter the 4-digit PIN');
    setBusy(true);
    const { data, error } = await supabase.rpc('nfc_pay', { p_token: token, p_amount: Number(amount), p_pin: pin, p_idem: idem.current });
    setBusy(false); setPin('');
    if (error || !data) return show('Network problem. Check Recent before charging again.');
    if (!data.ok) return show(data.error || 'Payment failed');
    setDone(data); setToken(''); setAmount(''); load();
  };

  return (
    <Shell title="Tap to Pay" back="/xwallet/nfc">
      {info === null ? <LoadSk count={3} />
        : !info.partner ? (
          <div className="card" style={{ padding: 16, fontSize: 13.5, lineHeight: 1.6 }}>
            This account is not registered as an Xmarket NFC partner. Contact Xmarket to become a partner.
          </div>
        ) : (
          <>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Receiving as <b style={{ color: 'var(--text)' }}>{info.name}</b></div>
              {!hasNfc && <p style={{ fontSize: 12, color: '#DC2626' }}>This needs Chrome on Android with NFC turned on.</p>}
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
              <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                style={{ width: '100%', padding: 14, marginTop: 6, marginBottom: 12, fontSize: 22, fontWeight: 800, textAlign: 'center' }} />
              {scanning ? (
                <>
                  <p style={{ textAlign: 'center', fontWeight: 800, margin: '4px 0' }}>Hold the customer card near the back of this phone…</p>
                  <button className="btn-ghost" onClick={stopScan} style={{ width: '100%', padding: 12 }}>Cancel</button>
                </>
              ) : (
                <button className="btn-primary" disabled={!hasNfc} onClick={startScan} style={{ width: '100%', padding: 13, fontWeight: 800 }}>Tap card to charge</button>
              )}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: '16px 0 8px' }}>Recent</h3>
            {recent.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No payments yet.</p> : recent.map((r) => (
              <div key={r.receipt_no + r.created_at} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.customer}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{dt(r.created_at)} · {r.receipt_no}</div>
                </div>
                <b style={{ color: '#059669' }}>+{peso(r.amount)}</b>
              </div>
            ))}
          </>
        )}

      {token && (
        <Sheet title="Customer PIN" onClose={() => { setToken(''); setPin(''); }}>
          <p style={{ fontSize: 13, marginTop: 0 }}>Charge <b>{peso(Number(amount))}</b>. Ask the customer to enter their 4-digit Xwallet PIN.</p>
          <input type="password" inputMode="numeric" maxLength={4} value={pin} autoFocus onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            style={{ width: '100%', height: 52, textAlign: 'center', fontSize: 24, letterSpacing: 10, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={() => { setToken(''); setPin(''); }} style={{ flex: 1, padding: 12 }}>Cancel</button>
            <button className="btn-primary" disabled={busy || pin.length !== 4} onClick={pay} style={{ flex: 1, padding: 12, fontWeight: 800 }}>{busy ? 'Processing…' : 'Pay'}</button>
          </div>
        </Sheet>
      )}

      {done && (
        <Sheet title="Payment received" onClose={() => setDone(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <div style={{ fontSize: 26, fontWeight: 800, margin: '6px 0' }}>{peso(done.amount)}</div>
            {done.customer && <div style={{ fontSize: 13, color: 'var(--muted)' }}>from {done.customer}</div>}
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Receipt {done.receipt_no}</div>
          </div>
          <button className="btn-primary" onClick={() => setDone(null)} style={{ width: '100%', padding: 13, fontWeight: 800, marginTop: 14 }}>Done</button>
        </Sheet>
      )}
    </Shell>
  );
}
