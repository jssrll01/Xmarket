import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Truck, Headset, Sparkles, MessageCircle, Wallet, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchWallet } from '../lib/xwallet';
import { useVip, purchaseVip, fetchVipHistory, VIP_PRICE, VIP_DAYS } from '../lib/vip';
import VipBadge from '../components/VipBadge';
import '../vip.css';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const PERKS = [
  { icon: Truck, title: 'Unlimited Free Shipping', desc: 'Shop more without worrying about shipping fees.', live: true },
  { icon: Headset, title: 'Priority Customer Support', desc: 'Get faster assistance whenever you need help.' },
  { icon: Sparkles, title: 'Priority Access to Customer Campaigns', desc: 'Get early access to exclusive promotions and campaigns.' },
  { icon: Crown, title: 'Exclusive VIP Profile Badge', desc: 'Show your VIP status throughout XMARKET.', live: true },
  { icon: MessageCircle, title: 'Exclusive VIP Chat Bubbles', desc: 'Stand out with personalized VIP messaging.', live: true },
];

function Perks({ owned }) {
  return (
    <div className="vip-panel">
      <div className="vip-sec">{owned ? 'Your privileges' : 'Membership privileges'}</div>
      {PERKS.map(({ icon: Icon, title, desc, live }) => (
        <div className="vip-perk" key={title}>
          <span className="vip-perk-ic"><Icon size={18} /></span>
          <div className="vip-perk-tx"><b>{title}</b><span>{desc}</span></div>
          {owned && <span className={'vip-tag' + (live ? ' on' : '')}>{live ? 'Active' : 'Included'}</span>}
        </div>
      ))}
    </div>
  );
}

