export const topic = 'account/password';
export const triggers = ['password', 'passwd', 'pwd', 'forgot', 'reset', 'change password'];

export default [
  {
    id: 'account_forgot_password',
    keywords: ['forgot password', 'forgot my password', 'lost password', 'reset password', 'password reset', 'cannot remember password'],
    answer:
      "If you forgot your XMARKET password, use the Forgot Password option on the login page and follow the recovery instructions provided.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_change_password',
    keywords: ['change password', 'update password', 'new password', 'password settings', 'modify password'],
    answer:
      "If password management is available in your account settings, open the security or password section and follow the instructions to update your password.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_wrong_password',
    keywords: ['wrong password', 'password incorrect', 'invalid password', 'password not working', 'login password error'],
    answer:
      "If XMARKET says your password is incorrect, check that you entered the correct credentials. If you cannot remember the password, use the Forgot Password option to begin recovery.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_security_password_share',
    keywords: ['share password', 'give password', 'password safety', 'password security', 'should I share password'],
    answer:
      "Never share your XMARKET password with another person. XMARKET Support should not require you to disclose your private password.",
    links: [{ label: 'Account Security', to: '/security' }],
  },

  // ---- Password requirements & reset ----
  {
    id: 'account_password_requirements',
    keywords: ['password requirements', 'password rules', 'password length', 'strong password', 'password format'],
    answer:
      "Use the password requirements displayed by XMARKET when creating or changing your password. If a password is rejected, review the requirements shown on the screen and create one that satisfies them.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_password_reset_failed',
    keywords: ['password reset failed', 'cannot reset password', 'reset password error', 'password reset not working', 'unable to reset password'],
    answer:
      "If you cannot reset your XMARKET password, check that you are using the correct account-recovery information and follow the instructions displayed. If the problem continues, contact XMARKET Support.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_password_reset_link',
    keywords: ['password reset link', 'reset link', 'forgot password link', 'password recovery link', 'reset email'],
    answer:
      "Use the password-reset instructions provided by XMARKET after requesting a password reset. If you do not receive the reset message, check your inbox and spam or junk folders.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_password_reset_expired',
    keywords: ['reset link expired', 'password link expired', 'expired reset link', 'reset link not working', 'old reset link'],
    answer:
      "If a password-reset link has expired or is no longer valid, request a new password reset and use the latest recovery instructions provided by XMARKET.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_password_reset_wrong_account',
    keywords: ['reset wrong account', 'password reset wrong email', 'recovery for wrong account', 'forgot password wrong account'],
    answer:
      "Make sure the recovery information you provide belongs to the XMARKET account you are trying to access. If you have multiple accounts, verify that you are recovering the correct one.",
    links: [{ label: 'Forgot Password', to: '/forgot-password' }],
  },
  {
    id: 'account_password_reuse',
    keywords: ['reuse password', 'same password', 'password reused', 'password security', 'unique password'],
    answer:
      "Use a unique password for your XMARKET account rather than reusing a password from another service. This reduces the impact if another service experiences a credential breach.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_password_change_security',
    keywords: ['change password security', 'change password after hack', 'password security change', 'reset compromised password', 'secure password'],
    answer:
      "If you suspect unauthorized access, change your XMARKET password as soon as possible and review your account for unfamiliar activity.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_security_password_change',
    keywords: ['how to change password securely', 'secure password change', 'password update security', 'change account password'],
    answer:
      "Use XMARKET's official account settings or password-recovery flow to change your password. Do not use password-reset links from suspicious messages.",
    links: [
      { label: 'Account Settings', to: '/settings' },
      { label: 'Forgot Password', to: '/forgot-password' }
    ],
  },
  {
    id: 'account_access_after_password_change',
    keywords: ['cannot login after password change', 'password changed cannot login', 'new password not working', 'login after changing password'],
    answer:
      "If you cannot sign in after changing your XMARKET password, make sure you are using the newly saved password and the correct account identifier. If necessary, start the password-recovery process again.",
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Forgot Password', to: '/forgot-password' }
    ],
  },
];
