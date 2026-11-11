import { VoucherListSkeleton } from '../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Vouchers() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      let promoRes = { data: [] };
      try { promoRes = await supabase.from('promo_codes').select('*').eq('active', true); if (promoRes.error) { console.error(promoRes.error); showToast('Vouchers: ' + promoRes.error.message); } } catch (e) { showToast('Vouchers: ' + e.message); }
      if (!alive) return;
      setPromos(Array.isArray(promoRes && promoRes.data) ? promoRes.data : []);
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
    const disabled = false;
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
              color: '#2563EB',
              background: '#DBEAFE',
              padding: '2px 8px', borderRadius: 20, marginBottom: 6,
            }}>
              <ShoppingBag size={10} />
              Promo
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
              
              {v.expires_at && ` · expires ${new Date(v.expires_at).toLocaleDateString()}`}
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
            Expired
          </div>
        )}
      </div>
    );
  };

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

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Vouchers</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Collect and use codes to save on your next order.
      </p>

      {loading ? (
        <VoucherListSkeleton />
      ) : (
        <>
          {/* Active promo codes */}
          {activePromos.length > 0 && (
            <>
              <h3 style={{
                fontSize: 12, fontWeight: 800, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 10, marginTop: 4,
              }}>
                Available Promos ({activePromos.length})
              </h3>
              {activePromos.map(p => renderVoucher(p, 'promo'))}
            </>
          )}

          {activePromos.length === 0 && (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40, fontSize: 14, fontWeight: 700 }}>No vouchers yet</p>
          )}
        </>
      )}
    </div>
  );
}
