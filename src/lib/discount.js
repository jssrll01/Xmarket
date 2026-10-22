import { getPromoDisplay } from './promo';
export function discountPercent(price) {
  const p = getPromoDisplay(price);
  return p.hasPromo ? p.discountPercent : 0;
}
export function itemDiscount(price, qty) {
  const p = Number(price) || 0, q = Number(qty) || 1;
  return Math.round(p * q * discountPercent(p)) / 100;
}
export function firstNumber(text) {
  const m = String(text || '').replace(/,/g, '').match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}
