export const topic = 'sellers/support';
export const triggers = ['seller problem', 'seller complaint', 'seller dispute', 'report seller', 'seller issue', 'seller unresponsive', 'seller scam', 'seller', 'respond', 'reply', 'seller not responding'];

export default [
  {
    id: 'shop_seller_dispute',
    keywords: ['seller dispute', 'dispute seller', 'seller problem order', 'seller disagreement', 'seller order issue'],
    answer: "If you have a dispute with a seller, keep your order details, chat messages, and evidence, then use the available XMARKET support or dispute process.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_complaint',
    keywords: ['seller complaint', 'complain about seller', 'report bad seller', 'seller misbehavior', 'seller issue report'],
    answer: "Use the available reporting or support option to submit a complaint about a seller. Provide accurate details and evidence to help XMARKET review the issue.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_scam',
    keywords: ['seller scam', 'scam seller', 'fraud seller', 'seller fraud', 'seller cheating'],
    answer: "If you suspect a seller is attempting to scam you, do not send additional payments or share sensitive information. Keep evidence and report the seller through XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_offplatform',
    keywords: ['seller asks payment outside', 'seller off platform', 'pay seller directly', 'seller outside xmarket', 'off xmarket payment'],
    answer: "Be cautious if a seller asks you to pay outside XMARKET or move communication off the platform. These requests may remove important purchase protections.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_not_shipping',
    keywords: ['seller not shipping', 'seller won\'t ship', 'seller has not shipped', 'seller delaying shipment', 'seller did not ship'],
    answer: "If a seller does not ship an order within the expected period, check the order status and contact XMARKET Support if the delay continues beyond the applicable processing time.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_cancels_order',
    keywords: ['seller cancelled order', 'seller cancel order', 'seller refused order', 'seller cancelled my order', 'seller cancels purchase'],
    answer: "If a seller cancels your order, check the order details for the cancellation reason and any applicable refund information.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_missing_item',
    keywords: ['seller missing item', 'seller did not include item', 'seller sent incomplete order', 'seller omitted product', 'seller incomplete order'],
    answer: "If a seller ships an incomplete order, keep the package and evidence and use the available Return / Refund or support process.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }, { label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shop_seller_wrong_item',
    keywords: ['seller wrong item', 'seller sent wrong product', 'seller shipped wrong item', 'seller incorrect item', 'seller different product'],
    answer: "If a seller ships a different product from what you ordered, submit a Return / Refund request with the applicable reason and evidence.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'shop_seller_fake_product',
    keywords: ['seller fake product', 'seller counterfeit', 'seller fake item', 'seller sold counterfeit', 'counterfeit from seller'],
    answer: "If a seller ships a suspected counterfeit product, preserve the product, packaging, and order information as evidence and report the issue through XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_bad_packaging',
    keywords: ['seller bad packaging', 'seller poor packaging', 'seller packaging problem', 'damaged because of packaging', 'seller weak packaging'],
    answer: "If poor packaging resulted in damage, document the packaging and product with photos and use the applicable Return / Refund process.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'shop_seller_no_response',
    keywords: ['seller not responding', 'seller no reply', 'seller ignoring messages', 'seller chat ignored', 'seller no response'],
    answer: "If a seller is unresponsive but the order is still within a normal processing window, allow time for a response. If the issue continues and affects the order, contact XMARKET Support.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_contact_problem',
    keywords: ['cannot contact seller', 'seller contact unavailable', 'seller chat not working', 'cannot message seller', 'seller contact problem'],
    answer: "If seller communication is not working, check your connection and try again. If the problem continues and affects an order, contact XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_blocked',
    keywords: ['seller blocked me', 'blocked by seller', 'seller restricted me', 'seller blocked chat', 'cannot reach seller'],
    answer: "If a seller has blocked or restricted communication, use the available XMARKET support or order-related reporting process instead of creating repeated accounts or messages.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_report',
    keywords: ['report seller', 'report store', 'report shop', 'seller report', 'store report'],
    answer: "Use the available reporting option on the seller profile or product listing to report a seller issue. Provide accurate information and evidence when possible.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_refund_problem',
    keywords: ['seller refund problem', 'seller refuses refund', 'seller refund refusal', 'seller will not refund', 'seller refund refused'],
    answer: "If a seller refuses a refund that you believe is valid, review the applicable return and refund rules and use the available support or dispute process.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_harassment',
    keywords: ['seller harassment', 'seller abusive', 'seller threatening', 'seller rude', 'seller inappropriate message'],
    answer: "If a seller behaves abusively or threatens you, do not respond to the harassment, keep evidence of the messages, and report the issue through XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_impersonation',
    keywords: ['fake seller', 'seller impersonation', 'impersonating seller', 'seller pretending', 'impostor seller'],
    answer: "If you suspect a seller is impersonating another person or store, do not complete any purchase and report the account through XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_policy_dispute',
    keywords: ['seller policy dispute', 'seller terms problem', 'seller policy issue', 'seller rules dispute', 'seller conditions complaint'],
    answer: "If you have a dispute about seller-specific policies, review the applicable marketplace and seller terms and use the available XMARKET support process.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_quality_issue',
    keywords: ['seller quality issue', 'seller product quality problem', 'bad quality from seller', 'poor quality seller', 'seller quality complaint'],
    answer: "If a seller repeatedly provides low-quality or misrepresented products, keep your order information and report the issue through XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'shop_seller_multiorder_problem',
    keywords: ['seller multiple orders problem', 'seller several orders issue', 'seller repeated problem', 'seller recurring issue', 'seller pattern'],
    answer: "If a seller repeatedly has problems with your orders, keep each order's details and evidence. XMARKET may review patterns through its support and enforcement processes.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
{
    id: 'order_report_seller',
    keywords: ['report seller', 'seller report', 'bad seller', 'seller misconduct', 'report marketplace seller'],
    answer: "If a seller violates marketplace rules or behaves suspiciously, use the available reporting option and provide specific, accurate evidence describing the issue.",
    links: [{ label: 'Report a Seller', to: '/report/shop' }, { label: 'Help Center', to: '/help' }],
  },
{
    id: 'order_seller_policy',
    keywords: ['seller rules', 'seller policy', 'marketplace seller rules', 'seller requirements', 'seller guidelines'],
    answer: "Sellers are expected to follow XMARKET's marketplace rules, accurately represent products, fulfill accepted orders, and communicate appropriately with buyers.",
    links: [],
  },
{
    id: 'order_seller_rating',
    keywords: ['seller rating', 'seller reviews', 'check seller rating', 'seller reputation', 'seller feedback'],
    answer: "Review the seller's profile and available ratings or reviews before purchasing. Consider the seller's feedback together with product information, price, and shipping details.",
    links: [],
  },
{
    id: 'order_seller_response',
    keywords: ['seller response', 'seller replied', 'seller message', 'waiting seller reply', 'seller chat response'],
    answer: "Seller response times can vary. Keep communication inside the supported XMARKET chat system when possible so the conversation remains associated with the marketplace transaction.",
    links: [],
  },
];
