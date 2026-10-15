export const topic = 'account/security/alerts';
export const triggers = ['changed by someone', 'not mine', 'unrecognized', 'unauthorized', 'unknown order', 'unknown email', 'unknown phone', 'compromise'];

export default [
  {
    id: 'account_security_settings',
    keywords: ['security settings', 'account security settings', 'security options', 'manage security', 'security controls'],
    answer:
      "Use the XMARKET account security area to review the security controls and options made available for your account.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_change_email',
    keywords: ['secure email change', 'email security', 'protect account email', 'email account security', 'email changed by someone'],
    answer:
      "If you notice an unexpected change to the email associated with your XMARKET account, secure the account immediately and contact support if you cannot restore the correct information.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_change_phone',
    keywords: ['phone changed by someone', 'unauthorized phone change', 'phone security', 'account phone changed', 'unknown phone number'],
    answer:
      "If the phone number on your XMARKET account was changed without your permission, secure the account immediately and contact XMARKET Support.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_profile_change',
    keywords: ['profile changed by someone', 'unauthorized profile change', 'profile hacked', 'account profile changed', 'unknown profile information'],
    answer:
      "If someone changed information on your XMARKET profile without permission, secure your account by changing your password and review your account details. Contact support if you need help restoring the information.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Profile', to: '/profile' }],
  },
  {
    id: 'account_security_password_reset_suspicious',
    keywords: ['unexpected password reset', 'password reset I did not request', 'unknown reset email', 'someone requested password reset', 'password reset suspicious'],
    answer:
      "If you receive an unexpected XMARKET password-reset message, do not share any codes or credentials. If you suspect someone is attempting to access your account, secure the account and contact support.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_unknown_email',
    keywords: ['unknown email account', 'email changed unexpectedly', 'strange email account', 'unrecognized email', 'email not mine'],
    answer:
      "If the email associated with your XMARKET account is not yours or changed without your permission, treat the account as potentially compromised and contact XMARKET Support.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_unknown_phone',
    keywords: ['unknown phone account', 'phone number not mine', 'mobile number changed', 'unrecognized phone', 'phone changed unexpectedly'],
    answer:
      "If an unfamiliar phone number is associated with your XMARKET account, secure the account and contact XMARKET Support as soon as possible.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_unknown_address',
    keywords: ['unknown address', 'address added by someone', 'unrecognized delivery address', 'strange saved address', 'unauthorized address'],
    answer:
      "If you find an unfamiliar address saved in your XMARKET account, remove it if possible, secure your account, and review your account activity for anything else you do not recognize.",
    links: [{ label: 'Addresses', to: '/settings' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_unknown_order',
    keywords: ['unknown order', 'order I did not place', 'unrecognized purchase', 'someone ordered', 'unauthorized order'],
    answer:
      "If you see an order you did not place, secure your XMARKET account immediately and review the order information. Contact XMARKET Support as soon as possible for assistance with the unauthorized order.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_unknown_store_activity',
    keywords: ['unknown seller activity', 'store activity not mine', 'unrecognized seller activity', 'unauthorized store action', 'store account hacked'],
    answer:
      "If you notice unfamiliar activity involving an XMARKET seller or store account, secure the account immediately and contact XMARKET Support with details of the activity.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_logout_after_compromise',
    keywords: ['logout after hacked', 'sign out after hack', 'secure hacked account', 'logout compromised account', 'end unauthorized session'],
    answer:
      "If you believe someone accessed your XMARKET account, change your password and use any available session or device-security controls to end unauthorized access.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_contact',
    keywords: ['security support', 'report hacked account', 'security incident', 'account security support', 'report account compromise'],
    answer:
      "For an XMARKET account-security incident, secure the account first when possible, then contact support with a clear description of the unauthorized activity. Never include your password or verification code.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
];
