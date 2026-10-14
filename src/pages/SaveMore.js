import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Percent, TrendingDown, Sparkles, PackageSearch, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';
import { priceRange } from '../lib/variants';

const SORTS = [
  { key: 'low',  label: 'Lowest price',  icon: TrendingDown },
  { key: 'high', label: 'Highest price', icon: Sparkles },
  { key: 'new',  label: 'Newest first',  icon: Percent },
];

export default function SaveMore() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('new');

  useEffect(() => {
    supabase.from('products')
      .select('*')
      .eq('save_more', true)
      .order('created_at', { ascending: false })
      .limit(80)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  const stats = useMemo(() => {
    if (!products.length) return { count: 0, freshCount: 0, avg: 0 };
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const freshCount = products.filter(p => {
      const t = p.created_at ? new Date(p.created_at).getTime() : 0;
      return t && (now - t) < week;
    }).length;
    let priceSum = 0;
    let priceN = 0;
    for (const p of products) {
      const r = priceRange(p);
      if (r.min > 0) { priceSum += r.min; priceN += 1; }
    }
    const avg = priceN ? Math.round(priceSum / priceN) : 0;
    return { count: products.length, freshCount, avg };
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

      <div className="sm-hero">
        <span className="sm-hero-badge">
          <Tag size={11} /> CURATED FOR YOU
        </span>
        <div className="sm-hero-title">
          <Percent size={24} color="#FFFFFF" />
          Save More
        </div>
        <div className="sm-hero-sub">
          Handpicked deals, refreshed often. The best of XMARKET in one place.
        </div>

        <div className="sm-stats">
          <div className="sm-stat">
            <div className="sm-stat-num">{stats.freshCount}</div>
            <div className="sm-stat-lab">New this week</div>
          </div>
          <div className="sm-stat">
            <div className="sm-stat-num">{stats.count}</div>
            <div className="sm-stat-lab">Total deals</div>
          </div>
          <div className="sm-stat">
            <div className="sm-stat-num">
              {stats.avg >= 1000
                ? '₱' + (stats.avg / 1000).toFixed(1) + 'k'
                : '₱' + stats.avg.toLocaleString()}
            </div>
            <div className="sm-stat-lab">Avg price</div>
          </div>
        </div>
      </div>

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
          <div className="sm-empty-title">No Save More deals yet</div>
          <div className="sm-empty-sub">
            Our curators are picking fresh deals. Check back soon — or browse the full catalog on Home.
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
                className="sm-card fade-up"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  animationDelay: Math.min(i * 40, 400) + 'ms',
                }}
              >
                <div className="product-thumb" style={{ position: 'relative' }}>
                  <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                  <span className="sm-ribbon">SAVE MORE</span>
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
                    <span className="sm-price">{info.display}</span>
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
