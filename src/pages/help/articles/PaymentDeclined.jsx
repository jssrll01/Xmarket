import React from 'react';

export default function PaymentDeclined() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why was my payment declined?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>A payment is declined when the payment provider, bank, card issuer, or applicable payment system does not authorize the transaction.</p>
          <p>A declined payment may occur even when your payment information appears correct.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why can a payment be declined?</h3>
        <div>
          <p>Common reasons include:</p>
          <p>• Insufficient available funds</p>
          <p>• Insufficient available credit</p>
          <p>• Card restrictions</p>
          <p>• Expired card</p>
          <p>• Incorrect card information</p>
          <p>• Transaction limit reached</p>
          <p>• Bank or payment-provider security controls</p>
          <p>• Online transactions disabled</p>
          <p>• International or merchant restrictions</p>
          <p>• Suspicious or unusual transaction activity</p>
          <p>• Payment method unavailable</p>
          <p>• Temporary provider issue</p>
          <p>The exact reason may only be available from your bank or payment provider.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do if my payment is declined?</h3>
        <div>
          <p>1. Check the payment message shown by XMARKET.</p>
          <p>2. Verify your payment details.</p>
          <p>3. Check your available funds or credit.</p>
          <p>4. Check whether your card or payment account is active.</p>
          <p>5. Check applicable transaction limits.</p>
          <p>6. Try the payment again if appropriate.</p>
          <p>7. Use another supported payment method.</p>
          <p>8. Contact your bank or payment provider if necessary.</p>
          <p>9. Contact XMARKET Support if the issue continues.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my bank declined the transaction?</h3>
        <div>
          <p>If your bank or card issuer declined the transaction, contact them for the specific reason.</p>
          <p>XMARKET may not be able to override a decision made by your bank or payment provider.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the payment worked before but is now being declined?</h3>
        <div>
          <p>A previously successful payment does not guarantee that another transaction will be approved.</p>
          <p>Possible reasons include:</p>
          <p>• Different order amount</p>
          <p>• Different payment provider</p>
          <p>• New security checks</p>
          <p>• Changed card status</p>
          <p>• Transaction limits</p>
          <p>• Temporary bank restrictions</p>
          <p>• Different merchant or order conditions</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I use another payment method?</h3>
        <div>
          <p>Yes, if another payment method is available for your order.</p>
          <p>Return to checkout and select another supported option.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I was charged even though the payment was declined?</h3>
        <div>
          <p>Check your payment account or bank transaction history.</p>
          <p>If the transaction shows a deduction but XMARKET did not confirm the order, do not immediately submit another payment.</p>
          <p>Follow the applicable deducted-but-unconfirmed payment process.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can XMARKET tell me why my bank declined the payment?</h3>
        <div>
          <p>Not always.</p>
          <p>The bank, card issuer, or payment provider may have information about the specific decline reason that is not shared with XMARKET.</p>
          <p>Contact the relevant provider for more information.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• A declined payment does not necessarily mean your XMARKET account is restricted.</p>
          <p>• Do not repeatedly retry a transaction if you suspect a payment was already processed.</p>
          <p>• Use another supported payment method when appropriate.</p>
          <p>• Never provide your card PIN, password, or verification code to another person.</p>
          <p>• Contact your bank or payment provider for bank-specific decline reasons.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What payment methods are available on XMARKET?</p>
          <p>• How do I pay for my order?</p>
          <p>• Why did my payment fail?</p>
          <p>• My payment was deducted but my order was not confirmed. What should I do?</p>
          <p>• How do I keep my payment information secure?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your payment continues to be declined and you believe there is an XMARKET-related issue, contact XMARKET Support with your order and payment information.</p>
        </div>
      </div>
    </div>
  );
}
