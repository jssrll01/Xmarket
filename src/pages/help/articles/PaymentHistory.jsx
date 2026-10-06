import React from 'react';

export default function PaymentHistory() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Where can I view my payment history?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Your payment history allows you to review previous payment transactions associated with your XMARKET account, where this feature is available.</p>
          <p>Depending on XMARKET's available features, payment information may appear under your Payment History, Transactions, Wallet, or within individual order details.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I view my payment history?</h3>
        <div>
          <p>1. Sign in to XMARKET.</p>
          <p>2. Open My Account.</p>
          <p>3. Look for Payment History, Transactions, Wallet, or a similar section.</p>
          <p>4. Open the payment or transaction history.</p>
          <p>5. Browse your previous transactions.</p>
          <p>6. Select a transaction to view additional details, if available.</p>
        </div>
      </div>

      <div className="card">
        <h3>What information may appear?</h3>
        <div>
          <p>A payment record may include:</p>
          <p>• Transaction date</p>
          <p>• Payment amount</p>
          <p>• Payment method</p>
          <p>• Transaction/reference number</p>
          <p>• Related order number</p>
          <p>• Payment status</p>
          <p>• Refund information</p>
          <p>• Payment description</p>
          <p>The exact information shown may vary by payment method.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I view the payment for a specific order?</h3>
        <div>
          <p>If payment details are available within order information:</p>
          <p>1. Open My Account.</p>
          <p>2. Select Orders.</p>
          <p>3. Open the relevant order.</p>
          <p>4. Review the payment section.</p>
          <p>5. Check the transaction information.</p>
        </div>
      </div>

      <div className="card">
        <h3>What do common payment statuses mean?</h3>
        <div>
          <p>Depending on XMARKET's terminology, you may see statuses such as:</p>
          <p>• Completed — payment was successfully processed.</p>
          <p>• Pending/Processing — payment is still being processed.</p>
          <p>• Failed — the payment was not successfully completed.</p>
          <p>• Declined — the payment provider did not authorize the transaction.</p>
          <p>• Refunded — funds were returned through the applicable refund process.</p>
          <p>• Reversed — the payment was reversed by the payment system or provider.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why is a transaction missing?</h3>
        <div>
          <p>A transaction may not immediately appear because:</p>
          <p>• The payment is still processing.</p>
          <p>• The payment was unsuccessful.</p>
          <p>• The payment system has not synchronized yet.</p>
          <p>• You are viewing the wrong account.</p>
          <p>• The transaction belongs to another payment service.</p>
          <p>• There is a temporary technical issue.</p>
          <p>Check the original payment provider or bank statement when appropriate.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I use payment history as proof of payment?</h3>
        <div>
          <p>Transaction information may help verify a payment, but whether it is accepted as official proof depends on the specific XMARKET process.</p>
          <p>Keep payment confirmations, receipts, and transaction references when necessary.</p>
        </div>
      </div>

      <div className="card">
        <h3>How long should I keep payment records?</h3>
        <div>
          <p>Keep relevant payment records until the order, refund, or payment issue has been completely resolved.</p>
          <p>For important transactions, retaining the payment reference can make support requests easier.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Review payment history regularly for unfamiliar transactions.</p>
          <p>• Keep transaction references for unresolved payments.</p>
          <p>• Report unauthorized transactions promptly.</p>
          <p>• Never share passwords, verification codes, card PINs, or Wallet PINs.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What payment methods are available on XMARKET?</p>
          <p>• How do I pay for my order?</p>
          <p>• Are my payment details secure?</p>
          <p>• What should I do if I was charged twice?</p>
          <p>• Why is my payment still processing?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If a payment transaction is missing, incorrect, or unfamiliar, contact XMARKET Support with the relevant transaction information.</p>
        </div>
      </div>
    </div>
  );
}
