export const topic = 'orders/shipping/returns';
export const triggers = ['return to sender', 'RTS', 'return shipping', 'return label', 'return parcel'];

export default [
{
    id: 'shipping_return_to_sender',
    keywords: ['returned to sender', 'parcel returned seller', 'package sent back seller', 'return to sender shipping', 'RTS package'],
    answer: "If a shipment is returned to the sender, check the tracking information for the reason and contact XMARKET Support if you need help determining the next step.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
{
    id: 'shipping_return_sender',
    keywords: ['return to sender', 'RTS', 'package returned seller', 'shipment returned to seller', 'parcel RTS'],
    answer: "Return to Sender means the courier is sending the package back to the seller instead of completing delivery. Check the tracking details and contact support if you believe the return happened incorrectly.",
    links: [{ label: 'Track Order', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
{
    id: 'shipping_return_shipping',
    keywords: ['return shipping', 'shipping for return', 'return delivery fee', 'cost to return item', 'return package shipping'],
    answer: "Return-shipping arrangements depend on the reason for the return, approval status, seller policy, courier process, and applicable XMARKET rules. Follow the return instructions provided for the order.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
{
    id: 'shipping_return_label',
    keywords: ['return label', 'shipping label return', 'return waybill', 'return shipping label', 'label for return'],
    answer: "When a return label is provided, use the label and instructions associated with the approved return. Do not send the item to an unverified address.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
{
    id: 'shipping_return_tracking',
    keywords: ['return tracking', 'track return package', 'return shipment tracking', 'track returned item', 'return parcel tracking'],
    answer: "If your return has tracking information, use it to monitor the package until it reaches the required destination. Keep the tracking number as proof of shipment.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }, { label: 'Track Order', to: '/orders' }],
  },
{
    id: 'shipping_package_returned',
    keywords: ['package returned', 'parcel returned', 'shipment sent back', 'delivery returned', 'package went back'],
    answer: "If a parcel is returned to the seller, check the tracking reason and order status. If the return was unexpected, contact support with the order and tracking information.",
    links: [{ label: 'Track Order', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
{
    id: 'shipping_delivery_refund',
    keywords: ['refund for delivery problem', 'refund lost package', 'refund failed delivery', 'refund undelivered order', 'money back delivery issue'],
    answer: "If a delivery problem makes an order eligible for a refund, use the applicable order refund or support process. Eligibility and refund handling depend on the circumstances of the shipment.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
{
    id: 'shipping_rts_recipient_unavailable',
    keywords: ['RTS recipient unavailable', 'returned because nobody home', 'return to sender missed delivery'],
    answer: "If repeated delivery attempts fail because the recipient cannot receive the parcel, the courier may return it to the seller according to its procedures.",
    links: [],
  },
{
    id: 'shipping_rts_refused',
    keywords: ['refused package', 'refuse delivery', 'decline parcel', 'package refused'],
    answer: "Refusing a parcel can cause it to be returned to the seller. If you no longer want an order, use the available cancellation or return process instead of refusing delivery when possible.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
{
    id: 'shipping_rts_refund',
    keywords: ['refund after return to sender', 'RTS refund', 'returned parcel refund', 'refund returned package'],
    answer: "If an order is returned to the seller, refund handling depends on the order status, payment method, and applicable marketplace rules. Check the order details or contact support for the specific case.",
    links: [],
  },
{
    id: 'shipping_resend',
    keywords: ['resend order', 'reship order', 'send replacement', 'ship again'],
    answer: "A replacement or re-shipment may be possible depending on the order issue and seller policy. Contact support or follow the available resolution shown on the order.",
    links: [],
  },
{
    id: 'shipping_replacement_tracking',
    keywords: ['replacement tracking', 'track replacement', 'replacement shipment', 'replacement package'],
    answer: "If a replacement shipment is approved, tracking information may become available once the replacement is dispatched and scanned by the courier.",
    links: [],
  },
{
    id: 'shipping_refund',
    keywords: ['shipping fee refund', 'refund shipping fee', 'delivery fee refund', 'shipping refund'],
    answer: "Whether a shipping fee is refunded depends on the reason for the refund, order status, applicable policies, and the outcome of the return or refund request.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
{
    id: 'shipping_return_cost',
    keywords: ['return shipping fee', 'return delivery fee', 'who pays return shipping', 'return shipping cost'],
    answer: "Return-shipping costs depend on the reason for the return, the applicable return policy, and the approved return arrangement.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
];
