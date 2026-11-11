import React from 'react';

export default function TechInfo() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>What information should I provide when reporting an error?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>When reporting a technical problem to XMARKET Support, provide enough information to reproduce or understand the issue.</p>
          <p>Clear technical details can help Support identify whether the problem is related to your device, connection, account, application, browser, or XMARKET's systems.</p>
        </div>
      </div>

      <div className="card">
        <h3>What information should I provide?</h3>
        <div>
          <p>Depending on the issue, provide:</p>

          <p><strong>1. Description of the problem</strong></p>
          <p>Explain:</p>
          <p>• What happened</p>
          <p>• What you expected to happen</p>
          <p>• What you were doing when the error occurred</p>

          <p><strong>2. Error message</strong></p>
          <p>If an error message appears, provide the exact wording when possible.</p>

          <p><strong>3. Affected feature</strong></p>
          <p>Identify the affected area, such as:</p>
          <p>• Login</p>
          <p>• Search</p>
          <p>• Product page</p>
          <p>• Cart</p>
          <p>• Checkout</p>
          <p>• Payment</p>
          <p>• Orders</p>
          <p>• Chat</p>
          <p>• Product upload</p>
          <p>• Account settings</p>

          <p><strong>4. Date and time</strong></p>
          <p>Provide approximately when the problem occurred.</p>
          <p>This can help Support identify relevant system activity.</p>

          <p><strong>5. Device information</strong></p>
          <p>When requested, provide:</p>
          <p>• Device type</p>
          <p>• Device model</p>
          <p>• Operating-system version</p>

          <p><strong>6. App or browser information</strong></p>
          <p>If applicable, provide:</p>
          <p>• XMARKET app version</p>
          <p>• Browser name</p>
          <p>• Browser version</p>

          <p><strong>7. Internet connection</strong></p>
          <p>Indicate whether you were using:</p>
          <p>• Wi-Fi</p>
          <p>• Mobile data</p>
          <p>• Another supported connection</p>
          <p>You generally do not need to provide private network credentials.</p>

          <p><strong>8. Screenshots or recordings</strong></p>
          <p>Provide screenshots or other relevant evidence when available.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I not provide?</h3>
        <div>
          <p>Never include unnecessary sensitive information such as:</p>
          <p>• Passwords</p>
          <p>• Verification codes</p>
          <p>• Wallet PINs</p>
          <p>• Card security codes</p>
          <p>• Banking passwords</p>
          <p>• Complete payment credentials</p>
          <p>• Private security questions or answers</p>
          <p>XMARKET Support should not require your password or verification code to diagnose an ordinary technical problem.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the problem involves an order?</h3>
        <div>
          <p>Provide the relevant:</p>
          <p>• Order number</p>
          <p>• Affected product</p>
          <p>• Error message</p>
          <p>• Order status</p>
          <p>Only provide information requested through official XMARKET Support channels.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the problem involves a payment?</h3>
        <div>
          <p>Provide the relevant transaction or order reference when requested.</p>
          <p>Do not send complete card details, passwords, PINs, or verification codes.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I cannot reproduce the problem?</h3>
        <div>
          <p>Explain:</p>
          <p>• When it happened</p>
          <p>• What you were doing</p>
          <p>• What appeared on the screen</p>
          <p>• Whether it happened once or multiple times</p>
          <p>• Any troubleshooting steps you already tried</p>
          <p>Screenshots can be especially useful for one-time errors.</p>
        </div>
      </div>

      <div className="card">
        <h3>Example of a useful technical report</h3>
        <div>
          <p>A useful report could explain:</p>
          <p><em>"I attempted to add a product to my cart, but the quantity remained unchanged after selecting a different quantity. I refreshed the page and restarted the app, but the issue continued. The problem occurred at approximately 8:00 PM. I am using the latest available XMARKET app on my Android device."</em></p>
          <p>This gives Support enough context to investigate without exposing sensitive information.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Be specific and accurate.</p>
          <p>• Include screenshots when useful.</p>
          <p>• Mention troubleshooting steps you already tried.</p>
          <p>• Protect your account and payment information.</p>
          <p>• Use official XMARKET Support channels.</p>
          <p>• Keep your support reference number when one is provided.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I report a technical problem?</p>
          <p>• What should I do if XMARKET is not loading?</p>
          <p>• Why is the XMARKET app crashing?</p>
          <p>• Why can't I log in?</p>
          <p>• Why isn't my payment page loading?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you are unsure what information to provide, start with a description of the problem and the affected XMARKET feature. XMARKET Support can request additional information if needed.</p>
        </div>
      </div>
    </div>
  );
}
