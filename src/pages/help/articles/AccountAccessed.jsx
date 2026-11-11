import React from 'react';

export default function AccountAccessed() {
  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>What should I do if someone accessed my account?</h2>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Overview</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you believe someone accessed your XMARKET account without your permission, take action immediately to protect your account and prevent further unauthorized activity.
          </p>
          <p style={{ marginBottom: 10 }}>
            Signs of unauthorized access may include:
          </p>
          <p>• An unfamiliar login or device</p>
          <p>• A password change you did not make</p>
          <p>• An unexpected email or phone-number change</p>
          <p>• Orders you did not place</p>
          <p>• Messages you did not send</p>
          <p>• Reviews or profile changes you did not make</p>
          <p>• Unrecognized XMARKET Wallet transactions</p>
          <p>• Unexpected verification codes</p>
          <p>• Security notifications you do not recognize</p>
          <p style={{ marginTop: 10 }}>
            «Important: Do not share your password, verification codes, recovery codes, Wallet PIN, or payment credentials with anyone claiming they can help recover your account.»
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What should I do immediately?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you can still access your account, secure it as soon as possible.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 1: Change your password</strong></p>
          <p style={{ marginBottom: 10 }}>
            Go to Account Settings → Security → Change Password and create a new, unique password.
          </p>
          <p style={{ marginBottom: 10 }}>
            Do not reuse a password that you previously used on another service.
          </p>
          <p style={{ marginBottom: 10 }}>
            If you cannot sign in, use the official Account Recovery process instead.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 2: Sign out unfamiliar sessions</strong></p>
          <p style={{ marginBottom: 10 }}>
            If XMARKET provides Login Activity, Devices, or Active Sessions, review the list.
          </p>
          <p style={{ marginBottom: 10 }}>
            Sign out devices or sessions that you do not recognize.
          </p>
          <p style={{ marginBottom: 10 }}>
            If XMARKET provides a Sign Out of All Devices option, consider using it after confirming your account ownership.
          </p>
          <p style={{ marginBottom: 10 }}>
            Invalidating existing sessions is an important part of recovering a compromised account because changing the password alone may not remove an attacker's existing session.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 3: Check your account information</strong></p>
          <p style={{ marginBottom: 10 }}>
            Review your:
          </p>
          <p>• Email address</p>
          <p>• Phone number</p>
          <p>• Username</p>
          <p>• Profile information</p>
          <p>• Recovery methods</p>
          <p>• MFA settings</p>
          <p>• Trusted devices</p>
          <p style={{ marginBottom: 10 }}>
            If anything was changed without your permission, correct it using XMARKET's official account-security process.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 4: Check your account activity</strong></p>
          <p style={{ marginBottom: 10 }}>
            Review recent:
          </p>
          <p>• Orders</p>
          <p>• Messages</p>
          <p>• Reviews</p>
          <p>• Wallet transactions</p>
          <p>• Payment activity</p>
          <p>• Profile changes</p>
          <p>• Address changes</p>
          <p style={{ marginBottom: 10 }}>
            Report anything you do not recognize.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 5: Enable additional security</strong></p>
          <p style={{ marginBottom: 10 }}>
            If XMARKET supports Multi-Factor Authentication (MFA), enable it after securing your account.
          </p>
          <p style={{ marginBottom: 10 }}>
            MFA provides an additional authentication factor beyond the password and can help protect accounts against password-based attacks.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 6: Contact XMARKET Support</strong></p>
          <p>
            If you find unauthorized activity, cannot remove an unfamiliar session, or believe the attacker changed your account information, contact XMARKET Support.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I can still access my account?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you still have access, do not immediately sign out before securing the account.
          </p>
          <p style={{ marginBottom: 10 }}>
            Follow this order:
          </p>
          <p>1. Change your password.</p>
          <p>2. Review and terminate unfamiliar sessions.</p>
          <p>3. Check your email address and phone number.</p>
          <p>4. Check MFA and recovery settings.</p>
          <p>5. Review orders and transactions.</p>
          <p>6. Review messages and other activity.</p>
          <p>7. Enable MFA if available.</p>
          <p>8. Contact XMARKET Support if you find unauthorized activity.</p>
          <p style={{ marginTop: 10 }}>
            Changing sensitive account information should require appropriate re-authentication so that someone with only a stolen or unattended session cannot easily take permanent control of the account.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I cannot access my account?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If someone changed your password or other login information:
          </p>
          <p>1. Open the official XMARKET login page.</p>
          <p>2. Select Forgot Password?, Account Recovery, or the applicable option.</p>
          <p>3. Use an established recovery method that you still control.</p>
          <p>4. Complete the required verification.</p>
          <p>5. Create a new, unique password.</p>
          <p>6. Sign in again.</p>
          <p>7. Review your account information and active sessions.</p>
          <p>8. Contact XMARKET Support if you discover unauthorized changes.</p>
          <p style={{ marginTop: 10 }}>
            A password reset by itself may not be enough if an attacker has also changed your recovery information or still has an active session. A secure recovery process should also address those forms of continued access.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if someone changed my email address?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If an attacker changed the email address associated with your XMARKET account:
          </p>
          <p>1. Start XMARKET Account Recovery.</p>
          <p>2. Do not rely solely on the newly added email address.</p>
          <p>3. Use an established recovery method that you still control.</p>
          <p>4. Complete the required ownership verification.</p>
          <p>5. Restore your correct email address if XMARKET allows it.</p>
          <p>6. Change your password.</p>
          <p>7. Review active sessions.</p>
          <p>8. Contact XMARKET Support.</p>
          <p style={{ marginTop: 10 }}>
            Changes to security-critical information such as an email address should receive additional verification because that information may also be used for future account recovery.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if someone changed my phone number?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If your registered phone number was changed without your permission:
          </p>
          <p>1. Start XMARKET Account Recovery.</p>
          <p>2. Use another established recovery method if available.</p>
          <p>3. Complete the required verification.</p>
          <p>4. Restore your correct phone number if permitted.</p>
          <p>5. Change your password.</p>
          <p>6. Review MFA and recovery settings.</p>
          <p>7. Review active sessions.</p>
          <p>8. Contact XMARKET Support.</p>
          <p style={{ marginTop: 10 }}>
            Do not ask another person to receive XMARKET verification codes for you.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I receive an unexpected verification code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you receive a verification code that you did not request:
          </p>
          <p>1. Do not share the code.</p>
          <p>2. Do not enter it into an unfamiliar website.</p>
          <p>3. Check your XMARKET account for unfamiliar activity.</p>
          <p>4. Change your password if you suspect someone knows it.</p>
          <p>5. Review active sessions and devices.</p>
          <p>6. Check your recovery information.</p>
          <p>7. Contact XMARKET Support if you believe someone is attempting to access your account.</p>
          <p style={{ marginTop: 10 }}>
            An unexpected verification request does not necessarily mean that access was successful, but it should be treated seriously.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if there are unauthorized orders?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you find an order that you did not place:
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 1: Secure your account</strong></p>
          <p style={{ marginBottom: 10 }}>
            Change your password and terminate unfamiliar sessions.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 2: Review the order</strong></p>
          <p style={{ marginBottom: 10 }}>
            Open the order details and record the relevant information.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 3: Contact XMARKET</strong></p>
          <p style={{ marginBottom: 10 }}>
            Report the order as unauthorized through the available support or order-help process.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 4: Check your payment activity</strong></p>
          <p style={{ marginBottom: 10 }}>
            Review your XMARKET Wallet or other payment activity for transactions you do not recognize.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 5: Contact your payment provider if necessary</strong></p>
          <p style={{ marginBottom: 10 }}>
            If an unauthorized payment was made using an external payment method, contact the applicable payment provider through its official support channel.
          </p>

          <p>
            Do not attempt to resolve an unauthorized order by communicating with an unknown person outside XMARKET.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if someone sent messages from my account?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If messages were sent from your account without your permission:
          </p>
          <p>1. Secure your account immediately.</p>
          <p>2. Change your password.</p>
          <p>3. Sign out unfamiliar sessions.</p>
          <p>4. Review your account and security settings.</p>
          <p>5. Check whether your email or phone number was changed.</p>
          <p>6. Review connected devices or applications if available.</p>
          <p>7. Report the unauthorized activity to XMARKET Support.</p>
          <p style={{ marginTop: 10 }}>
            If the unauthorized messages contain suspicious links or requests for money, warn anyone who may have received them not to follow the instructions.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if my XMARKET Wallet was accessed?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you notice an unfamiliar Wallet transaction:
          </p>
          <p>1. Secure your XMARKET account immediately.</p>
          <p>2. Change your password.</p>
          <p>3. Terminate unfamiliar sessions.</p>
          <p>4. Do not share your Wallet PIN.</p>
          <p>5. Review your recent Wallet transactions.</p>
          <p>6. Record the details of the suspicious transaction.</p>
          <p>7. Contact XMARKET Support immediately.</p>
          <p>8. Contact the relevant payment provider if an external payment method was involved.</p>
          <p style={{ marginTop: 10 }}>
            Do not attempt to recover funds by giving your Wallet PIN or verification codes to another person.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if the attacker still has access after I change my password?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Changing the password may not be sufficient if an attacker still has an active session or has changed another authentication method.
          </p>
          <p style={{ marginBottom: 10 }}>
            Check:
          </p>
          <p>• Active sessions</p>
          <p>• Trusted devices</p>
          <p>• Recovery email</p>
          <p>• Recovery phone number</p>
          <p>• MFA methods</p>
          <p>• Passkeys, if supported</p>
          <p>• Connected applications, if supported</p>
          <p>• Other account-security settings</p>
          <p style={{ marginTop: 10 }}>
            Terminate or remove anything you do not recognize.
          </p>
          <p style={{ marginTop: 10 }}>
            After a confirmed compromise, XMARKET's recovery process should invalidate existing sessions and outstanding recovery credentials where appropriate.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I clicked a suspicious link?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you clicked a suspicious link related to XMARKET:
          </p>
          <p>1. Do not enter your password or verification code.</p>
          <p>2. Close the suspicious page.</p>
          <p>3. If you entered your XMARKET credentials, change your password immediately.</p>
          <p>4. Review your account activity.</p>
          <p>5. Review active sessions.</p>
          <p>6. Check your recovery information.</p>
          <p>7. Secure your email account if necessary.</p>
          <p>8. Contact XMARKET Support if you suspect unauthorized access.</p>
          <p style={{ marginTop: 10 }}>
            If you downloaded an unfamiliar file or installed an unknown application, consider securing the device before performing further sensitive account actions.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if my email account was also compromised?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Your email account may be important for XMARKET account recovery.
          </p>
          <p style={{ marginBottom: 10 }}>
            If you believe your email account was compromised:
          </p>
          <p>1. Secure your email account first.</p>
          <p>2. Change its password.</p>
          <p>3. Enable MFA if available.</p>
          <p>4. Review active email sessions.</p>
          <p>5. Check recovery information.</p>
          <p>6. Check forwarding rules and filters for unauthorized changes.</p>
          <p>7. Then secure your XMARKET account.</p>
          <p>8. Contact XMARKET Support if necessary.</p>
          <p style={{ marginTop: 10 }}>
            Do not assume that securing only your XMARKET password is enough if an attacker also controls your recovery email.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if my phone or SIM was compromised?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If your phone or SIM card may have been compromised:
          </p>
          <p>1. Contact your mobile carrier through its official support channel.</p>
          <p>2. Secure your mobile account.</p>
          <p>3. Check whether your number was transferred or replaced without authorization.</p>
          <p>4. Secure your XMARKET account using another trusted recovery method if available.</p>
          <p>5. Change your XMARKET password.</p>
          <p>6. Review active sessions and security settings.</p>
          <p>7. Contact XMARKET Support.</p>
          <p style={{ marginTop: 10 }}>
            For higher-security accounts, XMARKET may provide or recommend authentication methods that are less dependent on SMS, such as authenticator-based MFA or passkeys, when supported.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>How do I know whether my account is secure again?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            After securing your account, check that:
          </p>
          <p>• Your password has been changed.</p>
          <p>• Unrecognized sessions have been terminated.</p>
          <p>• Your email address is correct.</p>
          <p>• Your phone number is correct.</p>
          <p>• Your MFA settings are correct.</p>
          <p>• Your recovery methods are correct.</p>
          <p>• Your trusted devices are recognized.</p>
          <p>• No unfamiliar applications are connected.</p>
          <p>• No unauthorized orders remain unexplained.</p>
          <p>• No unfamiliar Wallet transactions remain unexplained.</p>
          <p>• Your profile information has not been changed.</p>
          <p style={{ marginTop: 10 }}>
            If you still see suspicious activity after completing these steps, contact XMARKET Support.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What information should I provide to XMARKET Support?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            When reporting unauthorized access, provide information that helps XMARKET investigate the incident, such as:
          </p>
          <p>• Your XMARKET username</p>
          <p>• Approximate time you noticed the problem</p>
          <p>• Description of the suspicious activity</p>
          <p>• Unrecognized order information</p>
          <p>• Unrecognized transaction information</p>
          <p>• Unexpected account changes</p>
          <p>• Security notifications you received</p>
          <p>• Screenshots of relevant information, if appropriate</p>
          <p style={{ marginTop: 10, marginBottom: 10 }}>
            Do not provide:
          </p>
          <p>• Your password</p>
          <p>• Your Wallet PIN</p>
          <p>• Verification codes</p>
          <p>• Recovery codes</p>
          <p>• Full payment credentials</p>
          <p style={{ marginTop: 10 }}>
            Support should use an appropriate account-verification process rather than asking you to disclose your secret authentication credentials.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I am completely locked out?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you cannot sign in and cannot use your normal recovery methods:
          </p>
          <p>1. Go to the official XMARKET Account Recovery page.</p>
          <p>2. Start the recovery process.</p>
          <p>3. Use any previously established recovery method that you still control.</p>
          <p>4. Follow the account-ownership verification process.</p>
          <p>5. Contact XMARKET Support if automated recovery fails.</p>
          <p>6. Provide only the information requested through the official support process.</p>
          <p style={{ marginTop: 10 }}>
            XMARKET may be unable to restore an account if there is insufficient evidence to establish ownership. This protects accounts from unauthorized recovery attempts.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Important reminders</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p>• Act quickly if you suspect unauthorized access.</p>
          <p>• Change your password immediately if you believe it was exposed.</p>
          <p>• Use a new password that is unique to XMARKET.</p>
          <p>• Terminate unfamiliar sessions and devices.</p>
          <p>• Review your email, phone number, and recovery methods.</p>
          <p>• Enable MFA if available.</p>
          <p>• Check orders, messages, and Wallet transactions.</p>
          <p>• Secure your email account if it may also be compromised.</p>
          <p>• Contact XMARKET Support about unauthorized activity.</p>
          <p>• Never share passwords, verification codes, recovery codes, or Wallet PINs.</p>
          <p>• Only use official XMARKET recovery and support channels.</p>
          <p>• Do not pay anyone who claims they can recover your XMARKET account.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Account Security Checklist</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            After suspected unauthorized access, confirm that you have:
          </p>
          <p>• Changed my XMARKET password</p>
          <p>• Signed out unfamiliar devices or sessions</p>
          <p>• Checked my email address</p>
          <p>• Checked my phone number</p>
          <p>• Checked my MFA settings</p>
          <p>• Checked my recovery methods</p>
          <p>• Checked recent orders</p>
          <p>• Checked Wallet transactions</p>
          <p>• Checked messages and profile activity</p>
          <p>• Secured my email account</p>
          <p>• Enabled MFA if available</p>
          <p>• Contacted XMARKET Support if necessary</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Related Questions</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p>• How do I secure my XMARKET account?</p>
          <p>• How do I recover my account?</p>
          <p>• How do I change my password?</p>
          <p>• How do I change my email address?</p>
          <p>• How do I change my phone number?</p>
          <p>• What should I do if I receive an unknown verification code?</p>
          <p>• How do I report suspicious activity?</p>
          <p>• How do I secure my XMARKET Wallet?</p>
          <p>• How do I delete my XMARKET account?</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Need More Help?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p>
            If you believe someone accessed your XMARKET account, contact XMARKET Support as soon as possible after securing the account.
          </p>
          <p style={{ marginTop: 10 }}>
            If you cannot access your account, use the official Account Recovery process.
          </p>
          <p style={{ marginTop: 10 }}>
            For your security, never include your password, verification code, Wallet PIN, recovery code, or full payment credentials in a support request.
          </p>
        </div>
      </div>
    </div>
  );
}
