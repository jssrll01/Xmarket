export const topic = 'discounts';
export const triggers = ['discount', 'sale price', 'flash deal', 'promo', 'promotion', 'coupon', 'best price', 'price mismatch'];

export default [
  {
    id: 'discount_how',
    keywords: ['how discounts work', 'discounts', 'product discount', 'sale discount', 'discounted products'],
    answer: "Discounts may be offered through product markdowns, seller promotions, vouchers, or marketplace campaigns. Check the product and checkout price breakdown to see which discounts apply.",
    links: [{ label: 'Deals', to: '/deals' }, { label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'discount_sale_price',
    keywords: ['sale price', 'discounted price', 'original price sale', 'product sale', 'sale discount'],
    answer: "A discounted product displays its current selling price along with applicable promotional information when provided. Review the final checkout total before purchasing.",
    links: [{ label: 'Deals', to: '/deals' }, { label: 'Shop', to: '/shop' }],
  },
  {
    id: 'discount_flash_deal',
    keywords: ['Flash Deals', 'flash deal', 'flash sale', 'limited deal', 'flash discount'],
    answer: "Flash Deals are time-limited promotions that may have limited stock or purchase conditions. Check the deal page for the current price, validity period, and available quantity.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }],
  },
  {
    id: 'discount_flash_expired',
    keywords: ['flash deal expired', 'flash sale ended', 'flash discount expired', 'flash deal unavailable', 'missed flash deal'],
    answer: "A Flash Deal may no longer be available after its promotion period ends or its promotional stock is exhausted. Check current deals for other available offers.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }],
  },
  {
    id: 'discount_price_changed',
    keywords: ['price changed', 'price increased', 'price went up', 'price different checkout', 'product price changed'],
    answer: "Product prices can change based on seller updates, promotions, stock conditions, or other marketplace settings. Always use the final price displayed at checkout before placing the order.",
    links: [{ label: 'Shop', to: '/shop' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'discount_price_mismatch',
    keywords: ['price mismatch', 'different price checkout', 'wrong product price', 'listing price different', 'price discrepancy'],
    answer: "If the price at checkout differs from the product listing, review variations, quantity, seller promotions, vouchers, and the final checkout breakdown. If the discrepancy remains unexplained, contact support.",
    links: [{ label: 'Checkout', to: '/checkout' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'discount_coupon',
    keywords: ['coupon', 'coupon code', 'promo code', 'discount code', 'coupon code XMARKET'],
    answer: "If XMARKET supports coupon or promotional codes, enter the code in the applicable checkout field and verify that the discount is applied before placing the order.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'discount_promo',
    keywords: ['promo', 'promotion', 'promotions', 'special offer', 'promotional offer'],
    answer: "Current promotions may include product discounts, seller offers, vouchers, Flash Deals, or other campaigns. Check the Deals and Vouchers sections for available promotions.",
    links: [{ label: 'Deals', to: '/deals' }, { label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'discount_promo_expired',
    keywords: ['promotion expired', 'promo expired', 'expired sale', 'promotion ended', 'promo ended'],
    answer: "Promotions are only valid during their stated promotional period and while applicable conditions are met. Check current Deals for active offers.",
    links: [{ label: 'Deals', to: '/deals' }],
  },
  {
    id: 'discount_best_price',
    keywords: ['best price', 'cheapest price', 'find cheapest', 'best deal', 'lowest price'],
    answer: "Compare product prices, seller offers, available vouchers, shipping fees, ratings, and reviews rather than looking at the item price alone. The best overall value depends on the complete checkout total.",
    links: [{ label: 'Shop', to: '/shop' }, { label: 'Deals', to: '/deals' }, { label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'discount_apply_before_payment',
    keywords: ['apply discount before payment', 'voucher before paying', 'discount before checkout payment', 'apply coupon before payment', 'discount payment'],
    answer: "Apply eligible vouchers or promotional codes before confirming payment. Always verify the discounted total before completing the transaction.",
    links: [{ label: 'Checkout', to: '/checkout' }, { label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'discount_after_order',
    keywords: ['apply voucher after order', 'add discount after purchase', 'voucher after ordering', 'discount after checkout', 'coupon after payment'],
    answer: "Discounts and vouchers generally need to be applied before an order is confirmed. If you forgot to use a voucher, check whether the order can still be cancelled before placing a new discounted order.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Vouchers', to: '/vouchers' }],
  },
  {
    id: 'discount_refund_calculation',
    keywords: ['refund discount calculation', 'refund after discount', 'discount affects refund', 'voucher affects refund', 'refund discounted order'],
    answer: "Refund calculations can account for discounts and vouchers used on the original order. Check the refund breakdown for the exact amount approved.",
    links: [{ label: 'Refunds', to: '/refunds' }, { label: 'Vouchers', to: '/vouchers' }],
  },
];
