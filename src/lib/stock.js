import { totalStock } from './variants';

/**
 * Sort products: in-stock first, sold-out last.
 * Uses rollup stock (sum of variant stock) when variants exist.
 */
export function sortByStock(items) {
  return (items || []).slice().sort((a, b) => {
    const aOut = totalStock(a) <= 0 ? 1 : 0;
    const bOut = totalStock(b) <= 0 ? 1 : 0;
    if (aOut !== bOut) return aOut - bOut;
    return 0;
  });
}

export function isOutOfStock(product) {
  return totalStock(product) <= 0;
}

export function cartHasOutOfStock(cartItems, productsMap) {
  for (const c of cartItems || []) {
    const p = productsMap?.[c.product_id];
    if (p && isOutOfStock(p)) return p;
  }
  return null;
}
