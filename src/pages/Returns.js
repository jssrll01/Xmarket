import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Package, Truck, CheckCircle2, XCircle, Clock,
  ChevronDown, RotateCcw, CircleDot,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';

const STEPS = [
  { id: 'requested', label: 'Requested', Icon: CircleDot },
  { id: 'approved',  label: 'Approved',  Icon: CheckCircle2 },
  { id: 'shipped',   label: 'Shipped',   Icon: Truck },
  { id: 'refunded',  label: 'Refunded',  Icon: Package },
];

const STATUS_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'pending',   label: 'Pending' },
  { id: 'approved',  label: 'Approved' },
  { id: 'shipped',   label: 'Shipped' },
  { id: 'refunded',  label: 'Refunded' },
  { id: 'rejected',  label: 'Rejected' },
];

function statusIndex(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'pending' || s === 'requested') return 0;
  if (s === 'approved') return 1;
  if (s === 'shipped' || s === 'in_transit') return 2;
  if (s === 'refunded' || s === 'completed') return 3;
  return -1;
}

function Stepper({ status }) {
  const s = String(status || '').toLowerCase();
  const rejected = s === 'rejected' || s === 'denied';
  const idx = statusIndex(status);

  return (
    <div className="ret-stepper">
      {STEPS.map((step, i) => {
        const done = !rejected && i <= idx;
        const active = !rejected && i === idx;
        return (
          <React.Fragment key={step.id}>
            <div className={'ret-step' + (done ? ' done' : '') + (active ? ' active' : '')}>
              <div className="ret-step-dot">
                <step.Icon size={12} />
              </div>
              <div className="ret-step-label">{step.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={'ret-step-line' + (done && i < idx ? ' done' : '')} />
            )}
          </React.Fragment>
        );
      })}
      {rejected && (
        <div className="ret-rejected">
          <XCircle size={12} /> Rejected
        </div>
      )}
    </div>
  );
}

export default function Returns() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    supabase
      .from('return_requests')
      .select('*, order:orders(id, order_code), product:products(id, legacy_id, name, images)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setRows(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  const filtered = useMemo(() => {
    if (filter === 'all') return rows;
    return rows.filter((r) => {
      const s = String(r.status || '').toLowerCase();
      if (filter === 'pending') return s === 'pending' || s === 'requested';
      return s === filter;
    });
  }, [rows, filter]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>Returns</h2>
      </div>

      {/* Filter chips */}
      {rows.length > 0 && (
        <div className="ret-chips">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              className={'ret-chip' + (filter === f.id ? ' active' : '')}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.id !== 'all' && (
                <span className="ret-chip-count">
                  {rows.filter((r) => {
                    const s = String(r.status || '').toLowerCase();
                    if (f.id === 'pending') return s === 'pending' || s === 'requested';
                    return s === f.id;
                  }).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="ret-list">
          {[0, 1, 2].map((i) => <div key={i} className="ret-skel" />)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={RotateCcw}
          title="No returns yet"
          message="Request a return on any delivered order and track it here."
          action="View orders"
          onAction={() => nav('/orders')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={RotateCcw}
          title="No returns match"
          message="Try a different status filter."
          action="Show all"
          onAction={() => setFilter('all')}
        />
      ) : (
        <div className="ret-list">
          {filtered.map((r) => {
            const prod = r.product || {};
            const img = (prod.images && prod.images[0]) || '';
            const created = r.created_at ? new Date(r.created_at) : null;
            return (
              <div key={r.id} className="ret-card">
                <div className="ret-head">
                  <div className="ret-head-left">
                    <div className="ret-order-code">
                      #{r.order?.order_code || r.order_id || '—'}
                    </div>
                    {created && (
                      <div className="ret-date">
                        <Clock size={11} /> {created.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div className={'ret-status ret-status-' + String(r.status || 'pending').toLowerCase()}>
                    {String(r.status || 'pending').replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="ret-body">
                  {img && (
                    <Link to={`/product/${prod.legacy_id || prod.id}`} className="ret-thumb">
                      <SmartImage src={img} alt={prod.name || 'Item'} />
                    </Link>
                  )}
                  <div className="ret-info">
                    <div className="ret-name">{prod.name || r.product_name || 'Item'}</div>
                    {r.reason && <div className="ret-reason">Reason: {r.reason}</div>}
                    {r.refund_amount != null && (
                      <div className="ret-refund money">
                        Refund: ₱{Number(r.refund_amount).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <Stepper status={r.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
