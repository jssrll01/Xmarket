import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Search } from 'lucide-react';
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Store size={24} color="var(--primary)" />
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>XMALL</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Official XMARKET store — curated products from our own catalog.
      </p>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search XMALL products…"
          style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 14, background: 'var(--card)' }}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map(p => (
            <Link key={p.id} to={`/product/${p.legacy_id || p.id}`} className="card" style={{ padding: 0, textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}>
              <div className="product-thumb" style={{ position: 'relative' }}>
                <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 6, height: '2.7em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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
