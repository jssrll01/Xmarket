import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Store } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';
import YouMayAlsoLike from '../components/YouMayAlsoLike';
import { priceRange } from '../lib/variants';
import { isOutOfStock } from '../lib/stock';

export default function Wishlist() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    supabase
      .from('wishlists')
      .select('id, product:products(id, legacy_id, name, images, store, sold, variant_config, variant_prices, variant_stock)')
      .eq('user_id', user.id)
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;
  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const valid = items.filter(w => w.product);
  const ids = valid.map(w => w.product.id);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>My Wishlist</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
        {loading ? 'Loading your saved items…' : `${valid.length} saved ${valid.length === 1 ? 'item' : 'items'}`}
      </p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ padding: 0 }}>
              <div className="sk sk-img" />
              <div style={{ padding: 12 }}>
                <div className="sk sk-line" style={{ width: '90%', marginBottom: 8 }} />
                <div className="sk sk-line" style={{ width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : valid.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here."
          action="Browse products"
          onAction={() => nav('/')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {valid.map(w => {
            const out = isOutOfStock(w.product);
            return (
              <Link key={w.id} to={`/product/${w.product.legacy_id || w.product.id}`} className="card" style={{ padding: 0, textDecoration: 'none', color: 'inherit', opacity: out ? 0.6 : 1 }}>
                <div className="product-thumb" style={{ position: 'relative' }}>
                  <SmartImage src={w.product.images?.[0]} alt={w.product.name} />
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
                    <Heart size={15} color="#EF4444" fill="#EF4444" />
                  </div>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 4 }}>{w.product.name}</div>
                  {w.product.store && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                      <Store size={11} /> {w.product.store}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{priceRange(w.product).display}</span>
                    {out
                      ? <span style={{ fontSize: 10.5, fontWeight: 700, color: '#991B1B' }}>Sold out</span>
                      : (w.product.sold > 0 && <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{w.product.sold} sold</span>)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <YouMayAlsoLike excludeIds={ids} />
    </div>
  );
}
