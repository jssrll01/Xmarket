import { supabase } from './supabase';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[products] fetch error:', error.message);
    return [];
  }

  return (data || []).map(p => ({
    id: p.legacy_id ?? p.id,
    uuid: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price,
    category: p.category,
    discount: p.discount,
    sold: p.sold,
    store: p.store,
    verified: p.verified,
    preorder: p.preorder,
    instant: p.instant,
    images: p.images || [],
    description: p.description,
    variants: p.variants || [],
  }));
}

export const banners = [
  'https://res.cloudinary.com/bvw3okdf/image/upload/v1789443102/file_00000000177c820ba120270fcb723501.png',
  'https://res.cloudinary.com/bvw3okdf/image/upload/v1789443105/file_000000009f68820b98eb8e7e633c5547.png',
  'https://res.cloudinary.com/bvw3okdf/image/upload/v1789443120/file_00000000a3d8820b85b001b0d269ef1b.png',
  'https://res.cloudinary.com/bvw3okdf/image/upload/v1789443126/file_0000000067d8820bb0bae75741f4350b.png',
  'https://res.cloudinary.com/bvw3okdf/image/upload/v1789443837/file_00000000a55c8246b2511b1883dc67d3.png'
];

export async function fetchProductById(id) {
  // id may be a legacy numeric id or a UUID; try both.
  let query = supabase.from('products').select('*');
  if (/^\d+$/.test(String(id))) {
    query = query.eq('legacy_id', Number(id));
  } else {
    query = query.eq('id', id);
  }
  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return mapProduct(data);
}

export async function fetchRelatedProducts(category, excludeId, limit = 8) {
  let query = supabase.from('products').select('*').limit(limit + 1);
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) return [];
  return (data || [])
    .map(mapProduct)
    .filter(p => String(p.id) !== String(excludeId))
    .slice(0, limit);
}

function mapProduct(p) {
  return {
    id: p.legacy_id ?? p.id,
    uuid: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price,
    category: p.category,
    discount: p.discount,
    sold: p.sold,
    store: p.store,
    verified: p.verified,
    preorder: p.preorder,
    instant: p.instant,
    images: p.images || [],
    description: p.description,
    variants: p.variants || [],
  };
}


export async function fetchProductStatsMap() {
  const { data, error } = await supabase
    .from('product_stats')
    .select('product_id, avg_rating, review_count, sold');
  if (error) { console.warn('[stats]', error.message); return {}; }
  const map = {};
  (data || []).forEach(r => {
    map[r.product_id] = {
      avgRating: Number(r.avg_rating) || 0,
      reviewCount: Number(r.review_count) || 0,
      sold: Number(r.sold) || 0,
    };
  });
  return map;
}
