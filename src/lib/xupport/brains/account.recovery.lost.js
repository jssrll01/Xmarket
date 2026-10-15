export const topic = 'account/recovery/lost';
export const triggers = ['forgot email', 'forgot phone', 'lost access', 'old email', 'old phone', 'recovery code', 'recovery information', 'ownership'];

export default [
  {
    id: 'account_forgot_login_email',
    keywords: ['forgot email', 'forgot account email', 'cannot remember email', 'lost login email', 'forgot email address'],
    answer:
      "If you cannot remember which email is associated with your XMARKET account, use the available account-recovery options or contact support for assistance.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_forgot_login_phone',
    keywords: ['forgot phone number', 'cannot remember phone', 'lost account phone', 'forgot mobile number', 'old phone number'],
    answer:
      "If you cannot remember the phone number associated with your XMARKET account, use the available recovery process or contact support for assistance.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_old_email_access',
    keywords: ['lost email access', 'old email account', 'cannot access old email', 'email account lost', 'no access to email'],
    answer:
      "If you no longer have access to the email associated with your XMARKET account, use the account-recovery process and provide the requested information.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_old_phone_access',
    keywords: ['lost phone access', 'old phone number', 'cannot access old number', 'lost mobile access', 'old sim'],
    answer:
      "If you no longer have access to the phone number associated with your XMARKET account, use the available account-recovery process rather than repeatedly requesting codes to the unavailable number.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_recovery_code',
    keywords: ['recovery code', 'account recovery code', 'recovery otp', 'code for account recovery', 'recover using code'],
    answer:
      "If XMARKET provides a recovery code as part of account recovery, enter the current code exactly as instructed and keep the code private.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_recovery_code_expired',
    keywords: ['recovery code expired', 'expired recovery otp', 'recovery code invalid', 'old recovery code', 'recovery code no longer works'],
    answer:
      "If a recovery code has expired or is no longer valid, request a new recovery code through the available XMARKET recovery process.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_recovery_identity',
    keywords: ['prove account ownership', 'verify account ownership', 'account owner verification', 'prove account is mine', 'ownership verification'],
    answer:
      "If XMARKET asks you to verify account ownership during recovery, provide only the information requested through the official recovery process.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_recovery_wrong_information',
    keywords: ['recovery information incorrect', 'wrong recovery details', 'recovery details rejected', 'account recovery information wrong', 'recovery data error'],
    answer:
      "If the information provided during XMARKET account recovery is rejected, check that it matches the account information and follow the recovery instructions again.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_recovery_too_many_attempts',
    keywords: ['too many recovery attempts', 'recovery attempts exceeded', 'account recovery limit', 'recovery temporarily blocked', 'too many recovery tries'],
    answer:
      "If repeated recovery attempts have triggered a temporary restriction, stop making repeated requests and follow the waiting or support instructions provided by XMARKET.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_recovery_contact_support',
    keywords: ['recovery support', 'cannot recover account', 'help recovering account', 'recovery assistance', 'account recovery support'],
    answer:
      "If the available XMARKET recovery process does not restore access to your account, contact XMARKET Support and provide the information requested to help identify the problem.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
];
