import React from 'react';
import { Zap } from 'lucide-react';
import VipBadge from './VipBadge';
import { usePerkFlags, useMyPerks } from '../lib/perks';
import '../vip.css';

const day = (d) => new Date(d).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' });

export function VerifiedBadge({ title = 'Verified', size = 15 }) {
  return (
    <span className="vf-badge" title={title} aria-label={title}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#2563EB" />
        <path d="m7.8 12.4 3 3 5.6-6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// Name + VIP effect/badge + verified badge.
//   verified: show the normal-user verified badge (global chat, DMs, comments)
//   creator:  show the creator verified badge (posts, creator pages, comments), never use it in DMs/chat
export function NameLabel({ username, prefix = '@', fallback = '', vip, verified, creator, showVip = true }) {
  const f = usePerkFlags(username);
  const isVip = Boolean(vip || (f && f.vip));
  const badge = f && ((verified && f.verified) || (creator && f.creator_verified));
  const text = username ? prefix + username : fallback;
  return (
    <>
      <span className={isVip ? 'vip-name' : undefined}>{text}</span>
      {showVip && isVip && <VipBadge active />}
      {badge && <VerifiedBadge title={creator && f.creator_verified && !(verified && f.verified) ? 'Verified creator' : 'Verified'} />}
    </>
  );
}

// "Cashback x2" tag for product cards. The parent must be position: relative.
export function BoosterTag() {
  const p = useMyPerks();
  if (!p || !p.booster || !p.booster.active) return null;
  return <span className="booster-tag" title="Cashback Booster active"><Zap size={11} />Cashback ×2</span>;
}

export function PerkStatus() {
  const p = useMyPerks();
  const rows = [['verified', 'Verified badge'], ['creator_verified', 'Creator verified badge'], ['booster', 'Cashback booster ×2']]
    .filter(([k]) => p && p[k] && p[k].active);
  if (!rows.length) return null;
  return (
    <div className="card" style={{ padding: 12, marginBottom: 12, fontSize: 13, fontWeight: 700, display: 'grid', gap: 4 }}>
      {rows.map(([k, l]) => <div key={k}>{l} active until {day(p[k].expires_at)}</div>)}
    </div>
  );
}
