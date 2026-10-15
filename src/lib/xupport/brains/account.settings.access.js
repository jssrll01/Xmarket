export const topic = 'account/settings/access';
export const triggers = ['account settings', 'settings page', 'security page', 'privacy page', 'terms page'];

export default [
  {
    id: 'account_settings_access',
    keywords: ['open account settings', 'where are settings', 'account settings page', 'manage account settings', 'settings page'],
    answer:
      "Open your XMARKET account settings to view and manage the account options available to you.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_security_access',
    keywords: ['open security settings', 'where is security', 'security page', 'account security page', 'security settings page'],
    answer:
      "Open the XMARKET account security area to review the security controls and account-protection options available to you.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_privacy_access',
    keywords: ['open privacy policy', 'where is privacy policy', 'privacy page', 'xmarket privacy', 'privacy information'],
    answer:
      "Open the XMARKET Privacy page to review information about privacy and personal-data handling.",
    links: [{ label: 'Privacy', to: '/privacy' }],
  },
  {
    id: 'account_terms_access',
    keywords: ['open terms', 'where are terms', 'terms page', 'xmarket terms', 'read terms'],
    answer:
      "Open the XMARKET Terms of Service page to review the rules and conditions applicable to using the marketplace.",
    links: [{ label: 'Terms of Service', to: '/terms' }],
  },
];
