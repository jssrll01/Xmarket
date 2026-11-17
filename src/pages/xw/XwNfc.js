/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import useWallet from './useWallet';
import { Shell, SignIn, Sheet, Confirm, dt } from './ui';

const hasNfc = typeof window !== 'undefined' && 'NDEFReader' in window;
const chip = (s) => ({ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: s === 'active' ? '#D1FAE5' : '#E0F2FE', color: s === 'active' ? '#059669' : '#0369A1' });

export default function XwNfc() {
  const { user } = useWallet();
  const { show } = useToast();
  const [cards, setCards] = useState(null);
  const [sheet, setSheet] = useState(false);
  const [step, setStep] = useState('form');
  const [pin, setPin] = useState('');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(null);
  const ctrl = useRef(null);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('nfc_my_cards');
    setCards(data || []);
  }, []);
  useEffect(() => { if (user) load(); }, [user, load]);
  useEffect(() => () => { if (ctrl.current) ctrl.current.abort(); }, []);
  if (!user) return <SignIn />;

  const closeSheet = () => {
    if (ctrl.current) ctrl.current.abort();
    setSheet(false); setStep('form'); setPin('');
  };

  const link = async () => {
    if (!/^\d{4}$/.test(pin)) return show('Enter your 4-digit Xwallet PIN');
    setBusy(true);
    const { data, error } = await supabase.rpc('nfc_issue_card', { p_pin: pin, p_label: label });
    setPin('');
    if (error || !data || !data.ok) { setBusy(false); return show((data && data.error) || 'Could not create the card. Try again.'); }
    setStep('tap');
    try {
      ctrl.current = new AbortController();
      const ndef = new window.NDEFReader();
      await ndef.write({ records: [{ recordType: 'text', data: 'XM1:' + data.token }] }, { overwrite: true, signal: ctrl.current.signal });
      show('Card linked! Try it at a partner.');
      setSheet(false); setStep('form'); setLabel('');
    } catch (e) {
      await supabase.rpc('nfc_set_card_status', { p_id: data.id, p_status: 'revoked' });
      if (!(e && e.name === 'AbortError')) show('Could not write to the card. Hold it steady at the back of your phone and try again.');
      setStep('form');
    }
    setBusy(false);
    load();
  };

  const setStatus = async (id, status) => {
    setBusy(true);
    const { data, error } = await supabase.rpc('nfc_set_card_status', { p_id: id, p_status: status });
    setBusy(false); setAsk(null);
    if (error || !data || !data.ok) return show((data && data.error) || 'Something went wrong');
    load();
  };

  const inp = { width: '100%', padding: 12, marginTop: 6, marginBottom: 12, fontSize: 14 };
  const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--muted)' };

  return (
    <Shell title="NFC Card">
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <CreditCard size={22} color="var(--primary)" />
          <b>Pay by tapping your card</b>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Link an NFC card to your Xwallet. At Xmarket partners, tap the card and enter your 4-digit PIN to pay. Your balance is never stored on the card.
        </p>
        {!hasNfc && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 8 }}>NFC linking works in Chrome on Android only.</p>}
        <button className="btn-primary" disabled={!hasNfc} onClick={() => { setSheet(true); setStep('form'); }} style={{ width: '100%', padding: 12, marginTop: 12, fontWeight: 800 }}>
          <Plus size={16} /> Link a new card
        </button>
      </div>

      {cards === null ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</p>
        : cards.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center' }}>No cards linked yet.</p>
        : cards.map((c) => (
          <div key={c.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <b style={{ fontSize: 14 }}>{c.label || 'NFC card'}</b>
              <span style={chip(c.status)}>{c.status}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
              Linked {dt(c.created_at)}{c.last_used_at ? ' · Last used ' + dt(c.last_used_at) : ''}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn-ghost" disabled={busy} style={{ flex: 1, padding: 10 }} onClick={() => setStatus(c.id, c.status === 'active' ? 'frozen' : 'active')}>
                {c.status === 'active' ? 'Freeze' : 'Unfreeze'}
              </button>
              <button className="btn-ghost" disabled={busy} style={{ padding: 10, color: '#DC2626' }} onClick={() => setAsk(c)} aria-label="Remove card"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}

      <Link to="/xwallet/nfc-pay" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
        Xmarket partner? Open Tap to Pay
      </Link>

      {sheet && (
        <Sheet title="Link NFC card" onClose={closeSheet}>
          {step === 'form' ? (
            <>
              <label style={lbl}>Card name (optional)</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={30} placeholder="My blue card" style={inp} />
              <label style={lbl}>Xwallet PIN</label>
              <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="4 digits" style={inp} />
              <button className="btn-primary" disabled={busy || pin.length !== 4} onClick={link} style={{ width: '100%', padding: 13, fontWeight: 800 }}>
                {busy ? 'Please wait…' : 'Continue'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CreditCard size={40} color="var(--primary)" />
              <p style={{ fontWeight: 800, margin: '10px 0 4px' }}>Tap your card now</p>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>Hold the card against the back of your phone until it confirms. Writing replaces anything already on the card.</p>
              <button className="btn-ghost" onClick={closeSheet} style={{ marginTop: 16, padding: '10px 24px' }}>Cancel</button>
            </div>
          )}
        </Sheet>
      )}

      {ask && (
        <Confirm title="Remove card" busy={busy}
          message="This card will stop working for payments. This cannot be undone."
          onCancel={() => setAsk(null)} onConfirm={() => setStatus(ask.id, 'revoked')} />
      )}
    </Shell>
  );
}
