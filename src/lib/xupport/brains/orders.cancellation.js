export const topic = 'orders/cancellation';
export const triggers = ['cancel order', 'cancellation', 'cancel purchase', 'seller cancelled', 'system cancelled', 'cancel'];

export default [
  {
    id: 'account_order_cancel',
    keywords: ['cancel order', 'cancel my order', 'how to cancel purchase', 'order cancellation', 'want to cancel order'],
    answer: "Open the relevant XMARKET order and check whether the Cancel Order option is available. Cancellation availability depends on the current order status.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_cancel_unavailable',
    keywords: ['cannot cancel order', 'cancel button missing', 'order cannot be cancelled', 'cancellation unavailable', 'cancel order disabled'],
    answer: "If the Cancel Order option is unavailable, the order may already have progressed to a stage where cancellation is no longer supported. Check the order status and available options.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_cancel_pending',
    keywords: ['cancellation pending', 'cancel request pending', 'waiting cancellation', 'order cancellation pending', 'cancel processing'],
    answer: "If your XMARKET cancellation request is pending, check the order status for updates and wait for the cancellation result shown by the system.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_cancel_rejected',
    keywords: ['cancellation rejected', 'cancel request rejected', 'order cancellation denied', 'cannot cancel after request', 'cancel declined'],
    answer: "If your cancellation request was rejected, review the order status and reason provided by XMARKET. If the order has already progressed, you may need to use the applicable return or refund process after delivery.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'account_order_cancelled',
    keywords: ['order cancelled', 'cancelled order', 'why was order cancelled', 'order was cancelled', 'cancelled purchase'],
    answer: "Open the cancelled order to review its current status and any cancellation information provided by XMARKET.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_cancelled_by_seller',
    keywords: ['seller cancelled order', 'seller cancelled my order', 'order cancelled by seller', 'seller cancellation', 'seller did not fulfill'],
    answer: "If a seller cancels your XMARKET order, review the order status and cancellation information. If a payment was already made, check the applicable refund information.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'account_order_cancelled_by_system',
    keywords: ['system cancelled order', 'xmarket cancelled order', 'automatically cancelled', 'order automatically cancelled', 'system cancellation'],
    answer: "If XMARKET automatically cancels an order, review the order details for the cancellation reason and any applicable refund information.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
];
