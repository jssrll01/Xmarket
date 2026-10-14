import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, X as XIcon, Clock, Tag, MessageSquare,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

const CATEGORY_LABEL = {
  product: 'Product',
  seller: 'Seller',
  order: 'Order',
  payment: 'Payment',
  delivery: 'Delivery',
  other: 'Other',
};

const STATUS_META = {
  open:        { label: 'Open',        Icon: AlertCircle,  color: '#F59E0B' },
  in_progress: { label: 'In progress', Icon: Loader2,      color: '#6366F1' },
  resolved:    { label: 'Resolved',    Icon: CheckCircle2, color: '#10B981' },
  closed:      { label: 'Closed',      Icon: CheckCircle2, color: '#94A3B8' },
};

function prettyStatus(s) {
  const k = String(s || 'open').toLowerCase();
  return STATUS_META[k] || STATUS_META.open;
}

export default function MyReports() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState(null);   // ticket detail modal

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    supabase
      .from('report_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setRows(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  const categories = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => { if (r.category) set.add(r.category); });
    return ['all', ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    if (category === 'all') return rows;
    return rows.filter((r) => r.category === category);
  }, [rows, category]);

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
          My Reports {rows.length > 0 && (
            <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 16 }}>· {rows.length}</span>
          )}
        </h2>
      </div>

      {/* Category chips */}
      {categories.length > 1 && (
        <div className="rep-chips">
          {categories.map((c) => (
            <button
              key={c}
              className={'rep-chip' + (category === c ? ' active' : '')}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? 'All' : (CATEGORY_LABEL[c] || c)}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="rep-list">
          {[0, 1, 2].map((i) => <div key={i} className="rep-skel" />)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          message="Report an issue from any order or product and track it here."
          action="Browse orders"
          onAction={() => nav('/orders')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nothing in this category"
          message="Try a different filter."
          action="Show all"
          onAction={() => setCategory('all')}
        />
      ) : (
        <div className="rep-list">
          {filtered.map((r) => {
            const sm = prettyStatus(r.status);
            const created = r.created_at ? new Date(r.created_at) : null;
            return (
              <button
                key={r.id}
                className="rep-card"
                onClick={() => setOpen(r)}
                type="button"
              >
                <div className="rep-card-top">
                  <span className="rep-cat">
                    <Tag size={11} /> {CATEGORY_LABEL[r.category] || r.category || 'Other'}
                  </span>
                  <span className="rep-status" style={{ color: sm.color }}>
                    <sm.Icon size={12} /> {sm.label}
                  </span>
                </div>
                <div className="rep-subject">{r.subject || r.title || 'Untitled report'}</div>
                {r.description && (
                  <div className="rep-desc">{r.description}</div>
                )}
                <div className="rep-meta">
                  {created && (
                    <span className="rep-date">
                      <Clock size={11} /> {created.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {r.ticket_code && (
                    <span className="rep-ticket">#{r.ticket_code}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Ticket detail modal */}
      {open && (
        <div className="rep-backdrop" onClick={() => setOpen(null)}>
          <div className="rep-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="rep-close" onClick={() => setOpen(null)} aria-label="Close">
              <XIcon size={18} />
            </button>

            <div className="rep-sheet-head">
              <span className="rep-cat">
                <Tag size={11} /> {CATEGORY_LABEL[open.category] || open.category || 'Other'}
              </span>
              {(() => {
                const sm = prettyStatus(open.status);
                return (
                  <span className="rep-status" style={{ color: sm.color }}>
                    <sm.Icon size={12} /> {sm.label}
                  </span>
                );
              })()}
            </div>

            <div className="rep-sheet-subject">{open.subject || open.title || 'Untitled report'}</div>

            <div className="rep-sheet-meta">
              {open.ticket_code && <span>#{open.ticket_code}</span>}
              {open.created_at && (
                <span>
                  <Clock size={11} /> {new Date(open.created_at).toLocaleString()}
                </span>
              )}
            </div>

            <div className="rep-sheet-section">
              <div className="rep-sheet-label">
                <MessageSquare size={12} /> Description
              </div>
              <div className="rep-sheet-body">
                {open.description || '(no description)'}
              </div>
            </div>

            {open.admin_reply && (
              <div className="rep-sheet-section">
                <div className="rep-sheet-label">
                  <CheckCircle2 size={12} /> Support reply
                </div>
                <div className="rep-sheet-body">{open.admin_reply}</div>
              </div>
            )}

            {open.resolution && (
              <div className="rep-sheet-section">
                <div className="rep-sheet-label">
                  <CheckCircle2 size={12} /> Resolution
                </div>
                <div className="rep-sheet-body">{open.resolution}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
