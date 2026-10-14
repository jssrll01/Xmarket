import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Share2, Trash2, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../CartContext';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';
import SmartImage from '../components/SmartImage';
import ConfirmDialog from '../components/ConfirmDialog';
import { discountPct } from '../lib/variants';

export default function Wishlist() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { dispatch } = useCart();
  const { show: showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (!user) { nav('/signin', { replace: true }); return; }
    supabase
      .from('wishlists')
      .select('id, product:products(id, legacy_id, name, price, original_price, images, store, instant, stock)')
      .eq('user_id', user.id)
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [user, nav]);

  if (!user) return null;

  const goBackSafe = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) nav(-1);
    else nav('/');
  };

  const moveToCart = async (row) => {
    const p = row.product;
    if (!p) return;
    setAdding(row.id);
    try {
      await dispatch({
        type: 'ADD',
        payload: {
          product_id: p.id,
          quantity: 1,
          name: p.name,
          price: p.price,
          original_price: p.original_price,
          images: p.images,
          instant: p.instant,
        },
      });
      showToast?.('Added to cart', 'success');
    } catch {
      showToast?.('Could not add');
    } finally {
      setAdding(null);
    }
  };

  const share = async (row) => {
    const p = row.product;
    if (!p) return;
    const url = `${window.location.origin}/product/${p.legacy_id || p.id}`;
    const data = { title: p.name || 'XMARKET', text: 'Check this out on XMARKET', url };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(url); showToast?.('Link copied'); }
    } catch {}
  };

  const removeRow = async (row) => {
    await supabase.from('wishlists').delete().eq('id', row.id);
    setItems((prev) => prev.filter((x) => x.id !== row.id));
    setConfirmRemove(null);
    showToast?.('Removed from wishlist');
  };

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={goBackSafe} className="icon-btn"><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: 22, fontWeight: 900, flex: 1 }}>
          My Wishlist {items.length > 0 && (
            <span style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 16 }}>· {items.length}</span>
          )}
        </h2>
      </div>

      {loading ? (
        <div className="wl-grid">
          {[0, 1, 2, 3].map((i) => <div key={i} className="wl-skel" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here."
          action="Browse products"
          onAction={() => nav('/')}
        />
      ) : (
        <div className="wl-grid">
          {items.map((row) => {
            const p = row.product;
            if (!p) return null;
            const pct = discountPct(p);
            const price = Number(p.price) || 0;
            const orig = Number(p.original_price) || 0;
            const img = (p.images && p.images[0]) || '';
            return (
              <div key={row.id} className="wl-card">
                <Link to={`/product/${p.legacy_id || p.id}`} className="wl-thumb">
                  <SmartImage src={img} alt={p.name} />
                  {pct !== null && <span className="discount-badge wl-badge">-{pct}%</span>}
                  {p.instant && (
                    <span className="instant-badge wl-instant"><Zap size={10} /> Instant</span>
                  )}
                </Link>

                <div className="wl-body">
                  <Link to={`/product/${p.legacy_id || p.id}`} className="wl-name">{p.name}</Link>
                  <div className="wl-price-row">
                    <span className="wl-price money">₱{price.toLocaleString()}</span>
                    {orig > price && (
                      <span className="wl-orig money">₱{orig.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="wl-actions">
                    <button
                      className="wl-btn primary"
                      onClick={() => moveToCart(row)}
                      disabled={adding === row.id}
                    >
                      {adding === row.id
                        ? <span className="spinner" />
                        : <><ShoppingCart size={13} /> Add</>}
                    </button>
                    <button className="wl-btn" onClick={() => share(row)} aria-label="Share">
                      <Share2 size={14} />
                    </button>
                    <button className="wl-btn danger" onClick={() => setConfirmRemove(row)} aria-label="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove from wishlist?"
        message={confirmRemove?.product?.name ? `Remove "${confirmRemove.product.name}"?` : ''}
        confirmLabel="Remove"
        danger
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => removeRow(confirmRemove)}
      />
    </div>
  );
}
