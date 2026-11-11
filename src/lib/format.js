
export function safeNum(val, fallback = 0) {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
}

export function safeFixed(val, decimals = 2, fallback = '0.00') {
  const num = Number(val);
  if (isNaN(num)) return fallback;
  return num.toFixed(decimals);
}
