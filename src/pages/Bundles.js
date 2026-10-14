import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../CartContext';
import { useToast } from '../components/Toast';

export default function Bundles() {
  const nav = useNavigate();
  const { dispatch } = useCart();
  const { show: showToast } = useToast();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  // Track selected variant per bundle id
  const [selectedVariant, setSelectedVariant] = useState({});

  useEffect(() => {
    supabase.from('bundles').select('*').eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBundles(data || []);
        setLoading(false);
      });
  }, []);

  const addBundle = async (b) => {
    setAdding(b.id);
    try {
      const variant = selectedVariant[b.id] || null;
      for (const pid of b.product_ids) {
        await dispatch({
          type: 'ADD',
          payload: { product_id: pid, quantity: 1, variant },
        });
      }
      const label = variant ? ` (${variant})` : '';
      showToast(`Added ${b.product_ids.length} items${label} to cart`);
    } catch (err) {
      showToast('Failed to add bundle');
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Bundle Deals</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Curated product sets — buy together and save.
      </p>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : bundles.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <Package size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No bundles available right now.</p>
        </div>
      ) : (
        bundles.map(b => {
          const variants = Array.isArray(b.variants) ? b.variants.filter(Boolean) : [];
          const hasVariants = variants.length > 0;
          const chosen = selectedVariant[b.id] || (hasVariants ? variants[0] : null);

          return (
            <div key={b.id} className="card" style={{ padding: 14, marginBottom: 12 }}>
              {b.image_url && (
                <img src={b.image_url} alt={b.title}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
              )}
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 10 }}>
                {b.description}
              </div>

              {/* Variants picker */}
              {hasVariants && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--muted)',
                    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
                  }}>
                    Variant
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {variants.map((v) => {
                      const active = chosen === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(prev => ({ ...prev, [b.id]: v }))}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                            background: active ? 'var(--primary)' : 'transparent',
                            color: active ? '#fff' : 'inherit',
                            cursor: 'pointer',
                          }}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--primary)' }}>₱{b.bundle_price}</span>
                {b.original_price && b.original_price > b.bundle_price && (
                  <span style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>
                    ₱{b.original_price}
                  </span>
                )}
              </div>
              <button
                onClick={() => addBundle(b)}
                disabled={adding === b.id}
                className="btn-primary"
                style={{
                  width: '100%', padding: 11, fontSize: 13, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <ShoppingCart size={14} />
                {adding === b.id ? 'Adding…' : 'Add bundle to cart'}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
