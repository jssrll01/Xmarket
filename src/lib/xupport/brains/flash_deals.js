export const topic = 'flash_deals';
export const triggers = ['flash deal', 'flash sale', 'limited time deal', 'flash discount'];

export default [
  {
    id: 'flash_deals',
    keywords: ['Flash Deals', 'flash sale', 'limited time deals', 'flash discount', 'flash sale products'],
    answer: "Flash Deals are time-limited promotions where selected products may be offered at special prices. Availability, quantity, and campaign duration can be limited.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }],
  },
  {
    id: 'flash_deals_how',
    keywords: ['how Flash Deals work', 'how flash sale works', 'join Flash Deal', 'buy Flash Deal', 'Flash Deals purchase'],
    answer: "Open Flash Deals, choose an available product, review its promotion details and remaining availability, then complete checkout while the deal is active.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }],
  },
  {
    id: 'flash_deals_expired',
    keywords: ['Flash Deal expired', 'flash sale ended', 'flash deal ended', 'missed Flash Deal', 'expired flash sale'],
    answer: "Once a Flash Deal ends, its promotional price may no longer be available. Check the Flash Deals page for current campaigns.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }],
  },
  {
    id: 'flash_deals_sold_out',
    keywords: ['Flash Deal sold out', 'flash sale sold out', 'flash deal unavailable', 'flash product sold out', 'deal sold out'],
    answer: "Flash Deal quantities can be limited. If a promotional item sells out, the special price may no longer be available.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }],
  },
  {
    id: 'flash_deals_price',
    keywords: ['Flash Deal price', 'flash sale price', 'discounted flash price', 'deal price', 'flash discount amount'],
    answer: "The promotional price shown on the Flash Deals page is subject to the campaign's conditions, timing, product availability, and stock limits. Review the price again at checkout.",
    links: [{ label: 'Flash Deals', to: '/flash-deals' }, { label: 'Checkout', to: '/checkout' }],
  },
];
