import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Percent, Tag, TrendingDown, Sparkles, PackageSearch } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';

const SORTS = [
  { key: 'discount', label: 'Biggest discount', icon: Percent },
  { key: 'low',      label: 'Lowest price',     icon: TrendingDown },
  { key: 'high',     label: 'Highest price',    icon: Sparkles },
];

export default function SaveMore() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('discount');

  useEffect(() => {
    // Products with discount >= 80
    supabase.from('products')
      .select('*')
      .gte('discount', 80)
      .order('discount', { ascending: false })
      .limit(80)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    if (!products.length) return { top: 0, count: 0, totalSavings: 0 };
    const top = products.reduce((m, p) => Math.max(m, p.discount || 0), 0);
    let total = 0;
    for (const p of products) {
      const orig = p.original_price || 0;
      const now = p.price || 0;
      if (orig > now) total += (orig - now);
    }
    return { top, count: products.length, totalSavings: total };
  }, [products]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === 'low')  copy.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === 'high') copy.sort((a, b) => (b.price || 0) - (a.price || 0));
    else copy.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return copy;
  }, [products, sort]);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      {/* HERO */}
      <div className="sm-hero">
        <span className="sm-hero-badge">
          <Tag size={11} /> 80% OFF &amp; UP
        </span>
        <div className="sm-hero-title">
          <Percent size={24} color="#FFFFFF" />
          Save More
        </div>
        <div className="sm-hero-sub">
          The deepest cuts on XMARKET — 80% off or more, while stocks last.
        </div>

        <div className="sm-stats">
          <div className="sm-stat">
            <div className="sm-stat-num">{stats.top}%</div>
            <div className="sm-stat-lab">Top deal</div>
          </div>
          <div className="sm-stat">
            <div className="sm-stat-num">{stats.count}</div>
            <div className="sm-stat-lab">On sale</div>
          </div>
          <div className="sm-stat">
            <div className="sm-stat-num">
              {stats.totalSavings >= 1000
                ? '₱' + (stats.totalSavings / 1000).toFixed(1) + 'k'
                : '₱' + stats.totalSavings}
            </div>
            <div className="sm-stat-lab">Total saved</div>
          </div>
        </div>
      </div>

      {/* SORT CHIPS */}
      {!loading && products.length > 0 && (
        <div className="sm-tools">
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

      {/* CONTENT */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sm-card">
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
            <PackageSearch size={30} />
          </div>
          <div className="sm-empty-title">No 80%+ deals right now</div>
          <div className="sm-empty-sub">
            We're always hunting for bigger cuts. Check back soon — or browse Flash Sale for 50%+ deals.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {sorted.map((p, i) => {
            const orig = p.original_price || 0;
            const saved = orig > p.price ? (orig - p.price) : 0;
            return (
              <Link
                key={p.id}
                to={`/product/${p.legacy_id || p.id}`}
                className="sm-card fade-up"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  animationDelay: Math.min(i * 40, 400) + 'ms',
                }}
              >
                <div className="product-thumb" style={{ position: 'relative' }}>
                  <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                  <span className="sm-ribbon">-{p.discount}%</span>
                  {saved > 0 && (
                    <span className="sm-save-tag">
                      <Tag size={9} />
                      Save ₱{saved}
                    </span>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, lineHeight: 1.35,
                    marginBottom: 6, height: '2.7em', overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                  }}>
                    {p.name}
                  </div>
                  <div className="sm-price-row">
                    <span className="sm-price">₱{p.price}</span>
                    {orig > 0 && (
                      <span className="sm-original">₱{orig}</span>
                    )}
                  </div>
                  <div className="sm-bar">
                    <div
                      className="sm-bar-fill"
                      style={{ width: Math.min(100, p.discount || 0) + '%' }}
                    />
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
