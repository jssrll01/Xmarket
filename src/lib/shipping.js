export const SHIPPING_TIERS = [
  { max: 99.99, fee: 25 },
  { max: 199.99, fee: 20 },
  { max: 299.99, fee: 19 },
  { max: 499.99, fee: 18 },
  { max: 999.99, fee: 16 },
  { max: 1499.99, fee: 14 },
  { max: 1999.99, fee: 12 },
  { max: 2999.99, fee: 10 },
  { max: 4999.99, fee: 8 },
  { max: 7499.99, fee: 6 },
  { max: 9999.99, fee: 5 },
  { max: Infinity, fee: 3 },
];

export function getShippingFee(subtotal) {
  const num = Number(subtotal);
  if (isNaN(num) || num <= 0) {
    return 0;
  }
  for (const tier of SHIPPING_TIERS) {
    if (num <= tier.max) {
      return tier.fee;
    }
  }
  return 3;
}
