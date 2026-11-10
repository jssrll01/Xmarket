import { WalletSkeleton } from '../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchWallet } from '../lib/xwallet';
import { purchaseXcard, fetchMyXcards } from '../lib/xcards';
import TopupButton from '../components/TopupButton';

const DENOMS = [100, 200, 500, 1000];
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CSS = `
.xcn{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.xcn-head{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.xcn-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin:0}
.xcn-head p{font-size:12.5px;color:var(--muted);margin:3px 0 0}
.xcn-card{border-radius:22px;padding:20px;height:190px;display:flex;flex-direction:column;justify-content:space-between;background:var(--card);box-shadow:var(--raised);color:var(--text)}
.xcn-row{display:flex;justify-content:space-between;align-items:center}
.xcn-brand{font-size:12px;font-weight:700;letter-spacing:.22em}
.xcn-tag{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.xcn-chip{width:36px;height:26px;border-radius:7px;background:var(--bg);box-shadow:var(--inset)}
.xcn-amt{font-size:38px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1;color:var(--primary)}
.xcn-foot{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);letter-spacing:.04em;margin-top:10px}
.xcn-sec{margin-top:24px}
.xcn-lab{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.xcn-bal{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-radius:14px;background:var(--bg);box-shadow:var(--inset);margin-bottom:18px}
.xcn-bal span{font-size:13px;color:var(--muted)}.xcn-bal b{font-size:18px;font-variant-numeric:tabular-nums;color:var(--text)}
.xcn-seg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:5px;border-radius:16px;background:var(--bg);box-shadow:var(--inset);margin-bottom:14px}
.xcn-seg button{border:0;padding:12px 0;border-radius:11px;font-size:14px;font-weight:600;background:transparent;color:var(--text);font-variant-numeric:tabular-nums}
.xcn-seg button.on{background:var(--card);color:var(--primary);box-shadow:var(--raised-sm)}
.xcn-buy{width:100%;border:0;padding:15px;border-radius:14px;background:var(--primary);color:#fff;font-size:14.5px;font-weight:600;box-shadow:0 6px 14px -6px rgba(37,99,235,.5)}
.xcn-buy:disabled{opacity:.5}
.xcn-warn{font-size:12.5px;color:#92400E;margin-bottom:12px}.xcn-warn button{border:0;background:none;font-weight:700;color:var(--primary);text-decoration:underline;margin-left:6px}
.xcn-note{font-size:11.5px;color:var(--muted);text-align:center;margin-top:10px}
.xcn-stats{display:grid;grid-template-columns:repeat(3,1fr);border-radius:16px;background:var(--card);box-shadow:var(--raised-sm)}
.xcn-stats div{padding:14px 12px;border-right:1px solid var(--border)}.xcn-stats div:last-child{border-right:0}
.xcn-stats b{display:block;font-size:19px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;color:var(--text)}
.xcn-stats span{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.xcn-list{border-radius:16px;background:var(--card);box-shadow:var(--raised-sm)}
.xcn-item{display:flex;align-items:center;gap:12px;padding:14px;border-bottom:1px solid var(--border)}.xcn-item:last-child{border-bottom:0}
.xcn-code{font-family:ui-monospace,Menlo,monospace;font-size:13.5px;font-weight:600;letter-spacing:.08em;color:var(--text)}
.xcn-item.used{opacity:.5}.xcn-item.used .xcn-code{text-decoration:line-through}
.xcn-meta{font-size:11.5px;color:var(--muted);margin-top:3px}
.xcn-val{margin-left:auto;text-align:right;font-weight:700;font-variant-numeric:tabular-nums;color:var(--text)}
.xcn-copy{display:flex;align-items:center;gap:5px;margin:6px 0 0 auto;border:0;font-size:12px;font-weight:600;padding:7px 12px;border-radius:10px;background:var(--card);color:var(--text);box-shadow:var(--raised-sm)}
.xcn-copy:active{box-shadow:var(--inset)}
.xcn-empty{padding:30px 16px;text-align:center;color:var(--muted);font-size:13px}
.xcn-empty b{display:block;color:var(--text);font-size:14px;margin:8px 0 3px}
.xcn-steps{list-style:none;border-top:1px solid var(--border)}
.xcn-steps li{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)}
.xcn-steps i{font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted);width:18px;padding-top:2px}
.xcn-steps b{display:block;font-size:13.5px;color:var(--text)}.xcn-steps span{font-size:12.5px;color:var(--muted);line-height:1.45}
`;

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
    try { await navigator.clipboard.writeText(code); setCopied(code); showToast('Code copied'); setTimeout(() => setCopied(null), 2000); }
    catch { showToast('Copy failed'); }
  };
  const steps = [
    ['Choose an amount', 'Buy a denomination with your Xwallet balance.'],
    ['Get your code', 'A unique code starting with XC appears under My Xcards.'],
    ['Share or keep it', 'Send the code to any XMARKET account, or use it yourself.'],
    ['Redeem at checkout', 'Enter the code in the Xcard field. Each code works once.'],
  ];

  return (
    <div className="page-enter xcn">
      <style>{CSS}</style>
      <header className="xcn-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Xcards</h1><p>Digital gift cards. Redeem once at checkout.</p></div>
      </header>

      <div className="xcn-card">
        <div className="xcn-row"><span className="xcn-brand">XMARKET</span><span className="xcn-tag">Gift card</span></div>
        <div className="xcn-chip" />
        <div>
          <div className="xcn-amt">₱{selected.toLocaleString()}</div>
          <div className="xcn-foot"><span>One-time use</span><span>No expiry</span></div>
        </div>
      </div>

      <div className="xcn-sec">
        <div className="xcn-bal"><span>Xwallet balance</span><span style={{ display: 'inline-flex', alignItems: 'center' }}><b>{peso(balance)}</b><TopupButton /></span></div>
        <div className="xcn-lab">Amount</div>
        <div className="xcn-seg">
          {DENOMS.map(d => <button key={d} className={selected === d ? 'on' : ''} onClick={() => setSelected(d)}>₱{d.toLocaleString()}</button>)}
        </div>
        {insufficient && <div className="xcn-warn">You need {peso(selected - balance)} more.<button onClick={() => nav('/xwallet/topup')}>Top up</button></div>}
        <button className="xcn-buy" aria-busy={buying} onClick={buy} disabled={buying || insufficient}>{buying ? 'Purchasing…' : `Buy ₱${selected.toLocaleString()} Xcard`}</button>
        <div className="xcn-note">Deducted from your Xwallet immediately.</div>
      </div>

      <div className="xcn-sec">
        <div className="xcn-stats">
          <div><b>{available.length}</b><span>Available</span></div>
          <div><b>{redeemed}</b><span>Redeemed</span></div>
          <div><b>₱{availableValue.toLocaleString()}</b><span>Value left</span></div>
        </div>
      </div>

      <div className="xcn-sec">
        <div className="xcn-lab">My Xcards</div>
        {loading ? <WalletSkeleton /> : cards.length === 0 ? (
          <div className="xcn-list xcn-empty"><Ticket size={26} color="#94A3B8" /><b>No Xcards yet</b>Buy one above and it will appear here.</div>
        ) : (
          <div className="xcn-list">
            {cards.map(c => {
              const used = !!c.redeemed_by;
              const d = used ? c.redeemed_at : c.purchased_at;
              return (
                <div key={c.id} className={'xcn-item' + (used ? ' used' : '')}>
                  <div>
                    <div className="xcn-code">{c.code}</div>
                    <div className="xcn-meta">{used ? 'Redeemed' : 'Purchased'} {d ? new Date(d).toLocaleDateString() : ''}</div>
                  </div>
                  <div className="xcn-val">
                    <div>₱{Number(c.value).toLocaleString()}</div>
                    {!used && <button className="xcn-copy" onClick={() => copyCode(c.code)}>{copied === c.code ? <Check size={13} /> : <Copy size={13} />}{copied === c.code ? 'Copied' : 'Copy'}</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="xcn-sec">
        <div className="xcn-lab">How it works</div>
        <ol className="xcn-steps">
          {steps.map(([t, d], i) => <li key={t}><i>0{i + 1}</i><div><b>{t}</b><span>{d}</span></div></li>)}
        </ol>
      </div>
    </div>
  );
}
