export const topic = 'chat';
export const triggers = ['chat', 'message seller', 'contact seller', 'seller chat', 'talk to seller'];

export default [
  {
    id: 'seller_chat_before_order',
    keywords: ['ask seller before buying', 'message seller before purchase', 'question seller', 'ask product seller', 'contact seller before order'],
    answer: "You can use seller chat, when available, to ask product-related questions before placing an order. Never send passwords, OTPs, or sensitive payment credentials in chat.",
    links: [],
  },
  {
    id: 'seller_chat_after_order',
    keywords: ['message seller after order', 'contact seller after purchase', 'ask seller order', 'seller order chat', 'talk seller order'],
    answer: "If seller chat is available for your order, use it for appropriate order-related communication. Keep important return, refund, and payment actions inside the official XMARKET system.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'seller_not_replying',
    keywords: ['seller not replying', 'seller does not respond', 'seller ignoring message', 'seller no response', 'seller chat no reply'],
    answer: "Sellers may not respond immediately. If your issue affects an active order or requires an official action, use the appropriate XMARKET support or order process instead of waiting indefinitely for a seller reply.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'seller_unavailable',
    keywords: ['seller unavailable', 'seller offline', 'seller inactive', 'seller not available', 'seller account unavailable'],
    answer: "If a seller is unavailable, check whether the product is still available and whether you can contact support for an active-order issue.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'seller_report',
    keywords: ['report seller', 'seller complaint', 'bad seller', 'seller violation', 'report seller account'],
    answer: "If you believe a seller has violated XMARKET rules, use the available reporting option and provide accurate information and relevant evidence.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'seller_scam',
    keywords: ['seller scam', 'seller is scammer', 'scammed by seller', 'seller fraud', 'seller trying to scam'],
    answer: "If you suspect a seller is attempting fraud, do not send money outside the official payment flow or share security codes. Preserve evidence and report the seller to XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }, { label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'seller_personal_information',
    keywords: ['seller asks personal information', 'seller asking details', 'seller wants my information', 'personal data seller', 'seller asks for OTP'],
    answer: "Do not share your password, OTP, PIN, complete card details, or other sensitive security information with sellers. Report suspicious requests through XMARKET Support.",
    links: [{ label: 'Account Security', to: '/settings' }, { label: 'Help Center', to: '/help' }],
  },
];
