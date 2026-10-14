import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Timer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import SmartImage from '../components/SmartImage';

export default function FlashSale() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Products with discount >= 50%
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

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
      }}>
        <Zap size={24} color="#F59E0B" fill="#F59E0B" />
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>Flash Sale</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Grab the biggest discounts before they're gone.
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.legacy_id || p.id}`} className="card" style={{ padding: 0, textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}>
              <div className="product-thumb" style={{ position: 'relative' }}>
                <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  background: '#DC2626', color: '#fff',
                  fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                  letterSpacing: 0.5,
                }}>
                  -{p.discount}%
                </div>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 6, height: '2.7em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
