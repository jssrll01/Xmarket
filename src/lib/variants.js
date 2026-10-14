/**
 * Variant model
 * -------------
 * product.variants        — legacy: flat array of strings (still supported)
 * product.variant_config  — new: { "Color": ["Red","Blue"], "Size": ["S","M"] }
 * product.variant_prices  — new: { "Red / S": 199, "Red / M": 219, ... }  (optional)
 */

/** Normalize to config shape regardless of which field is populated. */
export function getVariantConfig(product) {
  if (!product) return {};
  const cfg = product.variant_config;
  if (cfg && typeof cfg === 'object' && Object.keys(cfg).length > 0) return cfg;
  const flat = product.variants;
  if (Array.isArray(flat) && flat.length > 0) return { Variant: flat };
  return {};
}

/** True if the product has any variant options. */
export function hasVariants(product) {
  return Object.keys(getVariantConfig(product)).length > 0;
}

/** Stable key for a combo: { Color:'Red', Size:'M' } → 'Color=Red|Size=M' */
export function comboKey(selection) {
  if (!selection || typeof selection !== 'object') return '';
  return Object.keys(selection).sort().map(k => `${k}=${selection[k]}`).join('|');
}

/** Human-readable label: 'Red / M' */
export function comboLabel(selection) {
  if (!selection || typeof selection !== 'object') return '';
  return Object.keys(selection).sort().map(k => selection[k]).join(' / ');
}

/** Look up the price for a combo, or fall back to base price. */
export function priceFor(product, selection) {
  if (!product) return 0;
  const prices = product.variant_prices;
  if (!prices || typeof prices !== 'object') return 0;
  const label = comboLabel(selection);
  const byLabel = prices[label];
  if (typeof byLabel === 'number') return byLabel;
  const key = comboKey(selection);
  const byKey = prices[key];
  if (typeof byKey === 'number') return byKey;
  return 0;
}

/** Parse the `variant` text column stored on cart rows back into an object. */
export function parseCartVariant(text) {
  if (!text) return {};
  if (typeof text === 'object') return text;
  try { return JSON.parse(text); } catch { return { Variant: text }; }
}

/** Serialize selection for storage in cart_items.variant. */
export function serializeVariant(selection) {
  if (!selection || !Object.keys(selection).length) return '';
  return JSON.stringify(selection);
}

/** Compute % off from price vs original_price. Returns null if no discount. */
export function discountPct() {
  return null;
}

/**
 * Per-combo stock lookup. Falls back to product.stock if variant_stock
 * is missing or the specific combo isn't listed.
 */
export function stockFor(product, selection) {
  if (!product) return 0;
  const hasConfig = product.variant_config && Object.keys(product.variant_config).length > 0;
  // No variants configured → not stock-tracked → always available
  if (!hasConfig) return Infinity;
  const map = product.variant_stock;
  if (!map || typeof map !== 'object') return 0;
  if (!selection || !Object.keys(selection).length) return 0;
  const label = comboLabel(selection);
  const byLabel = map[label];
  if (typeof byLabel === 'number') return byLabel;
  const key = comboKey(selection);
  const byKey = map[key];
  if (typeof byKey === 'number') return byKey;
  return 0;
}

/**
 * Total stock across all variant combos. Falls back to product.stock
 * when there are no variants defined.
 */
export function totalStock(product) {
  if (!product) return 0;
  const hasConfig = product.variant_config && Object.keys(product.variant_config).length > 0;
  if (!hasConfig) return Infinity;
  const map = product.variant_stock;
  if (!map || typeof map !== 'object' || Object.keys(map).length === 0) return 0;
  let sum = 0;
  for (const k of Object.keys(map)) {
    const v = Number(map[k]) || 0;
    if (v > 0) sum += v;
  }
  return sum;
}

/**
 * Compute a price range across all variant prices, or fall back to base price.
 * Returns { min, max, isRange, display } where display is '₱60' or '₱60–₱90'
 */
export function priceRange(product) {
  if (!product) return { min: 0, max: 0, isRange: false, display: '₱0' };
  const prices = product.variant_prices;
  const hasConfig = product.variant_config && Object.keys(product.variant_config).length > 0;
  const values = (hasConfig && prices && typeof prices === 'object')
    ? Object.values(prices).map(Number).filter(n => n > 0)
    : [];
  if (values.length === 0) {
    return { min: 0, max: 0, isRange: false, display: '₱0' };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const isRange = min !== max;
  return {
    min, max, isRange,
    display: isRange
      ? `₱${min.toLocaleString()}–₱${max.toLocaleString()}`
      : `₱${min.toLocaleString()}`,
  };
}
