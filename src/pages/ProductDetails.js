import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Share2, Minus, Plus, BadgeCheck, Store, Heart
} from 'lucide-react';
import { fetchProductById, fetchRelatedProducts } from '../lib/products';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { supabase } from '../lib/supabase';
import SmartImage from '../components/SmartImage';
import { ProductDetailSkeleton } from '../components/Skeleton';
import ProductReviews from '../components/ProductReviews';

function Description({ text }) {
  const HEADINGS = [
    'What You Get',
    'Features',
    "What's Included",
    'Revision & Update Policy',
    'Perfect For',
    "Why You'll Love It",
  ];
  const lines = (text || '').split('\n');
  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
        if (HEADINGS.includes(line)) {
          return (
            <div key={i} style={{
              fontWeight: 800, fontSize: 15,
              marginTop: i === 0 ? 0 : 16, marginBottom: 6,
            }}>{line}</div>
          );
        }
        if (line.startsWith('•')) {
          return (
            <div key={i} style={{
              paddingLeft: 14, textIndent: -14,
              marginBottom: 4, color: 'var(--text)',
            }}>{line}</div>
          );
        }
        return <p key={i} style={{ marginBottom: 8 }}>{line}</p>;
      })}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { user } = useAuth();
  const { show: showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  const hasVariants = product?.variants && product.variants.length > 0;
  const [variant, setVariant] = useState(null);
  const [variantError, setVariantError] = useState(false);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [slide, setSlide] = useState(0);
  const slideshowRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProductById(id).then(p => {
      if (!alive) return;
      setProduct(p);
      setLoading(false);
      if (p) {
        setVariant(p.variants && p.variants.length > 0 ? null : '');
        fetchRelatedProducts(p.category, p.id, 8).then(list => {
          if (alive) setRelated(list);
        });
      }
    });
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    if (!user || !product) { setWishlisted(false); return; }
    supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.uuid)
      .maybeSingle()
      .then(({ data }) => setWishlisted(!!data));
  }, [user, product]);

  useEffect(() => {
    if (!product || !product.images || product.images.length < 2) return;
    const t = setInterval(() => {
      setSlide(s => {
        const next = (s + 1) % product.images.length;
        if (slideshowRef.current) {
          slideshowRef.current.scrollTo({
            left: next * slideshowRef.current.clientWidth,
            behavior: 'smooth',
          });
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, [product]);

  const goBack = () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };

  const share = async () => {
    if (!product) return;
    const shareUrl = window.location.origin + '/product/' + product.id;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url: shareUrl });
      } else {
        navigator.clipboard.writeText(shareUrl);
        showToast('Link copied');
      }
    } catch (err) {}
  };

  const toggleWishlist = async () => {
    if (!user) { showToast('Please sign in'); navigate('/signin'); return; }
    if (!product) return;
    if (wishlisted) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.uuid);
      if (!error) { setWishlisted(false); showToast('Removed from wishlist'); }
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: product.uuid });
      if (!error) { setWishlisted(true); showToast('Added to wishlist'); }
    }
  };

  const validateVariant = () => {
    if (hasVariants && !variant) { setVariantError(true); return false; }
    return true;
  };

  const doAdd = (setFn, isBuy) => {
    if (!user) { showToast('Please sign in'); navigate('/signin'); return; }
    if (!validateVariant()) return;
    setFn(true);
    setTimeout(async () => {
      for (let i = 0; i < qty; i++) {
        await dispatch({ type: 'ADD', payload: {
          product_id: product.uuid,
          variant: variant || '',
          quantity: 1,
        }});
      }
      setFn(false);
      showToast(isBuy ? 'Proceeding to checkout' : 'Added to cart');
      navigate(isBuy ? '/checkout' : '/cart');
    }, 400);
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Product not found</div>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ padding: '12px 24px' }}>
          Go home
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12 }}>
        <button onClick={goBack} className="icon-btn"><ArrowLeft size={20} /></button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleWishlist} className="icon-btn" aria-label="Wishlist">
            <Heart size={18} fill={wishlisted ? '#DC2626' : 'none'} color={wishlisted ? '#DC2626' : 'currentColor'} />
          </button>
          <button onClick={share} className="icon-btn"><Share2 size={18} /></button>
        </div>
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
            <SmartImage key={i} src={img} alt={'view ' + (i + 1)} style={{ flex: '0 0 100%' }} />
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
          <Link to={`/store/${encodeURIComponent(product.store)}`} style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>{product.store}</Link>
          {product.verified && <BadgeCheck size={16} color="#2563EB" />}
        </div>
        <h2>{product.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>₱{product.price}</span>
          {product.originalPrice && (
            <span style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'line-through' }}>
              ₱{product.originalPrice}
            </span>
          )}
          {product.discount > 0 && (
            <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '3px 8px', borderRadius: 6 }}>
              -{product.discount}%
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
          {product.sold} sold
        </div>
      </div>

      {hasVariants && (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Variant</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {product.variants.map(v => (
              <button key={v}
                onClick={() => { setVariant(v); setVariantError(false); }}
                className={'chip' + (variant === v ? ' active' : '')}
                style={{ border: variantError && variant !== v ? '1px solid #DC2626' : undefined }}>
                {v}
              </button>
            ))}
          </div>
          {variantError && (
            <div style={{ color: '#DC2626', fontSize: 12, marginTop: 8 }}>
              Please select a variant
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Quantity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn-ghost" style={{ padding: 8 }}>
            <Minus size={14} />
          </button>
          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="btn-ghost" style={{ padding: 8 }}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
        <button onClick={() => doAdd(setAdding, false)} disabled={adding}
          className="btn-outline" style={{ flex: 1, padding: 12 }}>
          {adding ? <span className="spinner" /> : 'Add to Cart'}
        </button>
        <button onClick={() => doAdd(setBuying, true)} disabled={buying}
          className="btn-primary" style={{ flex: 1, padding: 12 }}>
          {buying ? <span className="spinner" /> : 'Buy Now'}
        </button>
      </div>

      <div className="card" style={{ padding: 16, margin: '16px 16px 12px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Description</h3>
        <Description text={product.description} />
      </div>

      <ProductReviews product={product} />

      {related.length > 0 && (
        <div style={{ padding: '12px 16px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>You may also like</h3>
          <div className="related-scroll" style={{ padding: 0 }}>
            {related.map(r => (
              <button key={r.uuid}
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
      )}
    </div>
  );
}
