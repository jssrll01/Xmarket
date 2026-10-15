import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Copy, Check, Sparkles, Wallet, ShieldCheck, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchWallet } from '../lib/xwallet';
import { purchaseXcard, fetchMyXcards } from '../lib/xcards';

const DENOMS = [100, 200, 500, 1000];

export default function Xcards() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [balance, setBalance] = useState(0);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(100);
  const [buying, setBuying] = useState(false);
  const [copied, setCopied] = useState(null);

  const refresh = async () => {
    if (!user) return;
    const [b, c] = await Promise.all([fetchWallet(user.id), fetchMyXcards(user.id)]);
    setBalance(b); setCards(c); setLoading(false);
  };

  useEffect(() => { refresh(); /* eslint-disable-line */ }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Sign in to buy Xcards.</p>
        <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
      </div>
    );
  }

  const insufficient = balance < selected;
  const available = cards.filter(c => !c.redeemed_by);
  const redeemed = cards.length - available.length;
  const availableValue = available.reduce((n, c) => n + (Number(c.value) || 0), 0);

  const buy = async () => {
    if (insufficient) { showToast('Insufficient Xwallet balance'); return; }
    setBuying(true);
    const { error } = await purchaseXcard(user.id, selected);
    setBuying(false);
    if (error) { showToast(error.message); return; }
    showToast(`Xcard ₱${selected} purchased`);
    refresh();
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      showToast('Code copied');
      setTimeout(() => setCopied(null), 2000);
    } catch { showToast('Copy failed'); }
  };

  const steps = [
    ['Choose an amount', 'Pick a denomination and buy it with your Xwallet balance.'],
    ['Get your code', 'A unique code starting with XC appears under My Xcards.'],
    ['Share or keep it', 'Send the code to any XMARKET account, or use it yourself.'],
    ['Redeem at checkout', 'Enter the code in the Xcard code field. Each code works once.'],
  ];

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Xcards</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Digital gift cards from XMARKET. Send to anyone, redeem once at checkout.
      </p>

      {/* Card preview */}
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: 20, padding: 22, marginBottom: 14,
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #7C3AED 100%)',
        color: '#fff', boxShadow: '0 12px 30px rgba(37,99,235,0.28)', minHeight: 150,
      }}>
        <Gift size={110} style={{ position: 'absolute', right: -18, bottom: -22, opacity: 0.12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.2 }}>XMARKET</span>
          <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.8 }}>Gift card</span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, marginTop: 22, lineHeight: 1 }}>₱{selected.toLocaleString()}</div>
        <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 8 }}>One-time use · Does not expire</div>
      </div>

      {/* Buy panel */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, background: 'var(--card)', marginBottom: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: 'var(--muted)' }}>
            <Wallet size={15} /> Xwallet balance
          </span>
          <span style={{ fontWeight: 800, fontSize: 15 }}>₱{balance.toFixed(2)}</span>
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Choose an amount</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {DENOMS.map(d => (
            <button key={d} onClick={() => setSelected(d)}
              style={{
                padding: '14px 0', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 15,
                border: selected === d ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: selected === d ? 'var(--primary)' : 'var(--card)',
                color: selected === d ? '#fff' : 'var(--text)',
              }}>
              ₱{d.toLocaleString()}
            </button>
          ))}
        </div>

        {insufficient && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: '#FEF3C7', color: '#92400E', fontSize: 12.5, fontWeight: 600, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <span>You need ₱{(selected - balance).toFixed(2)} more to buy this card.</span>
            <button onClick={() => nav('/xwallet')} style={{ border: 'none', background: '#92400E', color: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}>Top up</button>
          </div>
        )}

        <button onClick={buy} disabled={buying || insufficient} className="btn-primary"
          style={{ width: '100%', padding: 14, fontSize: 14, fontWeight: 800, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: insufficient ? 0.6 : 1 }}>
          <Sparkles size={15} />
          {buying ? 'Purchasing…' : `Buy ₱${selected.toLocaleString()} Xcard`}
        </button>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          The amount is deducted from your Xwallet balance right away.
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
        {[['Available', available.length], ['Redeemed', redeemed], ['Value left', `₱${availableValue.toLocaleString()}`]].map(([k, v]) => (
          <div key={k} className="card" style={{ padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{v}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* My cards */}
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>My Xcards</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading…</p>
      ) : cards.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center', marginBottom: 18 }}>
          <Ticket size={32} color="var(--muted)" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 800 }}>No Xcards yet</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>Buy one above and it will show up here.</div>
        </div>
      ) : (
        <div style={{ marginBottom: 18 }}>
          {cards.map(c => {
            const used = !!c.redeemed_by;
            return (
              <div key={c.id} style={{
                borderRadius: 16, padding: 14, marginBottom: 10, color: used ? 'var(--text)' : '#fff',
                background: used ? 'var(--card)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                border: used ? '1px dashed var(--border)' : 'none',
                opacity: used ? 0.7 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 900 }}>₱{Number(c.value).toLocaleString()}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.5,
                    background: used ? '#E2E8F0' : 'rgba(255,255,255,0.22)', color: used ? '#475569' : '#fff',
                  }}>{used ? 'Redeemed' : 'Available'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, letterSpacing: 1.5, textDecoration: used ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.code}</div>
                    <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                      {used
                        ? `Redeemed ${c.redeemed_at ? new Date(c.redeemed_at).toLocaleDateString() : ''}`
                        : `Purchased ${c.purchased_at ? new Date(c.purchased_at).toLocaleDateString() : ''}`}
                    </div>
                  </div>
                  {!used && (
                    <button onClick={() => copyCode(c.code)}
                      style={{ border: 'none', background: '#fff', color: '#2563EB', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      {copied === c.code ? <Check size={13} /> : <Copy size={13} />}
                      {copied === c.code ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* How it works */}
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>How Xcards work</h3>
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        {steps.map(([t, d], i) => (
          <div key={t} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i === steps.length - 1 ? 'none' : '1px solid var(--border, #EEF2F7)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800 }}>{t}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.5 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <ShieldCheck size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <b style={{ color: 'var(--text)' }}>Keep your codes private.</b> Anyone with an Xcard code can redeem it, so only share it with the person you're gifting.
        </div>
      </div>
    </div>
  );
}
