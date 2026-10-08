import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, Reply } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import {
  fetchProductReviews, getEligibleOrder, submitReview,
  voteHelpful, unvoteHelpful, hasVoted, replyToReview,
} from '../lib/reviews';

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
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

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

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const submit = async () => {
    if (!user) { showToast('Please sign in'); return; }
    if (!eligibleOrderId) { showToast('Order not eligible'); return; }
    if (comment.trim().length < 3) { showToast('Add a few words'); return; }
    setSubmitting(true);
    const { error } = await submitReview({
      userId: user.id,
      productId: product.uuid,
      orderId: eligibleOrderId,
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (error) { showToast(error.message); return; }
    setWriting(false);
    setComment('');
    setRating(5);
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

  const submitReply = async (review) => {
    if (!replyText.trim()) return;
    const { error } = await replyToReview(review.id, replyText.trim());
    if (error) { showToast(error.message); return; }
    setReviews(rs => rs.map(r => r.id === review.id ? { ...r, seller_reply: replyText.trim() } : r));
    setReplyingTo(null);
    setReplyText('');
    showToast('Reply posted');
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
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn-ghost" onClick={() => { setWriting(false); setComment(''); }} style={{ flex: 1, padding: 10 }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={submit} disabled={submitting} style={{ flex: 1, padding: 10 }}>
              {submitting ? 'Posting…' : 'Post review'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20, fontSize: 13 }}>Loading reviews…</p>
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
            {replyingTo === r.id ? (
              <div style={{ marginTop: 8 }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="Reply as seller"
                  style={{ width: '100%', padding: 8, fontSize: 12.5, minHeight: 60 }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button onClick={() => setReplyingTo(null)} className="btn-ghost" style={{ flex: 1, padding: 8, fontSize: 12 }}>Cancel</button>
                  <button onClick={() => submitReply(r)} className="btn-primary" style={{ flex: 1, padding: 8, fontSize: 12 }}>Post reply</button>
                </div>
              </div>
            ) : (
              user && user.id === r.user_id && !r.seller_reply && (
                <button onClick={() => setReplyingTo(r.id)}
                  style={{ marginTop: 8, fontSize: 11.5, color: 'var(--primary)', background: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Reply size={12} /> Add reply
                </button>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}
