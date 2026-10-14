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
  const base = Number(product.price) || 0;
  const prices = product.variant_prices;
  if (!prices || typeof prices !== 'object') return base;
  const label = comboLabel(selection);
  const byLabel = prices[label];
  if (typeof byLabel === 'number') return byLabel;
  const key = comboKey(selection);
  const byKey = prices[key];
  if (typeof byKey === 'number') return byKey;
  return base;
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
export function discountPct(product) {
  const price = Number(product?.price) || 0;
  const orig = Number(product?.original_price) || 0;
  if (!orig || orig <= price) return null;
  return Math.round(((orig - price) / orig) * 100);
}
