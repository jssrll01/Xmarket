// Xautomated Support — brain auto-loader.
// DO NOT EDIT unless you're changing global behavior.
// Every file in ./brains/*.js is auto-loaded at build time via require.context.

const ctx = require.context('./brains', false, /\.js$/);

const intents = [];
const categoryMap = [];

ctx.keys().forEach((key) => {
  const mod = ctx(key);
  const list = mod.default || [];
  const topic = mod.topic || key.replace('./', '').replace('.js', '');
  const triggers = mod.triggers || [];
  intents.push(...list);
  categoryMap.push({ topic, triggers, intents: list });
});

export const GREETING =
  "Hi! I'm Xautomated Support. Ask me about your account, orders, shipping, returns, payments, vouchers, or selling on XMARKET.";

export const QUICK_CHIPS = [
  { label: 'Track my order', q: 'where is my order' },
  { label: 'Returns', q: 'how do I return an item' },
  { label: 'Shipping time', q: 'how long is shipping' },
  { label: 'Payment methods', q: 'what payment methods do you accept' },
  { label: 'Forgot password', q: 'forgot password' },
  { label: 'Delete account', q: 'delete account' },
];

export const FALLBACK = {
  answer:
    "I'm not sure about that one. You can browse our Help Center or email support@xmarket — a human will get back to you within 24 hours.",
  links: [
    { label: 'Help Center', to: '/help' },
    { label: 'Email support', href: 'mailto:support@xmarket.app' },
  ],
};

export const BRAIN_DEBUG = {
  fileCount: ctx.keys().length,
  intentCount: intents.length,
  categoryCount: categoryMap.length,
};

export { intents, categoryMap };
