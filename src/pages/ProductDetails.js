import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Minus, Plus, BadgeCheck, Store } from 'lucide-react';
import { products } from '../products';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SmartImage from '../components/SmartImage';

function Description({ text }) {
  const HEADINGS = [
    'What You Get',
    'Features',
    "What's Included",
    'Revision & Update Policy',
    'Perfect For',
    "Why You'll Love It",
  ];
  const lines = text.split('\n');
  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 10 }} />;

        if (HEADINGS.includes(line)) {
          return (
            <div key={i} style={{
              fontWeight: 800,
              fontSize: 15,
              marginTop: i === 0 ? 0 : 16,
              marginBottom: 8,
              color: 'var(--text)'
            }}>{line}</div>
          );
        }

        if (line.startsWith('•')) {
          return (
            <div key={i} style={{
              display: 'flex',
              gap: 8,
              marginBottom: 6,
              paddingLeft: 2
            }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1 }}>{line.slice(1).trim()}</span>
            </div>
          );
        }

        return <div key={i} style={{ marginBottom: 8 }}>{line}</div>;
      })}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === +id);
  const { dispatch } = useCart();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  const hasVariants = product?.variants && product.variants.length > 0;
  const [variant, setVariant] = useState(hasVariants ? null : '');
  const [variantError, setVariantError] = useState(false);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [slide, setSlide] = useState(0);
  const slideshowRef = useRef(null);

  useEffect(() => {
    if (!product || !product.images || product.images.length < 2) return;
    const t = setInterval(() => {
      setSlide(s => {
        const next = (s + 1) % product.images.length;
        if (slideshowRef.current) {
          slideshowRef.current.scrollTo({
            left: next * slideshowRef.current.clientWidth,
            behavior: 'smooth'
          });
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, [product]);

  if (!product) return <div style={{ padding: 20 }}>Product not found</div>;

  const goBack = () => {
    if (window.history.length > 1 && document.referrer) navigate(-1);
    else navigate('/');
  };

  const share = async () => {
    const shareUrl = window.location.origin + '/product/' + product.id;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url: shareUrl });
      } else {
        alert('Link: ' + shareUrl);
      }
    } catch (err) {}
  };

  const validateVariant = () => {
    if (hasVariants && !variant) {
      setVariantError(true);
      showToast('Please select a variant');
      return false;
    }
    return true;
  };

  const doAdd = (setFn, isBuy) => {
    if (!validateVariant()) return;
    setFn(true);
    setTimeout(() => {
      for (let i = 0; i < qty; i++) {
        if (!user) { navigate('/signin'); return; }
      dispatch({ type: 'ADD', payload: { ...product, variant } });
      }
      setFn(false);
      showToast(isBuy ? 'Proceeding to checkout' : 'Added to cart');
      navigate(isBuy ? '/checkout' : '/cart');
    }, 700);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={goBack} className="icon-btn">
          <ArrowLeft size={20} />
        </button>
        <button onClick={share} className="icon-btn">
          <Share2 size={18} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        {product.preorder && (
          <div className="preorder-badge" style={{ left: 12, right: 'auto' }}>PRE-ORDER</div>
        )}
        {product.instant && !product.preorder && (
          <div className="instant-badge" style={{ left: 12, right: 'auto' }}>INSTANT</div>
        )}
        <div className="slideshow pd-hero" ref={slideshowRef}
          onScroll={e => {
            const w = e.currentTarget.clientWidth;
            setSlide(Math.round(e.currentTarget.scrollLeft / w));
          }}>
          {product.images.map((img, i) => (
            <SmartImage key={i} src={img} alt={'view ' + (i+1)}
              style={{ flex: "0 0 100%" }} />
          ))}
        </div>
        {product.images.length > 1 && (
          <div className="banner-dots" style={{ bottom: 12 }}>
            {product.images.map((_, i) => (
              <span key={i} className={'banner-dot' + (i === slide ? ' active' : '')} />
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Store size={14} />
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{product.store}</span>
          {product.verified && <BadgeCheck size={16} color="#2563EB" />}
        </div>

        <h2>{product.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>₱{product.price}</span>
          {product.originalPrice && (
            <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>₱{product.originalPrice}</span>
          )}
          {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Description</h3>
        <Description text={product.description} />
      </div>

      {hasVariants && (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h4 style={{ marginBottom: 4 }}>
            Variant <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 12 }}>(required)</span>
          </h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            {product.variants.map(v => (
              <button key={v}
                onClick={() => { setVariant(v); setVariantError(false); }}
                className={'chip' + (variant === v ? ' active' : '')}
                style={{
                  border: variantError && variant !== v ? '1px solid #DC2626' : undefined
                }}>{v}</button>
            ))}
          </div>
          {variantError && (
            <div style={{ color: '#DC2626', fontSize: 12, marginTop: 8 }}>
              Please select a variant to continue
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h4 style={{ marginBottom: 10 }}>Quantity</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setQty(Math.max(1, qty-1))} className="btn-ghost" style={{ padding: 8 }}>
            <Minus size={14} />
          </button>
          <span style={{ minWidth: 20, textAlign: 'center' }}>{qty}</span>
          <button onClick={() => setQty(qty+1)} className="btn-ghost" style={{ padding: 8 }}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => doAdd(setAdding, false)} disabled={adding}
          className="btn-outline" style={{ flex: 1, padding: 12 }}>
          {adding ? <span className="spinner" /> : 'Add to Cart'}
        </button>
        <button onClick={() => doAdd(setBuying, true)} disabled={buying}
          className="btn-primary" style={{ flex: 1, padding: 12 }}>
          {buying ? <span className="spinner" /> : 'Buy Now'}
        </button>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>You may also like</h3>
        <div className="related-scroll" style={{ padding: 0 }}>
          {products
            .filter(p => p.id !== product.id)
            .sort((a, b) => {
              const sameA = a.category === product.category ? 0 : 1;
              const sameB = b.category === product.category ? 0 : 1;
              return sameA - sameB;
            })
            .slice(0, 8)
            .map(r => (
              <button key={r.id}
                onClick={() => navigate('/product/' + r.id)}
                className="related-card"
                style={{ cursor: 'pointer', textAlign: 'left' }}>
                <div className="thumb">
                  <SmartImage src={r.images[0]} alt={r.name} />
                </div>
                <div className="meta">
                  <div className="name">{r.name}</div>
                  <div className="price">₱{r.price}</div>
                </div>
              </button>
            ))}
        </div>
      </div>

    </div>
  );
}
