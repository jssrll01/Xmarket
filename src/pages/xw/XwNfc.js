import { CardListSkeleton as LoadSk } from '../../components/Skeleton';
/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';
import useWallet from './useWallet';
import { Shell, SignIn, Sheet, Confirm, dt, peso } from './ui';

const FEE = 49;
const LABEL = { pending: 'Waiting for activation', active: 'Activated', frozen: 'Frozen', rejected: 'Rejected' };
const COLOR = { pending: '#D97706', active: '#059669', frozen: '#0369A1', rejected: '#DC2626' };

export default function XwNfc() {
  const { user, balance, refresh } = useWallet();
  const { show } = useToast();
  const [cards, setCards] = useState(null);
  const [sheet, setSheet] = useState(false);
  const [pin, setPin] = useState('');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(null);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('nfc_my_cards');
    setCards(data || []);
  }, []);
  useEffect(() => { if (user) load(); }, [user, load]);
  if (!user) return <SignIn />;

  const request = async () => {
    if (!label.trim()) return show('Enter a card name');
    if (!/^\d{4}$/.test(pin)) return show('Enter your 4-digit Xwallet PIN');
    setBusy(true);
    const { data, error } = await supabase.rpc('nfc_request_card', { p_pin: pin, p_label: label });
    setBusy(false); setPin('');
    if (error || !data || !data.ok) return show((data && data.error) || 'Could not send the request. Try again.');
    show('Request sent! ' + peso(FEE) + ' was deducted from your Xwallet.');
    setSheet(false); setLabel('');
    load(); refresh();
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
          <b>Xmarket NFC card</b>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Request a card for {peso(FEE)}, paid from your Xwallet. Once Xmarket activates it, tap it at partners and enter your 4-digit PIN to pay.
        </p>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Your balance <b style={{ color: 'var(--text)' }}>{peso(balance)}</b></div>
        <button className="btn-primary" onClick={() => setSheet(true)} style={{ width: '100%', padding: 12, marginTop: 12, fontWeight: 800 }}>
          <Plus size={16} /> Request NFC card · {peso(FEE)}
        </button>
      </div>

      {cards === null ? <LoadSk count={3} />
        : cards.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center' }}>No cards yet.</p>
        : cards.map((c) => (
          <div key={c.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <b style={{ fontSize: 14 }}>{c.label || 'NFC card'}</b>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: (COLOR[c.status] || '#64748B') + '1A', color: COLOR[c.status] || '#64748B' }}>{LABEL[c.status] || c.status}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
              Requested {dt(c.created_at)}{c.last_used_at ? ' · Last used ' + dt(c.last_used_at) : ''}
            </div>
            {c.status === 'rejected' && <div style={{ fontSize: 12, marginTop: 6 }}>{peso(c.fee)} refunded.{c.reject_note ? ' Reason: ' + c.reject_note : ''}</div>}
            {c.status !== 'pending' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {(c.status === 'active' || c.status === 'frozen') && (
                  <button className="btn-ghost" disabled={busy} style={{ flex: 1, padding: 10 }} onClick={() => setStatus(c.id, c.status === 'active' ? 'frozen' : 'active')}>
                    {c.status === 'active' ? 'Freeze' : 'Unfreeze'}
                  </button>
                )}
                <button className="btn-ghost" disabled={busy} style={{ padding: 10, color: '#DC2626' }} onClick={() => setAsk(c)} aria-label="Remove card"><Trash2 size={16} /></button>
              </div>
            )}
          </div>
        ))}

      {sheet && (
        <Sheet title="Request NFC card" onClose={() => { setSheet(false); setPin(''); }}>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 0 }}>{peso(FEE)} will be deducted from your Xwallet. If the request is rejected, it is refunded.</p>
          <label style={lbl}>Preferred card name</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={30} placeholder="My blue card" style={inp} />
          <label style={lbl}>Xwallet PIN</label>
          <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="4 digits" style={inp} />
          <button className="btn-primary" disabled={busy || pin.length !== 4 || !label.trim()} onClick={request} style={{ width: '100%', padding: 13, fontWeight: 800 }}>
            {busy ? 'Sending…' : 'Send request'}
          </button>
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
