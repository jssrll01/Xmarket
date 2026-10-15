export const topic = 'sellers/orders';
export const triggers = ['seller order', 'seller cancelled order', 'seller processed order', 'seller preparing order', 'seller shipped order'];

export default [
  {
    id: 'shop_seller_order_process',
    keywords: ['seller order process', 'how seller processes order', 'seller order handling', 'seller order steps', 'seller fulfillment'],
    answer: "Sellers generally process orders by confirming the purchase, preparing the items, and shipping them according to the applicable fulfillment process. Check your order details for available status updates.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_confirmed',
    keywords: ['seller confirmed order', 'order confirmed by seller', 'seller accepted order', 'seller acknowledgement', 'seller accepted purchase'],
    answer: "A confirmed order has been accepted for processing. Continue checking My Orders for shipment and delivery updates.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_preparing',
    keywords: ['seller preparing order', 'seller packing order', 'order being prepared', 'seller packing purchase', 'seller processing order'],
    answer: "When an order is being prepared, the seller is packing the items for shipment. Check My Orders for status changes and tracking information when it becomes available.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_shipped',
    keywords: ['seller shipped order', 'seller dispatched order', 'seller sent package', 'order shipped by seller', 'seller handed to courier'],
    answer: "A shipped order has been handed to the courier or is being processed for delivery. Tracking information may be available in the order details.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_delivered',
    keywords: ['seller delivered order', 'order delivered from seller', 'seller completed delivery', 'seller delivered', 'seller order complete'],
    answer: "When the order shows as delivered, check the package, confirm that the items match your order, and use the available review or Return / Refund options if needed.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_problem',
    keywords: ['seller order problem', 'problem with seller order', 'seller order issue', 'seller purchase problem', 'seller transaction issue'],
    answer: "If a problem arises with a seller order, first review the order details and any available communication. If the issue cannot be resolved there, use the available support or Return / Refund process.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_order_cancel',
    keywords: ['seller cancelled order', 'seller cancel purchase', 'seller cancelled my order', 'seller cancelled sale', 'seller cancellation'],
    answer: "If a seller cancels your order, review the order details for the cancellation reason and any applicable refund information.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_delay',
    keywords: ['seller delayed order', 'seller late order', 'seller shipment delay', 'seller order delayed', 'seller slow order'],
    answer: "If a seller delays an order beyond the expected processing period, check the order status and contact XMARKET Support if the delay continues.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_order_modify',
    keywords: ['modify seller order', 'change seller order', 'edit seller order', 'seller order update', 'adjust seller order'],
    answer: "After an order is placed, changes may not be possible once the seller has processed or shipped it. Check the order for any available modification options.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_address',
    keywords: ['seller order address', 'seller shipping address', 'change address seller order', 'address for seller order', 'seller delivery address'],
    answer: "The seller ships to the delivery address associated with the order. Address changes may be limited after the order is placed and are usually no longer possible once shipped.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_contact',
    keywords: ['contact seller about order', 'message seller about order', 'seller order message', 'order chat seller', 'seller order communication'],
    answer: "Use the available seller chat option in the order details to ask order-related questions. Avoid sharing sensitive account or payment information in chats.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_order_support',
    keywords: ['seller order support', 'help seller order', 'order problem seller', 'seller order assistance', 'seller order help'],
    answer: "If you need help with a seller order, review the order details first. If the issue cannot be resolved through the available seller communication or order controls, contact XMARKET Support.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
];
