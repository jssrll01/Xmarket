import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Copy, Check, Sparkles } from 'lucide-react';
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

  const buy = async () => {
    if (balance < selected) {
      showToast('Insufficient Xwallet balance');
      return;
    }
    setBuying(true);
    const { card, error } = await purchaseXcard(user.id, selected);
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

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Gift size={24} color="var(--primary)" />
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>Xcards</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Digital gift cards — send to anyone, redeem once.
      </p>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Xwallet balance</span>
          <span style={{ fontWeight: 800, fontSize: 16 }}>₱{balance.toFixed(2)}</span>
        </div>

        <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Choose a denomination</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {DENOMS.map(d => (
            <button key={d} onClick={() => setSelected(d)}
              style={{
                padding: 12, borderRadius: 10, border: '1px solid var(--border)',
                background: selected === d ? 'var(--primary)' : 'var(--card)',
                color: selected === d ? '#fff' : 'var(--text)',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
              }}>
              ₱{d}
            </button>
          ))}
        </div>

        <button onClick={buy} disabled={buying} className="btn-primary"
          style={{ width: '100%', padding: 14, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Sparkles size={14} />
          {buying ? 'Purchasing…' : `Buy ₱${selected} Xcard`}
        </button>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          Amount will be deducted from your Xwallet balance
        </p>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>My Xcards</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading…</p>
      ) : cards.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>
          No Xcards yet. Buy one above to get started.
        </p>
      ) : (
        cards.map(c => {
          const used = !!c.redeemed_by;
          return (
            <div key={c.id} className="card" style={{
              padding: 14, marginBottom: 10,
              border: used ? '1px dashed var(--border)' : '1px solid var(--primary)',
              opacity: used ? 0.5 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{
                    fontFamily: 'monospace', fontWeight: 900, fontSize: 16, letterSpacing: 1.5,
                    textDecoration: used ? 'line-through' : 'none',
                  }}>
                    {c.code}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
                    ₱{c.value} · {used ? `Redeemed ${new Date(c.redeemed_at).toLocaleDateString()}` : 'Available'}
                  </div>
                </div>
                {!used && (
                  <button onClick={() => copyCode(c.code)} className="btn-ghost"
                    style={{ padding: '8px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {copied === c.code ? <Check size={12} /> : <Copy size={12} />}
                    {copied === c.code ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
