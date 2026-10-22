export function getPromoDisplay(priceNum) {
  const price = Number(priceNum);
  if (!price || isNaN(price) || price <= 0) {
    return { hasPromo: false, label: 'Great Value', originalPrice: null, discountPercent: 0 };
  }

  let rate = 0;
  if (price <= 100) rate = 0.05;
  else if (price <= 299) rate = 0.08;
  else if (price <= 499) rate = 0.10;
  else if (price <= 999) rate = 0.12;
  else if (price <= 1999) rate = 0.15;
  else if (price <= 4999) rate = 0.18;
  else if (price <= 9999) rate = 0.20;
  else rate = 0.25;

  const referencePrice = price / (1 - rate);
  const percentOff = Math.round(rate * 100);

  return {
    hasPromo: true,
    originalPrice: referencePrice,
    discountPercent: percentOff,
    badgeText: `${percentOff}% OFF`,
    label: null
  };
}
