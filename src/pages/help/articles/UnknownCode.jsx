import React from 'react';

export default function UnknownCode() {
  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>What should I do if I receive an unknown verification code?</h2>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Overview</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you receive an XMARKET verification code that you did not request, someone may be attempting to sign in, reset your password, change account information, or perform another security-sensitive action.
          </p>
          <p style={{ marginBottom: 10 }}>
            An unexpected code does not necessarily mean that someone successfully accessed your account, but you should treat it as a security warning.
          </p>
          <p style={{ marginBottom: 10 }}>
            Never share an XMARKET verification code with anyone.
          </p>
          <p>
            Verification codes are authentication secrets and should be protected in the same way as other account credentials. Secure OTP systems are designed to use codes for a limited time and generally for a single verification attempt.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What should I do immediately?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you receive an unexpected verification code:
          </p>
          <p>1. Do not share the code.</p>
          <p>2. Do not enter the code anywhere unless you personally initiated the action.</p>
          <p>3. Do not send the code to someone claiming to be XMARKET Support.</p>
          <p>4. Check your XMARKET account for unfamiliar activity.</p>
          <p>5. Change your password if you believe someone may know it.</p>
          <p>6. Review your active sessions or devices, if available.</p>
          <p>7. Check your email address and phone number.</p>
          <p>8. Contact XMARKET Support if you suspect unauthorized access.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Why did I receive a verification code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            An unexpected code can happen for several reasons.
          </p>
          <p style={{ marginBottom: 10 }}>
            Someone may have:
          </p>
          <p>• Attempted to sign in to your account.</p>
          <p>• Attempted to reset your password.</p>
          <p>• Attempted to change your email address.</p>
          <p>• Attempted to change your phone number.</p>
          <p>• Attempted to perform a security-sensitive action.</p>
          <p>• Entered your email address or phone number by mistake.</p>
          <p>• Repeatedly requested verification codes.</p>
          <p style={{ marginTop: 10 }}>
            The code itself does not prove that the person successfully accessed your account.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if someone asks me for the code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Do not provide it.
          </p>
          <p style={{ marginBottom: 10 }}>
            XMARKET verification codes are intended to verify an action or account-access attempt. Giving the code to another person could allow them to complete an authentication or recovery process that you did not initiate.
          </p>
          <p style={{ marginBottom: 10 }}>
            Be especially cautious if someone says:
          </p>
          <p>• "I accidentally sent the code to you."</p>
          <p>• "Send me the code so I can verify your account."</p>
          <p>• "I'm from XMARKET Support."</p>
          <p>• "Your account will be suspended if you don't give me the code."</p>
          <p>• "You need to confirm the code to receive your order."</p>
          <p>• "Give me the code so I can cancel the order."</p>
          <p style={{ marginTop: 10 }}>
            Do not follow instructions that require you to disclose your verification code.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if someone claims to be XMARKET Support?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Do not provide your verification code simply because someone claims to be a support representative.
          </p>
          <p style={{ marginBottom: 10 }}>
            Instead:
          </p>
          <p>1. End the conversation if it appears suspicious.</p>
          <p>2. Open XMARKET directly.</p>
          <p>3. Use the official XMARKET Support channel.</p>
          <p>4. Report the suspicious interaction if appropriate.</p>
          <p>5. Follow the official account-security process.</p>
          <p style={{ marginTop: 10 }}>
            Do not use a support link supplied by a suspicious message if you are unsure whether it is legitimate.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I accidentally shared the code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you shared an unexpected verification code:
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 1: Change your password</strong></p>
          <p style={{ marginBottom: 10 }}>
            Immediately change your XMARKET password to a new, unique password.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 2: Review active sessions</strong></p>
          <p style={{ marginBottom: 10 }}>
            Check your active devices or sessions and terminate anything you do not recognize.
          </p>

          <p style={{ marginBottom: 10 }}><strong>Step 3: Check account information</strong></p>
          <p style={{ marginBottom: 10 }}>
            Review your:
          </p>
          <p>• Email address</p>
          <p>• Phone number</p>
          <p>• Username</p>
          <p>• Recovery methods</p>
          <p>• MFA settings</p>
          <p>• Trusted devices</p>

          <p style={{ marginBottom: 10 }}><strong>Step 4: Check account activity</strong></p>
          <p style={{ marginBottom: 10 }}>
            Look for:
          </p>
          <p>• Unrecognized orders</p>
          <p>• Unfamiliar messages</p>
          <p>• Profile changes</p>
          <p>• Wallet transactions</p>
          <p>• Payment activity</p>
          <p>• Other security changes</p>

          <p style={{ marginBottom: 10 }}><strong>Step 5: Contact XMARKET Support</strong></p>
          <p>
            Tell XMARKET Support that you may have disclosed a verification code and provide information about any suspicious activity.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I entered the code on a suspicious website?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you entered an XMARKET verification code into a website you do not trust:
          </p>
          <p>1. Close the website.</p>
          <p>2. Change your XMARKET password immediately.</p>
          <p>3. Review active sessions and devices.</p>
          <p>4. Check your email and phone number.</p>
          <p>5. Review MFA and recovery settings.</p>
          <p>6. Check recent orders and transactions.</p>
          <p>7. Contact XMARKET Support if you suspect your account was accessed.</p>
          <p style={{ marginTop: 10 }}>
            If you also entered your password, treat the account as potentially compromised.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I did not share the code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you did not share or enter the code, you generally do not need to use the code.
          </p>
          <p style={{ marginBottom: 10 }}>
            However, you should still pay attention to additional security notifications or unfamiliar account activity.
          </p>
          <p style={{ marginBottom: 10 }}>
            If unexpected codes continue arriving:
          </p>
          <p>1. Do not respond to the requests.</p>
          <p>2. Do not share any codes.</p>
          <p>3. Change your password if you suspect it has been exposed.</p>
          <p>4. Review active sessions.</p>
          <p>5. Enable MFA if available.</p>
          <p>6. Contact XMARKET Support if the activity continues.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Should I change my password?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Consider changing your password if:
          </p>
          <p>• You did not request the verification code.</p>
          <p>• You believe someone knows your password.</p>
          <p>• You reused your XMARKET password on another website.</p>
          <p>• You clicked a suspicious XMARKET-related link.</p>
          <p>• You entered your credentials on an unfamiliar website.</p>
          <p>• You notice other suspicious account activity.</p>
          <p style={{ marginTop: 10 }}>
            Use a strong, unique password that you do not use for other accounts.
          </p>
          <p style={{ marginTop: 10 }}>
            MFA can provide an additional authentication factor beyond your password and is an important defense against many password-based attacks.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I receive several codes?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Repeated unexpected codes may indicate repeated login or account-recovery attempts.
          </p>
          <p style={{ marginBottom: 10 }}>
            Do not respond to the requests or provide any codes.
          </p>
          <p style={{ marginBottom: 10 }}>
            Instead:
          </p>
          <p>1. Secure your account.</p>
          <p>2. Change your password if necessary.</p>
          <p>3. Review account activity.</p>
          <p>4. Check your recovery information.</p>
          <p>5. Review active sessions.</p>
          <p>6. Enable MFA if available.</p>
          <p>7. Contact XMARKET Support if the attempts continue.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if the code message contains a link?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Be careful with links in unexpected messages.
          </p>
          <p style={{ marginBottom: 10 }}>
            If you receive a verification message containing a link that you did not expect:
          </p>
          <p>• Do not automatically open the link.</p>
          <p>• Do not enter your password through the link.</p>
          <p>• Do not enter the verification code through the link.</p>
          <p>• Open XMARKET directly instead.</p>
          <p>• Check your account through the official application or website.</p>
          <p style={{ marginTop: 10 }}>
            If you need to recover your account, use the official XMARKET recovery process rather than a link supplied by an unknown person.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I requested the code myself?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you personally requested the verification code, use it only for the action you intentionally started.
          </p>
          <p style={{ marginBottom: 10 }}>
            Before entering the code, make sure:
          </p>
          <p>• You are using the official XMARKET app or website.</p>
          <p>• You initiated the login, recovery, or account-security action.</p>
          <p>• The action shown matches what you intended to do.</p>
          <p>• You have not been instructed by another person to provide the code.</p>
          <p style={{ marginTop: 10 }}>
            Never forward the code to another person.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if the code expires?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Verification codes are generally designed to be valid for a limited period.
          </p>
          <p style={{ marginBottom: 10 }}>
            If a code expires:
          </p>
          <p>1. Return to the XMARKET verification screen.</p>
          <p>2. Request a new code if necessary.</p>
          <p>3. Use the newest valid code.</p>
          <p>4. Do not use an old code that has expired.</p>
          <p>5. Never ask another person to provide a code for you.</p>
          <p style={{ marginTop: 10 }}>
            Security codes should be short-lived and, where applicable, single-use.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I receive a code after changing my password?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            If you recently changed your password or performed another security action, a verification message may be legitimate.
          </p>
          <p style={{ marginBottom: 10 }}>
            However, if you did not initiate the action that triggered the code:
          </p>
          <p>• Do not use the code.</p>
          <p>• Do not share it.</p>
          <p>• Review your account security.</p>
          <p>• Contact XMARKET Support if necessary.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I receive a verification code after someone contacted me?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Be especially cautious.
          </p>
          <p style={{ marginBottom: 10 }}>
            For example, someone may contact you and claim:
          </p>
          <p style={{ marginBottom: 10 }}>
            «"I need the code that was just sent to you."»
          </p>
          <p style={{ marginBottom: 10 }}>
            Do not provide it.
          </p>
          <p style={{ marginBottom: 10 }}>
            The person may be attempting to use your verification code to complete an account-access or recovery process.
          </p>
          <p>
            End the conversation and use XMARKET's official support channels instead.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What should I check after receiving an unknown code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Review your account for:
          </p>
          <p>• Password: Has it changed?</p>
          <p>• Email: Is your registered email still correct?</p>
          <p>• Phone: Is your registered phone number still correct?</p>
          <p>• MFA: Are the authentication methods yours?</p>
          <p>• Devices: Are all logged-in devices recognized?</p>
          <p>• Orders: Are there unfamiliar orders?</p>
          <p>• Wallet: Are there unfamiliar transactions?</p>
          <p>• Messages: Did your account send messages you did not write?</p>
          <p>• Profile: Did someone change your information?</p>
          <p>• Recovery settings: Are your recovery methods still correct?</p>
          <p style={{ marginTop: 10 }}>
            If you find unauthorized changes, follow the XMARKET account-recovery process and contact Support.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Can someone access my account just by requesting a code?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Not necessarily.
          </p>
          <p style={{ marginBottom: 10 }}>
            Requesting a verification code does not by itself prove that someone successfully accessed your account.
          </p>
          <p style={{ marginBottom: 10 }}>
            However, an attacker may be attempting to obtain the code from you through social engineering or phishing.
          </p>
          <p>
            The safest response is to never disclose the code and to secure your account if you suspect your password or other credentials have been compromised.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What information should I give XMARKET Support?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            When reporting suspicious verification activity, you may provide:
          </p>
          <p>• Your XMARKET username</p>
          <p>• Approximate time you received the code</p>
          <p>• Whether you requested the code</p>
          <p>• The type of verification message, if known</p>
          <p>• Whether someone contacted you about the code</p>
          <p>• Screenshots of the suspicious message, when appropriate</p>
          <p>• Any unfamiliar account activity</p>
          <p style={{ marginTop: 10 }}>
            Never include the verification code itself, your password, Wallet PIN, recovery codes, or full payment credentials.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>What if I think someone already accessed my account?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            Treat the situation as a potential account compromise.
          </p>
          <p style={{ marginBottom: 10 }}>
            1. Change your XMARKET password.
          </p>
          <p>2. Sign out unfamiliar sessions.</p>
          <p>3. Review your email and phone number.</p>
          <p>4. Check MFA and recovery settings.</p>
          <p>5. Review orders and Wallet transactions.</p>
          <p>6. Review messages and profile changes.</p>
          <p>7. Enable MFA if available.</p>
          <p>8. Contact XMARKET Support.</p>
          <p style={{ marginTop: 10 }}>
            A password change alone may not be enough if an attacker already has an active session or has modified recovery information. Account-recovery guidance recommends reviewing recovery methods and invalidating existing sessions after a suspected compromise.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Verification Code Safety Checklist</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: 10 }}>
            When you receive an unexpected code:
          </p>
          <p>• Do not share the code.</p>
          <p>• Do not enter it on an unfamiliar website.</p>
          <p>• Do not send it to someone claiming to be Support.</p>
          <p>• Check whether you initiated the request.</p>
          <p>• Review your account for suspicious activity.</p>
          <p>• Change your password if necessary.</p>
          <p>• Review active sessions.</p>
          <p>• Check your recovery information.</p>
          <p>• Enable MFA if available.</p>
          <p>• Contact XMARKET Support if you suspect unauthorized access.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Important reminders</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p>• Your verification code is private.</p>
          <p>• XMARKET Support should not require you to disclose your authentication code simply to provide assistance.</p>
          <p>• An unexpected code does not automatically mean your account was successfully accessed.</p>
          <p>• Never follow urgent instructions from unknown people asking for your code.</p>
          <p>• Use only official XMARKET account-recovery and support channels.</p>
          <p>• If you accidentally disclose a code, secure your account immediately.</p>
          <p>• If you notice unauthorized activity, report it to XMARKET Support as soon as possible.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Related Questions</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p>• What should I do if someone accessed my account?</p>
          <p>• How do I secure my XMARKET account?</p>
          <p>• How do I recover my account?</p>
          <p>• How do I change my password?</p>
          <p>• How do I change my email address?</p>
          <p>• How do I change my phone number?</p>
          <p>• How do I report suspicious activity?</p>
          <p>• What should I do if I lose access to my account?</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 10, color: "#000000" }}>Need More Help?</h3>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <p>
            If you received an unknown verification code and believe someone may be attempting to access your XMARKET account, secure your account immediately and contact XMARKET Support through the official support channel.
          </p>
          <p style={{ marginTop: 10 }}>
            Never share your verification code, password, Wallet PIN, or recovery codes with another person.
          </p>
        </div>
      </div>
    </div>
  );
}
