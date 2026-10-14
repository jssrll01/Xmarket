import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Search, X, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';

export default function Xmall() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    supabase.from('products').select('*').eq('store', 'XMALL')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  const filtered = products.filter(p =>
    !q || (p.name || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div className="xm-hero">
        <div className="xm-hero-badge">
          <Store size={26} />
        </div>
        <div className="xm-hero-body">
          <div className="xm-hero-title">
            XMALL
            <span className="xm-verified">
              <BadgeCheck size={11} /> Verified
            </span>
          </div>
          <div className="xm-hero-sub">
            Official XMARKET store — curated products from our own catalog.
          </div>
        </div>
      </div>

      <div className="xm-search">
        <Search size={16} className="xm-search-icon" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search XMALL products…"
        />
        {q && (
          <button className="xm-search-clear" onClick={() => setQ('')} aria-label="Clear">
            <X size={13} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="xm-card">
              <div className="sk sk-img" />
              <div style={{ padding: 12 }}>
                <div className="sk sk-line" style={{ width: '90%' }} />
                <div className="sk sk-line" style={{ width: '50%', marginTop: 8, height: 16 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Store size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700, marginBottom: 4 }}>
            {q ? 'No matching products' : 'No products yet'}
          </p>
          <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {q ? 'Try a different search term.' : 'New arrivals coming soon.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.legacy_id || p.id}`}
              className="xm-card fade-up"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                animationDelay: Math.min(i * 40, 400) + 'ms',
              }}
            >
              <div className="product-thumb" style={{ position: 'relative' }}>
                <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                {p.verified && (
                  <span className="xm-card-badge" title="Verified">
                    <BadgeCheck size={14} />
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
                <div style={{ fontWeight: 800, fontSize: 15 }}>₱{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
