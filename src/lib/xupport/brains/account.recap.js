export const topic = 'account/recap';
export const triggers = ['account', 'suspended', 'banned', 'unauthorized', 'lost phone', 'lost email', 'phishing', 'otp', 'security alert', 'reset password', 'hi', 'hello', 'kumusta', 'salamat'];

export default [
  {
    id: 'account_reset_password',
    keywords: ['change forgotten password', 'password reset link', 'reset account password', 'new password', 'set new password'],
    answer: "Use the password-reset process to create a new password. Choose a strong password that you do not reuse on other services.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_lost_phone',
    keywords: ['lost phone', 'phone lost account', 'lost mobile account access', 'phone stolen', 'cannot access phone'],
    answer: "If you lose access to the phone associated with your XMARKET account, secure the account as soon as possible and use the available account-recovery process.",
    links: [{ label: 'Recover Account', to: '/forgot-password' }, { label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'account_lost_email',
    keywords: ['lost email access', 'cannot access email', 'email account lost', 'old email inaccessible', 'lost email account'],
    answer: "If you can no longer access the email associated with XMARKET, use the available account-recovery process and provide the requested account information.",
    links: [{ label: 'Recover Account', to: '/forgot-password' }],
  },
  {
    id: 'account_recovery_failed',
    keywords: ['account recovery failed', 'cannot recover account', 'recovery not working', 'unable to recover account', 'account recovery unsuccessful'],
    answer: "If automated account recovery does not work, review the information you entered and try again using the details originally associated with the account. Contact XMARKET Support if additional assistance is available.",
    links: [{ label: 'Recover Account', to: '/forgot-password' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_suspended',
    keywords: ['account suspended', 'suspended account', 'account suspension', 'why account suspended', 'account disabled'],
    answer: "A suspended or disabled account may have restricted access because of a security, policy, or account issue. Review any notice associated with the account and contact XMARKET Support if an appeal or review is available.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_banned',
    keywords: ['banned account', 'account banned', 'permanently banned', 'ban appeal', 'account ban'],
    answer: "If your account has been banned, review the notice explaining the restriction and use the available support or appeal process if you believe the action was made in error.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_suspicious_login',
    keywords: ['suspicious login', 'unknown login', 'someone logged into account', 'unauthorized login', 'strange login'],
    answer: "If you notice an unfamiliar login, change your password immediately, secure your email or phone account, review active sessions if available, and contact XMARKET Support if you suspect unauthorized access.",
    links: [{ label: 'Account Security', to: '/settings' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_hacked',
    keywords: ['hacked account', 'account hacked', 'someone hacked me', 'account compromised', 'hacked xmarket'],
    answer: "If you believe your XMARKET account has been compromised, change your password immediately if you can still sign in, secure your recovery accounts, and contact support for further assistance.",
    links: [{ label: 'Account Security', to: '/settings' }, { label: 'Recover Account', to: '/forgot-password' }],
  },
  {
    id: 'account_unauthorized_order',
    keywords: ['unauthorized order', 'order I did not place', 'someone ordered', 'unknown purchase', 'order not mine'],
    answer: "If you see an order you did not place, secure your account immediately by changing your password and reviewing account access. Keep the order information and contact XMARKET Support.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Account Security', to: '/settings' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_unauthorized_payment',
    keywords: ['unauthorized payment', 'payment I did not make', 'unknown payment', 'payment not mine', 'unrecognized transaction'],
    answer: "If you see an unfamiliar payment, secure your XMARKET account and contact the relevant payment provider immediately if the transaction was processed through their service. Keep the transaction details for investigation.",
    links: [{ label: 'Account Security', to: '/settings' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_active_sessions',
    keywords: ['active sessions', 'logged in devices', 'account devices', 'where am I logged in', 'login sessions'],
    answer: "If XMARKET provides active-session management, review the devices or sessions associated with your account and sign out of any session you do not recognize.",
    links: [{ label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'account_logout_all',
    keywords: ['logout all devices', 'sign out everywhere', 'log out all devices', 'remove other sessions', 'logout other devices'],
    answer: "If the security settings provide a 'Log Out All' or similar option, use it to end other active sessions. Change your password afterward if you suspect unauthorized access.",
    links: [{ label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'account_change_name',
    keywords: ['change name', 'edit name', 'update profile name', 'change account name', 'modify name'],
    answer: "If profile-name editing is available, open your account settings and update the permitted profile information. Some identity or transaction information may not be editable after verification.",
    links: [{ label: 'Account', to: '/account' }],
  },
  {
    id: 'account_delete_cannot',
    keywords: ['cannot delete account', 'account deletion failed', 'unable to delete account', 'delete account not working', 'account wont delete'],
    answer: "If account deletion is unavailable, check whether there are outstanding orders, unresolved transactions, or other account requirements preventing deletion. Contact support if the issue continues.",
    links: [{ label: 'Delete Account', to: '/account' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_email_notifications',
    keywords: ['email notifications', 'email alerts', 'marketing emails', 'email updates', 'turn off emails'],
    answer: "If notification preferences are available, use your account settings to manage eligible email notifications. Some essential account or transaction messages may still be sent.",
    links: [{ label: 'Account', to: '/account' }],
  },
  {
    id: 'account_security_alert',
    keywords: ['security alert', 'security notification', 'account security warning', 'login alert', 'security message'],
    answer: "If you receive a security alert you do not recognize, avoid clicking suspicious links, secure your account, and review your recent account activity.",
    links: [{ label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'account_suspicious_email',
    keywords: ['fake xmarket email', 'phishing email', 'suspicious xmarket email', 'fake account email', 'phishing'],
    answer: "Be cautious with unexpected messages requesting passwords, OTPs, payment details, or urgent account actions. Use the official XMARKET website or app instead of suspicious links, and report suspected phishing.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_suspicious_link',
    keywords: ['fake xmarket link', 'suspicious link', 'phishing link', 'fake website', 'fake login page'],
    answer: "Do not enter your XMARKET password, OTP, PIN, or payment information into suspicious websites. Navigate to XMARKET through your normal official access point instead.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_otp_safety',
    keywords: ['never share otp', 'otp safety', 'verification code safety', 'someone asks otp', 'otp scam'],
    answer: "Never share an OTP or verification code with another person. XMARKET support, sellers, and couriers should not need your private authentication code.",
    links: [{ label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'account_password_security',
    keywords: ['password security', 'password safety', 'protect password', 'password stolen', 'password compromised'],
    answer: "Never share your XMARKET password. If you think someone knows it, change it immediately and review your account activity for anything you do not recognize.",
    links: [{ label: 'Account Security', to: '/settings' }],
  },
  {
    id: 'account_support_access',
    keywords: ['contact account support', 'account problem support', 'account help', 'login support', 'account assistance'],
    answer: "For account-access problems that cannot be resolved through the available recovery tools, use the XMARKET Help Center and provide only the information needed to identify and investigate the issue.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
];
