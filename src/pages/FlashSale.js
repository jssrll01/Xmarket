import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Timer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';


export default function FlashSale() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products')
      .select('*')
      .gte('discount', 50)
      .order('discount', { ascending: false })
      .limit(50)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div className="fs-hero">
        <div className="fs-hero-title">
          <Zap size={22} color="#FFFFFF" fill="#FFFFFF" />
          Flash Sale
        </div>
        <div className="fs-hero-sub">
          Up to 50% off. Ends soon — grab them before the timer runs out.
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Timer size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700 }}>No flash sale items right now</p>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
            Check back soon for new deals.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {products.map((p, i) => {
            const stockPct = typeof p.stock === 'number'
              ? Math.max(15, Math.min(100, Math.round((p.stock / Math.max(p.stock, 50)) * 100)))
              : null;
            return (
              <Link
                key={p.id}
                to={`/product/${p.legacy_id || p.id}`}
                className="fs-card fade-up"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  animationDelay: Math.min(i * 40, 400) + 'ms',
                }}
              >
                <div className="product-thumb" style={{ position: 'relative' }}>
                  <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                  <span className="fs-ribbon">-{p.discount}%</span>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, lineHeight: 1.35,
                    marginBottom: 6, height: '2.7em', overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                  }}>
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>₱{p.price}</span>
                    {p.original_price && (
                      <span style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'line-through' }}>
                        ₱{p.original_price}
                      </span>
                    )}
                  </div>
                  {stockPct !== null && (
                    <div className="fs-stock-bar">
                      <div className="fs-stock-fill" style={{ width: stockPct + '%' }} />
                    </div>
                  )}
                  <span className="fs-cta">
                    Grab it now
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
