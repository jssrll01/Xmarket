import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SmartImage from '../components/SmartImage';

export default function SellerProfile() {
  const { store } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const decodedStore = decodeURIComponent(store || '');

  useEffect(() => {
    supabase.from('products').select('*').eq('store', decodedStore)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, [decodedStore]);

  useEffect(() => {
    if (!user) { setFollowing(false); return; }
    supabase.from('seller_follows').select('id').eq('user_id', user.id).eq('seller_name', decodedStore).maybeSingle()
      .then(({ data }) => setFollowing(!!data));
  }, [user, decodedStore]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) nav(-1);
    else nav('/', { replace: true });
  };

  const toggleFollow = async () => {
    if (!user) { showToast('Please sign in'); nav('/signin'); return; }
    if (following) {
      await supabase.from('seller_follows').delete().eq('user_id', user.id).eq('seller_name', decodedStore);
      setFollowing(false);
      showToast('Unfollowed');
    } else {
      await supabase.from('seller_follows').insert({ user_id: user.id, seller_name: decodedStore });
      setFollowing(true);
      showToast('Following ' + decodedStore);
    }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}><ArrowLeft size={20} /></button>

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Seller</div>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Store size={32} color="#fff" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>{decodedStore}</h2>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>
        <button onClick={toggleFollow} className={following ? 'btn-ghost' : 'btn-primary'}
          style={{ marginTop: 12, padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : products.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No products yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.legacy_id || p.id}`} className="card" style={{ padding: 0 }}>
              <div className="product-thumb">
                <SmartImage src={(p.images && p.images[0]) || ''} alt={p.name} />
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>₱{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
