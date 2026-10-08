import { supabase } from './supabase';

export async function fetchProductReviews(productId) {
  const { data, error } = await supabase
    .from('review_details')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) return { error, items: [] };
  return { error: null, items: data || [] };
}

export async function getEligibleOrder(userId, productId) {
  // Find a completed order from this user that contains the product
  // and does NOT yet have a review from this user
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_items!inner(product_id), reviews(id)')
    .eq('buyer_id', userId)
    .eq('status', 'completed')
    .eq('order_items.product_id', productId)
    .limit(5);
  if (error) return { eligibleOrderId: null };
  // Find one without an existing review from this user for this product
  const usable = (data || []).find(o => !o.reviews || o.reviews.length === 0);
  return { eligibleOrderId: usable?.id || null };
}

export async function submitReview({ userId, productId, orderId, rating, comment }) {
  return supabase.from('reviews').insert({
    user_id: userId,
    product_id: productId,
    order_id: orderId,
    rating,
    comment,
  });
}

export async function voteHelpful(reviewId, userId) {
  return supabase.from('review_votes').insert({ review_id: reviewId, user_id: userId });
}

export async function unvoteHelpful(reviewId, userId) {
  return supabase.from('review_votes').delete().eq('review_id', reviewId).eq('user_id', userId);
}

export async function replyToReview(reviewId, reply) {
  return supabase.from('reviews').update({ seller_reply: reply, replied_at: new Date().toISOString() }).eq('id', reviewId);
}

export async function hasVoted(reviewId, userId) {
  const { data } = await supabase
    .from('review_votes')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}
