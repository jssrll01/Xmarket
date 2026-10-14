import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Following() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from('seller_follows')
      .select('seller_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setSellers(data || []); setLoading(false); });
  }, [user]);

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

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Following</h2>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : sellers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Heart size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>You're not following any sellers yet.</p>
        </div>
      ) : (
        sellers.map(s => (
          <Link key={s.seller_name} to={`/store/${encodeURIComponent(s.seller_name)}`}
            className="card" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 14, marginBottom: 10, textDecoration: 'none', color: 'inherit',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Store size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.seller_name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  Followed {new Date(s.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>→</span>
          </Link>
        ))
      )}
    </div>
  );
}
