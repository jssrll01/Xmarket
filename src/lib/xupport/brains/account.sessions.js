export const topic = 'account/sessions';
export const triggers = ['logout', 'log out', 'sign out', 'session', 'remember me', 'auto logout', 'shared device', 'public computer'];

export default [
  {
    id: 'account_logout',
    keywords: ['logout', 'log out', 'sign out', 'exit account', 'how do I logout'],
    answer:
      "Open your XMARKET account menu and use the available Log Out or Sign Out option. If you are using a shared device, always sign out when finished.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_logout_not_working',
    keywords: ['logout not working', 'cannot logout', 'sign out not working', 'logout button not working', 'unable to sign out'],
    answer:
      "If you cannot log out of XMARKET, refresh the page and try again. If the problem continues, close the browser or app and review your account security settings.",
    links: [{ label: 'Account Security', to: '/security' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_auto_logout',
    keywords: ['automatically logged out', 'keeps logging me out', 'session expired', 'signed out automatically', 'account logs out'],
    answer:
      "If XMARKET repeatedly signs you out, refresh the site and check your browser or app connection. Persistent session problems may require clearing outdated site data or contacting support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_session_expired',
    keywords: ['session expired', 'session has expired', 'login session expired', 'session timeout', 'expired session'],
    answer:
      "If your XMARKET session has expired, sign in again using your account credentials. Unsaved information may need to be entered again.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_keep_logged_in',
    keywords: ['remember me', 'stay logged in', 'keep me signed in', 'remember login', 'automatic login'],
    answer:
      "If XMARKET provides a Remember Me or similar option, use it only on a private and trusted device. Avoid enabling persistent login on shared or public devices.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_shared_device',
    keywords: ['shared computer', 'shared phone', 'public computer', 'someone else phone', 'use xmarket shared device'],
    answer:
      "When using XMARKET on a shared or public device, avoid saving your credentials and sign out completely after using your account.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
];
