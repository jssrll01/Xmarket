import React from 'react';

export default function TechPaymentPage() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why isn't my payment page loading?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>The payment page may fail to load because of an internet connection issue, browser or app problem, payment-provider issue, security verification, or temporary XMARKET technical problem.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do?</h3>
        <div>
          <p>1. Check your internet connection.</p>
          <p>2. Refresh the payment page.</p>
          <p>3. Close and reopen XMARKET.</p>
          <p>4. Check that your app or browser is updated.</p>
          <p>5. Try another supported browser or device.</p>
          <p>6. Review your selected payment method.</p>
          <p>7. Try again after a short period.</p>
          <p>8. Check your Orders and payment history before attempting payment again.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the payment page freezes?</h3>
        <div>
          <p>Do not repeatedly press the payment button.</p>
          <p>Instead:</p>
          <p>1. Wait briefly for the page to respond.</p>
          <p>2. Check whether a payment confirmation appeared.</p>
          <p>3. Check your payment provider.</p>
          <p>4. Check your XMARKET order status.</p>
          <p>5. Contact Support if the payment status is unclear.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I was charged while the page was loading?</h3>
        <div>
          <p>Do not immediately pay again.</p>
          <p>Check whether:</p>
          <p>• An order was created.</p>
          <p>• The payment is pending.</p>
          <p>• The payment was completed.</p>
          <p>• The payment was reversed.</p>
          <p>• The payment appears in your provider's transaction history.</p>
          <p>If the payment was deducted but no order was confirmed, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if only one payment method does not load?</h3>
        <div>
          <p>The issue may be related to that payment method or its payment provider.</p>
          <p>If another supported payment method is available, you may try it after confirming that no previous payment was completed.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Never enter payment credentials on an unofficial page.</p>
          <p>• Do not repeatedly submit payments.</p>
          <p>• Check your order and payment history after an interrupted checkout.</p>
          <p>• Never share your verification code or payment PIN with another person.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What payment methods are available on XMARKET?</p>
          <p>• Why did my payment fail?</p>
          <p>• Why was my payment declined?</p>
          <p>• My payment was deducted but my order was not confirmed. What should I do?</p>
          <p>• What should I do if I see a blank page?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If the payment page consistently fails to load, contact XMARKET Support with the payment method and error information.</p>
        </div>
      </div>
    </div>
  );
}
