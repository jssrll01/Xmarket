import { ListRowsSkeleton } from './Skeleton';
import React, { useEffect, useRef, useState } from 'react';
import { Star, ThumbsUp, ImagePlus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import {
  fetchProductReviews, getEligibleOrder, submitReview,
  voteHelpful, unvoteHelpful, hasVoted,
} from '../lib/reviews';
import { uploadReviewPhoto, cld } from '../lib/cloudinary';

function Stars({ value = 0, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          fill={i <= value ? '#F59E0B' : 'none'}
          color={i <= value ? '#F59E0B' : 'var(--muted)'} />
      ))}
    </span>
  );
}

export default function ProductReviews({ product }) {
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [eligibleOrderId, setEligibleOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votes, setVotes] = useState({});
  const [photo, setPhoto] = useState(null);   // one photo at most: { file, preview }
  const [zoom, setZoom] = useState(null);
  const fileRef = useRef(null);
  const clearPhoto = () => {
    setPhoto((p) => { if (p && p.preview) URL.revokeObjectURL(p.preview); return null; });
  };
  const pickPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { showToast('Please choose a JPG, PNG or WebP photo'); return; }
    if (f.size > 15 * 1024 * 1024) { showToast('That photo is too large (max 15 MB)'); return; }
    setPhoto((p) => { if (p && p.preview) URL.revokeObjectURL(p.preview); return { file: f, preview: URL.createObjectURL(f) }; });
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProductReviews(product.uuid).then(({ items }) => {
      if (alive) { setReviews(items); setLoading(false); }
    });
    return () => { alive = false; };
  }, [product.uuid]);

  useEffect(() => {
    if (!user || !product) { setEligibleOrderId(null); return; }
    getEligibleOrder(user.id, product.uuid).then(({ eligibleOrderId }) => {
      setEligibleOrderId(eligibleOrderId);
    });
  }, [user, product]);

  useEffect(() => {
    if (!user || reviews.length === 0) return;
    Promise.all(reviews.map(r => hasVoted(r.id, user.id).then(v => [r.id, v])))
      .then(pairs => setVotes(Object.fromEntries(pairs)));
  }, [user, reviews]);

  // If we arrived via /product/:id#review, auto-open the review form
  useEffect(() => {
    if (window.location.hash === '#review' && user && eligibleOrderId && !writing) {
      setWriting(true);
    }
  }, [user, eligibleOrderId, writing]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const submit = async () => {
    if (!user) { showToast('Please sign in'); return; }
    if (!eligibleOrderId) { showToast('Order not eligible'); return; }
    if (comment.trim().length < 3) { showToast('Add a few words'); return; }
    setSubmitting(true);
    let photoUrl = null;
    if (photo && photo.file) {
      try {
        photoUrl = await uploadReviewPhoto(photo.file);
      } catch (err) {
        setSubmitting(false);
        showToast('Photo could not be uploaded. Try again or remove the photo.');
        return;
      }
    }
    const { error } = await submitReview({
      userId: user.id,
      productId: product.uuid,
      orderId: eligibleOrderId,
      rating,
      comment: comment.trim(),
      photoUrl,
    });
    setSubmitting(false);
    if (error) { showToast(error.message); return; }
    setWriting(false);
    setComment('');
    setRating(5);
    clearPhoto();
    setEligibleOrderId(null);
    showToast('Review submitted');
    const { items } = await fetchProductReviews(product.uuid);
    setReviews(items);
  };

  const toggleVote = async (review) => {
    if (!user) { showToast('Please sign in'); return; }
    const isVoted = votes[review.id];
    if (isVoted) {
      await unvoteHelpful(review.id, user.id);
      setVotes(v => ({ ...v, [review.id]: false }));
      setReviews(rs => rs.map(r => r.id === review.id ? { ...r, helpful_count: Math.max(0, r.helpful_count - 1) } : r));
    } else {
      await voteHelpful(review.id, user.id);
      setVotes(v => ({ ...v, [review.id]: true }));
      setReviews(rs => rs.map(r => r.id === review.id ? { ...r, helpful_count: r.helpful_count + 1 } : r));
    }
  };

  const shareReview = async (review) => {
    const text = `I rated ${product.name} ${review.rating}★ on XMARKET`;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, text, url });
      else { await navigator.clipboard.writeText(`${text} — ${url}`); showToast('Copied to clipboard'); }
    } catch {}
  };

  return (
    <div className="card" style={{ padding: 16, margin: '0 16px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800 }}>
          Reviews {reviews.length > 0 && <span style={{ color: 'var(--muted)', fontWeight: 500 }}>({reviews.length})</span>}
        </h3>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Stars value={Math.round(avgRating)} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {user && eligibleOrderId && !writing && (
        <button className="btn-primary" onClick={() => setWriting(true)}
          style={{ width: '100%', padding: 10, marginBottom: 12, fontSize: 13 }}>
          Write a review
        </button>
      )}

      {writing && (
        <div style={{ padding: 12, background: 'var(--card)', borderRadius: 12, marginBottom: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your rating</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)} style={{ background: 'none', padding: 2 }}>
                  <Star size={22} fill={i <= rating ? '#F59E0B' : 'none'} color={i <= rating ? '#F59E0B' : 'var(--muted)'} />
                </button>
              ))}
            </div>
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this product"
            style={{ width: '100%', padding: 10, minHeight: 80, fontSize: 13 }} />
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickPhoto} style={{ display: 'none' }} />
          {photo ? (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: 8 }}>
              <img src={photo.preview} alt="Your photo" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
              <button type="button" onClick={clearPhoto} aria-label="Remove photo"
                style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: '#DC2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => fileRef.current && fileRef.current.click()}
              style={{ marginTop: 8, padding: '8px 12px', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ImagePlus size={15} /> Add a photo (1 max)
            </button>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn-ghost" onClick={() => { setWriting(false); setComment(''); clearPhoto(); }} style={{ flex: 1, padding: 10 }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={submit} disabled={submitting} style={{ flex: 1, padding: 10 }}>
              {submitting ? 'Posting…' : 'Post review'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <ListRowsSkeleton compact />
      ) : reviews.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>
          No reviews yet. Be the first after your order is delivered.
        </p>
      ) : (
        reviews.map(r => (
          <div key={r.id} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {r.first_name || r.username || 'XMARKET user'}
              </div>
              <Stars value={r.rating} size={12} />
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)', marginBottom: 8 }}>
              {r.comment}
            </div>
            {cld(r.photo_url, 'w_300,c_limit,f_auto,q_auto') && (
              <img src={cld(r.photo_url, 'w_300,c_limit,f_auto,q_auto')} alt="Review photo" loading="lazy"
                onClick={() => setZoom(r.photo_url)}
                style={{ maxWidth: 140, maxHeight: 140, borderRadius: 10, marginBottom: 8, cursor: 'zoom-in', display: 'block' }} />
            )}
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
              {new Date(r.created_at).toLocaleDateString()}
            </div>
            {r.seller_reply && (
              <div style={{ padding: 10, background: 'var(--card)', borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 3 }}>Seller reply</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{r.seller_reply}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleVote(r)}
                style={{
                  padding: '6px 10px', fontSize: 11.5, borderRadius: 8,
                  background: votes[r.id] ? 'var(--primary)' : 'var(--card)',
                  color: votes[r.id] ? '#fff' : 'var(--text)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                <ThumbsUp size={12} /> Helpful {r.helpful_count > 0 && `(${r.helpful_count})`}
              </button>
              <button onClick={() => shareReview(r)}
                style={{ padding: '6px 10px', fontSize: 11.5, borderRadius: 8, background: 'var(--card)', color: 'var(--text)' }}>
                Share
              </button>
            </div>
          </div>
        ))
      )}
      {zoom && (
        <div onClick={() => setZoom(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <img src={cld(zoom, 'w_1200,c_limit,f_auto,q_auto')} alt="Review photo" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 12 }} />
        </div>
      )}
    </div>
  );
}
