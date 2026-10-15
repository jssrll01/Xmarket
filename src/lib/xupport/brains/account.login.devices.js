export const topic = 'account/login/devices';
export const triggers = ['browser', 'incognito', 'cache', 'cookies', 'javascript', 'redirect', 'timeout', 'server error', 'autofill', 'private mode', 'desktop', 'mobile browser'];

export default [
  {
    id: 'account_login_identifier',
    keywords: ['login identifier', 'account identifier', 'what do I use to login', 'login details', 'sign in information'],
    answer:
      "Use the login information associated with your XMARKET account. Enter it exactly as requested on the login page and complete any verification step shown.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_case_sensitive',
    keywords: ['password case sensitive', 'uppercase password', 'lowercase password', 'capital letters password', 'password capitalization'],
    answer:
      "Enter your XMARKET password exactly as you created it, including capitalization and any required characters.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_password_spaces',
    keywords: ['password has spaces', 'password space', 'spaces in password', 'login password spaces', 'password typing error'],
    answer:
      "When entering your XMARKET password, make sure there are no accidental spaces before or after it. Enter the password exactly as it was created.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_email_spaces',
    keywords: ['email has spaces', 'email space login', 'spaces in email', 'email typing error', 'login email spaces'],
    answer:
      "Check your XMARKET login email for accidental spaces or typing errors. Enter the email address exactly as associated with your account.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_password_autofill',
    keywords: ['autofill password', 'saved password', 'browser password', 'password autofill wrong', 'saved login'],
    answer:
      "If your browser automatically fills incorrect XMARKET login information, clear or replace the saved credentials and enter the correct account details manually.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_browser_saved_credentials',
    keywords: ['saved xmarket password', 'browser saved password', 'remove saved password', 'saved account credentials', 'browser credentials'],
    answer:
      "If you no longer want your browser to remember XMARKET credentials, manage the saved-password settings in your browser and remove the saved entry.",
    links: [{ label: 'Account Security', to: '/security' }],
  },
  {
    id: 'account_login_private_mode',
    keywords: ['private browsing login', 'incognito login', 'private mode', 'login incognito', 'browser private mode'],
    answer:
      "If you are troubleshooting an XMARKET login problem, you can try a private or incognito browser window to determine whether cached data or browser extensions are contributing to the issue.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_browser_cache',
    keywords: ['clear cache login', 'browser cache', 'cached xmarket page', 'login cache problem', 'clear browser data'],
    answer:
      "If XMARKET behaves incorrectly in your browser, clearing cached site data and refreshing the page may resolve outdated page information.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_browser_cookies',
    keywords: ['cookies', 'browser cookies', 'login cookies', 'cookies disabled', 'xmarket cookies'],
    answer:
      "Some website features may require browser storage or cookies to function correctly. If XMARKET login or account features do not work, check your browser's site-data settings.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_browser_javascript',
    keywords: ['javascript disabled', 'javascript login', 'website scripts not working', 'xmarket scripts', 'browser javascript'],
    answer:
      "If parts of XMARKET do not load or respond correctly, make sure your browser allows the website functionality required by the marketplace.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_login_mobile_browser',
    keywords: ['login phone browser', 'mobile browser login issue', 'phone browser sign in', 'android login', 'mobile website login'],
    answer:
      "If you are having trouble signing in to XMARKET from a mobile browser, refresh the page, check your connection, and make sure the browser is up to date.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_desktop_browser',
    keywords: ['computer login', 'desktop login', 'pc login', 'laptop login', 'desktop browser sign in'],
    answer:
      "If you are signing in to XMARKET from a computer, use a supported browser and enter your account credentials on the official login page.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_page_missing',
    keywords: ['login page missing', 'cannot find login', 'where is login', 'login button missing', 'sign in button'],
    answer:
      "Use the XMARKET login page to access an existing account. If the login control is not appearing, refresh the page and check that the website has loaded correctly.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_register_page_missing',
    keywords: ['register page missing', 'cannot find signup', 'where to register', 'signup button missing', 'create account button'],
    answer:
      "Use the XMARKET registration page to create a new account. If the registration option is not visible, refresh the page and check that the website has loaded correctly.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_login_redirect',
    keywords: ['login redirect', 'login sends me back', 'sign in redirects', 'login redirect loop', 'cannot stay logged in'],
    answer:
      "If XMARKET repeatedly redirects you away from the login page, refresh the site and try signing in again. Clearing relevant browser site data can also help resolve a stale session.",
    links: [{ label: 'Login', to: '/login' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_register_redirect',
    keywords: ['registration redirect', 'signup redirects', 'register page redirect', 'signup loop', 'registration loop'],
    answer:
      "If the XMARKET registration process repeatedly redirects or does not complete, refresh the page and retry with valid registration information. If the issue continues, contact support.",
    links: [{ label: 'Create Account', to: '/register' }, { label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_login_timeout',
    keywords: ['login timeout', 'sign in timeout', 'login request timed out', 'authentication timeout', 'login taking too long'],
    answer:
      "If your XMARKET login request times out, check your internet connection and retry. If the problem continues while other websites work normally, try again later or contact support.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_register_timeout',
    keywords: ['registration timeout', 'signup timeout', 'registration taking too long', 'create account timeout', 'signup request timed out'],
    answer:
      "If XMARKET registration times out, check your internet connection and retry the registration process. Avoid submitting multiple registration requests at the same time.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_login_server_error',
    keywords: ['login server error', 'login server problem', 'authentication server error', 'sign in server error', 'login unavailable'],
    answer:
      "If XMARKET displays a server or service error during login, retry after checking your connection. If the error continues, the service may need attention from XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_register_server_error',
    keywords: ['registration server error', 'signup server error', 'registration service unavailable', 'register server problem', 'create account server error'],
    answer:
      "If XMARKET displays a server error while creating an account, retry after checking your connection. If registration remains unavailable, contact XMARKET Support.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_login_unavailable',
    keywords: ['login unavailable', 'cannot access login', 'sign in unavailable', 'login service down', 'login not available'],
    answer:
      "If the XMARKET login service is temporarily unavailable, retry later. If the problem persists, check the available XMARKET support information for service-related updates.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_register_unavailable',
    keywords: ['registration unavailable', 'cannot register now', 'signup unavailable', 'registration disabled', 'new account unavailable'],
    answer:
      "If XMARKET registration is temporarily unavailable, retry later and check the available support information for updates.",
    links: [{ label: 'Help Center', to: '/help' }],
  },
  {
    id: 'account_login_error_message',
    keywords: ['login error message', 'authentication error', 'login error', 'sign in error message', 'what does login error mean'],
    answer:
      "Read the specific error message shown by XMARKET because it may identify whether the problem involves your credentials, verification, connection, or account access.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_registration_error_message',
    keywords: ['registration error message', 'signup error message', 'registration warning', 'signup warning', 'create account error message'],
    answer:
      "Check the exact message shown by XMARKET during registration and correct the information it identifies. If no corrective action is provided and registration still fails, contact support.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_recovery_error_message',
    keywords: ['recovery error message', 'account recovery error', 'forgot password error', 'recovery warning', 'recovery problem message'],
    answer:
      "Follow the instructions in the XMARKET recovery error message. If the requested recovery information is correct but the process still fails, contact XMARKET Support.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_register_username_taken',
    keywords: ['username taken', 'username already exists', 'username unavailable', 'username already used', 'choose another username'],
    answer:
      "If the username you entered is already in use, choose another available username and continue the XMARKET registration process.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_email_format',
    keywords: ['email format registration', 'invalid signup email', 'email format signup', 'valid email registration', 'email syntax'],
    answer:
      "Enter a valid email address in the format requested by the XMARKET registration form. Check for spelling errors or missing characters before submitting.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_phone_format',
    keywords: ['phone format registration', 'mobile format signup', 'valid phone registration', 'phone format', 'mobile number format'],
    answer:
      "Enter your mobile number using the format requested by XMARKET. Check the country code, digits, and spacing if the registration form provides specific formatting instructions.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_invalid_name',
    keywords: ['invalid name registration', 'name rejected', 'registration name error', 'name field error', 'invalid account name'],
    answer:
      "If XMARKET rejects a name during registration, review the field for invalid characters, missing information, or formatting requirements and follow the message displayed by the registration form.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_terms_unchecked',
    keywords: ['terms checkbox', 'cannot register terms', 'terms not checked', 'accept terms checkbox', 'registration checkbox'],
    answer:
      "If XMARKET requires you to acknowledge its Terms of Service before registration, review the terms and complete the required acknowledgment before submitting the form.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_verification_required',
    keywords: ['registration verification required', 'verify before account', 'signup verification required', 'registration needs verification', 'verify signup'],
    answer:
      "If XMARKET requires verification during registration, complete the verification step shown before attempting to use the account.",
    links: [{ label: 'Create Account', to: '/register' }, { label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_login_verification_required',
    keywords: ['login verification required', 'verify during login', 'login otp', 'sign in verification', 'login code required'],
    answer:
      "If XMARKET requests an additional verification step during login, complete the verification using the method provided by the system.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_verification_failed',
    keywords: ['login verification failed', 'login code rejected', 'sign in verification failed', 'login otp failed', 'verification failed login'],
    answer:
      "If verification fails during XMARKET login, check that you are using the latest valid code and follow any retry instructions displayed. If the issue persists, use account recovery or contact support.",
    links: [{ label: 'Login', to: '/login' }, { label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_login_verification_expired',
    keywords: ['login code expired', 'otp expired login', 'verification expired login', 'expired sign in code', 'old login code'],
    answer:
      "If the login verification code has expired, request a new code using the available option and enter the latest code provided.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_verification_resend',
    keywords: ['resend login code', 'send login code again', 'new login otp', 'resend otp', 'request new login code'],
    answer:
      "If XMARKET provides a resend option during login verification, use it to request a new code. Enter the most recently received code.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_login_verification_limit',
    keywords: ['login verification limit', 'too many login codes', 'too many login attempts', 'verification attempts exceeded', 'login temporarily blocked'],
    answer:
      "If repeated login or verification attempts trigger a temporary restriction, stop retrying repeatedly and follow the waiting or recovery instructions provided by XMARKET.",
    links: [{ label: 'Account Recovery', to: '/recover-account' }],
  },
  {
    id: 'account_register_duplicate',
    keywords: ['duplicate registration', 'registered twice', 'duplicate account signup', 'created two accounts', 'multiple registrations'],
    answer:
      "If you accidentally created multiple XMARKET accounts, identify which account contains your correct information or orders and use that account going forward.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_wrong_credentials',
    keywords: ['wrong login details', 'incorrect credentials', 'wrong credentials', 'login details incorrect', 'credentials not accepted'],
    answer:
      "Check that you are using the correct XMARKET account identifier and password. If you cannot remember the password, use the password-recovery option.",
    links: [{ label: 'Login', to: '/login' }, { label: 'Forgot Password', to: '/forgot-password' }],
  },
];
