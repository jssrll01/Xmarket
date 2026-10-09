import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchMyReports } from '../../lib/reports';

const STATUS_META = {
  submitted:  { label: 'Submitted',  color: '#2563EB', icon: AlertCircle },
  processing: { label: 'Processing', color: '#F59E0B', icon: Clock },
  completed:  { label: 'Completed',  color: '#10B981', icon: CheckCircle2 },
};

const CATEGORY_LABELS = {
  bug: 'Bug & Technical',
  order: 'Order & Product',
  shop: 'Shop / Seller',
  content: 'Content & Review',
  security: 'Account Security',
};

export default function MyReports() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchMyReports(user.id).then(({ items }) => {
      setItems(items); setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Sign in to see your reports.</p>
        <button className="btn-primary" onClick={() => nav('/signin')} style={{ marginTop: 12, padding: '10px 24px' }}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 60 }}>
      <button onClick={() => nav(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Reports</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Track the status of every report you've submitted.
      </p>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Ticket size={40} color="var(--muted)" style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700 }}>No reports yet</p>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6, marginBottom: 16 }}>
            Found a bug or issue? Submit a report from the menu.
          </p>
        </div>
      ) : (
        items.map(t => {
          const meta = STATUS_META[t.status] || STATUS_META.submitted;
          const Icon = meta.icon;
          return (
            <div key={t.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {CATEGORY_LABELS[t.category] || t.category}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 20,
                  background: `${meta.color}15`, color: meta.color,
                  fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  <Icon size={11} /> {meta.label}
                </div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)', marginBottom: 8, whiteSpace: 'pre-wrap' }}>
                {t.concern.length > 180 ? t.concern.slice(0, 180) + '…' : t.concern}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                Ticket #{t.id.slice(0, 8).toUpperCase()} · {new Date(t.created_at).toLocaleString()}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
