import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Timer, TrendingDown, Sparkles, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';
import { priceRange } from '../lib/variants';

const SORTS = [
  { key: 'new',  label: 'Newest first',  icon: Clock },
  { key: 'low',  label: 'Lowest price',  icon: TrendingDown },
  { key: 'high', label: 'Highest price', icon: Sparkles },
];

export default function FlashSale() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('new');

  useEffect(() => {
    supabase.from('products')
      .select('*')
      .eq('flash_sale', true)
      .order('created_at', { ascending: false })
      .limit(60)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  const stats = useMemo(() => {
    if (!products.length) return { count: 0, freshCount: 0 };
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const freshCount = products.filter(p => {
      const t = p.created_at ? new Date(p.created_at).getTime() : 0;
      return t && (now - t) < week;
    }).length;
    return { count: products.length, freshCount };
  }, [products]);

  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === 'low') copy.sort((a, b) => priceRange(a).min - priceRange(b).min);
    else if (sort === 'high') copy.sort((a, b) => priceRange(b).max - priceRange(a).max);
    else copy.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return copy;
  }, [products, sort]);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div className="fs-hero">
        <span className="fs-hero-badge">
          <Zap size={11} /> HOT RIGHT NOW
        </span>
        <div className="fs-hero-title">
          <Zap size={22} color="#FFFFFF" fill="#FFFFFF" />
          Flash Sale
        </div>
        <div className="fs-hero-sub">
          Curated drops, refreshed often. Grab them before they're gone.
        </div>
        <div className="fs-countdown">
          <div className="fs-unit">
            <div className="fs-unit-num">{stats.freshCount}</div>
            <div className="fs-unit-lab">New this week</div>
          </div>
          <div className="fs-unit">
            <div className="fs-unit-num">{stats.count}</div>
            <div className="fs-unit-lab">Live deals</div>
          </div>
        </div>
      </div>

      {!loading && products.length > 0 && (
        <div className="sm-tools" style={{ marginTop: 4 }}>
          {SORTS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={'sm-chip' + (sort === key ? ' active' : '')}
              onClick={() => setSort(key)}
            >
              <Icon size={11} style={{ marginRight: 5, verticalAlign: 'middle' }} />
              {label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="fs-card">
              <div className="sk sk-img" />
              <div style={{ padding: 12 }}>
                <div className="sk sk-line" style={{ width: '90%' }} />
                <div className="sk sk-line" style={{ width: '60%', marginTop: 6 }} />
                <div className="sk sk-line" style={{ width: '40%', marginTop: 10, height: 16 }} />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="sm-empty">
          <div className="sm-empty-icon">
            <Timer size={30} />
          </div>
          <div className="sm-empty-title">No flash deals right now</div>
          <div className="sm-empty-sub">
            New drops land often. Check back soon — or explore the full catalog on Home.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {sorted.map((p, i) => {
            const info = priceRange(p);
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
                  <span className="fs-ribbon">FLASH</span>
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
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{info.display}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
