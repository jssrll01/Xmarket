export const topic = 'account/security';
export const triggers = ['security', 'hacked', 'suspicious', 'unauthorized', 'compromised', '2fa', 'verification code', 'otp'];

export default [
  {
    id: 'account_security',
    keywords: ['account security', 'secure account', 'protect account', 'account hacked', 'someone accessed my account', 'security'],
    answer:
      "If you believe your XMARKET account may be compromised, secure your account immediately by changing your password and reviewing your account information and activity. Do not share your password or verification codes with anyone.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_code_share',
    keywords: ['share verification code', 'give otp', 'share otp', 'verification code scam', 'send my code'],
    answer:
      "Never share an XMARKET verification code or one-time code with anyone. Treat unexpected requests for your code as suspicious and keep the code private.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_suspicious_activity',
    keywords: ['suspicious activity', 'strange activity', 'unknown activity', 'unrecognized account activity', 'account activity'],
    answer:
      "If you notice activity on your XMARKET account that you do not recognize, secure the account by changing your password and reviewing the available account information. Contact XMARKET Support if you need further assistance.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_unknown_login',
    keywords: ['unknown login', 'unrecognized login', 'someone logged in', 'login I do not recognize', 'unauthorized login'],
    answer:
      "If you notice an unfamiliar login to your XMARKET account, change your password immediately and review your account information. Contact XMARKET Support if you believe someone else accessed your account.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_compromised',
    keywords: ['account hacked', 'hacked account', 'account compromised', 'someone took my account', 'account stolen'],
    answer:
      "If you believe your XMARKET account has been compromised, change your password immediately if you still have access and review your account information. If you cannot access the account, use the account-recovery process.",
    links: [
      { label: 'Account Security', to: '/security' },
      { label: 'Account Recovery', to: '/recover-account' }
    ],
  },

  {
    id: 'account_security_suspicious_message',
    keywords: ['fake xmarket message', 'phishing', 'scam message', 'suspicious email', 'fake support message'],
    answer:
      "Be cautious of messages asking for your XMARKET password, verification codes, or other sensitive account information. Do not provide private credentials through suspicious messages or unfamiliar links.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_phishing_link',
    keywords: ['phishing link', 'fake login link', 'suspicious login link', 'fake xmarket website', 'scam link'],
    answer:
      "Do not enter your XMARKET credentials on a suspicious or unfamiliar website. Use the official XMARKET website or application interface when signing in.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_security_device',
    keywords: ['trusted device', 'new device login', 'device security', 'login from new phone', 'new phone account'],
    answer:
      "When accessing XMARKET from a new device, complete any verification or security checks requested. Only sign in on devices you trust.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_lost_device',
    keywords: ['lost phone', 'lost device', 'phone stolen', 'device lost', 'lost mobile account'],
    answer:
      "If you lose a device that was used to access your XMARKET account, secure the account as soon as possible. Change your password and review available security options, especially if the device could access your account automatically.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_shared_credentials',
    keywords: ['share account', 'shared account', 'give someone account', 'account sharing', 'someone else using account'],
    answer:
      "Keep your XMARKET login credentials private and avoid sharing your account with other people. Sharing credentials can expose your personal information and marketplace activity.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_public_wifi',
    keywords: ['public wifi security', 'xmarket public wifi', 'login public wifi', 'unsafe wifi', 'account on public network'],
    answer:
      "When accessing XMARKET over a public network, use a trusted connection and avoid entering credentials on suspicious pages. Always sign out of shared devices after use.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_terms_violation',
    keywords: ['account suspended', 'account banned', 'account violation', 'terms violation', 'account suspension'],
    answer:
      "If your XMARKET account has been suspended or restricted because of a policy or Terms of Service issue, review the information provided by XMARKET and use the available support or appeal process if one is provided.",
    links: [{ label: 'Terms of Service', to: '/terms' }, { label: 'Help Center', to: '/help' }],
  },
];
