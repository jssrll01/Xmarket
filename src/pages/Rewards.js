import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchLoyalty, fetchLoyaltyLedger } from '../lib/promos';

export default function Rewards() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([fetchLoyalty(user.id), fetchLoyaltyLedger(user.id)])
      .then(([p, l]) => { setPoints(p); setLedger(l); setLoading(false); });
  }, [user]);

  if (!user) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Sign in to see your loyalty points.</p>
      <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
    </div>
  );

  // Calculate tier
  const tier = points >= 1000 ? 'Gold' : points >= 300 ? 'Silver' : 'Bronze';
  const tierColor = points >= 1000 ? '#F59E0B' : points >= 300 ? '#9CA3AF' : '#B45309';
  const nextTier = points >= 1000 ? null : points >= 300 ? 1000 : 300;
  const progress = nextTier ? Math.min(100, (points / nextTier) * 100) : 100;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Loyalty Points</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Earn points with every order. Redeem for discounts soon.
      </p>

      {/* Hero Card */}
      <div style={{
        padding: 24, marginBottom: 16,
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        color: '#fff', borderRadius: 16, position: 'relative', overflow: 'hidden',
      }}>
        <Sparkles size={80} style={{ position: 'absolute', top: -10, right: -20, opacity: 0.15 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Award size={18} color={tierColor} fill={tierColor} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.9 }}>
            {tier} Member
          </span>
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{points}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>points earned</div>

        {nextTier && (
          <>
            <div style={{ marginTop: 16, fontSize: 11, opacity: 0.85 }}>
              {nextTier - points} points to next tier
            </div>
            <div style={{ marginTop: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.25)' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#fff', borderRadius: 3 }} />
            </div>
          </>
        )}
      </div>

      {/* How it works */}
      <div className="card" style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Gift size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: 13 }}>How it works</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--muted)' }}>
          • Earn <b style={{ color: 'var(--text)' }}>1 point per ₱100</b> spent<br />
          • Points unlock <b style={{ color: 'var(--text)' }}>Bronze → Silver → Gold</b> tiers<br />
          • Higher tiers get exclusive discounts
        </div>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Activity</h3>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading…</p>
      ) : ledger.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <TrendingUp size={32} color="var(--muted)" style={{ marginBottom: 8 }} />
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            No activity yet.<br />Place an order to start earning points.
          </p>
        </div>
      ) : (
        ledger.map(l => (
          <div key={l.id} className="card" style={{
            padding: 14, marginBottom: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{l.reason || 'Reward'}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {new Date(l.created_at).toLocaleDateString()}
              </div>
            </div>
            <div style={{
              fontWeight: 800, fontSize: 15,
              color: l.delta > 0 ? '#10B981' : '#DC2626',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {l.delta > 0 ? '+' : ''}{l.delta}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
