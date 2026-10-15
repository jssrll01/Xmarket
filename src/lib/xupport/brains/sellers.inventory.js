export const topic = 'sellers/inventory';
export const triggers = ['seller inventory', 'stock by seller', 'seller out of stock', 'seller inventory issue', 'seller restock'];

export default [
  {
    id: 'shop_seller_inventory_help',
    keywords: ['seller inventory help', 'inventory problem seller', 'seller stock help', 'stock issue seller', 'seller inventory support'],
    answer: "For a seller inventory issue, review the product listing and order status. If the problem affects your order or purchase, contact XMARKET Support with the details.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_inventory_accuracy',
    keywords: ['seller stock accuracy', 'seller inventory accuracy', 'wrong stock info', 'incorrect stock', 'stock information problem'],
    answer: "Stock information can change as items sell or restock. If a listing displays an incorrect stock status, report it to XMARKET Support so it can be reviewed.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
];
