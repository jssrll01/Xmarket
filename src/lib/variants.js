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
  const v = lookupCombo(product.variant_prices, selection);
  return typeof v === 'number' ? v : 0;
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
  const cfg = product.variant_config;
  const dims = (cfg && typeof cfg === 'object') ? Object.keys(cfg) : [];
  const hasRealVariants = dims.some(d => Array.isArray(cfg[d]) && cfg[d].length > 0);
  // No real variants → not stock-tracked → always available
  if (!hasRealVariants) return Infinity;
  const map = product.variant_stock;
  // Has variants but no stock data entered → treat as unlimited
  if (!map || typeof map !== 'object' || Object.keys(map).length === 0) return Infinity;
  // Has variants AND stock data → check specific combo
  if (!selection || !Object.keys(selection).length) return Infinity;
  const found = lookupCombo(map, selection);
  if (typeof found === 'number') return found;
  // Selection doesn't match any stock entry → treat as unlimited
  return Infinity;
}

/**
 * Total stock across all variant combos. Falls back to product.stock
 * when there are no variants defined.
 */
export function totalStock(product) {
  if (!product) return 0;
  const cfg = product.variant_config;
  const dims = (cfg && typeof cfg === 'object') ? Object.keys(cfg) : [];
  const hasRealVariants = dims.some(d => Array.isArray(cfg[d]) && cfg[d].length > 0);
  // No real variants → not stock-tracked
  if (!hasRealVariants) return Infinity;
  const map = product.variant_stock;
  // Has variants but no stock data → unlimited
  if (!map || typeof map !== 'object' || Object.keys(map).length === 0) return Infinity;
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

/**
 * True if the product has at least one variant dimension with options.
 * Checks `variant_config` only; the legacy `variants` array is ignored.
 */
export function hasRealVariants(product) {
  if (!product) return false;
  const cfg = product.variant_config;
  if (!cfg || typeof cfg !== 'object') return false;
  return Object.keys(cfg).some(d => Array.isArray(cfg[d]) && cfg[d].length > 0);
}

function _num(v) {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function _norm(str) {
  return String(str).toLowerCase().replace(/\u00d7/g, 'x').replace(/\s+/g, ' ').trim();
}
function _perms(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  arr.forEach((v, i) => {
    _perms(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(q => out.push([v].concat(q)));
  });
  return out;
}

/** Tolerant lookup of a variant combo in a price/stock map. */
export function lookupCombo(map, selection) {
  if (!map || typeof map !== 'object' || !selection || typeof selection !== 'object') return undefined;
  for (const k of [comboLabel(selection), comboKey(selection)]) {
    if (k && _num(map[k]) !== undefined) return _num(map[k]);
  }
  const parts = [];
  Object.keys(selection).forEach(d => String(selection[d]).split(' / ').forEach(x => parts.push(x)));
  if (!parts.length || parts.length > 5) return undefined;
  const normMap = {};
  Object.keys(map).forEach(k => { if (_num(map[k]) !== undefined) normMap[_norm(k)] = _num(map[k]); });
  for (const q of _perms(parts)) {
    const v = normMap[_norm(q.join(' / '))];
    if (v !== undefined) return v;
  }
  return undefined;
}
