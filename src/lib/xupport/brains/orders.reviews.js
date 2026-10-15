export const topic = 'orders/reviews';
export const triggers = ['review', 'rate', 'rating', 'product review', 'feedback'];

export default [
  {
    id: 'account_order_review',
    keywords: ['review order', 'review purchase', 'rate order', 'leave review', 'review product after order'],
    answer: "After receiving an eligible XMARKET purchase, open the relevant order and use the available review or rating option.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_review_missing',
    keywords: ['cannot review order', 'review button missing', 'cannot rate product', 'review unavailable', 'no review option'],
    answer: "If you cannot review an XMARKET order, check whether the order has reached the stage where reviews are available and whether the item is eligible for review.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_order_review_edit',
    keywords: ['edit review', 'change review', 'modify review', 'update product review', 'edit rating'],
    answer: "If XMARKET allows review editing, open your review or the associated order and use the available edit controls.",
    links: [],
  },
  {
    id: 'account_order_review_delete',
    keywords: ['delete review', 'remove review', 'erase review', 'delete product review', 'remove rating'],
    answer: "If XMARKET provides a review-management option, open your review and use the available controls to remove or manage it.",
    links: [],
  },
  {
    id: 'account_order_review_wrong',
    keywords: ['wrong review', 'review posted accidentally', 'accidental review', 'review submitted by mistake', 'wrong rating'],
    answer: "If you submitted a review or rating by mistake, open your review-management area to see whether editing or removal is available.",
    links: [],
  },
  {
    id: 'account_order_review_report',
    keywords: ['report review', 'review abuse', 'report fake review', 'inappropriate review', 'review violation'],
    answer: "If you believe an XMARKET review violates marketplace rules, use the available reporting option and provide the reason for your report.",
    links: [],
  },
];
