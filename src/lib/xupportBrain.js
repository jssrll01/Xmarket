// Xautomated Support — knowledge base
// Edit any answer here to "train" the bot. Save file = it's live.
// Each intent: { id, keywords[], answer, links?[] }
// Matching is keyword-based (see xupportMatch.js). Lowercase keywords only.

export const GREETING =
  "Hi! I'm Xautomated Support. Ask me about orders, shipping, returns, payments, vouchers, or your account.";

export const QUICK_CHIPS = [
  { label: 'Track my order', q: 'where is my order' },
  { label: 'Returns', q: 'how do I return an item' },
  { label: 'Shipping time', q: 'how long is shipping' },
  { label: 'Payment methods', q: 'what payment methods do you accept' },
  { label: 'Vouchers', q: 'how do vouchers work' },
  { label: 'Change my email', q: 'how do I change my email' },
];

export const FALLBACK = {
  answer:
    "I'm not sure about that one. You can browse our Help Center or email support@xmarket — a human will get back to you within 24 hours.",
  links: [
    { label: 'Help Center', to: '/help' },
    { label: 'Email support', href: 'mailto:support@xmarket.app' },
  ],
};

export const intents = [
  // ---- Orders ----
  {
    id: 'order_track',
    keywords: ['where is my order', 'track', 'tracking', 'status', 'order status', 'not arrived', 'delivery status', 'my order'],
    answer:
      "You can see live status for every order here. If your order is past the estimated delivery window, open the order and tap 'Contact Seller' or 'Report an Issue'.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'order_cancel',
    keywords: ['cancel order', 'cancel my order', 'stop order'],
    answer:
      "Orders can be cancelled from the Orders page before the seller marks them 'Shipped'. Once shipped, you'll need to start a return after delivery.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'order_not_received',
    keywords: ['did not receive', 'never arrived', 'not delivered', 'lost package', 'missing order'],
    answer:
      "Sorry about that. Open the order and tap 'Report an Issue' — if the courier has no proof of delivery, you'll get a full refund or a replacement.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'order_wrong_item',
    keywords: ['wrong item', 'wrong product', 'not what I ordered', 'incorrect item'],
    answer:
      "Please open the order and tap 'Return / Refund'. Choose reason 'Wrong item' and upload a photo. We'll cover return shipping.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },

  // ---- Shipping ----
  {
    id: 'shipping_time',
    keywords: ['shipping', 'delivery', 'how long', 'when arrive', 'when will it arrive', 'how many days'],
    answer:
      "Standard delivery takes 3–7 business days depending on your location. Metro Manila is usually 1–3 days. You'll see an estimate on each product page before checkout.",
  },
  {
    id: 'shipping_cost',
    keywords: ['shipping fee', 'shipping cost', 'delivery fee', 'free shipping'],
    answer:
      "Shipping fees are shown at checkout based on your address and the seller. Many sellers offer free shipping on orders above a certain amount — look for the badge on the product page.",
  },
  {
    id: 'shipping_courier',
    keywords: ['courier', 'which courier', 'who delivers', 'shipping partner'],
    answer:
      "We work with multiple couriers depending on the seller and your location. The courier name appears on your order page once the seller ships.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shipping_address_change',
    keywords: ['change address', 'wrong address', 'update address', 'edit address', 'shipping address'],
    answer:
      "You can change your shipping address from the order page as long as the seller hasn't shipped it yet. After shipping, contact the seller directly from the order.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },

  // ---- Returns & Refunds ----
  {
    id: 'returns_how',
    keywords: ['return', 'returning', 'send back', 'how do I return'],
    answer:
      "Open the order, tap 'Return / Refund', pick a reason, and upload photos if relevant. Most items can be returned within 7 days of delivery. Approved returns get a prepaid label.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }],
  },
  {
    id: 'refund_when',
    keywords: ['refund', 'money back', 'when refund', 'refund status'],
    answer:
      "Refunds are processed within 3–5 business days after we receive the returned item. The money goes back to your original payment method, or to Xwallet if you chose that at checkout.",
    links: [{ label: 'Returns & Refunds', to: '/returns' }, { label: 'Xwallet', to: '/xwallet' }],
  },
  {
    id: 'returns_not_allowed',
    keywords: ['non-returnable', 'cannot return', 'not returnable', 'final sale'],
    answer:
      "Some items can't be returned for hygiene or safety reasons (underwear, perishables, digital goods, personalized items). This is always shown on the product page before you buy.",
  },

  // ---- Payments ----
  {
    id: 'payment_methods',
    keywords: ['payment', 'payment methods', 'how to pay', 'pay with', 'gcash', 'card', 'cod', 'cash on delivery'],
    answer:
      "We accept cards, GCash, Maya, bank transfer, and Cash on Delivery (where available). All payment options appear at checkout.",
  },
  {
    id: 'payment_failed',
    keywords: ['payment failed', 'card declined', 'cannot pay', 'payment error'],
    answer:
      "If a payment fails, first check that your card is enabled for online transactions. Try a different method if it persists — GCash and Maya are usually the most reliable. No charge is made for failed attempts.",
  },
  {
    id: 'payment_safe',
    keywords: ['safe', 'secure', 'is it safe', 'scam', 'trust'],
    answer:
      "Yes — payments are processed by licensed payment partners. XMARKET never stores your card details. Only pay inside the app, never via off-platform transfers.",
  },

  // ---- Account ----
  {
    id: 'account_email',
    keywords: ['change email', 'update email', 'edit email', 'new email'],
    answer:
      "Go to Account Settings → Email, enter the new address, and confirm via the link we send you. Your old email stays active until you confirm.",
    links: [{ label: 'Account Settings', to: '/account' }],
  },
  {
    id: 'account_phone',
    keywords: ['change phone', 'update phone', 'new number', 'mobile number'],
    answer:
      "Go to Account Settings → Phone and verify the new number with the code we text you.",
    links: [{ label: 'Account Settings', to: '/account' }],
  },
  {
    id: 'account_password',
    keywords: ['change password', 'reset password', 'forgot password', 'new password'],
    answer:
      "Go to Account Settings → Password. You'll need your current password to set a new one. If you forgot it, sign out and use 'Forgot password' on the sign-in screen.",
    links: [{ label: 'Account Settings', to: '/account' }],
  },
  {
    id: 'account_username',
    keywords: ['change username', 'update username', 'new username'],
    answer:
      "Usernames can be changed once every 30 days from Account Settings → Username.",
    links: [{ label: 'Account Settings', to: '/account' }],
  },
  {
    id: 'account_delete',
    keywords: ['delete account', 'close account', 'remove my account'],
    answer:
      "You can delete your account from Account Settings → Delete Account. This removes your profile and personal data. Order history is retained for legal reasons for 1 year.",
    links: [{ label: 'Account Settings', to: '/account' }],
  },
  {
    id: 'account_recover',
    keywords: ['recover account', 'locked out', 'hacked', 'cannot log in', 'cannot sign in'],
    answer:
      "Use 'Forgot password' on the sign-in screen. If you've lost access to both email and phone, email support@xmarket from any address with your username and we'll help.",
    links: [{ label: 'Help Center', to: '/help' }],
  },

  // ---- Vouchers / Xcards / Xwallet / Loyalty ----
  {
    id: 'vouchers_how',
    keywords: ['voucher', 'vouchers', 'coupon', 'promo code', 'discount code'],
    answer:
      "Vouchers are applied automatically at checkout when eligible. You can collect seller vouchers from their store page and see all your collected vouchers here.",
    links: [{ label: 'My Vouchers', to: '/vouchers' }, { label: 'Mega Voucher', to: '/mega-voucher' }],
  },
  {
    id: 'vouchers_not_working',
    keywords: ['voucher not working', 'coupon not applying', 'promo invalid'],
    answer:
      "Check the voucher's minimum spend, category restriction, and expiry. Vouchers can't usually be stacked. If it still won't apply, send us the voucher code and we'll look into it.",
    links: [{ label: 'My Vouchers', to: '/vouchers' }],
  },
  {
    id: 'xwallet',
    keywords: ['xwallet', 'wallet', 'top up', 'cash in', 'balance'],
    answer:
      "Xwallet is your in-app balance. Top up via GCash/Maya/card, and use it to pay instantly at checkout. Refunds can also be sent here for faster access.",
    links: [{ label: 'Xwallet', to: '/xwallet' }],
  },
  {
    id: 'xcards',
    keywords: ['xcard', 'xcards', 'gift card', 'gift code'],
    answer:
      "Xcards are prepaid gift cards. Redeem the code under Xcards and the value lands in your Xwallet instantly.",
    links: [{ label: 'Xcards', to: '/xcards' }],
  },
  {
    id: 'loyalty',
    keywords: ['loyalty', 'points', 'rewards', 'coins'],
    answer:
      "You earn Loyalty Points on every completed order. Points can be redeemed for vouchers and Xcards. See your balance under Loyalty Points.",
    links: [{ label: 'Loyalty Points', to: '/rewards' }, { label: 'Coins', to: '/coins' }],
  },

  // ---- Shopping features ----
  {
    id: 'bundles',
    keywords: ['bundle', 'bundles', 'bundle deals'],
    answer:
      "Bundle Deals group items at a lower combined price. Add the whole bundle to cart in one tap.",
    links: [{ label: 'Bundle Deals', to: '/bundles' }],
  },
  {
    id: 'flash_sale',
    keywords: ['flash sale', 'flash', 'limited time'],
    answer:
      "Flash Sale items are heavily discounted for a short window. Prices revert when the timer ends, so grab them while they last.",
    links: [{ label: 'Flash Sale', to: '/flash-sale' }],
  },
  {
    id: 'save_more',
    keywords: ['save more', 'savemore', 'bigger discount'],
    answer:
      "Save More deals give you a bigger discount the more you buy from a seller. Look for the green SAVE MORE ribbon.",
    links: [{ label: 'Save More', to: '/savemore' }],
  },
  {
    id: 'xmall',
    keywords: ['xmall', 'official store', 'official'],
    answer:
      "XMALL is our official stores section — products shipped directly by XMARKET or verified brand partners, with the strongest guarantees.",
    links: [{ label: 'XMALL', to: '/xmall' }],
  },
  {
    id: 'wishlist',
    keywords: ['wishlist', 'save item', 'favorite item', 'saved items'],
    answer:
      "Tap the heart on any product to save it to your Wishlist. Wishlist items are easy to find later from your profile menu.",
    links: [{ label: 'Wishlist', to: '/wishlist' }],
  },
  {
    id: 'follow_store',
    keywords: ['follow store', 'following', 'follow seller'],
    answer:
      "Open any store page and tap Follow to get updates from that seller. See everyone you follow under Following.",
    links: [{ label: 'Following', to: '/following' }],
  },

  // ---- Safety / reports ----
  {
    id: 'report_product',
    keywords: ['report product', 'report seller', 'counterfeit', 'fake item', 'scam seller'],
    answer:
      "Open the product or seller page, tap the three-dot menu, and choose 'Report'. Include photos if you can — reports are reviewed within 24 hours.",
    links: [{ label: 'My Reports', to: '/my-reports' }],
  },
  {
    id: 'contact_human',
    keywords: ['human', 'agent', 'talk to someone', 'real person', 'customer service', 'contact'],
    answer:
      "Happy to pass you on. Email support@xmarket and a human will reply within 24 hours. For urgent order issues, use 'Contact Seller' on the order page.",
    links: [
      { label: 'Email support', href: 'mailto:support@xmarket.app' },
      { label: 'Help Center', to: '/help' },
    ],
  },

  // ---- Meta ----
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
    answer: "Hi! What can I help you with today?",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'ty', 'appreciate'],
    answer: "You're welcome! Anything else I can help with?",
  },
  {
    id: 'who_are_you',
    keywords: ['who are you', 'what are you', 'are you a bot', 'are you human'],
    answer:
      "I'm Xautomated Support — a bot that answers common XMARKET questions instantly. For anything I can't handle, I'll point you to a human.",
  },
];
