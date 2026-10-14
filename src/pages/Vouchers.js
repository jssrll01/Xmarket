import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Ticket, Clock, Check, XCircle, Copy, Tag, Gift,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';

const TABS = [
  { id: 'active',   label: 'Active' },
  { id: 'used',     label: 'Used up' },
  { id: 'expired',  label: 'Expired' },
];

function countdown(until) {
  if (!until) return '';
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

// Bucket against real columns: active, expires_at, max_uses, used_count
function voucherStatus(v) {
  const now = Date.now();
  const expires = v.expires_at ? new Date(v.expires_at).getTime() : null;
  if (expires && expires <= now) return 'expired';
  if (v.max_uses && v.used_count >= v.max_uses) return 'used';
  if (v.active === false) return 'used';
  return 'active';
}

function discountLabel(v) {
  const type = String(v.discount_type || '').toLowerCase();
  const value = Number(v.discount_value) || 0;
  if (type === 'percent' || type === 'percentage' || type === 'pct') return `${value}%`;
  if (type === 'shipping' || type === 'free_shipping') return 'Free ship';
  return `₱${value.toLocaleString()}`;
}

export default function Vouchers() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    // Global catalog — no user_id filter
    supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.warn('[vouchers] promo_codes unavailable:', error.message);
          setRows([]);
        } else {
          setRows(data || []);
        }
        setLoading(false);
      })
      .catch(() => { setRows([]); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  const buckets = useMemo(() => {
    const b = { active: [], used: [], expired: [] };
    rows.forEach((r) => { b[voucherStatus(r)].push(r); });
    return b;
  }, [rows]);

  const visible = buckets[tab] || [];

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast?.('Code copied');
    } catch { showToast?.('Could not copy'); }
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>
          Vouchers {rows.length > 0 && (
            <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 16 }}>· {rows.length}</span>
          )}
        </h2>
      </div>

      <div className="vo-tabs">
        {TABS.map((t) => {
          const count = (buckets[t.id] || []).length;
          return (
            <button
              key={t.id}
              className={'vo-tab' + (tab === t.id ? ' active' : '')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {count > 0 && <span className="vo-tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="vo-list">
          {[0, 1, 2].map((i) => <div key={i} className="vo-skel" />)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No vouchers yet"
          message="Promo codes will show up here when they go live."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title={`No ${tab} vouchers`}
          message="Check back when new ones drop."
        />
      ) : (
        <div className="vo-list">
          {visible.map((v) => {
            const status = voucherStatus(v);
            const isActive = status === 'active';
            return (
              <div key={v.code} className={'vo-card vo-' + status}>
                <div className="vo-card-left">
                  <div className="vo-amount">
                    {discountLabel(v)}
                    <span className="vo-amount-off">OFF</span>
                  </div>
                  {v.min_spend > 0 && (
                    <div className="vo-min-spend">
                      Min ₱{Number(v.min_spend).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="vo-card-body">
                  <div className="vo-title">{v.code}</div>
                  {v.description && <div className="vo-desc">{v.description}</div>}

                  <div className="vo-code-row">
                    <code className="vo-code">{v.code}</code>
                    {isActive && (
                      <button
                        className="vo-copy"
                        onClick={() => copyCode(v.code)}
                        aria-label="Copy code"
                      >
                        <Copy size={11} />
                      </button>
                    )}
                  </div>

                  <div className="vo-meta">
                    {status === 'active' && v.expires_at && (
                      <span className="vo-countdown">
                        <Clock size={11} /> {countdown(v.expires_at)}
                      </span>
                    )}
                    {status === 'used' && (
                      <span className="vo-badge used">
                        <Check size={11} /> Used up
                      </span>
                    )}
                    {status === 'expired' && (
                      <span className="vo-badge expired">
                        <XCircle size={11} /> Expired
                      </span>
                    )}
                    {v.per_user_limit && (
                      <span className="vo-badge cat">
                        <Tag size={10} /> Limit {v.per_user_limit}/user
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
