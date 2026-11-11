export const topic = 'orders/favorites';
export const triggers = ['favorite', 'wishlist', 'saved items', 'saved products'];

export default [
  {
    id: 'account_order_favorite',
    keywords: ['favorite product', 'save product', 'add to favorites', 'wishlist product', 'save item'],
    answer: "Use the available Favorites or wishlist control on an XMARKET product to save it for easier access later.",
    links: [{ label: 'Favorites', to: '/favorites' }],
  },
  {
    id: 'account_order_favorite_remove',
    keywords: ['remove favorite', 'unfavorite product', 'remove wishlist item', 'delete favorite', 'remove saved item'],
    answer: "Open your XMARKET Favorites list and use the available control on the saved product to remove it.",
    links: [{ label: 'Favorites', to: '/favorites' }],
  },
  {
    id: 'account_order_favorites_missing',
    keywords: ['favorites disappeared', 'wishlist disappeared', 'saved products missing', 'favorites not showing', 'wishlist empty'],
    answer: "If your XMARKET Favorites list is missing saved products, make sure you are signed in to the correct account and refresh the page. If the items remain missing, contact support.",
    links: [{ label: 'Favorites', to: '/favorites' }, { label: 'Help Center', to: '/help' }],
  },
];
