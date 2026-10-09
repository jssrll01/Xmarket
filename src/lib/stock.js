/**
 * Sort products: in-stock first, sold-out last.
 * Secondary: keep original order stable (newest first is preserved).
 */
export function sortByStock(items) {
  return (items || []).slice().sort((a, b) => {
    const aOut = Number(a.stock || 0) <= 0 ? 1 : 0;
    const bOut = Number(b.stock || 0) <= 0 ? 1 : 0;
    if (aOut !== bOut) return aOut - bOut;
    return 0;
  });
}

export function isOutOfStock(product) {
  return Number(product?.stock || 0) <= 0;
}

export function cartHasOutOfStock(cartItems, productsMap) {
  // cartItems: array of { product_id, quantity }
  // productsMap: { [product_id]: product }
  for (const c of cartItems || []) {
    const p = productsMap?.[c.product_id];
    if (p && isOutOfStock(p)) return p;
  }
  return null;
}
