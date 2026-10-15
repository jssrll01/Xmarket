export const topic = 'sellers/products';
export const triggers = ['seller product', 'seller inventory', 'seller stock', 'seller listing', 'seller catalog'];

export default [
  {
    id: 'shop_seller_product_variation',
    keywords: ['seller variation', 'seller product variation', 'seller listing variation', 'seller option', 'seller choices'],
    answer: "Sellers set the variations for their own listings. Select the required variation on the product page before purchasing.",
    links: [],
  },
  {
    id: 'shop_seller_product_price',
    keywords: ['seller price', 'price set by seller', 'seller product price', 'product seller pricing', 'seller listing price'],
    answer: "Sellers set their own product prices, which may change because of promotions, updates, or inventory. The current price is shown on the listing.",
    links: [],
  },
  {
    id: 'shop_seller_product_stock',
    keywords: ['seller stock', 'seller inventory', 'seller stock level', 'product stock seller', 'seller availability'],
    answer: "Stock information is maintained by the seller and can change. Check the listing for current availability before ordering.",
    links: [],
  },
  {
    id: 'shop_seller_product_remove',
    keywords: ['seller removed product', 'seller deleted listing', 'product removed seller', 'seller took down product', 'listing removed seller'],
    answer: "If a seller removes a listing, the product may no longer be available for purchase. Check the marketplace for another listing if needed.",
    links: [],
  },
  {
    id: 'shop_seller_product_update',
    keywords: ['seller updated product', 'seller changed listing', 'listing update', 'product listing changed', 'seller modified listing'],
    answer: "Sellers can update their listings, including descriptions, prices, images, variations, and stock. Review the current listing before purchasing.",
    links: [],
  },
  {
    id: 'shop_seller_product_restock',
    keywords: ['seller restock', 'when seller restocks', 'seller restocking item', 'seller restock product', 'restock from seller'],
    answer: "Restocking depends on the seller. Check the listing periodically for updated availability or use any available restock notification feature.",
    links: [],
  },
  {
    id: 'shop_seller_inventory_issue',
    keywords: ['seller inventory issue', 'seller stock problem', 'seller inventory error', 'incorrect stock seller', 'seller inventory mistake'],
    answer: "If a seller reports an inventory issue with your order, review the order status and any available cancellation or refund options.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_inventory_unavailable',
    keywords: ['seller item unavailable', 'seller out of stock', 'seller no inventory', 'seller sold out', 'seller stock unavailable'],
    answer: "If a seller no longer has stock for a listed product, the item may be unavailable for purchase. Look for another listing or seller if needed.",
    links: [],
  },
  {
    id: 'shop_seller_inventory_remove',
    keywords: ['seller item removed', 'seller removed stock', 'seller deleted item', 'seller removed listing stock', 'seller deleted listing item'],
    answer: "If a seller removes an item from their inventory or listings, the product may no longer appear in the marketplace. Check for alternative listings if needed.",
    links: [],
  },
  {
    id: 'shop_seller_product_bulk',
    keywords: ['bulk order seller', 'bulk purchase', 'wholesale seller', 'large quantity seller', 'bulk quantity product'],
    answer: "Bulk or wholesale availability depends on the seller. Contact the seller through the available chat option to ask about large quantities before placing an order.",
    links: [],
  },
];
