import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, Users, Star, Store, ShoppingBag, ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';

export default function Following() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    // follows table shape is uncertain; assume { user_id, seller_id, created_at }
    // and join sellers via profiles
    supabase
      .from('follows')
      .select('id, seller_id, created_at, seller:profiles!follows_seller_id_fkey(id, username, first_name, last_name, avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setRows(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>
          Following {rows.length > 0 && (
            <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 16 }}>· {rows.length}</span>
          )}
        </h2>
      </div>

      {loading ? (
        <div className="fl-list">
          {[0, 1, 2].map((i) => <div key={i} className="fl-skel" />)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="You're not following anyone"
          message="Follow sellers to see their new products first."
          action="Discover sellers"
          onAction={() => nav('/')}
        />
      ) : (
        <div className="fl-list">
          {rows.map((r) => {
            const s = r.seller || {};
            const displayName =
              s.username ||
              `${s.first_name || ''} ${s.last_name || ''}`.trim() ||
              'Seller';
            const initials = displayName.trim()[0]?.toUpperCase() || 'S';
            return (
              <Link
                key={r.id}
                to={`/seller/${r.seller_id}`}
                className="fl-card"
              >
                <div className="fl-avatar">
                  {s.avatar_url ? (
                    <SmartImage src={s.avatar_url} alt={displayName} />
                  ) : (
                    <span className="fl-avatar-initials">{initials}</span>
                  )}
                </div>
                <div className="fl-info">
                  <div className="fl-name">{displayName}</div>
                  <div className="fl-sub">
                    <Store size={11} /> Seller
                  </div>
                  <div className="fl-meta">
                    <span><ShoppingBag size={11} /> View shop</span>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--muted)" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
