import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Send, Smartphone,
  CheckCircle2, AlertCircle, Clock, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  fetchWallet, fetchWalletTxns, createTopupRequest, fetchMyTopups,
  buyLoad, fetchMyLoads, transferByEmail,
} from '../lib/xwallet';

const NETWORKS = ['Globe', 'TM', 'Smart', 'TNT', 'DITO'];
const QUICK_TOPUP = [100, 200, 500, 1000, 2000];

export default function Xwallet() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  const [balance, setBalance] = useState(0);
  const [txns, setTxns] = useState([]);
  const [topups, setTopups] = useState([]);
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('topup');

  // Top-up form
  const [topupAmount, setTopupAmount] = useState(100);

  // Transfer form
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);

  // Buy load form
  const [loadNetwork, setLoadNetwork] = useState('Globe');
  const [loadNumber, setLoadNumber] = useState('');
  const [loadAmount, setLoadAmount] = useState('');
  const [loadLoading, setLoadLoading] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);

  const refresh = async () => {
    if (!user) return;
    const [b, t, tp, ld] = await Promise.all([
      fetchWallet(user.id),
      fetchWalletTxns(user.id),
      fetchMyTopups(user.id),
      fetchMyLoads(user.id),
    ]);
    setBalance(b); setTxns(t); setTopups(tp); setLoads(ld); setLoading(false);
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

  const submitTransfer = async () => {
    setShowTransferConfirm(false);
    const amt = Number(transferAmount);
    if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
    if (amt > balance) { showToast('Insufficient balance'); return; }
    if (!transferEmail.includes('@')) { showToast('Enter a valid email address'); return; }
    setTransferLoading(true);
    const { data, error } = await transferByEmail(user.id, transferEmail, amt, `Transfer to ${transferEmail}`);
    setTransferLoading(false);
    if (error) { showToast(error.message); return; }
    if (data?.error) { showToast(data.error); return; }
    showToast(`Sent ₱${amt} to ${transferEmail}`);
    setTransferAmount(''); setTransferEmail('');
    refresh();
  };

  const submitBuyLoad = async () => {
    setShowLoadConfirm(false);
    const amt = Number(loadAmount);
    if (!amt || amt < 10) { showToast('Minimum load ₱10'); return; }
    if (!loadNumber.trim()) { showToast('Enter mobile number'); return; }
    setLoadLoading(true);
    const { error } = await buyLoad(user.id, loadNetwork, loadNumber.trim(), amt);
    setLoadLoading(false);
    if (error) { showToast(error.message || error); return; }
    showToast(`${loadNetwork} load ₱${amt} sent to ${loadNumber}`);
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

      {/* Balance card */}
      <div style={{
        padding: 24, marginBottom: 16, borderRadius: 18,
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
      }}>
        <Wallet size={80} style={{ position: 'absolute', top: -10, right: -20, opacity: 0.15 }} />
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' }}>Balance</div>
        <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginTop: 4 }}>₱{balance.toFixed(2)}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16, background: 'var(--card)', borderRadius: 14, padding: 6 }}>
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

      {/* TOP-UP TAB */}
      {activeTab === 'topup' && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Request top-up</h3>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
            <input type="number" value={topupAmount} onChange={e => setTopupAmount(Number(e.target.value) || 0)}
              style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Or pick a quick amount</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {QUICK_TOPUP.map(a => (
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
            <button onClick={() => {
              const amt = Number(topupAmount);
              if (!amt || amt < 10) { showToast('Minimum ₱10'); return; }
              nav(`/xwallet/topup?amount=${amt}`);
            }} className="btn-primary"
              style={{ width: '100%', padding: 12, fontSize: 13 }}>
              Continue to Pay
            </button>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
              Top-ups are reviewed by admin. You'll see it approved within 24 hours.
            </p>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Top-up history</h3>
          {topups.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No top-up requests yet.</p>
          ) : (
            topups.map(t => {
              const statusColor = t.status === 'approved' ? '#059669' : t.status === 'rejected' ? '#DC2626' : '#F59E0B';
              const StatusIcon = t.status === 'approved' ? CheckCircle2 : t.status === 'rejected' ? AlertCircle : Clock;
              return (
                <div key={t.id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>₱{Number(t.amount).toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{new Date(t.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: `${statusColor}15`, color: statusColor, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    <StatusIcon size={11} /> {t.status}
                  </div>
                </div>
              );
            })
          )}
        </>
      )}

      {/* TRANSFER TAB */}
      {activeTab === 'transfer' && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Send to another user</h3>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Recipient email</label>
          <input value={transferEmail} onChange={e => setTransferEmail(e.target.value)}
            placeholder="friend@example.com" type="email"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
          <input type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)}
            placeholder="0.00"
            style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />
          <button onClick={() => {
            const amt = Number(transferAmount);
            if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
            if (amt > balance) { showToast('Insufficient balance'); return; }
            if (!transferEmail.includes('@')) { showToast('Enter a valid email'); return; }
            setShowTransferConfirm(true);
          }} disabled={transferLoading} className="btn-primary"
            style={{ width: '100%', padding: 12, fontSize: 13 }}>
            {transferLoading ? 'Sending…' : 'Send money'}
          </button>
        </div>
      )}

      {/* BUY LOAD TAB */}
      {activeTab === 'load' && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Buy prepaid load</h3>

            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Network</label>
            <select value={loadNetwork} onChange={e => setLoadNetwork(e.target.value)}
              style={{
                width: '100%', padding: '12px 40px 12px 14px', marginTop: 6, marginBottom: 12,
                borderRadius: 10, border: '1px solid var(--border)',
                fontSize: 14, fontWeight: 600,
                background: 'var(--card)', color: 'var(--text)',
                appearance: 'none', WebkitAppearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2.5\'><polyline points=\'6 9 12 15 18 9\'/></svg>")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '14px',
              }}>
              {NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Mobile number</label>
            <input value={loadNumber} onChange={e => setLoadNumber(e.target.value)}
              placeholder="09XX XXX XXXX" type="tel"
              style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />

            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Amount (₱)</label>
            <input type="number" value={loadAmount} onChange={e => setLoadAmount(e.target.value)}
              placeholder="10 minimum"
              style={{ width: '100%', padding: 12, marginTop: 6, marginBottom: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 14 }} />

            <button onClick={() => {
              const amt = Number(loadAmount);
              if (!amt || amt < 10) { showToast('Minimum ₱10'); return; }
              if (!loadNumber.trim()) { showToast('Enter mobile number'); return; }
              if (amt > balance) { showToast('Insufficient balance'); return; }
              setShowLoadConfirm(true);
            }} disabled={loadLoading} className="btn-primary"
              style={{ width: '100%', padding: 12, fontSize: 13 }}>
              {loadLoading ? 'Processing…' : 'Buy Load'}
            </button>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Load history</h3>
          {loads.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No loads yet.</p>
          ) : (
            loads.map(l => (
              <div key={l.id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{l.network} · {l.mobile}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{new Date(l.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#DC2626' }}>-₱{Number(l.amount).toFixed(2)}</div>
              </div>
            ))
          )}
        </>
      )}

      {/* TRANSACTIONS */}
      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '20px 0 10px' }}>All transactions</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading…</p>
      ) : txns.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>No transactions yet.</p>
      ) : (
        txns.map(t => (
          <div key={t.id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>{t.type.replace('_', ' ')}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{new Date(t.created_at).toLocaleString()}</div>
              </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: t.amount > 0 ? '#059669' : '#DC2626' }}>
              {t.amount > 0 ? '+' : ''}₱{Math.abs(t.amount).toFixed(2)}
            </div>
          </div>
        ))
      )}

      {/* TRANSFER CONFIRM */}
      {showTransferConfirm && (
        <ConfirmModal
          title="Confirm transfer"
          message={`Send ₱${Number(transferAmount).toFixed(2)} to ${transferEmail}?`}
          onCancel={() => setShowTransferConfirm(false)}
          onConfirm={submitTransfer}
          confirming={transferLoading}
        />
      )}

      {/* LOAD CONFIRM */}
      {showLoadConfirm && (
        <ConfirmModal
          title="Confirm load purchase"
          message={`${loadNetwork} ₱${Number(loadAmount).toFixed(2)} to ${loadNumber}?`}
          onCancel={() => setShowLoadConfirm(false)}
          onConfirm={submitBuyLoad}
          confirming={loadLoading}
        />
      )}
    </div>
  );
}

function ConfirmModal({ title, message, onCancel, onConfirm, confirming }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--bg, #fff)', padding: 20, borderRadius: '20px 20px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, padding: 12 }}>Cancel</button>
          <button onClick={onConfirm} disabled={confirming} className="btn-primary" style={{ flex: 1, padding: 12 }}>
            {confirming ? 'Processing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
