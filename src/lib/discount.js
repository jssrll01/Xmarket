
import {
  getPromoDisplay,
  loadDiscountTiers,
  computeDiscountForPrice,
} from './promo';

let tiersPromise = null;

export function loadDiscountRules() {
  if (!tiersPromise) {
    tiersPromise = loadDiscountTiers().catch((error) => {
      tiersPromise = null;
      throw error;
    });
  }

  return tiersPromise;
}

export function discountPercent(price, tiers) {
  const promo = getPromoDisplay(price, tiers);
  return promo.hasPromo ? promo.discountPercent : 0;
}

export async function loadDiscountPercent(price) {
  try {
    const tiers = await loadDiscountRules();
    return discountPercent(price, tiers);
  } catch (error) {
    console.error('Unable to load discount tiers:', error);
    return 0;
  }
}

export function itemDiscount(price, qty, tiers) {
  const p = Number(price);
  const q = Number(qty);

  if (!Number.isFinite(p) || p <= 0) return 0;
  if (!Number.isFinite(q) || q <= 0) return 0;

  // Without loaded rules, do not claim a discount was applied.
  if (!Array.isArray(tiers) || tiers.length === 0) return 0;

  const result = computeDiscountForPrice(p, tiers);

  // The maximum discount applies to the entire product line.
  const lineDiscount = result.discount * q;
  const cap = Number(result.tier?.max_discount);

  const cappedDiscount = Number.isFinite(cap) && cap >= 0
    ? Math.min(lineDiscount, cap)
    : lineDiscount;

  return Math.round(cappedDiscount * 100) / 100;
}

export function firstNumber(text) {
  const m = String(text || '').replace(/,/g, '').match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}
