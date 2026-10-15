export const topic = 'carriers';
export const triggers = ['courier', 'j&t', 'lbc', 'lalamove', 'grab', 'grabexpress', 'ninjavan', 'flash express', '2go', 'entrego'];

export default [
  {
    id: 'shipping_jnt',
    keywords: ['J&T', 'J&T Express', 'JNT', 'J&T delivery', 'J&T courier'],
    answer: "J&T Express may be available for eligible XMARKET shipments. Courier availability depends on the order, seller, destination, and current shipping arrangements.",
    links: [{ label: 'Shipping', to: '/shipping' }],
  },
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
  {
    id: 'shipping_courier_contact',
    keywords: ['contact courier', 'call courier', 'courier phone number', 'contact delivery driver', 'delivery rider contact'],
    answer: "Courier contact information may become available through the shipment or tracking details when supported. Use official tracking information rather than sharing sensitive account credentials.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'shipping_courier_choice',
    keywords: ['choose courier', 'select courier', 'preferred courier', 'courier selection', 'change courier option'],
    answer: "If multiple couriers are available for your order, you can select from the options presented at checkout. Otherwise, the applicable courier will be used based on the seller's shipping arrangement.",
    links: [{ label: 'Checkout', to: '/checkout' }, { label: 'Shipping', to: '/shipping' }],
  },
];
