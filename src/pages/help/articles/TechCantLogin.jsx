import React from 'react';

export default function TechCantLogin() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why can't I log in?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>You may be unable to log in because of incorrect account information, verification problems, connectivity issues, account restrictions, temporary technical problems, or security checks.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I check?</h3>
        <div>
          <p>1. Confirm that you are using the correct email address, phone number, or username.</p>
          <p>2. Check that your password is correct.</p>
          <p>3. Make sure Caps Lock or other keyboard settings are not causing an error.</p>
          <p>4. Check your internet connection.</p>
          <p>5. Try signing in again.</p>
          <p>6. Request a password reset if you forgot your password.</p>
          <p>7. Complete any required verification.</p>
          <p>8. Update the XMARKET app or browser.</p>
          <p>9. Try another supported browser or device.</p>
          <p>10. Contact Support if you still cannot access your account.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I forgot my password?</h3>
        <div>
          <p>Use the official Forgot Password or account recovery option.</p>
          <p>Follow the verification steps provided by XMARKET.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I cannot receive my verification code?</h3>
        <div>
          <p>Check that:</p>
          <p>• Your phone number or email is correct.</p>
          <p>• Your device has connectivity.</p>
          <p>• Your email spam or junk folder is checked.</p>
          <p>• You have not requested too many codes in a short period.</p>
          <p>If you no longer have access to your recovery information, use XMARKET's account recovery process.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my account is temporarily restricted?</h3>
        <div>
          <p>A security or policy restriction may prevent login or certain account actions.</p>
          <p>Follow the instructions displayed by XMARKET or contact Support if an appeal or review is available.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Never share your password or verification code.</p>
          <p>• Use only official XMARKET login pages or applications.</p>
          <p>• If you suspect someone accessed your account, secure it immediately.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I recover my account?</p>
          <p>• How do I change my password?</p>
          <p>• What should I do if someone accessed my account?</p>
          <p>• What should I do if I receive an unknown verification code?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you cannot log in after completing the available recovery steps, contact XMARKET Support.</p>
        </div>
      </div>
    </div>
  );
}
