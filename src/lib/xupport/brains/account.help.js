export const topic = 'account/help';
export const triggers = ['help', 'support', 'contact', 'report', 'complaint', 'terms', 'privacy'];

export default [
  {
    id: 'account_help',
    keywords: ['help account', 'account help', 'account problem', 'account issue', 'need account support'],
    answer:
      "For an XMARKET account problem, first check the relevant account, security, login, or recovery option. If the available tools do not resolve the issue, contact XMARKET Support with details about the problem.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_help_center',
    keywords: ['help center', 'customer help', 'support center', 'xmarket help', 'need help'],
    answer:
      "Visit the XMARKET Help Center to find support information for your account, orders, shopping, payments, shipping, and other marketplace concerns.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_contact_support',
    keywords: ['contact support', 'customer support', 'contact xmarket', 'talk to support', 'customer service'],
    answer:
      "If the available XMARKET help information does not resolve your problem, use the available support or contact option and provide the relevant details about your issue.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_report_problem',
    keywords: ['report account problem', 'report issue', 'report problem', 'account complaint', 'submit issue'],
    answer:
      "If you need to report an XMARKET account problem, use the available support or reporting option and describe what happened, including any relevant order or account information.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_data_privacy',
    keywords: ['account data', 'personal data', 'my information', 'privacy', 'personal information', 'data privacy'],
    answer:
      "Your XMARKET account may contain personal information needed to provide marketplace services. Review XMARKET's privacy information and account settings to understand and manage the information available to you.",
    links: [{ label: 'Privacy', to: '/privacy' }],
  },
  {
    id: 'account_terms',
    keywords: ['terms', 'terms of service', 'terms and conditions', 'user agreement', 'xmarket rules'],
    answer:
      "The XMARKET Terms of Service describe the rules and conditions that apply when using the marketplace.",
    links: [{ label: 'Terms of Service', to: '/terms' }],
  },

  {
    id: 'account_profile_contact_support',
    keywords: ['profile support', 'profile problem support', 'help with profile', 'profile issue support', 'account profile help'],
    answer:
      "If you cannot resolve a profile problem using the available account controls, contact XMARKET Support and describe the profile issue you are experiencing.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_address_contact_support',
    keywords: ['address support', 'address problem support', 'help with address', 'delivery address issue', 'address support request'],
    answer:
      "If you cannot add, edit, or manage an address using the available XMARKET controls, contact support and explain the address problem.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_privacy_request',
    keywords: ['privacy request', 'personal data request', 'data request', 'privacy support', 'request account data'],
    answer:
      "For questions about personal information or privacy-related requests, review the applicable XMARKET privacy information and use the support channel provided for privacy concerns.",
    links: [{ label: 'Privacy', to: '/privacy' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_terms_question',
    keywords: ['question about terms', 'terms question', 'rules question', 'xmarket policy question', 'terms clarification'],
    answer:
      "For questions about XMARKET rules or user obligations, review the Terms of Service and contact support if you need clarification about a specific situation.",
    links: [{ label: 'Terms of Service', to: '/terms' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_help_missing_topic',
    keywords: ['help topic missing', 'cannot find answer', 'help article missing', 'support topic not found', 'no answer in help center'],
    answer:
      "If you cannot find an answer to your XMARKET problem in the Help Center, contact XMARKET Support and describe the issue clearly so it can be handled through the appropriate support process.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_support_information',
    keywords: ['what information support needs', 'support details', 'information for support', 'what to send support', 'support request details'],
    answer:
      "When contacting XMARKET Support, describe the problem clearly and include relevant non-sensitive details such as the affected feature, order reference when applicable, and the error message you see. Never send your password or verification code.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_privacy_information',
    keywords: ['what data xmarket collects', 'data collected', 'personal data collected', 'information collected', 'xmarket personal information'],
    answer:
      "Review the XMARKET Privacy Policy for information about personal data and how it is handled in connection with the marketplace.",
    links: [{ label: 'Privacy', to: '/privacy' }],
  },
  {
    id: 'account_privacy_delete_data',
    keywords: ['delete personal data', 'remove personal information', 'data deletion', 'erase my data', 'privacy deletion'],
    answer:
      "For questions about deleting personal information, review the applicable XMARKET privacy information and use the designated support process for privacy-related requests.",
    links: [{ label: 'Privacy', to: '/privacy' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_privacy_data_usage',
    keywords: ['how data is used', 'data usage', 'personal information usage', 'why xmarket needs data', 'use of my information'],
    answer:
      "The XMARKET Privacy Policy explains how personal information may be used in connection with the marketplace. Review the policy for the applicable details.",
    links: [{ label: 'Privacy', to: '/privacy' }],
  },
  {
    id: 'account_terms_updates',
    keywords: ['terms updated', 'terms changed', 'new terms', 'updated terms of service', 'terms changes'],
    answer:
      "XMARKET may update its Terms of Service when necessary. Review the current Terms of Service for the rules and conditions applicable to your use of the marketplace.",
    links: [{ label: 'Terms of Service', to: '/terms' }],
  },
  {
    id: 'account_privacy_updates',
    keywords: ['privacy policy updated', 'privacy changes', 'new privacy policy', 'updated privacy terms', 'privacy policy changes'],
    answer:
      "Review the current XMARKET Privacy Policy for the latest information about privacy and personal-data handling.",
    links: [{ label: 'Privacy', to: '/privacy' }],
  },
];
