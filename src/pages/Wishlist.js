import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';

export default function Wishlist() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { nav('/signin'); return; }
    supabase
      .from('wishlists')
      .select('id, product:products(id, legacy_id, name, price, images, store)')
      .eq('user_id', user.id)
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 20 }}>My Wishlist</h2>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here."
          action="Browse products"
          onAction={() => nav('/')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map(w => w.product && (
            <Link key={w.id} to={`/product/${w.product.legacy_id || w.product.id}`} className="card" style={{ padding: 0 }}>
              <div className="product-thumb">
                <SmartImage src={w.product.images?.[0]} alt={w.product.name} />
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>
                  {w.product.name}
                </div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>₱{w.product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
