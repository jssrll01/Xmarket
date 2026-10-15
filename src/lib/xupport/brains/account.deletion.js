export const topic = 'account/deletion';
export const triggers = ['delete account', 'close account', 'deactivate', 'remove account', 'cancel account'];

export default [
  {
    id: 'account_delete',
    keywords: ['delete account', 'remove account', 'close account', 'delete my account', 'deactivate account', 'cancel account'],
    answer:
      "If account deletion is available, open the account settings or account-management area and select the available account-deletion option. Review the information shown before confirming because deletion may affect your account data and activity.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },

  {
    id: 'account_delete_warning',
    keywords: ['before deleting account', 'account deletion warning', 'what happens if delete account', 'delete account consequences', 'account deletion information'],
    answer:
      "Before deleting your XMARKET account, review the confirmation information carefully. Account deletion may affect access to your profile, orders, saved information, and other account-related features.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_delete_confirmation',
    keywords: ['confirm account deletion', 'delete confirmation', 'confirm delete account', 'final account deletion', 'delete account confirm'],
    answer:
      "If you choose to delete your XMARKET account, review the deletion notice and confirm only when you are sure you want to proceed.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
];
