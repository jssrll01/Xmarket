import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Minus, Plus, BadgeCheck, Store } from 'lucide-react';
import { products } from '../products';
import SmartImage from '../components/SmartImage';
import { useCart } from '../CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === +id);
  const { dispatch } = useCart();

  const goBack = () => {
    if (window.history.length > 1 && document.referrer) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(product?.variants?.[0]);
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

  useEffect(() => {
    if (!product) return;
    document.title = product.name + ' - XMARKET';
    const setMeta = (prop, content) => {
      let el = document.querySelector('meta[property="' + prop + '"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('og:title', product.name + ' - XMARKET');
    setMeta('og:description', (product.description || '').slice(0, 160));
    setMeta('og:image', product.images[0]);
    setMeta('og:type', 'product');
    setMeta('og:url', window.location.href);
  }, [product]);

  if (!product) return <div style={{ padding: 20, color: 'var(--text)' }}>Product not found</div>;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url: window.location.href });
      } else {
        alert('Link: ' + window.location.href);
      }
    } catch (err) {}
  };

  const doAdd = (setFn, isBuy) => {
    setFn(true);
    setTimeout(() => {
      for (let i = 0; i < qty; i++) dispatch({ type: 'ADD', payload: { ...product, variant } });
      setFn(false);
      navigate(isBuy ? '/checkout' : '/cart');
    }, 700);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 100, color: 'var(--text)' }}>
      <button onClick={goBack} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        {product.preorder && (
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            background: 'var(--card)', color: "#000000",
            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999
          }}>PRE-ORDER</div>
        )}
        <div className="slideshow" ref={slideshowRef}
          onScroll={e => {
            const w = e.currentTarget.clientWidth;
            setSlide(Math.round(e.currentTarget.scrollLeft / w));
          }}>
          {product.images.map((img, i) => (
            <SmartImage key={i} src={img} alt={'view ' + (i+1)} style={{ flex: '0 0 100%', height: 320 }} />
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
          <Store size={14} color="#000000" />
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{product.store}</span>
          {product.verified && <BadgeCheck size={16} color="#000000" />}
        </div>

        <h2>{product.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ color: "#000000", fontSize: 24, fontWeight: 'bold' }}>₱{product.price}</span>
          {product.originalPrice && (
            <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)' }}>₱{product.originalPrice}</span>
          )}
          {product.discount > 0 && (
            <span style={{
              background: 'var(--grad-btn)', color: "#000000",
              padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700
            }}>-{product.discount}%</span>
          )}
        </div>
        <div className="social-proof">
          🔥 <b>{(product.sold || 0) + 12}</b> people bought this today
        </div>

        <p style={{ marginTop: 12, color: 'var(--text-dim)' }}>{product.description}</p>

        <h4 style={{ marginTop: 12 }}>Specifications</h4>
        <p style={{ color: 'var(--text-dim)' }}>{product.specs}</p>

        {product.variants && product.variants.length > 0 && (
          <>
            <h4 style={{ marginTop: 12 }}>Variant</h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.variants.map(v => (
                <button key={v} onClick={() => setVariant(v)}
                  style={{
                    padding: '6px 14px', borderRadius: 999,
                    border: '1px solid #000000',
                    background: variant === v ? 'var(--grad-btn)' : 'transparent',
                    color: variant === v ? '#000000' : '#000000', fontWeight: 600
                  }}>{v}</button>
              ))}
            </div>
          </>
        )}

        <h4 style={{ marginTop: 12 }}>Quantity</h4>
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
        <button onClick={share} className="icon-btn"><Share2 size={18} /></button>
        <button onClick={() => doAdd(setAdding, false)} disabled={adding}
          className="btn-outline" style={{ flex: 1, padding: 12 }}>
          {adding ? <span className="spinner" /> : 'Add to Cart'}
        </button>
        <button onClick={() => doAdd(setBuying, true)} disabled={buying}
          className="btn-primary" style={{ flex: 1, padding: 12 }}>
          {buying ? <span className="spinner" /> : 'Buy Now'}
        </button>
      </div>

      {(() => {
        const related = products.filter(x => x.id !== product.id && x.category === product.category).slice(0, 6);
        const fallback = products.filter(x => x.id !== product.id).slice(0, 6);
        const list = related.length > 0 ? related : fallback;
        if (list.length === 0) return null;
        return (
          <>
            <h3 style={{ margin: '24px 0 10px', fontSize: 16 }}>You may also like</h3>
            <div className="related-scroll">
              {list.map(r => (
                <button
                  key={r.id}
                  onClick={() => navigate('/product/' + r.id)}
                  className="related-card"
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  <div className="thumb">
                    <img src={r.images[0]} alt={r.name} />
                  </div>
                  <div className="meta">
                    <div className="name">{r.name}</div>
                    <div className="price">₱{r.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        );
      })()}
    </div>
  );
}
