import { ListRowsSkeleton } from '../components/Skeleton';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Heart, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Following() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [counts, setCounts] = useState({});
  const [verified, setVerified] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let alive = true;
    (async () => {
      const { data } = await supabase.from('seller_follows')
        .select('seller_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!alive) return;
      const list = data || [];
      setSellers(list);
      const names = list.map(s => s.seller_name);
      const { data: prods } = await supabase.from('products').select('store, verified').limit(500);
      if (!alive) return;
      const c = {}; const v = {};
      (prods || []).forEach(p => {
        if (!p.store) return;
        if (names.includes(p.store)) { c[p.store] = (c[p.store] || 0) + 1; if (p.verified) v[p.store] = true; }
      });
      setCounts(c); setVerified(v);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  const unfollow = async (name) => {
    setErr('');
    const { error } = await supabase.from('seller_follows').delete().eq('user_id', user.id).eq('seller_name', name);
    if (error) { setErr(error.message); return; }
    setSellers(prev => prev.filter(s => s.seller_name !== name));
  };

  if (!user) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Sign in to see who you follow.</p>
      <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
    </div>
  );

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Following</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        {loading ? 'Loading…' : `${sellers.length} ${sellers.length === 1 ? 'shop' : 'shops'} you follow`}
      </p>

      {err && <div style={{ padding: '10px 12px', borderRadius: 10, marginBottom: 12, fontSize: 12.5, fontWeight: 600, background: '#FEE2E2', color: '#991B1B' }}>{err}</div>}

      {loading ? (
        <ListRowsSkeleton />
      ) : sellers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Heart size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 14 }}>You're not following any shops yet.</p>
          <button className="btn-primary" onClick={() => nav('/')} style={{ padding: '10px 24px' }}>Discover shops</button>
        </div>
      ) : (
        sellers.map(s => (
          <div key={s.seller_name} className="card" style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Store size={20} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 800 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.seller_name}</span>
                  {verified[s.seller_name] && <BadgeCheck size={15} color="#2563EB" />}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                  {counts[s.seller_name] || 0} products · Followed {new Date(s.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Link to={`/store/${encodeURIComponent(s.seller_name)}`} className="btn-primary" style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}>
                Visit shop
              </Link>
              <button onClick={() => unfollow(s.seller_name)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 800, background: 'transparent', border: '1px solid var(--border, #E2E8F0)', color: 'var(--muted)', cursor: 'pointer' }}>
                Unfollow
              </button>
            </div>
          </div>
        ))
      )}

    </div>
  );
}
