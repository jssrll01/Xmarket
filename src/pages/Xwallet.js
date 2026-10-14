import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Wallet, ArrowDownLeft, ArrowUpRight, Download, Plus,
  RefreshCw, ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 20;

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'topup',    label: 'Top-ups' },
  { id: 'purchase', label: 'Purchases' },
];

const TYPE_META = {
  topup:    { label: 'Top-up',   color: '#10B981', Icon: ArrowDownLeft,  sign: '+' },
  purchase: { label: 'Purchase', color: '#EF4444', Icon: ArrowUpRight,   sign: '−' },
};

function txnMeta(type) {
  const k = String(type || '').toLowerCase();
  return TYPE_META[k] || {
    label: type || 'Transaction',
    color: '#6366F1',
    Icon: Wallet,
    sign: '',
  };
}

function formatDate(s) {
  if (!s) return '';
  const d = new Date(s);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function Xwallet() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [txns, setTxns] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showLoader = true) => {
    if (!user) return;
    if (showLoader) setLoading(true);
    else setRefreshing(true);

    const [{ data: tx }, { data: p }] = await Promise.all([
      supabase
        .from('xwallet_txns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(500),
      supabase.from('profiles').select('xwallet_balance, loyalty_points').eq('id', user.id).maybeSingle(),
    ]);

    setTxns(tx || []);
    setProfile(p || null);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    load();
  }, [user]);

  const filtered = useMemo(() => {
    if (filter === 'all') return txns;
    return txns.filter((t) => String(t.type || '').toLowerCase() === filter);
  }, [txns, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  useEffect(() => { setPage(1); }, [filter]);

  // Totals
  const totals = useMemo(() => {
    let inAmt = 0, outAmt = 0;
    txns.forEach((t) => {
      const a = Number(t.amount) || 0;
      if (String(t.type).toLowerCase() === 'topup') inAmt += a;
      else if (String(t.type).toLowerCase() === 'purchase') outAmt += a;
    });
    return { inAmt, outAmt };
  }, [txns]);

  const exportCSV = () => {
    const header = ['date', 'type', 'amount', 'description', 'id'];
    const rows = filtered.map((t) => [
      t.created_at || '',
      t.type || '',
      String(Number(t.amount) || 0),
      (t.description || '').replace(/"/g, '""'),
      t.id || '',
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xwallet-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  if (!user) return null;

  const balance = Number(profile?.xwallet_balance) || 0;
  const points = Number(profile?.loyalty_points) || 0;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>XWallet</h2>
        <button
          className="icon-btn"
          onClick={() => load(false)}
          aria-label="Refresh"
          disabled={refreshing}
        >
          <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
        </button>
      </div>

      {/* Balance hero */}
      <div className="xw-hero">
        <div className="xw-hero-glow" />
        <div className="xw-hero-label">
          <Wallet size={14} /> Available balance
        </div>
        <div className="xw-hero-balance money">₱{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="xw-hero-meta">
          <span><Wallet size={11} /> {points} points</span>
          {profile?.updated_at && <span>Updated {formatDate(profile.updated_at)}</span>}
        </div>
        <div className="xw-hero-actions">
          <button className="xw-hero-btn primary" onClick={() => nav('/xwallet/topup')}>
            <Plus size={15} /> Top up
          </button>
          <button className="xw-hero-btn" onClick={() => nav('/xcards')}>
            <ExternalLink size={14} /> Redeem card
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="xw-stats">
        <div className="xw-stat">
          <div className="xw-stat-label">In (top-ups)</div>
          <div className="xw-stat-num money" style={{ color: '#10B981' }}>
            +₱{totals.inAmt.toLocaleString()}
          </div>
        </div>
        <div className="xw-stat">
          <div className="xw-stat-label">Out (purchases)</div>
          <div className="xw-stat-num money" style={{ color: '#EF4444' }}>
            −₱{totals.outAmt.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Toolbar — filters + export */}
      <div className="xw-toolbar">
        <div className="xw-chips">
          {FILTERS.map((f) => {
            const count = f.id === 'all'
              ? txns.length
              : txns.filter((t) => String(t.type).toLowerCase() === f.id).length;
            return (
              <button
                key={f.id}
                className={'xw-chip' + (filter === f.id ? ' active' : '')}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                {count > 0 && <span className="xw-chip-count">{count}</span>}
              </button>
            );
          })}
        </div>
        <button className="xw-export" onClick={exportCSV} disabled={!filtered.length}>
          <Download size={14} /> CSV
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="xw-list">
          {[0, 1, 2, 3].map((i) => <div key={i} className="xw-skel" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={txns.length === 0 ? 'No transactions yet' : 'No matches'}
          message={
            txns.length === 0
              ? 'Top up your wallet or redeem an XCard to get started.'
              : 'Try a different filter.'
          }
          action={txns.length === 0 ? 'Top up now' : 'Show all'}
          onAction={() => (txns.length === 0 ? nav('/xwallet/topup') : setFilter('all'))}
        />
      ) : (
        <>
          <div className="xw-list">
            {pageRows.map((t) => {
              const meta = txnMeta(t.type);
              const Icon = meta.Icon;
              const amt = Number(t.amount) || 0;
              return (
                <div key={t.id} className="xw-row">
                  <div
                    className="xw-row-icon"
                    style={{ background: `${meta.color}18`, color: meta.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="xw-row-info">
                    <div className="xw-row-title">{t.description || meta.label}</div>
                    <div className="xw-row-sub">
                      {meta.label}
                      {t.created_at && <> · {formatDate(t.created_at)}</>}
                    </div>
                  </div>
                  <div className="xw-row-amt money" style={{ color: meta.color }}>
                    {meta.sign}₱{amt.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="xw-pager">
              <button
                className="xw-pager-btn"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <div className="xw-pager-info">
                Page {safePage} of {pageCount}
              </div>
              <button
                className="xw-pager-btn"
                disabled={safePage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Next
              </button>
            </div>
          )}

          <div className="xw-footnote">
            Showing {pageRows.length} of {filtered.length} transaction{filtered.length === 1 ? '' : 's'}
          </div>
        </>
      )}
    </div>
  );
}
