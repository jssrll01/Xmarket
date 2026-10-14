import React, { useEffect, useState } from 'react';
import { X, ShoppingCart, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import SmartImage from './SmartImage';
import { getVariantConfig, comboLabel, priceFor, discountPct, stockFor, totalStock, priceRange } from '../lib/variants';

export default function QuickView({ product, onClose, onAddToCart, onOpenFull }) {
  const [selection, setSelection] = useState({});
  const [imageIdx, setImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    // Only lock body scroll while a product is actually mounted.
    // If `product` is null we return early, so we never trap the page.
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev || ''; };
  }, [product]);

  if (!product) return null;

  const config = getVariantConfig(product);
  const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image].filter(Boolean);
  const price = priceFor(product, selection);
  const orig = Number(product.original_price) || 0;
  const pct = discountPct(product);
  const complete = Object.keys(config).every(k => selection[k]);
  const rangeInfo = priceRange(product);
  // Effective stock: per-variant when selection complete, else total rollup
  const stock = complete ? stockFor(product, selection) : totalStock(product);

  return (
    <div className="qv-backdrop" onClick={onClose}>
      <div className="qv-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose}><X size={18} /></button>

        <div className="qv-media">
          {images.length > 1 && (
            <>
              <button className="qv-nav prev" onClick={() => setImageIdx((i) => (i - 1 + images.length) % images.length)}><ChevronLeft size={18} /></button>
              <button className="qv-nav next" onClick={() => setImageIdx((i) => (i + 1) % images.length)}><ChevronRight size={18} /></button>
            </>
          )}
          <SmartImage src={images[imageIdx]} alt={product.name} className="qv-img" />
          {product.instant && (
            <span className="instant-badge qv-instant"><Zap size={11} /> Instant</span>
          )}
        </div>

        <div className="qv-body">
          <div className="qv-name">{product.name}</div>
          <div className="qv-price-row">
            <span className="qv-price money">{complete ? `₱${price.toLocaleString()}` : rangeInfo.display}</span>
            {orig > price && (
              <span className="qv-orig money">₱{orig.toLocaleString()}</span>
            )}
            {stock <= 0 && <span className="qv-stock-out">Out of stock</span>}
            {stock > 0 && stock <= 5 && (
              <span className="stock-low-pulse">Only {stock} left</span>
            )}
          </div>

          {Object.keys(config).length > 0 && (
            <div className="qv-variants">
              {Object.entries(config).map(([dim, opts]) => (
                <div key={dim} className="qv-dim">
                  <div className="qv-dim-label">{dim}</div>
                  <div className="qv-chips">
                    {(opts || []).map((v) => (
                      <button
                        key={v}
                        className={'chip' + (selection[dim] === v ? ' active' : '')}
                        onClick={() => setSelection((s) => ({ ...s, [dim]: v }))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="qv-qty">
            <button onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((n) => n + 1)}>+</button>
          </div>

          <div className="qv-actions">
            <button
              className="btn-brand qv-add"
              disabled={!complete || stock <= 0}
              onClick={() => {
                if (!complete) return;
                onAddToCart?.(product, JSON.stringify(selection), qty);
                onClose();
              }}
            >
              <ShoppingCart size={16} /> {stock <= 0 ? 'Out of stock' : !complete ? `Pick ${Object.keys(config).find(k => !selection[k])}` : 'Add to cart'}
            </button>
            <button className="qv-view" onClick={() => { onClose(); onOpenFull?.(product); }}>
              Full details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
