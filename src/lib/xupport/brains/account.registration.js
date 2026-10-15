export const topic = 'account/registration';
export const triggers = ['register', 'sign up', 'signup', 'create account', 'new account', 'registration'];

export default [
  {
    id: 'account_create',
    keywords: ['create account', 'make account', 'sign up', 'register', 'registration', 'new account'],
    answer:
      "To create an XMARKET account, open the registration page and provide the information requested by XMARKET. Complete any verification steps shown before using your new account.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_verify',
    keywords: ['verify account', 'account verification', 'verification', 'verify email', 'verify phone', 'verification code'],
    answer:
      "Complete the verification step requested by XMARKET using the code or verification method provided. Never share verification codes with other people.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_verification_code',
    keywords: ['verification code not received', 'no verification code', 'code not received', 'verification sms', 'verification email', 'where is my code'],
    answer:
      "If you did not receive a verification code, check that your contact information is correct and check your SMS or email inbox, including spam or junk folders. You can also use the available resend option if provided.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_resend_code',
    keywords: ['resend code', 'send code again', 'new verification code', 'request another code', 'verification resend'],
    answer:
      "If the verification screen provides a Resend Code option, use it to request another verification code. Avoid repeatedly requesting codes within a short period.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_email_invalid',
    keywords: ['invalid email', 'email invalid', 'wrong email format', 'email error', 'email address rejected'],
    answer:
      "If XMARKET reports that your email address is invalid, check the spelling and make sure the address uses a valid email format before submitting it again.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_email_not_received',
    keywords: ['email not received', 'no email', 'verification email missing', 'did not receive email', 'email never arrived'],
    answer:
      "If you are waiting for an XMARKET email, check your inbox and spam or junk folders and confirm that the email address associated with your account is correct.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_phone_invalid',
    keywords: ['invalid phone', 'phone number invalid', 'wrong phone format', 'mobile number error', 'phone rejected'],
    answer:
      "If XMARKET reports an invalid phone number, check the number carefully and make sure it follows the format requested on the account form.",
    links: [{ label: 'Account Settings', to: '/settings' }],
  },
  {
    id: 'account_phone_verification',
    keywords: ['verify phone', 'phone verification', 'mobile verification', 'verify mobile number', 'phone code'],
    answer:
      "If phone verification is required, enter the verification code sent to the phone number associated with your XMARKET account. Keep the code private.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_phone_not_received',
    keywords: ['phone code not received', 'sms code missing', 'verification sms not received', 'no sms code', 'mobile code not received'],
    answer:
      "If you did not receive the XMARKET verification SMS, check that the phone number is correct and that your device can receive messages. Use the resend option if it is available.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_wrong_verification_code',
    keywords: ['wrong verification code', 'invalid verification code', 'incorrect code', 'verification code error', 'code does not work'],
    answer:
      "If your verification code is rejected, make sure you are entering the most recently received code and that it has not expired. Request a new code if necessary.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_code_expired',
    keywords: ['expired code', 'verification code expired', 'code expired', 'old verification code', 'expired verification'],
    answer:
      "An expired verification code can no longer be used. Request a new verification code and enter the latest code provided by XMARKET.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_too_many_codes',
    keywords: ['too many codes', 'verification limit', 'too many verification attempts', 'code limit', 'verification blocked'],
    answer:
      "If XMARKET temporarily limits verification attempts, wait for the restriction to clear before requesting or entering another code. Avoid repeatedly requesting new codes.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },

  // ---- Registration methods & errors ----
  {
    id: 'account_register_email',
    keywords: ['register with email', 'email registration', 'sign up email', 'create account email', 'email signup'],
    answer:
      "If email registration is available on XMARKET, enter a valid email address during registration and complete any verification requested by the system.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_phone',
    keywords: ['register with phone', 'phone registration', 'sign up phone', 'create account phone', 'mobile signup'],
    answer:
      "If phone registration is available on XMARKET, enter a valid mobile number during registration and complete the verification steps shown.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_duplicate_email',
    keywords: ['email already registered', 'email already exists', 'email already used', 'duplicate email', 'email in use'],
    answer:
      "If XMARKET says an email address is already registered, that email may already be associated with an account. Try signing in or use the password-recovery option instead of creating another account.",
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Forgot Password', to: '/forgot-password' }
    ],
  },
  {
    id: 'account_duplicate_phone',
    keywords: ['phone already registered', 'phone already exists', 'number already used', 'duplicate phone', 'mobile already registered'],
    answer:
      "If XMARKET says a phone number is already registered, the number may already be associated with an account. Try signing in to that account or use the available recovery process.",
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Account Recovery', to: '/recover-account' }
    ],
  },
  {
    id: 'account_registration_error',
    keywords: ['registration error', 'sign up error', 'cannot register', 'registration failed', 'signup failed', 'create account error'],
    answer:
      "If XMARKET cannot complete your registration, check that all required information is valid and complete. Correct any displayed errors and try again.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_registration_missing_field',
    keywords: ['required field', 'missing registration information', 'registration field missing', 'required information', 'signup required field'],
    answer:
      "Complete all required fields on the XMARKET registration form before submitting it. Any field marked as required must contain valid information.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_registration_password',
    keywords: ['registration password', 'signup password', 'password during registration', 'create password', 'new account password'],
    answer:
      "When creating an XMARKET account, enter a password that meets the requirements displayed on the registration form. Keep your password private.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_password_mismatch',
    keywords: ['passwords do not match', 'password mismatch', 'confirm password error', 'password confirmation', 'passwords different'],
    answer:
      "If XMARKET reports that your passwords do not match, enter the same password in both password fields and try submitting the form again.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_registration_network',
    keywords: ['registration network error', 'signup connection error', 'register internet problem', 'cannot sign up internet', 'registration connection'],
    answer:
      "If registration fails because of a connection problem, check your internet connection and retry the registration form. Make sure you do not submit the form repeatedly while a previous request is still processing.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_register_refresh',
    keywords: ['registration page refresh', 'signup page reload', 'registration reset', 'lost registration form', 'register page refreshed'],
    answer:
      "If the registration page was refreshed and your information was cleared, enter the required details again and submit the registration form when ready.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_registration_age',
    keywords: ['age requirement', 'minimum age', 'age to register', 'who can register', 'registration age'],
    answer:
      "Check the XMARKET Terms of Service for the eligibility and age requirements that apply to creating and using an account.",
    links: [{ label: 'Terms of Service', to: '/terms' }],
  },
  {
    id: 'account_registration_terms',
    keywords: ['agree terms registration', 'accept terms', 'registration agreement', 'terms during signup', 'signup terms'],
    answer:
      "Review the XMARKET Terms of Service and any required agreements shown during registration before creating an account.",
    links: [{ label: 'Terms of Service', to: '/terms' }],
  },
  {
    id: 'account_registration_privacy',
    keywords: ['privacy during registration', 'registration privacy', 'signup privacy', 'personal information signup', 'data during signup'],
    answer:
      "Review the information requested during XMARKET registration and the applicable privacy information before submitting your account details.",
    links: [{ label: 'Privacy', to: '/privacy' }],
  },
  {
    id: 'account_registration_cancel',
    keywords: ['cancel registration', 'stop signup', 'cancel signup', 'do not create account', 'exit registration'],
    answer:
      "If you no longer want to create an XMARKET account, you can leave the registration process before submitting it. Information already submitted may depend on the registration process and applicable policies.",
    links: [{ label: 'Create Account', to: '/register' }],
  },
  {
    id: 'account_registration_already_account',
    keywords: ['already have account', 'existing account', 'already registered', 'have xmarket account', 'dont need new account'],
    answer:
      "If you already have an XMARKET account, use the login page instead of creating another account.",
    links: [{ label: 'Login', to: '/login' }],
  },
  {
    id: 'account_verification_pending',
    keywords: ['verification pending', 'account verification pending', 'waiting for verification', 'verify account pending', 'verification processing'],
    answer:
      "If your XMARKET verification is still pending, follow the status or instructions displayed on the verification page. Avoid submitting repeated verification requests unless instructed.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_verification_failed',
    keywords: ['verification failed', 'cannot verify account', 'account verification failed', 'verification rejected', 'verify failed'],
    answer:
      "If XMARKET cannot verify your account, review the information you submitted and follow any correction or retry instructions displayed. Contact support if the verification problem remains unresolved.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
  {
    id: 'account_verification_retry',
    keywords: ['retry verification', 'verify again', 'verification retry', 'try verification again', 'redo verification'],
    answer:
      "If XMARKET provides a verification retry option, use it and carefully follow the instructions shown. Make sure the information you provide is accurate.",
    links: [{ label: 'Account Verification', to: '/verify' }],
  },
];
