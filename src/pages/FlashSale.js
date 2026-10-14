import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Timer, TrendingUp, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';
import { discountPct } from '../lib/variants';

/* ─── Countdown hook — ticks every second ─── */
function useCountdown(targetMs) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const total = Math.floor(diff / 1000);
  return {
    expired: diff <= 0,
    h: String(Math.floor(total / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0'),
    label: (() => {
      if (diff <= 0) return 'Ended';
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      if (h > 0) return `Ends in ${h}h ${m}m`;
      if (m > 0) return `Ends in ${m}m ${s}s`;
      return `Ends in ${s}s`;
    })(),
  };
}

/* ─── One product card with its own countdown ─── */
function FlashCard({ product }) {
  // Default: 24h window starting from created_at, unless flash_ends_at exists
  const endsAt = useMemo(() => {
    if (product.flash_ends_at) return new Date(product.flash_ends_at).getTime();
    const created = product.created_at ? new Date(product.created_at).getTime() : Date.now();
    return created + 24 * 3600 * 1000;
  }, [product]);
  const cd = useCountdown(endsAt);

  const pct = discountPct(product);
  const price = Number(product.price) || 0;
  const orig = Number(product.original_price) || 0;
  const stock = Number(product.stock) || 0;
  const sold = Number(product.sold) || 0;
  const totalEver = stock + sold;
  const soldPct = totalEver > 0 ? Math.min(100, Math.round((sold / totalEver) * 100)) : 0;
  const stockLabel = stock <= 0 ? 'Sold out' : stock <= 5 ? `${stock} left!` : `${stock} available`;

  return (
    <Link to={`/product/${product.legacy_id || product.id}`} className="flash-card">
      <div className="flash-thumb">
        <SmartImage src={(product.images && product.images[0]) || product.image} alt={product.name} />
        {pct !== null && <span className="discount-badge flash-discount">-{pct}%</span>}
        {product.instant && (
          <span className="instant-badge flash-instant"><Zap size={10} /> Instant</span>
        )}
      </div>
      <div className="flash-body">
        <div className="flash-name">{product.name}</div>

        <div className="flash-price-row">
          <span className="flash-price money">₱{price.toLocaleString()}</span>
          {orig > price && (
            <span className="flash-orig money">₱{orig.toLocaleString()}</span>
          )}
        </div>

        {/* Sold progress bar */}
        <div className="flash-bar">
          <div className="flash-bar-fill" style={{ width: soldPct + '%' }} />
          <div className="flash-bar-glow" style={{ left: Math.max(0, soldPct - 6) + '%' }} />
        </div>
        <div className="flash-bar-labels">
          <span><TrendingUp size={10} /> {sold} sold</span>
          <span className={stock <= 5 && stock > 0 ? 'flash-stock-low' : ''}>{stockLabel}</span>
        </div>

        <div className={'flash-timer' + (cd.expired ? ' expired' : '')}>
          <Timer size={11} /> {cd.label}
        </div>
      </div>
    </Link>
  );
}

export default function FlashSale() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products')
      .select('*')
      .gte('discount', 30)
      .order('discount', { ascending: false })
      .limit(60)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  const endingSoon = useMemo(() => {
    return [...products]
      .map(p => ({
        p,
        endsAt: p.flash_ends_at
          ? new Date(p.flash_ends_at).getTime()
          : (p.created_at ? new Date(p.created_at).getTime() + 24 * 3600 * 1000 : 0),
      }))
      .filter(x => x.endsAt > Date.now())
      .sort((a, b) => a.endsAt - b.endsAt)
      .slice(0, 4)
      .map(x => x.p);
  }, [products]);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Flame size={24} color="#F59E0B" fill="#F59E0B" />
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>Flash Sale</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        {loading ? 'Loading deals…' : `${products.length} deals live right now — grab them before they're gone.`}
      </p>

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
        <>
          {/* Ending Soon */}
          {endingSoon.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div className="flash-section-head">
                <Zap size={14} color="#F59E0B" />
                <span>Ending soon</span>
              </div>
              <div className="flash-hscroll">
                {endingSoon.map(p => (
                  <div key={p.id} style={{ minWidth: 168, maxWidth: 168 }}>
                    <FlashCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All deals */}
          <div className="flash-section-head">
            <TrendingUp size={14} color="#EF4444" />
            <span>All deals</span>
          </div>
          <div className="flash-grid">
            {products.map(p => (
              <FlashCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
