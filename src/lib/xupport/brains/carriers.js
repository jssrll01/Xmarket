export const topic = 'carriers';
export const triggers = ['courier', 'j&t', 'lbc', 'lalamove', 'grab', 'grabexpress', 'ninjavan', 'flash express', '2go', 'entrego'];

export default [
  {
    id: 'shipping_lbc',
    keywords: ['LBC', 'LBC delivery', 'LBC courier', 'LBC shipping'],
    answer: "LBC may be available for eligible shipments depending on the shipping arrangements supported for the order. Check checkout or your shipment details for available courier options.",
    links: [{ label: 'Shipping', to: '/shipping' }],
  },
  {
    id: 'shipping_lalamove',
    keywords: ['Lalamove', 'Lalamove delivery', 'Lalamove courier', 'same day Lalamove'],
    answer: "Lalamove availability depends on the order location, seller, package requirements, and supported delivery arrangements. Check the available shipping options during checkout.",
    links: [{ label: 'Shipping', to: '/shipping' }, { label: 'Checkout', to: '/checkout' }],
  },
  {
    id: 'shipping_grab',
    keywords: ['Grab delivery', 'GrabExpress', 'Grab courier', 'Grab shipping', 'Grab delivery option'],
    answer: "GrabExpress availability depends on the delivery arrangement and eligible locations. If supported, the option will appear among the available shipping methods.",
    links: [{ label: 'Shipping', to: '/shipping' }],
  },
];
