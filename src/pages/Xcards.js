import { WalletSkeleton } from '../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchWallet } from '../lib/xwallet';
import { purchaseXcard, fetchMyXcards } from '../lib/xcards';

const DENOMS = [100, 200, 500, 1000];
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CSS = `
.xc2{padding:16px 16px 70px;max-width:560px;margin:0 auto}
.xc2-head{display:flex;align-items:center;gap:14px;margin-bottom:22px}
.xc2-head h1{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.xc2-head p{font-size:12.5px;color:#64748B;margin-top:3px}
.xc2-card{position:relative;overflow:hidden;border-radius:16px;padding:20px;height:188px;display:flex;flex-direction:column;justify-content:space-between;color:#F8FAFC;background:#0B1220;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.035) 0 1px,transparent 1px 9px);box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 18px 30px -22px rgba(11,18,32,.7)}
.xc2-row{display:flex;justify-content:space-between;align-items:center}
.xc2-brand{font-size:12px;font-weight:700;letter-spacing:.22em}
.xc2-tag{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#94A3B8}
.xc2-chip{width:34px;height:24px;border-radius:5px;border:1px solid rgba(255,255,255,.28);background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.04))}
.xc2-amt{font-size:38px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1}
.xc2-foot{display:flex;justify-content:space-between;font-size:11px;color:#94A3B8;letter-spacing:.04em}
.xc2-sec{margin-top:26px}
.xc2-lab{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:10px}
.xc2-bal{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;margin-bottom:18px}
.xc2-bal span{font-size:13px;color:#475569}.xc2-bal b{font-size:18px;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.xc2-seg{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #D7DCE3;border-radius:12px;overflow:hidden;margin-bottom:14px}
.xc2-seg button{padding:13px 0;font-size:14px;font-weight:600;background:#fff;color:#0F172A;border-right:1px solid #D7DCE3;font-variant-numeric:tabular-nums}
.xc2-seg button:last-child{border-right:0}
.xc2-seg button.on{background:#0B1220;color:#fff}
.xc2-buy{width:100%;padding:15px;border-radius:12px;background:#0B1220;color:#fff;font-size:14.5px;font-weight:600;letter-spacing:.01em}
.xc2-buy:disabled{opacity:.4}
.xc2-warn{font-size:12.5px;color:#92400E;margin-bottom:12px}.xc2-warn button{font-weight:700;color:#0B1220;text-decoration:underline;margin-left:6px}
.xc2-note{font-size:11.5px;color:#94A3B8;text-align:center;margin-top:10px}
.xc2-stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #E5E7EB;border-radius:12px;background:#fff}
.xc2-stats div{padding:14px 12px;border-right:1px solid #E5E7EB}.xc2-stats div:last-child{border-right:0}
.xc2-stats b{display:block;font-size:19px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.xc2-stats span{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#64748B}
.xc2-list{border:1px solid #E5E7EB;border-radius:12px;background:#fff}
.xc2-item{display:flex;align-items:center;gap:12px;padding:14px;border-bottom:1px solid #EEF1F5}.xc2-item:last-child{border-bottom:0}
.xc2-code{font-family:ui-monospace,Menlo,monospace;font-size:13.5px;font-weight:600;letter-spacing:.08em}
.xc2-item.used{opacity:.5}.xc2-item.used .xc2-code{text-decoration:line-through}
.xc2-meta{font-size:11.5px;color:#64748B;margin-top:3px}
.xc2-val{margin-left:auto;text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
.xc2-copy{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:7px 11px;border:1px solid #D7DCE3;border-radius:9px;background:#fff;margin-top:6px}
.xc2-empty{padding:30px 16px;text-align:center;color:#64748B;font-size:13px}
@keyframes xcUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes xcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes xcSheen{0%,55%{transform:translateX(-120%)}100%{transform:translateX(420%)}}
@keyframes xcPop{0%{transform:scale(.94)}60%{transform:scale(1.03)}100%{transform:scale(1)}}
.xc2 .xc2-card{color:#1D4ED8;background:linear-gradient(135deg,#FFFFFF 0%,#EFF6FF 55%,#DBEAFE 100%);border:1px solid #BFDBFE;box-shadow:0 18px 30px -22px rgba(37,99,235,.55);animation:xcUp .5s cubic-bezier(.2,.8,.2,1) both}
.xc2 .xc2-card::after{content:"";position:absolute;top:0;left:0;width:30%;height:100%;background:linear-gradient(100deg,transparent,rgba(37,99,235,.14),transparent);animation:xcSheen 5s ease-in-out infinite;pointer-events:none}
.xc2 .xc2-brand{color:#1E3A8A}
.xc2 .xc2-tag,.xc2 .xc2-foot{color:#3B82F6}
.xc2 .xc2-amt{color:#1D4ED8}
.xc2 .xc2-chip{border:1px solid #BFDBFE;background:linear-gradient(135deg,#FFFFFF,#DBEAFE)}
.xc2 .xc2-seg button{transition:background .2s,color .2s,transform .2s}
.xc2 .xc2-seg button:active{transform:scale(.96)}
.xc2 .xc2-seg button.on{background:#2563EB;color:#fff;animation:xcPop .3s ease both}
.xc2 .xc2-buy{background:linear-gradient(135deg,#3B82F6,#2563EB);box-shadow:0 10px 20px -12px rgba(37,99,235,.75);transition:transform .15s,box-shadow .2s,opacity .2s}
.xc2 .xc2-buy:not(:disabled):active{transform:scale(.98)}
.xc2 .xc2-buy:disabled{opacity:.55}
.xc2 .xc2-warn button{color:#2563EB}
.xc2 .xc2-stats>*{animation:xcUp .5s both}
.xc2 .xc2-stats>*:nth-child(2){animation-delay:.08s}
.xc2 .xc2-stats>*:nth-child(3){animation-delay:.16s}
.xc2 .xc2-empty svg{animation:xcFloat 3.2s ease-in-out infinite;color:#3B82F6}
.xc2 .xc2-item{animation:xcUp .45s both}
.xc2 .xc2-steps li{animation:xcUp .5s both}
.xc2 .xc2-steps li:nth-child(2){animation-delay:.07s}
.xc2 .xc2-steps li:nth-child(3){animation-delay:.14s}
.xc2 .xc2-steps li:nth-child(4){animation-delay:.21s}
@media(prefers-reduced-motion:reduce){.xc2 *,.xc2 .xc2-card::after{animation:none!important}}.xc2-empty b{display:block;color:#0F172A;font-size:14px;margin:8px 0 3px}
.xc2-steps{list-style:none;border-top:1px solid #E5E7EB}
.xc2-steps li{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #E5E7EB}
.xc2-steps i{font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#94A3B8;width:18px;padding-top:2px}
.xc2-steps b{display:block;font-size:13.5px}.xc2-steps span{font-size:12.5px;color:#64748B;line-height:1.45}
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
    <div className="page-enter xc2">
      <style>{CSS}</style>
      <header className="xc2-head">
        <button onClick={() => nav(-1)} className="icon-btn" aria-label="Back"><ArrowLeft size={20} /></button>
        <div><h1>Xcards</h1><p>Digital gift cards. Redeem once at checkout.</p></div>
      </header>

      <div className="xc2-card">
        <div className="xc2-row"><span className="xc2-brand">XMARKET</span><span className="xc2-tag">Gift card</span></div>
        <div className="xc2-chip" />
        <div>
          <div className="xc2-amt">₱{selected.toLocaleString()}</div>
          <div className="xc2-foot" style={{ marginTop: 10 }}><span>One-time use</span><span>No expiry</span></div>
        </div>
      </div>

      <div className="xc2-sec">
        <div className="xc2-bal"><span>Xwallet balance</span><b>{peso(balance)}</b></div>
        <div className="xc2-lab">Amount</div>
        <div className="xc2-seg">
          {DENOMS.map(d => <button key={d} className={selected === d ? 'on' : ''} onClick={() => setSelected(d)}>₱{d.toLocaleString()}</button>)}
        </div>
        {insufficient && <div className="xc2-warn">You need {peso(selected - balance)} more.<button onClick={() => nav('/xwallet/topup')}>Top up</button></div>}
        <button className="xc2-buy" onClick={buy} disabled={buying || insufficient}>{buying ? 'Purchasing…' : `Buy ₱${selected.toLocaleString()} Xcard`}</button>
        <div className="xc2-note">Deducted from your Xwallet immediately.</div>
      </div>

      <div className="xc2-sec">
        <div className="xc2-stats">
          <div><b>{available.length}</b><span>Available</span></div>
          <div><b>{redeemed}</b><span>Redeemed</span></div>
          <div><b>₱{availableValue.toLocaleString()}</b><span>Value left</span></div>
        </div>
      </div>

      <div className="xc2-sec">
        <div className="xc2-lab">My Xcards</div>
        {loading ? <WalletSkeleton /> : cards.length === 0 ? (
          <div className="xc2-list xc2-empty"><Ticket size={26} color="#94A3B8" /><b>No Xcards yet</b>Buy one above and it will appear here.</div>
        ) : (
          <div className="xc2-list">
            {cards.map(c => {
              const used = !!c.redeemed_by;
              const d = used ? c.redeemed_at : c.purchased_at;
              return (
                <div key={c.id} className={'xc2-item' + (used ? ' used' : '')}>
                  <div>
                    <div className="xc2-code">{c.code}</div>
                    <div className="xc2-meta">{used ? 'Redeemed' : 'Purchased'} {d ? new Date(d).toLocaleDateString() : ''}</div>
                  </div>
                  <div className="xc2-val">
                    <div>₱{Number(c.value).toLocaleString()}</div>
                    {!used && <button className="xc2-copy" onClick={() => copyCode(c.code)}>{copied === c.code ? <Check size={13} /> : <Copy size={13} />}{copied === c.code ? 'Copied' : 'Copy'}</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="xc2-sec">
        <div className="xc2-lab">How it works</div>
        <ol className="xc2-steps">
          {steps.map(([t, d], i) => <li key={t}><i>0{i + 1}</i><div><b>{t}</b><span>{d}</span></div></li>)}
        </ol>
      </div>
    </div>
  );
}
