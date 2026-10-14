import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, ShoppingCart, Sparkles, Tag, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../CartContext';
import { useToast } from '../components/Toast';
import SmartImage from '../components/SmartImage';
import EmptyState from '../components/EmptyState';

/* ─── Compute savings for a bundle ───
 * Priority:
 *   1. bundle.original_price vs bundle.bundle_price  (explicit)
 *   2. summed product prices vs bundle.bundle_price
 *   3. summed product original_price vs summed product price (products on sale)
 */
function computeSavings(bundle, productsById) {
  const items = (bundle.product_ids || [])
    .map((id) => productsById[id])
    .filter(Boolean);

  const sumPrice = items.reduce((s, p) => s + (Number(p.price) || 0), 0);
  const sumOrig  = items.reduce((s, p) => s + (Number(p.original_price) || Number(p.price) || 0), 0);

  const bundlePrice = Number(
    bundle.bundle_price ?? bundle.price ?? sumPrice
  ) || 0;

  // explicit original price on the bundle takes precedence
  const explicitOrig = Number(bundle.original_price) || 0;
  const baseline = explicitOrig > 0 ? explicitOrig : (sumOrig > sumPrice ? sumOrig : sumPrice);

  const savings = Math.max(0, baseline - bundlePrice);
  const pct = baseline > 0 ? Math.round((savings / baseline) * 100) : 0;

  return { bundlePrice, savings, pct, itemCount: items.length, items };
}

/* ─── One bundle card ─── */
function BundleCard({ bundle, productsById, onAdd, adding, selectedVariant, onPickVariant }) {
  const { bundlePrice, savings, pct, items, itemCount } = useMemo(
    () => computeSavings(bundle, productsById),
    [bundle, productsById]
  );

  const variants = Array.isArray(bundle.variants) ? bundle.variants : [];
  const selected = selectedVariant[bundle.id] || '';

  // preview up to 3 thumbs
  const preview = items.slice(0, 3);
  const more = Math.max(0, itemCount - preview.length);

  return (
    <div className="bundle-card">
      {/* header strip */}
      <div className="bundle-head">
        <div className="bundle-head-left">
          <Layers size={14} color="#7C3AED" />
          <span className="bundle-head-label">Bundle</span>
        </div>
        {pct > 0 && (
          <span className="bundle-save-badge">
            <Tag size={10} /> Save {pct}%
          </span>
        )}
      </div>

      {/* title + item count */}
      <div className="bundle-title">{bundle.name || 'Untitled bundle'}</div>
      {bundle.description && (
        <div className="bundle-sub">{bundle.description}</div>
      )}

      {/* thumbnails row */}
      <div className="bundle-thumbs">
        {preview.length === 0 ? (
          <div className="bundle-thumb-empty">
            <Package size={18} color="var(--muted)" />
          </div>
        ) : (
          preview.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.legacy_id || p.id}`}
              className="bundle-thumb"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage src={(p.images && p.images[0]) || p.image} alt={p.name} />
            </Link>
          ))
        )}
        {more > 0 && (
          <div className="bundle-thumb-more">+{more}</div>
        )}
        <div className="bundle-count-chip">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </div>
      </div>

      {/* variant picker (only if bundle defines variants) */}
      {variants.length > 0 && (
        <div className="bundle-variants">
          <div className="bundle-variants-label">Variant</div>
          <div className="bundle-chips">
            {variants.map((v) => (
              <button
                key={v}
                className={'chip' + (selected === v ? ' active' : '')}
                onClick={() => onPickVariant(bundle.id, v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* price + CTA */}
      <div className="bundle-price-row">
        <div className="bundle-price-block">
          <div className="bundle-price money">₱{bundlePrice.toLocaleString()}</div>
          {savings > 0 && (
            <div className="bundle-save-text">
              Save ₱{savings.toLocaleString()}
            </div>
          )}
        </div>

        <button
          className="btn-brand bundle-add"
          disabled={adding === bundle.id}
          onClick={() => onAdd(bundle)}
        >
          {adding === bundle.id ? (
            <span className="bundle-add-spinner">
              <span className="spinner" /> Adding…
            </span>
          ) : (
            <>
              <ShoppingCart size={15} /> Add all to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Bundles() {
  const nav = useNavigate();
  const { dispatch } = useCart();
  const { show: showToast } = useToast();
  const [bundles, setBundles] = useState([]);
  const [productsById, setProductsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});

  useEffect(() => {
    (async () => {
      const { data: bs } = await supabase
        .from('bundles')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      const list = bs || [];
      setBundles(list);

      // fetch all referenced products in one query
      const ids = Array.from(
        new Set(list.flatMap((b) => b.product_ids || []))
      );
      if (ids.length > 0) {
        const { data: ps } = await supabase
          .from('products')
          .select('id, legacy_id, name, price, original_price, images, image')
          .in('id', ids);
        const map = {};
        (ps || []).forEach((p) => { map[p.id] = p; });
        setProductsById(map);
      }

      setLoading(false);
    })();
  }, []);

  const addBundle = async (b) => {
    setAdding(b.id);
    try {
      const variant = selectedVariant[b.id] || null;
      const ids = b.product_ids || [];
      for (const pid of ids) {
        const p = productsById[pid] || {};
        await dispatch({
          type: 'ADD',
          payload: {
            product_id: pid,
            quantity: 1,
            variant,
            name: p.name,
            price: p.price,
            original_price: p.original_price,
            images: p.images,
          },
        });
      }
      const label = variant ? ` (${variant})` : '';
      showToast?.(`Added ${ids.length} items${label} to cart`, 'success');
    } catch (err) {
      showToast?.('Failed to add bundle', 'error');
    } finally {
      setAdding(null);
    }
  };

  const totalSavings = useMemo(() => {
    return bundles.reduce((sum, b) => {
      const { savings } = computeSavings(b, productsById);
      return sum + savings;
    }, 0);
  }, [bundles, productsById]);

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 80 }}>
      <button
        onClick={() => nav(-1)}
        className="icon-btn"
        style={{ marginBottom: 12 }}
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Hero */}
      <div className="bundle-hero">
        <div className="bundle-hero-glow" />
        <div className="bundle-hero-top">
          <Sparkles size={26} color="#C4B5FD" />
          <h2 className="bundle-hero-title">Bundle Deals</h2>
        </div>
        <p className="bundle-hero-sub">
          {loading
            ? 'Loading bundles…'
            : bundles.length === 0
              ? 'Curated product sets — buy together and save.'
              : `${bundles.length} bundle${bundles.length === 1 ? '' : 's'} live · up to ₱${totalSavings.toLocaleString()} in savings`}
        </p>
      </div>

      {loading ? (
        <div className="bundle-skeleton-grid">
          {[0, 1].map((i) => (
            <div key={i} className="bundle-skeleton" />
          ))}
        </div>
      ) : bundles.length === 0 ? (
        <EmptyState
          icon={<Package size={44} color="var(--muted)" />}
          title="No bundles available"
          message="Bundle deals will appear here when they go live. Check back soon."
          action={
            <button
              className="btn-brand"
              style={{ padding: '12px 22px', borderRadius: 12 }}
              onClick={() => nav('/')}
            >
              Browse products
            </button>
          }
        />
      ) : (
        <div className="bundle-list">
          {bundles.map((b) => (
            <BundleCard
              key={b.id}
              bundle={b}
              productsById={productsById}
              onAdd={addBundle}
              adding={adding}
              selectedVariant={selectedVariant}
              onPickVariant={(id, v) =>
                setSelectedVariant((s) => ({ ...s, [id]: s[id] === v ? '' : v }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
