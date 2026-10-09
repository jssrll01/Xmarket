import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Send, Phone, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchWallet, fetchWalletTxns, creditWallet, transferToUser, lookupUserByUsername } from '../lib/xwallet';

const TOPUP_AMOUNTS = [100, 200, 500, 1000, 2000];

export default function Xwallet() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [balance, setBalance] = useState(0);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('topup');
  const [topupAmount, setTopupAmount] = useState(100);
  const [topupLoading, setTopupLoading] = useState(false);

  const [transferUser, setTransferUser] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  const [loadAmount, setLoadAmount] = useState('');
  const [loadNumber, setLoadNumber] = useState('');
  const [loadLoading, setLoadLoading] = useState(false);

  const refresh = async () => {
    if (!user) return;
    const [b, t] = await Promise.all([fetchWallet(user.id), fetchWalletTxns(user.id)]);
    setBalance(b); setTxns(t); setLoading(false);
  };

  useEffect(() => { refresh(); /* eslint-disable-line */ }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Sign in to use Xwallet.</p>
        <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
      </div>
    );
  }

  const doTopup = async () => {
    setTopupLoading(true);
    const { error } = await creditWallet(user.id, topupAmount, 'topup', null, `Top-up ₱${topupAmount}`);
    setTopupLoading(false);
    if (error) { showToast(error.message); return; }
    showToast(`Topped up ₱${topupAmount}`);
    refresh();
  };

  const doTransfer = async () => {
    const amt = Number(transferAmount);
    if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
    if (amt > balance) { showToast('Insufficient balance'); return; }
    setTransferLoading(true);
    const { user: recipient, error } = await lookupUserByUsername(transferUser);
    if (error || !recipient) { setTransferLoading(false); showToast('Recipient not found'); return; }
    if (recipient.id === user.id) { setTransferLoading(false); showToast("Can't send to yourself"); return; }
    const { error: tErr } = await transferToUser(user.id, recipient.id, amt, `From ${user.email}`);
    setTransferLoading(false);
    if (tErr) { showToast(tErr.message); return; }
    showToast(`Sent ₱${amt} to ${recipient.username}`);
    setTransferAmount(''); setTransferUser('');
    refresh();
  };

  const doBuyLoad = async () => {
    const amt = Number(loadAmount);
    if (!amt || amt < 10) { showToast('Minimum load is ₱10'); return; }
    if (amt > balance) { showToast('Insufficient balance'); return; }
    if (!loadNumber.trim()) { showToast('Enter mobile number'); return; }
    setLoadLoading(true);
    const { error } = await creditWallet(user.id, -amt, 'load', loadNumber, `Buy load for ${loadNumber}`);
    setLoadLoading(false);
    if (error) { showToast(error.message); return; }
    showToast(`Sent ₱${amt} load to ${loadNumber}`);
    setLoadAmount(''); setLoadNumber('');
    refresh();
  };

  const TABS = [
    { id: 'topup', label: 'Top-up', icon: Plus },
    { id: 'transfer', label: 'Send', icon: Send },
    { id: 'load', label: 'Buy Load', icon: Smartphone },
  ];

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Xwallet</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Your XMARKET balance — top up, send, and pay.
      </p>

      <div style={{
        padding: 24, marginBottom: 16, borderRadius: 18,
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
      }}>
        <Wallet size={80} style={{ position: 'absolute', top: -10, right: -20, opacity: 0.15 }} />
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' }}>
          Balance
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginTop: 4 }}>
          ₱{balance.toFixed(2)}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        marginBottom: 16, background: 'var(--card)', borderRadius: 14, padding: 6,
      }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                padding: 12, borderRadius: 10, border: 'none',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text)',
                fontWeight: 700, fontSize: 12,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer',
              }}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'topup' && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Quick top-up</h3>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Custom amount (₱)</label>
          <input
            type="number"
            value={topupAmount}
            onChange={e => setTopupAmount(Number(e.target.value) || 0)}
            placeholder="Enter amount"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }}
          />
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Or pick a quick amount</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {TOPUP_AMOUNTS.map(a => (
              <button key={a} onClick={() => setTopupAmount(a)}
                style={{
                  padding: 12, borderRadius: 10, border: '1px solid var(--border)',
                  background: topupAmount === a ? 'var(--primary)' : 'var(--card)',
                  color: topupAmount === a ? '#fff' : 'var(--text)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>
                ₱{a}
              </button>
            ))}
          </div>
          <button onClick={doTopup} disabled={topupLoading} className="btn-primary"
            style={{ width: '100%', padding: 12, fontSize: 13 }}>
            {topupLoading ? 'Processing…' : `Top up ₱${topupAmount}`}
          </button>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
            Demo top-up (no payment gateway connected)
          </p>
        </div>
      )}

      {activeTab === 'transfer' && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Send to another user</h3>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Recipient username</label>
          <input value={transferUser} onChange={e => setTransferUser(e.target.value)}
            placeholder="e.g. zyntx01"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
          <input type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)}
            placeholder="0.00"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
          <button onClick={doTransfer} disabled={transferLoading} className="btn-primary"
            style={{ width: '100%', padding: 12, fontSize: 13 }}>
            {transferLoading ? 'Sending…' : 'Send money'}
          </button>
        </div>
      )}

      {activeTab === 'load' && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Buy prepaid load</h3>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Mobile number</label>
          <input value={loadNumber} onChange={e => setLoadNumber(e.target.value)}
            placeholder="09XX XXX XXXX"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
          <input type="number" value={loadAmount} onChange={e => setLoadAmount(e.target.value)}
            placeholder="10 minimum"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
          <button onClick={doBuyLoad} disabled={loadLoading} className="btn-primary"
            style={{ width: '100%', padding: 12, fontSize: 13 }}>
            {loadLoading ? 'Processing…' : 'Send load'}
          </button>
        </div>
      )}

      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Transactions</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading…</p>
      ) : txns.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>
          No transactions yet.
        </p>
      ) : (
        txns.map(t => (
          <div key={t.id} className="card" style={{
            padding: 12, marginBottom: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: t.amount > 0 ? '#D1FAE5' : '#FEE2E2',
                color: t.amount > 0 ? '#059669' : '#DC2626',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {t.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
                  {t.type.replace('_', ' ')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {new Date(t.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{
              fontWeight: 800, fontSize: 14,
              color: t.amount > 0 ? '#059669' : '#DC2626',
            }}>
              {t.amount > 0 ? '+' : ''}₱{Math.abs(t.amount).toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
