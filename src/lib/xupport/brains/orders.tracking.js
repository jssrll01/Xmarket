export const topic = 'orders/tracking';
export const triggers = ['track', 'tracking', 'delivery status', 'where is my order', 'estimated delivery', 'delayed', 'shipment', 'delivery'];

export default [
  {
    id: 'account_order_tracking',
    keywords: ['track order', 'order tracking', 'where is my order', 'track package', 'delivery tracking'],
    answer: "Open the order in My Orders to view the available shipping and tracking information.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_tracking_missing',
    keywords: ['tracking not available', 'no tracking number', 'tracking missing', 'cannot track order', 'tracking unavailable'],
    answer: "If tracking information is not yet available, the shipment may not have received tracking information yet. Check the order again later or contact support if the expected tracking information does not appear.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_order_tracking_not_updated',
    keywords: ['tracking not updating', 'tracking stuck', 'tracking status unchanged', 'shipment tracking stuck', 'tracking has not changed'],
    answer: "If your XMARKET tracking status has not changed, allow time for the courier to update its shipment records. If the tracking remains unchanged beyond the expected delivery period, contact support.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_order_delivery_estimate',
    keywords: ['delivery estimate', 'when will order arrive', 'estimated delivery', 'expected delivery date', 'arrival date'],
    answer: "Check the affected order for its available estimated delivery information. Delivery estimates can vary depending on the seller, courier, destination, and shipment conditions.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_late',
    keywords: ['late order', 'order delayed', 'delivery late', 'package delayed', 'order overdue'],
    answer: "If your XMARKET order is late, check its latest tracking status and estimated delivery information. If it is significantly beyond the expected delivery period, contact support.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
];
