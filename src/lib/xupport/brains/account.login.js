export const topic = 'account/login';
export const triggers = ['login', 'log in', 'sign in', 'signin', 'logout', 'log out', 'sign out', 'session'];

export default [
  {
    id: 'account_login',
    keywords: ['login', 'log in', 'sign in', 'signin', 'access account', 'enter account'],
    answer:
      "Open the XMARKET login page and enter your registered account credentials. If you cannot sign in, use the available account-recovery option.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_logout',
    keywords: ['logout', 'log out', 'sign out', 'signout', 'leave account'],
    answer:
      "To sign out of XMARKET, open your account controls and select the available Log Out or Sign Out option.",
    links: [{ label: 'Account', to: '/account' }],
  },
  {
    id: 'account_login_failed',
    keywords: ['cannot login', 'cannot log in', 'login failed', 'sign in failed', 'unable to sign in', 'login not working'],
    answer:
      "If you cannot sign in to XMARKET, check your account credentials and connection first. If the problem continues, use the available password-recovery or account-recovery option.",
    links: [{ label: 'Login', to: '/login' }, { label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_session',
    keywords: ['logged out', 'session expired', 'session ended', 'why was I logged out', 'account signed out'],
    answer:
      "If your XMARKET session ended unexpectedly, sign in again. If you repeatedly get logged out, check your connection and account security and contact support if the problem continues.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_multiple',
    keywords: ['multiple accounts', 'two accounts', 'more than one account', 'second account', 'duplicate account'],
    answer:
      "If you have more than one XMARKET account, make sure you are signed in to the account associated with the order, purchase, or store you are trying to access.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_session_security',
    keywords: ['secure login', 'login security', 'protect login', 'secure sign in', 'safe login'],
    answer:
      "Use a strong, unique password for your XMARKET account and keep your login credentials and verification codes private. Avoid entering your credentials on unfamiliar pages.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_logout_other_device',
    keywords: ['logout other device', 'sign out another device', 'remove other login', 'log out everywhere', 'other device access'],
    answer:
      "If XMARKET provides a session-management or security option for signing out other devices, use it from your account security settings. If you suspect unauthorized access, change your password as well.",
    links: [{ label: 'Account Security', to: '/security' }],
  },

  // ---- Login methods & errors ----
  {
    id: 'account_login_email',
    keywords: ['login with email', 'sign in email', 'email login', 'use email to login', 'email sign in'],
    answer:
      "If email login is supported by XMARKET, enter the email address associated with your account and your password on the login page.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_phone',
    keywords: ['login with phone', 'sign in phone', 'phone login', 'mobile login', 'use phone to login'],
    answer:
      "If phone-number login is supported by XMARKET, enter the mobile number associated with your account and complete the login or verification process shown.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_case',
    keywords: ['email case', 'uppercase email', 'lowercase email', 'login email spelling', 'email capitalization'],
    answer:
      "If you cannot sign in, check that the email address or other login identifier is entered correctly. Also make sure there are no accidental spaces or typing errors.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_empty',
    keywords: ['empty login fields', 'missing login information', 'login fields blank', 'login required fields', 'cannot submit login'],
    answer:
      "Enter the required login information before submitting the XMARKET login form. If the form still cannot be submitted, check for any validation message displayed on the page.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_loading',
    keywords: ['login loading', 'sign in loading', 'login stuck', 'login keeps loading', 'login spinner'],
    answer:
      "If the XMARKET login page remains loading, check your internet connection and wait briefly before retrying. Refresh the page if necessary. If the issue continues, try again later.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_network',
    keywords: ['login network error', 'cannot login internet', 'login connection error', 'sign in network problem', 'login offline'],
    answer:
      "A network problem can prevent XMARKET from completing a login request. Check your internet connection and retry the login. If other websites work normally but XMARKET does not, try refreshing the page.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_refresh',
    keywords: ['refresh login', 'reload login page', 'login page reset', 'login page refreshed', 'sign in page reload'],
    answer:
      "If the XMARKET login page was refreshed, enter your login information again and submit the form. If the issue repeats, check your connection or browser.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_browser_login',
    keywords: ['browser login', 'login browser', 'sign in browser', 'xmarket browser login', 'website login'],
    answer:
      "You can use the XMARKET website login page when browser access is supported. Enter your account credentials and follow any verification steps requested.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_mobile_login',
    keywords: ['mobile login', 'phone login website', 'login on phone', 'xmarket on mobile', 'mobile sign in'],
    answer:
      "When using XMARKET on a mobile device, open the marketplace in your supported browser or available XMARKET interface and use the normal login process.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_remember',
    keywords: ['remember login', 'stay logged in', 'keep me signed in', 'remember me', 'persistent login'],
    answer:
      "If XMARKET provides a Remember Me or similar login option, use it only on a device you trust and control. Avoid keeping your account signed in on shared or public devices.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_public_device',
    keywords: ['public computer', 'shared computer', 'shared device', 'public device', 'login public computer'],
    answer:
      "Avoid keeping your XMARKET account signed in on a public or shared device. Always sign out when you finish using the account and never save your password on a device you do not control.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_logout_failed',
    keywords: ['logout not working', 'cannot logout', 'sign out not working', 'logout error', 'unable to sign out'],
    answer:
      "If you cannot sign out of XMARKET, refresh the page and try the logout option again. If the problem continues, close the session and contact XMARKET Support if necessary.",
    links: [{ label: 'Account', to: '/account' }],
  },
  {
    id: 'account_login_after_registration',
    keywords: ['login after signup', 'sign in after registration', 'registered now login', 'new account login', 'created account login'],
    answer:
      "After completing XMARKET registration and any required verification, use your account credentials to sign in.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_credentials_correct',
    keywords: ['correct password but cannot login', 'password correct login failed', 'credentials correct', 'login despite correct password'],
    answer:
      "If your XMARKET credentials appear correct but login still fails, check for validation messages, connection problems, or account restrictions. If you still cannot sign in, use account recovery or contact support.",
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Account Recovery', to: '/recover-account' }
    ],
  },
  {
    id: 'account_access_restricted',
    keywords: ['access restricted', 'account restriction', 'account restricted', 'restricted account', 'access denied'],
    answer:
      "If access to your XMARKET account is restricted, review the message shown by the system and follow the provided instructions. Contact XMARKET Support if you need clarification about the restriction.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_new_device',
    keywords: ['new phone', 'new device', 'new mobile', 'switch phone', 'use xmarket on new device'],
    answer:
      "You can sign in to your XMARKET account from a new supported device using your existing account credentials. Complete any verification required for the new login.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_credentials_exposed',
    keywords: ['password leaked', 'credentials leaked', 'password exposed', 'login details exposed', 'credentials stolen'],
    answer:
      "If you believe your XMARKET credentials have been exposed, change your password immediately and avoid reusing that password elsewhere. Review your account activity for anything unfamiliar.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
];
