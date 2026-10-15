export const topic = 'orders/shipping/misc';
export const triggers = ['shipping', 'delivery', 'shipment', 'package', 'parcel', 'tracking'];

export default [

  {
    id: 'shipping_policy',
    keywords: ['shipping policy', 'delivery policy', 'shipping rules', 'delivery rules', 'how shipping works'],
    answer: "Shipping depends on the seller, destination, available courier, package details, and applicable delivery conditions. Review the shipping information shown on the product and checkout pages.",
    links: [{ label: 'Shipping', to: '/shipping' }],
  },
];
