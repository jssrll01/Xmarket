export const topic = 'account/recovery';
export const triggers = ['recover', 'recovery', 'restore account', 'lost access', 'locked', 'cannot access', 'deleted account'];

export default [
  {
    id: 'account_recovery',
    keywords: ['recover account', 'account recovery', 'get account back', 'restore account', 'cannot access account', 'lost access'],
    answer:
      "If you cannot access your XMARKET account, use the available account-recovery process and provide the requested information. Follow the recovery instructions shown by XMARKET.",
    links: [{ label: 'Recover Account', to: '/forgot-password' }],
  },
  {
    id: 'account_deleted_recovery',
    keywords: ['recover deleted account', 'restore deleted account', 'deleted my account', 'undo account deletion', 'get deleted account back'],
    answer:
      "If your XMARKET account has already been deleted, recovery depends on the account-deletion process and whether restoration is supported. Use the available recovery or support option for your situation.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_recovery_no_access',
    keywords: ['cannot access account', 'lost account access', 'locked out', 'cannot access my account', 'account inaccessible'],
    answer:
      "If you cannot access your XMARKET account, start with the available account-recovery process. Provide the requested information and follow the recovery instructions shown.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_recovery_credentials',
    keywords: ['lost credentials', 'forgot login details', 'forgot account details', 'lost login information', 'cannot remember login'],
    answer:
      "If you no longer remember your XMARKET login information, use the available recovery options to restore access. Follow the instructions shown rather than creating another account unnecessarily.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_locked',
    keywords: ['account locked', 'locked account', 'account blocked', 'cannot access locked account', 'login locked'],
    answer:
      "If your XMARKET account is locked or access has been restricted, follow the recovery or verification instructions displayed on the login screen. Contact XMARKET Support if the available recovery process does not resolve the issue.",
    links: [{ label: 'Login', to: '/signin' }, { label: 'Account Recovery', to: '/forgot-password' }],
  },

  {
    id: 'account_account_not_found',
    keywords: ['account not found', 'user not found', 'account does not exist', 'cannot find account', 'unknown account'],
    answer:
      "If XMARKET cannot find your account, check that you are using the correct email address, phone number, or other identifier associated with the account.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_recovery_information',
    keywords: ['recovery information', 'account recovery details', 'recovery details', 'what information for recovery', 'recover account information'],
    answer:
      "Use the information requested by XMARKET during account recovery. Provide accurate information associated with the account and follow the recovery instructions displayed.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_recovery_loop',
    keywords: ['recovery keeps failing', 'recovery loop', 'cannot complete recovery', 'account recovery stuck', 'recovery not working'],
    answer:
      "If XMARKET account recovery repeatedly fails, carefully follow each recovery step and make sure the information provided matches the account. If recovery remains unsuccessful, contact XMARKET Support.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_email_wrong',
    keywords: ['wrong email on account', 'incorrect account email', 'email entered wrong', 'mistyped email', 'wrong email address'],
    answer:
      "If you entered the wrong email address during account setup, check whether XMARKET provides an account-setting option to update it. If you cannot access the account, use the available recovery process.",
    links: [{ label: 'Account Settings', to: '/settings' }, { label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_phone_wrong',
    keywords: ['wrong phone on account', 'incorrect phone number', 'mistyped phone', 'wrong mobile number', 'phone entered wrong'],
    answer:
      "If the wrong phone number is associated with your XMARKET account, check whether you can update it from your account settings. If you cannot access the account, use the available recovery process.",
    links: [{ label: 'Account Settings', to: '/settings' }, { label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_order_access',
    keywords: ['cannot see orders', 'orders missing from account', 'order history missing', 'my orders disappeared', 'orders not showing'],
    answer:
      "If your XMARKET orders are not appearing, make sure you are signed in to the account used to place the order and open your order history. If the order remains missing, contact support with the relevant order information.",
    links: [{ label: 'My Orders', to: '/orders' }],
  },
  {
    id: 'account_wrong_account_order',
    keywords: ['order on another account', 'wrong account order', 'order belongs to another account', 'cannot find my purchase', 'purchase missing'],
    answer:
      "If you cannot find a purchase in your XMARKET account, check whether you placed the order using another account or login identifier. Sign in to the account used for the purchase.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Login', to: '/signin' }],
  },
];
