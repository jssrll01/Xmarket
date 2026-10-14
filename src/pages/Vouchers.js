import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Ticket, ShoppingBag, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fetchLoyaltyVouchers } from '../lib/promos';

export default function Vouchers() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [loyalty, setLoyalty] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [loyalRes, promoRes] = await Promise.all([
        user ? fetchLoyaltyVouchers(user.id) : Promise.resolve([]),
        supabase.from('promo_codes').select('*').eq('active', true),
      ]);
      if (!alive) return;
      setLoyalty(loyalRes || []);
      setPromos(promoRes.data || []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      showToast('Code copied');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      showToast('Copy failed');
    }
  };

  const applyAtCheckout = (code) => {
    nav('/checkout?promo=' + encodeURIComponent(code));
  };

  const renderVoucher = (v, kind) => {
    const isLoyalty = kind === 'loyalty';
    const disabled = isLoyalty ? v.redeemed : false;
    return (
      <div key={v.id || v.code} className="card" style={{
        padding: 14, marginBottom: 10,
        border: disabled ? '1px dashed var(--border)' : '1px solid var(--primary)',
        opacity: disabled ? 0.5 : 1,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 10, fontWeight: 800, letterSpacing: 1,
              textTransform: 'uppercase',
              color: isLoyalty ? '#7C3AED' : '#2563EB',
              background: isLoyalty ? '#EDE9FE' : '#DBEAFE',
              padding: '2px 8px', borderRadius: 20, marginBottom: 6,
            }}>
              {isLoyalty ? <Ticket size={10} /> : <ShoppingBag size={10} />}
              {isLoyalty ? `${v.tier || 'Loyalty'} Tier` : 'Promo'}
            </div>
            <div style={{
              fontWeight: 900, fontSize: 18, letterSpacing: 1.5,
              fontFamily: 'monospace',
              textDecoration: disabled ? 'line-through' : 'none',
            }}>
              {v.code}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {v.discount_type === 'percent'
                ? `${v.discount_value}% off`
                : v.discount_type === 'shipping'
                  ? 'Free shipping'
                  : `₱${v.discount_value} off`}
              {v.min_spend > 0 && ` · min ₱${v.min_spend}`}
              {isLoyalty && v.redeemed && ' · Used'}
              {!isLoyalty && v.expires_at && ` · expires ${new Date(v.expires_at).toLocaleDateString()}`}
            </div>
          </div>
        </div>

        {!disabled && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => copyCode(v.code)} className="btn-ghost"
              style={{ flex: 1, padding: 10, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {copied === v.code ? <Check size={13} /> : <Copy size={13} />}
              {copied === v.code ? 'Copied' : 'Copy code'}
            </button>
            <button onClick={() => applyAtCheckout(v.code)} className="btn-primary"
              style={{ flex: 1, padding: 10, fontSize: 12.5 }}>
              Use at checkout
            </button>
          </div>
        )}

        {disabled && (
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
            {isLoyalty ? 'Already redeemed' : 'Expired'}
          </div>
        )}
      </div>
    );
  };

  const availableLoyalty = loyalty.filter(v => !v.redeemed);
  const usedLoyalty = loyalty.filter(v => v.redeemed);
  const activePromos = promos.filter(p => {
    if (p.expires_at && new Date(p.expires_at) < new Date()) return false;
    if (p.max_uses && p.used_count >= p.max_uses) return false;
    return true;
  });

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Vouchers</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Collect and use codes to save on your next order.
      </p>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : (
        <>
          {/* Available loyalty vouchers */}
          {availableLoyalty.length > 0 && (
            <>
              <h3 style={{
                fontSize: 12, fontWeight: 800, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 10, marginTop: 4,
              }}>
                Loyalty Vouchers ({availableLoyalty.length})
              </h3>
              {availableLoyalty.map(v => renderVoucher(v, 'loyalty'))}
            </>
          )}

          {/* Active promo codes */}
          {activePromos.length > 0 && (
            <>
              <h3 style={{
                fontSize: 12, fontWeight: 800, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 10, marginTop: availableLoyalty.length > 0 ? 20 : 4,
              }}>
                Available Promos ({activePromos.length})
              </h3>
              {activePromos.map(p => renderVoucher(p, 'promo'))}
            </>
          )}

          {/* Used loyalty vouchers */}
          {usedLoyalty.length > 0 && (
            <>
              <h3 style={{
                fontSize: 12, fontWeight: 800, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 10, marginTop: 20,
              }}>
                Used ({usedLoyalty.length})
              </h3>
              {usedLoyalty.map(v => renderVoucher(v, 'loyalty'))}
            </>
          )}

          {/* Empty state */}
          {availableLoyalty.length === 0 && activePromos.length === 0 && usedLoyalty.length === 0 && (
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <Ticket size={44} color="var(--muted)" style={{ marginBottom: 12 }} />
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                No vouchers yet
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6, marginBottom: 16 }}>
                Earn <b>300 points</b> to unlock your first <b>Bronze</b> voucher (₱50 off).<br />
                <b>700 points</b> for Silver (₱75 off) · <b>1000 points</b> for Gold (₱100 off).
              </p>
              <button onClick={() => nav('/rewards')} className="btn-primary"
                style={{ padding: '10px 24px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> View my points
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
