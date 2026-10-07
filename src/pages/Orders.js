import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { nav('/signin'); return; }
    supabase
      .from('orders')
      .select('id, order_code, total, status, created_at')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ marginBottom: 20 }}>My Orders</h2>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="When you place an order, it will show up here."
          action="Start shopping"
          onAction={() => nav('/')}
        />
      ) : (
        orders.map(o => (
          <div key={o.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Order</span>
              <span style={{ fontSize: 11, padding: '3px 8px', background: 'var(--card)', borderRadius: 6, fontWeight: 700 }}>
                {o.status}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>#{o.order_code}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--muted)' }}>{new Date(o.created_at).toLocaleDateString()}</span>
              <span style={{ fontWeight: 800 }}>₱{o.total}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
