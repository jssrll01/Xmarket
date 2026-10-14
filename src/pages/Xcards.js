import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Gift, Plus, Trash2, X as XIcon, Check, Clock,
  Sparkles, ShieldCheck, Copy,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

function formatDate(s) {
  if (!s) return '';
  return new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function maskCode(code) {
  if (!code) return '';
  const s = String(code);
  if (s.length <= 6) return s;
  return s.slice(0, 3) + '••••' + s.slice(-3);
}

export default function Xcards() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [revealed, setRevealed] = useState({});

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('xcards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setCards(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    load();
  }, [user]);

  const totalValue = useMemo(() => {
    return cards.reduce((s, c) => s + (Number(c.value) || 0), 0);
  }, [cards]);

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const redeem = async () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { showToast?.('Enter a card code'); return; }

    // Already have it?
    const existing = cards.find((c) => String(c.code).toUpperCase() === code);
    if (existing) { showToast?.('You already added this card'); return; }

    setRedeeming(true);
    const { error } = await supabase.from('xcards').insert({
      user_id: user.id,
      code,
      value: 0,
    });
    setRedeeming(false);

    if (error) { showToast?.(error.message); return; }
    showToast?.('Card added', 'success');
    setCodeInput('');
    setAdding(false);
    load();
  };

  const removeCard = async (row) => {
    const { error } = await supabase.from('xcards').delete().eq('id', row.id);
    if (error) { showToast?.(error.message); return; }
    setCards((prev) => prev.filter((x) => x.id !== row.id));
    setConfirmRemove(null);
    showToast?.('Card removed');
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast?.('Code copied');
    } catch { showToast?.('Could not copy'); }
  };

  if (!user) return null;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>
          XCards {cards.length > 0 && (
            <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 16 }}>· {cards.length}</span>
          )}
        </h2>
        <button
          className="xcards-add-btn"
          onClick={() => setAdding((v) => !v)}
          aria-label="Add card"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Hero / total value */}
      <div className="xcards-hero">
        <div className="xcards-hero-glow" />
        <div className="xcards-hero-label">
          <Gift size={14} /> Total saved value
        </div>
        <div className="xcards-hero-value money">
          ₱{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="xcards-hero-sub">
          {cards.length} card{cards.length === 1 ? '' : 's'} in your wallet
        </div>
      </div>

      {/* Add card form */}
      {adding && (
        <div className="xcards-add">
          <div className="xcards-add-title">
            <Sparkles size={14} /> Add a card
          </div>
          <div className="xcards-add-hint">
            Enter the code from your physical or digital XCard.
          </div>
          <div className="xcards-add-row">
            <input
              autoFocus
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX"
              className="xcards-input"
              spellCheck={false}
            />
            <button
              className="xcards-redeem"
              onClick={redeem}
              disabled={redeeming || !codeInput.trim()}
            >
              {redeeming ? '…' : <><Check size={14} /> Add</>}
            </button>
          </div>
          <div className="xcards-add-note">
            <ShieldCheck size={11} /> Codes are stored securely and only you can see them.
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="xcards-grid">
          {[0, 1, 2, 3].map((i) => <div key={i} className="xcards-skel" />)}
        </div>
      ) : cards.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="No cards yet"
          message="Add an XCard code to keep it handy and use it at checkout."
          action="Add a card"
          onAction={() => setAdding(true)}
        />
      ) : (
        <div className="xcards-grid">
          {cards.map((c) => {
            const isRevealed = !!revealed[c.id];
            const value = Number(c.value) || 0;
            const hasValue = value > 0;
            return (
              <div key={c.id} className={'xcard' + (hasValue ? '' : ' empty')}>
                <div className="xcard-top">
                  <Gift size={14} />
                  <span className="xcard-brand">XCard</span>
                </div>
                <div className="xcard-code">
                  {isRevealed ? (
                    <span className="xcard-code-full">{c.code}</span>
                  ) : (
                    <span className="xcard-code-mask">{maskCode(c.code)}</span>
                  )}
                </div>
                <div className="xcard-value money">
                  ₱{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="xcard-date">
                  <Clock size={10} /> Added {formatDate(c.created_at)}
                </div>
                <div className="xcard-actions">
                  <button
                    className="xcard-btn"
                    onClick={() => setRevealed((r) => ({ ...r, [c.id]: !r[c.id] }))}
                  >
                    {isRevealed ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    className="xcard-btn"
                    onClick={() => copyCode(c.code)}
                    aria-label="Copy code"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    className="xcard-btn danger"
                    onClick={() => setConfirmRemove(c)}
                    aria-label="Remove card"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove this card?"
        message={confirmRemove ? `Remove card ${maskCode(confirmRemove.code)}?` : ''}
        confirmLabel="Remove"
        danger
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => removeCard(confirmRemove)}
      />
    </div>
  );
}
