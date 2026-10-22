/**
 * XMARKET illustrative reference-price display.
 *
 * Display only. Never use these values for cart totals, checkout,
 * payments, shipping, or actual promotional calculations.
 *
 * A product can override the default percentage through
 * PRODUCT_PERCENT_OVERRIDES, keyed by its product ID.
 *
 * These are illustrative reference prices, NOT verified former prices
 * or claims of actual customer savings.
 */

const PRICE_TIERS = [
  { max: 100, percent: 10 },
  { max: 299, percent: 15 },
  { max: 499, percent: 20 },
  { max: 999, percent: 25 },
  { max: 1999, percent: 30 },
  { max: 4999, percent: 35 },
  { max: 9999, percent: 40 },
  { max: Infinity, percent: 45 },
];

// Configure individual products here when needed.
// Example: 'your-product-id': 20
const PRODUCT_PERCENT_OVERRIDES = {};

export function getIllustrativeReferencePrice(product, actualPrice) {
  const price = Number(actualPrice);

  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  const productId = product?.id ?? product?.uuid;
  const configuredPercent =
    productId != null
      ? PRODUCT_PERCENT_OVERRIDES[String(productId)]
      : undefined;

  const percent = Number.isFinite(Number(configuredPercent))
    && configuredPercent !== undefined
    && configuredPercent !== null
    && Number(configuredPercent) > 0
    && Number(configuredPercent) < 100
      ? Number(configuredPercent)
      : PRICE_TIERS.find((tier) => price <= tier.max).percent;

  return {
    percent,
    referencePrice: Math.round((price / (1 - percent / 100)) * 100) / 100,
    label: 'Illustrative reference price',
  };
}
