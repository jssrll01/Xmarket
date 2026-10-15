export const topic = 'account/security/patterns';
export const triggers = ['suspicious', 'phishing', 'scam', 'fake support', 'activity', 'alert', 'not mine', 'unauthorized', 'public wifi', 'browser extension', 'old device'];

export default [
  {
    id: 'account_login_wrong_site',
    keywords: ['fake login page', 'wrong xmarket website', 'phishing login', 'fake xmarket login', 'suspicious login page'],
    answer:
      "Only enter your XMARKET credentials on the official XMARKET website or application. Do not provide your password or verification codes through suspicious links or messages.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_suspicious_message',
    keywords: ['suspicious xmarket message', 'fake xmarket message', 'scam message', 'phishing message', 'suspicious email'],
    answer:
      "Do not click suspicious links or provide passwords, payment information, or verification codes in response to unexpected messages claiming to be from XMARKET. Report suspicious activity through the appropriate support channel.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_verification_code_private',
    keywords: ['share verification code', 'give otp', 'send verification code', 'verification code safety', 'otp security'],
    answer:
      "Never share your XMARKET verification code with another person, even if they claim to be a support representative. Verification codes should be entered only through the official XMARKET verification process.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_password_private',
    keywords: ['share password', 'give password', 'password safety', 'password privacy', 'should I tell support my password'],
    answer:
      "Never share your XMARKET password with anyone. XMARKET Support should not need your password to investigate a normal support request.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_support_password',
    keywords: ['support asks password', 'customer service asks password', 'support wants password', 'give support password', 'agent asks password'],
    answer:
      "Do not provide your XMARKET password to another person. If someone claiming to be support requests your password, treat the request as suspicious and use the official support channel.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_support_otp',
    keywords: ['support asks otp', 'customer service asks code', 'agent asks verification code', 'support wants otp', 'give support code'],
    answer:
      "Never give your XMARKET verification or one-time code to another person. Enter codes only in the official XMARKET verification screen.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_phishing_link',
    keywords: ['phishing link', 'fake xmarket link', 'suspicious link', 'scam link', 'fraudulent xmarket link'],
    answer:
      "Avoid opening suspicious links claiming to be from XMARKET. If you need to access your account, navigate to XMARKET directly instead of using an unexpected link.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_fake_support',
    keywords: ['fake support agent', 'fake customer service', 'someone pretending support', 'fake xmarket support', 'support scam'],
    answer:
      "Be cautious of anyone claiming to represent XMARKET who asks for passwords, verification codes, or unnecessary sensitive information. Use the official XMARKET support channel instead.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_scam_purchase',
    keywords: ['scam purchase', 'seller scam', 'buyer scam', 'fraudulent seller', 'scam seller'],
    answer:
      "If you suspect a seller or buyer is attempting to scam you, keep communication and transaction evidence and report the activity through the appropriate XMARKET reporting or support process.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_suspicious_activity',
    keywords: ['suspicious account activity', 'unusual account activity', 'strange activity', 'account activity not mine', 'unknown activity'],
    answer:
      "If you notice suspicious activity on your XMARKET account, change your password, review recent account activity, and contact support if you find activity you did not authorize.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_login_alert',
    keywords: ['unknown login alert', 'new login alert', 'login notification', 'login I do not recognize', 'unknown sign in'],
    answer:
      "If you receive an XMARKET login alert for an activity you do not recognize, secure your account immediately by changing your password and reviewing your account activity.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_order_alert',
    keywords: ['unknown order alert', 'purchase notification not mine', 'order notification unknown', 'unexpected purchase alert', 'unrecognized order notification'],
    answer:
      "If an order notification does not match an order you placed, check your XMARKET order history and secure your account if the order is unauthorized.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_payment_alert',
    keywords: ['unknown payment alert', 'payment notification not mine', 'unrecognized payment', 'unexpected payment', 'payment activity not mine'],
    answer:
      "If you see an unfamiliar payment or payment-related activity connected to XMARKET, review the associated order and contact the relevant payment provider or XMARKET Support as appropriate.",
    links: [{ label: 'My Orders', to: '/orders' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_security_voucher_activity',
    keywords: ['unknown voucher activity', 'voucher used by someone', 'voucher disappeared', 'unauthorized voucher use', 'voucher not mine'],
    answer:
      "If a voucher or promotional benefit appears to have been used without your authorization, secure your account and contact XMARKET Support with the relevant order information.",
    links: [{ label: 'Vouchers', to: '/vouchers' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_wishlist_activity',
    keywords: ['wishlist changed', 'unknown wishlist items', 'wishlist activity not mine', 'favorites changed', 'someone changed wishlist'],
    answer:
      "If your XMARKET wishlist or favorites contain changes you did not make, secure your account and review your account activity.",
    links: [{ label: 'Favorites', to: '/wishlist' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_cart_activity',
    keywords: ['cart changed by someone', 'unknown cart items', 'cart activity not mine', 'someone added items', 'unexpected cart'],
    answer:
      "If your XMARKET cart contains items you did not add, remove them if necessary and review your account security if you suspect unauthorized access.",
    links: [{ label: 'Cart', to: '/cart' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_chat_activity',
    keywords: ['unknown chat', 'message not sent by me', 'chat activity not mine', 'someone used my chat', 'unauthorized message'],
    answer:
      "If you find messages or chat activity you did not send, secure your XMARKET account immediately and report the unauthorized activity to support.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_review_activity',
    keywords: ['unknown review', 'review not written by me', 'fake review on my account', 'review activity not mine', 'unauthorized review'],
    answer:
      "If a review appears on your XMARKET account that you did not submit, secure your account and contact support with the affected review details.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_profile_activity',
    keywords: ['profile activity not mine', 'someone edited profile', 'profile hacked', 'profile changes unauthorized', 'unknown profile changes'],
    answer:
      "If your profile was changed without your permission, secure your XMARKET account by changing your password and review other account information for unauthorized changes.",
    links: [{ label: 'Profile', to: '/profile' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_address_activity',
    keywords: ['someone added address', 'unauthorized saved address', 'address activity not mine', 'unknown delivery address', 'address security'],
    answer:
      "If an unfamiliar delivery address was added to your XMARKET account, remove it if possible, change your password, and review your account activity.",
    links: [{ label: 'Addresses', to: '/settings' }, { label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_recovery_email',
    keywords: ['recovery email security', 'protect recovery email', 'account recovery email', 'recovery contact security', 'secure recovery information'],
    answer:
      "Keep the email or other recovery information associated with your XMARKET account secure. Anyone with access to your recovery channel may potentially affect account recovery.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_recovery_phone',
    keywords: ['recovery phone security', 'protect recovery phone', 'recovery mobile', 'secure recovery number', 'recovery number security'],
    answer:
      "Keep the phone number used for XMARKET account recovery under your control. If you lose access to it, update your account information or use the available recovery process.",
    links: [{ label: 'Account Settings', to: '/settings' }, { label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_security_public_login',
    keywords: ['public computer login', 'internet cafe xmarket', 'computer shop login', 'public device account', 'login at internet cafe'],
    answer:
      "Avoid saving your XMARKET credentials on public computers. Always sign out completely after using your account and avoid enabling persistent login on shared devices.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_browser_extension',
    keywords: ['browser extension security', 'suspicious extension', 'extension stealing password', 'browser add-on security', 'unsafe browser extension'],
    answer:
      "If you suspect a browser extension is interfering with XMARKET or accessing sensitive information, disable or remove the extension and use a trusted browser session.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_device_cleanup',
    keywords: ['secure old device', 'remove old phone', 'old device account', 'device no longer owned', 'old device access'],
    answer:
      "If you no longer control a device that was used to access XMARKET, change your password and use any available account-security controls to prevent continued access.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_after_phone_change',
    keywords: ['changed phone number', 'new phone number security', 'phone number changed', 'update number security', 'new mobile number'],
    answer:
      "If your phone number changes, update the number associated with your XMARKET account when the account settings allow it. Make sure your new recovery information is under your control.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_security_after_email_change',
    keywords: ['changed email', 'new email address', 'email changed', 'update email security', 'new account email'],
    answer:
      "If your email address changes, update the email associated with your XMARKET account when supported and make sure you can access the new address.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_security_after_device_reset',
    keywords: ['phone reset', 'factory reset phone', 'device reset xmarket', 'reset phone account', 'factory reset account access'],
    answer:
      "After resetting your device, sign in to XMARKET again using your existing account credentials. If you cannot remember your credentials, use the account-recovery process.",
    links: [{ label: 'Login', to: '/signin' }, { label: 'Account Recovery', to: '/forgot-password' }],
  },
  {
    id: 'account_security_account_recovery_safety',
    keywords: ['safe account recovery', 'secure recovery', 'recovery security', 'protect account recovery', 'recovery scam'],
    answer:
      "Use only the official XMARKET account-recovery process. Never send your password or verification code to another person claiming they can recover your account.",
    links: [{ label: 'Account Recovery', to: '/forgot-password' }, { label: 'Account Security', to: '/security' }],
  },
];
