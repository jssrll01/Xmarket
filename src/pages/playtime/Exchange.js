import React, { useState } from 'react';
import { exchange, fmt, peso } from '../../lib/playtime';
import { useToast } from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import { usePlay, PlayHeader, Balances, Notice } from './common';

export default function Exchange() {
  const { status, setStatus, error, reload } = usePlay();
  const { show } = useToast();
  const [pick, setPick] = useState(null);
  const [msg, setMsg] = useState('');

  const cfg = status ? status.config.exchange : null;
  const phpOf = (p) => p / cfg.rate;

  const reasonFor = (p) => {
    if (p < cfg.min_points) return `Minimum exchange is ${fmt(cfg.min_points)} points.`;
    if (status.loyalty_points < p) return `You need ${fmt(p)} Loyalty Points.`;
    if (Number(status.exchanged_today_php) + phpOf(p) > cfg.max_daily_php) return 'Daily exchange limit reached.';
    return '';
  };

  const confirm = async () => {
    const p = pick; if (!p) return;
    const res = await exchange(p);
    setPick(null);
    if (!res.ok) { setMsg(res.message || 'Exchange failed.'); reload(); return; }
    setMsg('');
    setStatus(s => s && { ...s, loyalty_points: res.balance, xwallet_balance: res.xwallet_balance, exchanged_today_php: Number(s.exchanged_today_php) + Number(res.wallet_credit) });
    show(`Exchanged ${fmt(p)} Loyalty Points for ${peso(res.wallet_credit)}`);
    reload();
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <PlayHeader title="Coin Exchange" subtitle="Convert Loyalty Points into XWallet balance." />
      <Balances status={status} />
      {error && <Notice>{error}</Notice>}
      {msg && <Notice>{msg}</Notice>}
      {status && (
        <>
          <div className="card" style={{ padding: 14, margin: '18px 0 14px' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Exchanged today: {peso(status.exchanged_today_php)} <span style={{ color: 'var(--muted)', fontWeight: 600 }}>· No daily limit</span></div>
          </div>
          {cfg.denominations.map(p => {
            const reason = reasonFor(p); const off = !!reason;
            return (
              <div key={p} className="card" style={{ padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{fmt(p)} Loyalty Points</div>
                  <div style={{ fontSize: 13, color: '#059669', fontWeight: 800, marginTop: 2 }}>= {peso(phpOf(p))} XWallet</div>
                  {off && <div style={{ fontSize: 11.5, color: '#92400E', marginTop: 4 }}>{reason}</div>}
                </div>
                <button disabled={off} onClick={() => setPick(p)} className={off ? '' : 'btn-primary'}
                  style={{ padding: '10px 16px', borderRadius: 12, fontWeight: 800, fontSize: 13, border: 'none', background: off ? '#CBD5E1' : undefined, color: off ? '#fff' : undefined, cursor: off ? 'not-allowed' : 'pointer' }}>
                  Exchange
                </button>
              </div>
            );
          })}
        </>
      )}
      <ConfirmDialog
        open={!!pick}
        title="Confirm exchange"
        message={pick && cfg ? `Exchange ${fmt(pick)} Loyalty Points for ${peso(phpOf(pick))} XWallet balance?` : ''}
        confirmLabel="Confirm Exchange"
        onCancel={() => setPick(null)}
        onConfirm={confirm}
      />
    </div>
  );
}
