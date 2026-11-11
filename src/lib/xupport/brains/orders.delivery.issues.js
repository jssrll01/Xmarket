export const topic = 'orders/delivery/issues';
export const triggers = ['missing item', 'wrong item', 'damaged', 'not received', 'marked delivered', 'package missing'];

export default [
  {
    id: 'account_order_missing_item',
    keywords: ['missing item order', 'item missing from order', 'product missing', 'order incomplete', 'not all items arrived'],
    answer: "If an item is missing from an XMARKET order, first check the order and shipment information to see whether the missing item is being shipped separately. If it should have arrived, use the available support or return/refund process.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'account_order_wrong_item',
    keywords: ['wrong item received', 'incorrect product received', 'seller sent wrong item', 'wrong product order', 'received different item'],
    answer: "If you received an item different from what you ordered, open the affected order and use the available Return / Refund process. Provide photos or other evidence when requested.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'account_order_damaged_item',
    keywords: ['damaged item', 'item arrived damaged', 'broken product', 'damaged order', 'package damaged'],
    answer: "If an XMARKET item arrives damaged, document the condition with clear photos and open the affected order to use the available Return / Refund process.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'account_order_not_received',
    keywords: ['order not received', 'package not received', 'item never arrived', 'order did not arrive', 'missing delivery'],
    answer: "If your XMARKET order has not arrived, check its tracking and delivery status first. If the order is marked delivered but you did not receive it, report the issue through the available order-support process.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_order_marked_delivered',
    keywords: ['marked delivered but missing', 'delivered but not received', 'tracking says delivered', 'order says delivered', 'package marked delivered'],
    answer: "If tracking says your XMARKET order was delivered but you cannot find it, check with household members or the delivery location first. If it is still missing, report the delivery issue through the appropriate support process.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
];