function Preview() {
  return (
    <div className="vip-panel">
      <div className="vip-sec">How you will stand out</div>
      <div className="vip-prev-name">Your Name<VipBadge active /></div>
      <div className="gc-row mine vip-prev-row">
        <div className="gc-col">
          <div className="gc-bubble vip">
            <span className="gc-text">This is your VIP chat bubble</span>
            <span className="gc-time">now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Purchase({ user, status, onJoined }) {
  const nav = useNavigate();
  const [balance, setBalance] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let a = true;
    fetchWallet(user.id).then((b) => { if (a) setBalance(b); });
    return () => { a = false; };
  }, [user.id]);

  const short = balance !== null && balance < VIP_PRICE;

  const buy = async () => {
    if (busy) return;
    setBusy(true); setErr('');
    const { error } = await purchaseVip();
    if (error) { setBusy(false); setErr(error.message || 'Purchase failed. Try again.'); setConfirm(false); return; }
    onJoined();
  };

  return (
    <>
      <h2 className="vip-title">VIP Membership</h2>
      <p className="vip-sub">Become a VIP and unlock more on XMARKET.</p>

      {status?.expires_at && (
        <div className="vip-warn" style={{ marginTop: 0, marginBottom: 12 }}>
          <span>Your VIP expired on {fmtDate(status.expires_at)}. Renew to get your privileges back.</span>
        </div>
      )}

      <div className="vip-hero">
        <div className="vip-hero-ic"><Crown size={30} /></div>
        <h2>XMARKET VIP</h2>
        <p>Premium perks for the way you shop.</p>
        <div className="vip-price"><span>₱</span>{VIP_PRICE}<small> / {VIP_DAYS} days</small></div>
      </div>

      <Perks />
      <Preview />

      <div className="vip-panel">
        <div className="vip-sec">How it works</div>
        <div className="vip-steps">
          <div className="vip-step"><i>1</i><span>Pay {peso(VIP_PRICE)} using your Xwallet balance.</span></div>
          <div className="vip-step"><i>2</i><span>Your VIP privileges activate instantly.</span></div>
          <div className="vip-step"><i>3</i><span>Membership lasts {VIP_DAYS} days. After that, purchase again to continue.</span></div>
        </div>
      </div>

      <div className="vip-panel">
        <div className="vip-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={16} /> Xwallet balance</span>
          <span>{balance === null ? '…' : peso(balance)}</span>
        </div>
        {short && (
          <div className="vip-warn">
            <span>Not enough balance. You need {peso(VIP_PRICE - balance)} more.</span>
            <button onClick={() => nav('/xwallet/topup')}>Top up</button>
          </div>
        )}
      </div>

      {err && <div className="vip-err">{err}</div>}
      <button className="vip-btn" disabled={short || balance === null} onClick={() => setConfirm(true)}>
        Get VIP · {peso(VIP_PRICE)}
      </button>
      <div className="vip-note"><ShieldCheck size={12} style={{ verticalAlign: -2 }} /> Secure payment from your Xwallet</div>

      {confirm && (
        <div className="vip-ov" onClick={() => !busy && setConfirm(false)}>
          <div className="vip-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm VIP purchase</h3>
            <p>{peso(VIP_PRICE)} will be deducted from your Xwallet for {VIP_DAYS} days of VIP.</p>
            <div className="vip-row"><span>Current balance</span><span>{peso(balance)}</span></div>
            <div className="vip-row"><span>VIP Membership</span><span>-{peso(VIP_PRICE)}</span></div>
            <div className="vip-row"><span>Balance after</span><span>{peso((balance || 0) - VIP_PRICE)}</span></div>
            <button className="vip-btn" disabled={busy} onClick={buy}>{busy ? 'Processing…' : 'Pay & activate VIP'}</button>
            <button className="vip-btn ghost" style={{ marginTop: 8 }} disabled={busy} onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

function useCountdown(expiresAt, onDone) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, new Date(expiresAt).getTime() - now);
  useEffect(() => { if (ms === 0) onDone(); }, [ms, onDone]);
  const sec = Math.floor(ms / 1000);
  return { ms, d: Math.floor(sec / 86400), h: Math.floor((sec % 86400) / 3600), m: Math.floor((sec % 3600) / 60), s: sec % 60 };
}

function Dashboard({ user, profile, status, welcome, refresh }) {
  const nav = useNavigate();
  const [history, setHistory] = useState(null);
  const cd = useCountdown(status.expires_at, refresh);

  useEffect(() => {
    let a = true;
    fetchVipHistory(user.id).then((h) => { if (a) setHistory(h); });
    return () => { a = false; };
  }, [user.id, status.expires_at]);

  const meta = user.user_metadata || {};
  const first = profile?.first_name || meta.first_name || '';
  const last = profile?.last_name || meta.last_name || '';
  const fullName = (first + ' ' + last).trim() || user.email?.split('@')[0] || 'XMARKET Member';
  const username = profile?.username || user.email?.split('@')[0] || 'member';
  const accId = 'XM-' + user.id.replace(/-/g, '').slice(0, 10).toUpperCase();

  const total = Math.max(1, new Date(status.expires_at) - new Date(status.started_at || Date.now()));
  const pct = Math.max(0, Math.min(100, (cd.ms / total) * 100));
  const pad = (n) => String(n).padStart(2, '0');


  return (
    <>
      <h2 className="vip-title">VIP Dashboard <VipBadge active /></h2>
      <p className="vip-sub">Your membership is active. Enjoy your privileges.</p>
      {welcome && <div className="vip-welcome">Welcome to XMARKET VIP! Your privileges are now active.</div>}

      <div className="vip-card">
        <Crown size={170} className="vip-card-wm" />
        <div className="vip-card-top">
          <div className="vip-card-brand"><Crown size={18} /> XMARKET</div>
          <span className="vip-card-chip">VIP</span>
        </div>
        <div>
          <div className="vip-card-label">XMARKET VIP MEMBER</div>
          <div className="vip-card-name">{fullName}</div>
          <div className="vip-card-user">@{username}</div>
        </div>
        <div className="vip-card-bottom">
          <div>
            <div className="k">ACCOUNT ID</div>
            <div className="v">{accId}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="k">VALID THRU</div>
            <div className="v">{fmtDate(status.expires_at)}</div>
          </div>
        </div>
      </div>

      <div className="vip-stats">
        <div className="vip-stat"><b>{status.member_since ? fmtDate(status.member_since) : '-'}</b><span>Member since</span></div>
        <div className="vip-stat"><b>{status.purchases || 1}</b><span>Memberships purchased</span></div>
      </div>

      <div className="vip-panel">
        <div className="vip-sec"><Clock size={12} style={{ verticalAlign: -1 }} /> Time remaining</div>
        <div className="vip-tiles">
          <div className="vip-tile"><b>{cd.d}</b><span>Days</span></div>
          <div className="vip-tile"><b>{pad(cd.h)}</b><span>Hours</span></div>
          <div className="vip-tile"><b>{pad(cd.m)}</b><span>Mins</span></div>
          <div className="vip-tile"><b>{pad(cd.s)}</b><span>Secs</span></div>
        </div>
        <div className="vip-bar"><i style={{ width: pct + '%' }} /></div>
        <div className="vip-bar-cap"><span>Started {fmtDate(status.started_at)}</span><span>Ends {fmtDate(status.expires_at)}</span></div>
      </div>

      <Perks owned />

      <div className="vip-panel">
        <div className="vip-sec">Subscription history</div>
        {history === null && <div className="vip-note">Loading…</div>}
        {history && history.length === 0 && <div className="vip-note">No purchases yet.</div>}
        {history && history.map((h) => {
          const live = new Date(h.expires_at) > new Date();
          return (
            <div className="vip-hist" key={h.id}>
              <span className="vip-hist-ic"><Crown size={16} /></span>
              <div className="vip-hist-tx">
                <b>VIP Membership · {VIP_DAYS} days</b>
                <span>{fmtDate(h.starts_at)} – {fmtDate(h.expires_at)}</span>
              </div>
              <div className="vip-hist-r"><b>{peso(h.amount)}</b><em className={live ? 'on' : ''}>{live ? 'Active' : 'Expired'}</em></div>
            </div>
          );
        })}
      </div>

      <div className="vip-links">
        <button className="vip-btn ghost" onClick={() => nav('/')}>Start shopping</button>
        <button className="vip-btn ghost" onClick={() => nav('/customer-service')}>Priority support</button>
      </div>
      <div className="vip-note">When your membership ends, purchase again to keep your VIP privileges.</div>
    </>
  );
}

export default function Vip() {
  const nav = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { isVip, status, loading, refresh } = useVip();
  const [welcome, setWelcome] = useState(false);

  let body;
  if (authLoading || (user && loading)) {
    body = <div className="vip-center">Loading…</div>;
  } else if (!user) {
    body = (
      <div className="vip-center">
        <p>Sign in to get XMARKET VIP.</p>
        <button className="btn-primary" onClick={() => nav('/signin')} style={{ padding: '10px 24px' }}>Sign in</button>
      </div>
    );
  } else if (isVip) {
    body = <Dashboard user={user} profile={profile} status={status} welcome={welcome} refresh={refresh} />;
  } else {
    body = <Purchase user={user} status={status} onJoined={() => setWelcome(true)} />;
  }

  return <div className="page-enter vip-page">{body}</div>;
}
