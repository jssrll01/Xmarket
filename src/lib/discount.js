import { getPromoDisplay, loadDiscountTiers } from './promo';

let tiersPromise = null;

export function discountPercent(price) {
  const p = getPromoDisplay(price);
  return p.hasPromo ? p.discountPercent : 0;
}

export async function loadDiscountPercent(price) {
  if (!tiersPromise) {
    tiersPromise = loadDiscountTiers().catch((error) => {
      tiersPromise = null;
      throw error;
    });
  }

  try {
    const tiers = await tiersPromise;
    const promo = getPromoDisplay(price, tiers);
    return promo.hasPromo ? promo.discountPercent : 0;
  } catch (error) {
    console.error('Unable to load discount tiers:', error);
    return 0;
  }
}

export function itemDiscount(price, qty) {
  const p = Number(price) || 0;
  const q = Number(qty) || 1;
  return Math.round(p * q * discountPercent(p)) / 100;
}

export function firstNumber(text) {
  const m = String(text || '').replace(/,/g, '').match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}
