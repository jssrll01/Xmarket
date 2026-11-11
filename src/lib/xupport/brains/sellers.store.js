export const topic = 'sellers/store';
export const triggers = ['seller', 'store', 'shop profile', 'follow seller', 'seller rating', 'seller contact'];

export default [
  {
    id: 'shop_product_seller',
    keywords: ['who sells product', 'product seller', 'seller of product', 'shop owner product', 'seller information'],
    answer: "The product listing should identify the seller when seller information is available. Open the listing to review the seller profile and other available seller details.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_profile',
    keywords: ['seller profile', 'view seller', 'seller shop', 'seller store', 'shop profile'],
    answer: "Open the seller information on a product listing to view the seller's marketplace profile and available products.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_products',
    keywords: ['seller products', 'more products seller', 'seller catalog', 'seller items', 'view seller products'],
    answer: "Open the seller's profile or shop from a product listing to browse other products offered by that seller.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_rating',
    keywords: ['seller rating', 'seller reviews', 'seller reputation', 'seller score', 'rate seller'],
    answer: "Review the seller's available ratings and customer feedback before purchasing. Seller performance information may vary by account and marketplace features.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_follow_seller',
    keywords: ['follow seller', 'follow shop', 'seller follow', 'subscribe seller', 'favorite seller'],
    answer: "If seller following is supported, open the seller's shop or profile and use the available Follow option to receive or access updates.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_product_sold_by',
    keywords: ['sold by', 'seller name', 'who sells this', 'sold by seller', 'product sold by'],
    answer: "The seller's information is available on the product listing when supported. Review it before purchasing, especially when comparing multiple listings for the same type of product.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_chat',
    keywords: ['seller chat', 'chat seller', 'message seller', 'contact seller', 'talk to seller'],
    answer: "Open the product listing and use the available seller chat or contact option to ask questions directly. Never share passwords, OTPs, or unnecessary sensitive information.",
    links: [{ label: 'Shop', to: '/shop' }, { label: 'Chat', to: '/chat' }],
  },
  {
    id: 'shop_seller_no_response',
    keywords: ['seller not responding', 'seller does not reply', 'seller ignoring message', 'no seller response', 'seller chat no reply'],
    answer: "Seller response times can vary. If you need information before purchasing, review the listing details first and contact support if the seller's behavior creates an order or marketplace issue.",
    links: [{ label: 'Chat', to: '/chat' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_product_report_seller',
    keywords: ['report seller product', 'seller listing report', 'seller violation', 'report seller listing', 'seller breaking rules'],
    answer: "Use the available reporting feature to report a seller or listing that appears to violate XMARKET rules. Provide specific and accurate information about the issue.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_product_seller_review',
    keywords: ['seller reviews', 'review seller', 'rate seller shop', 'seller feedback', 'seller store review'],
    answer: "Review the seller's available feedback and ratings when supported. Consider multiple reviews and the product information before purchasing.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_product_seller_contact',
    keywords: ['ask seller', 'contact seller product', 'seller question', 'message seller product', 'seller inquiry'],
    answer: "Use the available seller chat or contact option from the product or seller page to ask questions about a specific product or listing.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_product_seller_policy',
    keywords: ['seller policy', 'seller return policy', 'seller shipping policy', 'store policy', 'seller rules'],
    answer: "Individual sellers may have their own policies in addition to XMARKET marketplace rules. Review the seller or product information provided before purchasing.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_store',
    keywords: ['seller store', 'shop store', 'store page', 'seller shop page', 'store information'],
    answer: "Open the seller or store page to view the seller's available products and profile information.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_info',
    keywords: ['seller info', 'info about seller', 'seller details', 'who is seller', 'seller information page'],
    answer: "Seller details are shown on the seller profile or product listing when available. Review them before purchasing when seller reliability is important to you.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_badge',
    keywords: ['verified seller', 'seller badge', 'trusted seller', 'seller verification', 'official seller'],
    answer: "If verification or trust badges are available, they are displayed on the seller profile or product listing. Always review other listing details as well.",
    links: [{ label: 'Shop', to: '/shop' }],
  },
  {
    id: 'shop_seller_respond',
    keywords: ['seller response time', 'how long seller reply', 'seller reply time', 'waiting for seller reply', 'seller response'],
    answer: "Seller response time can vary depending on the seller's operating hours, workload, and marketplace conditions. Review the listing details first if you need an immediate answer.",
    links: [{ label: 'Chat', to: '/chat' }],
  },
  {
    id: 'shop_seller_unresponsive',
    keywords: ['seller not replying', 'seller ignoring chat', 'no reply from seller', 'seller unreachable', 'seller silent'],
    answer: "If a seller does not respond and your order is affected, keep your order details and use the available support or Return / Refund process rather than sending repeated messages.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_suspend',
    keywords: ['seller suspended', 'seller banned', 'seller account suspended', 'seller disabled', 'seller removed'],
    answer: "If a seller account is suspended or removed, review the status of your existing orders through My Orders and contact XMARKET Support if assistance is needed.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
];
