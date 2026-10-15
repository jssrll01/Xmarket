export const topic = 'vouchers';
export const triggers = ['voucher', 'coupon', 'promo code', 'discount code', 'voucher code', 'voucher eligibility'];

export default [
  {
    id: 'voucher',
    keywords: ['voucher', 'coupon', 'promo code', 'discount code', 'voucher code'],
    answer: "Enter an eligible voucher or promo code during checkout and apply it before completing your purchase. Check the voucher's conditions, expiration, minimum spend, and eligible products.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'voucher_how',
    keywords: ['how to use voucher', 'use voucher', 'apply voucher', 'redeem voucher', 'voucher redemption'],
    answer: "At checkout, open the voucher or promo section, select an eligible voucher or enter its code, then apply it. Confirm that the discount appears in the order total before paying.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'voucher_not_working',
    keywords: ['voucher not working', 'voucher failed', 'cannot use voucher', 'voucher invalid', 'promo code not working'],
    answer: "Check the voucher's minimum spend, eligible products or sellers, payment requirements, expiration date, usage limit, and other conditions. If the requirements are met but it still fails, contact support.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'voucher_expired',
    keywords: ['expired voucher', 'voucher expired', 'old voucher', 'expired promo', 'voucher expiration'],
    answer: "Expired vouchers can no longer be redeemed. Check the Vouchers section for currently available promotions.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'voucher_minimum_spend',
    keywords: ['voucher minimum spend', 'minimum order voucher', 'minimum purchase voucher', 'voucher minimum amount', 'spend requirement'],
    answer: "Some vouchers require a minimum eligible order value. The minimum spend and other conditions should be shown in the voucher details.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'voucher_eligible_products',
    keywords: ['voucher eligible products', 'which products voucher', 'voucher product eligibility', 'voucher only certain products', 'eligible items voucher'],
    answer: "Vouchers may apply only to selected products, categories, sellers, or campaigns. Review the voucher details to see its eligible items.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'voucher_one',
    keywords: ['one voucher', 'multiple vouchers', 'stack vouchers', 'use two vouchers', 'combine vouchers'],
    answer: "Voucher combination rules depend on the promotion and checkout system. If multiple vouchers are supported, checkout will show which combinations are eligible.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'voucher_removed',
    keywords: ['voucher disappeared', 'voucher missing', 'voucher gone', 'voucher no longer available', 'voucher removed'],
    answer: "A voucher may disappear when it expires, reaches its usage limit, becomes unavailable, or no longer applies to your order. Check the current Vouchers section for active offers.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'voucher_discount_missing',
    keywords: ['voucher discount missing', 'discount not applied', 'voucher applied but no discount', 'promo discount missing', 'voucher amount missing'],
    answer: "After applying a voucher, check the checkout price breakdown to confirm the discount was applied. If the voucher shows as applied but the total does not change correctly, contact support before completing payment.",
    links: [{ label: 'Checkout', to: '/checkout' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'voucher_usage_limit',
    keywords: ['voucher usage limit', 'voucher limit', 'voucher already used', 'voucher used up', 'voucher redemption limit'],
    answer: "Some vouchers have per-user or campaign-wide redemption limits. If the usage limit has been reached, the voucher may no longer be available for your order.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'voucher_first_order',
    keywords: ['first order voucher', 'new user voucher', 'first purchase discount', 'new customer promo', 'first order coupon'],
    answer: "First-order promotions may be limited to eligible new customers and can have minimum-spend, product, payment, and expiration requirements. Check the voucher details before use.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_where',
    keywords: ['where are vouchers', 'find vouchers', 'voucher page', 'available vouchers', 'my vouchers'],
    answer: "Available vouchers can be viewed in the Vouchers section when provided by XMARKET or participating sellers. Check the voucher terms before using one.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_invalid',
    keywords: ['voucher invalid', 'invalid voucher', 'voucher not working', 'voucher error', 'cannot use voucher'],
    answer: "If a voucher is invalid, check its expiration date, minimum spend, eligible products or sellers, usage limits, and other conditions. Only eligible vouchers can be applied at checkout.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
{
    id: 'voucher_max_discount',
    keywords: ['maximum voucher discount', 'voucher discount limit', 'max voucher', 'voucher capped', 'discount cap'],
    answer: "Some vouchers have a maximum discount amount even when the order exceeds the minimum spend. Check the voucher terms for its discount limit.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_percentage',
    keywords: ['percentage voucher', 'percent discount voucher', '10 percent voucher', '20 percent voucher', 'percentage discount'],
    answer: "Percentage vouchers reduce the eligible purchase amount by the stated percentage, subject to any minimum spend, maximum discount, product restrictions, and other terms.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_fixed',
    keywords: ['fixed voucher', 'fixed amount discount', 'peso voucher', 'cash discount voucher', 'amount off voucher'],
    answer: "Fixed-amount vouchers provide a specified discount from an eligible order, subject to the voucher's terms and minimum purchase requirements.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_seller',
    keywords: ['seller voucher', 'store voucher', 'shop voucher', 'seller discount voucher', 'store coupon'],
    answer: "Seller vouchers are promotions provided by individual sellers and may only apply to eligible products or orders from that seller. Review the voucher terms before checkout.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Shop', to: '/shop' }],
  },
{
    id: 'voucher_xmarket',
    keywords: ['XMARKET voucher', 'marketplace voucher', 'platform voucher', 'XMARKET coupon', 'site voucher'],
    answer: "XMARKET platform vouchers are promotions offered at the marketplace level when available. Check their terms for minimum spend, eligible products, validity, and usage limits.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_multiple',
    keywords: ['multiple vouchers', 'use two vouchers', 'combine vouchers', 'stack vouchers', 'voucher stacking'],
    answer: "Voucher-combination rules depend on the promotion. If multiple vouchers are supported, checkout will show which combinations are eligible.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
{
    id: 'voucher_claim',
    keywords: ['claim voucher', 'collect voucher', 'save voucher', 'get voucher', 'voucher claim'],
    answer: "If a voucher requires claiming or collecting, open the available voucher and use the provided claim or collect control before checkout.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_unavailable',
    keywords: ['voucher unavailable', 'voucher gone', 'voucher disappeared', 'voucher not available', 'no vouchers'],
    answer: "A voucher may be unavailable because it has expired, reached its usage limit, or is no longer being offered. Check the current Vouchers section for active promotions.",
    links: [{ label: 'Vouchers', to: '/vouchers' }],
  },
{
    id: 'voucher_checkout_missing',
    keywords: ['voucher not showing checkout', 'voucher missing checkout', 'cannot find voucher checkout', 'voucher option missing', 'no voucher at checkout'],
    answer: "Make sure the voucher is eligible for the products in your Cart and that you are using the correct account. Available vouchers should appear in the applicable checkout section.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
{
    id: 'voucher_not_received',
    keywords: ['voucher missing', 'voucher disappeared', 'voucher not showing', 'where is my voucher', 'voucher not available'],
    answer: "Check your Vouchers section and confirm that you are signed into the correct XMARKET account. If an expected voucher is still missing, contact support with the promotion details.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Help Center', to: '/help' }],
  },
{
    id: 'voucher_refund',
    keywords: ['voucher after refund', 'refund voucher', 'voucher returned after cancellation', 'voucher comes back', 'voucher refund'],
    answer: "Whether a voucher is restored after cancellation or refund depends on the voucher's terms and the reason and status of the order. Check the voucher conditions and order refund details.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Refunds', to: '/refunds' }],
  },
];
