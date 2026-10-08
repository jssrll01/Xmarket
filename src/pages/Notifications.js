import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Package, Tag, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications, markAsRead, markAllAsRead } from '../lib/notifications';
import EmptyState from '../components/EmptyState';

const ICONS = { order: Package, promo: Tag, system: Bell, security: Shield };

export default function Notifications() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) nav('/signin', { replace: true });
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (!user) { setItems([]); setLoading(false); return; }
    let alive = true;
    fetchNotifications(user.id).then(({ items }) => {
      if (alive) { setItems(items); setLoading(false); }
    });
    return () => { alive = false; };
  }, [user]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) nav(-1);
    else nav('/', { replace: true });
  };

  if (authLoading) return null;
  if (!user) return null;

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  const handleTap = async (n) => {
    if (!n.read) {
      await markAsRead(n.id);
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    }
    if (n.type === 'order') nav('/orders');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={goBackSafe} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Notifications</h2>
        {items.some(i => !i.read) && (
          <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }}
            onClick={async () => {
              await markAllAsRead(user.id);
              setItems(prev => prev.map(x => ({ ...x, read: true })));
            }}>
            Mark all read
          </button>
        )}
      </div>

      <div className="chips" style={{ marginBottom: 16, padding: 0 }}>
        {['all', 'order', 'promo', 'system'].map(f => (
          <button key={f}
            className={'chip' + (filter === f ? ' active' : '')}
            onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          message="Order updates and promotions will appear here."
        />
      ) : (
        filtered.map(n => {
          const Icon = ICONS[n.type] || Bell;
          return (
            <button key={n.id}
              onClick={() => handleTap(n)}
              className="card"
              style={{
                width: '100%', padding: 14, marginBottom: 10, textAlign: 'left',
                display: 'flex', gap: 12, alignItems: 'flex-start',
                borderLeft: n.read ? undefined : '3px solid var(--primary)',
              }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{n.title}</div>
                {n.body && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{n.body}</div>}
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
