import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Trophy, Gift, History, ChevronRight,
  Star, Coins,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

// Tiers and how many points each requires
const TIERS = [
  { id: 'Starter', min: 0,     color: '#94A3B8', Icon: Star },
  { id: 'Silver',  min: 500,   color: '#94A3B8', Icon: Star },
  { id: 'Gold',    min: 2000,  color: '#F59E0B', Icon: Star },
  { id: 'Platinum',min: 5000,  color: '#8B5CF6', Icon: Trophy },
];

const REDEEM_CATALOG = [
  { id: 'v50',   cost: 500,  label: '₱50 XWallet credit',  desc: 'Adds ₱50 to your XWallet',   Icon: Coins },
  { id: 'v100',  cost: 950,  label: '₱100 XWallet credit', desc: 'Save 5% vs two ₱50 credits', Icon: Coins },
  { id: 'ship',  cost: 300,  label: 'Free shipping voucher', desc: 'Waives delivery fee on one order', Icon: Gift },
  { id: 'dis5',  cost: 700,  label: '5% off voucher',      desc: 'Cap ₱100 · one order',       Icon: Gift },
];

function tierFor(points) {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.min) current = t;
  const next = TIERS.find((t) => t.min > points);
  const span = next ? (next.min - current.min) : 0;
  const progress = next ? Math.min(100, Math.round(((points - current.min) / span) * 100)) : 100;
  return { current, next, progress };
}

export default function Rewards() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    let alive = true;
    (async () => {
      setLoading(true);
      const [{ data: p }, { data: h }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase
          .from('xwallet_txns')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);
      if (!alive) return;
      setProfile(p || null);
      setHistory(h || []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user, nav]);

  const points = Number(profile?.loyalty_points) || 0;
  const { current, next, progress } = useMemo(() => tierFor(points), [points]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  if (!user) return null;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>Rewards</h2>
      </div>

      {/* Hero: points + tier */}
      <div className="rw-hero">
        <div className="rw-hero-glow" />
        <div className="rw-hero-label">
          <Sparkles size={14} /> Your points
        </div>
        <div className="rw-hero-points">{points.toLocaleString()}</div>
        <div className="rw-hero-tier">
          <current.Icon size={13} color={current.color} />
          <span>{current.id}</span>
          {next && <span className="rw-hero-tier-next">· {Math.max(0, next.min - points)} to {next.id}</span>}
        </div>
        <div className="rw-hero-progress">
          <div className="rw-hero-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="rw-hero-progress-labels">
          <span>{current.id}</span>
          <span>{next ? next.id : 'Max tier'}</span>
        </div>
      </div>

      {/* Redeem catalog */}
      <div className="rw-section-head">
        <Gift size={14} color="var(--primary)" />
        <span>Redeem your points</span>
      </div>

      <div className="rw-catalog">
        {REDEEM_CATALOG.map((r) => {
          const canAfford = points >= r.cost;
          return (
            <button
              key={r.id}
              className={'rw-item' + (canAfford ? '' : ' disabled')}
              onClick={() => {
                if (!canAfford) return;
                // placeholder: real redemption would call an RPC
                alert(`Redeeming "${r.label}" for ${r.cost} points.\n\n(Redemption RPC not wired yet.)`);
              }}
              type="button"
            >
              <div className="rw-item-icon">
                <r.Icon size={18} color="var(--primary)" />
              </div>
              <div className="rw-item-body">
                <div className="rw-item-title">{r.label}</div>
                <div className="rw-item-desc">{r.desc}</div>
              </div>
              <div className="rw-item-cost">
                <span className="rw-item-cost-num">{r.cost}</span>
                <span className="rw-item-cost-label">pts</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Points history */}
      <div className="rw-section-head">
        <History size={14} color="var(--primary)" />
        <span>Recent activity</span>
      </div>

      {loading ? (
        <div className="rw-history">
          {[0, 1, 2].map((i) => <div key={i} className="rw-history-skel" />)}
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity yet"
          message="Points you earn from purchases will show up here."
        />
      ) : (
        <div className="rw-history">
          {history.slice(0, 10).map((h) => {
            const isEarn = String(h.type).toLowerCase() === 'topup';
            const amt = Number(h.amount) || 0;
            return (
              <div key={h.id} className="rw-history-row">
                <div className={'rw-history-dot' + (isEarn ? ' earn' : ' spend')} />
                <div className="rw-history-info">
                  <div className="rw-history-title">{h.description || (isEarn ? 'Points earned' : 'Points spent')}</div>
                  <div className="rw-history-date">
                    {h.created_at ? new Date(h.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
                <div className={'rw-history-amt' + (isEarn ? ' earn' : ' spend')}>
                  {isEarn ? '+' : '−'}{amt} pts
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
