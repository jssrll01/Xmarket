import React from 'react';

export default function PaymentFailed() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why did my payment fail?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>A payment may fail when XMARKET or the payment provider cannot successfully complete the transaction.</p>
          <p>A failed payment does not necessarily mean that your account has a problem. It may be caused by incorrect payment information, insufficient funds, a temporary technical issue, provider restrictions, or other factors.</p>
        </div>
      </div>

      <div className="card">
        <h3>Common reasons a payment may fail</h3>
        <div>
          <p>Your payment may fail because:</p>
          <p>• Payment information is incorrect</p>
          <p>• Insufficient funds or available credit</p>
          <p>• Card has expired</p>
          <p>• Card is not enabled for the transaction</p>
          <p>• Payment provider is temporarily unavailable</p>
          <p>• Internet connection was interrupted</p>
          <p>• Payment session expired</p>
          <p>• Security verification was unsuccessful</p>
          <p>• Transaction exceeded a payment limit</p>
          <p>• Payment method is not supported for the order</p>
          <p>• XMARKET or payment provider experienced a technical issue</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do if my payment fails?</h3>
        <div>
          <p>1. Review the error message.</p>
          <p>2. Check your payment information.</p>
          <p>3. Confirm that your payment method is active.</p>
          <p>4. Check your available funds or credit.</p>
          <p>5. Try the payment again if appropriate.</p>
          <p>6. Make sure your internet connection is stable.</p>
          <p>7. Try another supported payment method.</p>
          <p>8. Check whether your order status changed.</p>
          <p>9. Contact your payment provider if necessary.</p>
          <p>10. Contact XMARKET Support if the problem continues.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I entered the wrong payment information?</h3>
        <div>
          <p>Correct the information before attempting the payment again.</p>
          <p>For card payments, check the applicable card details requested by the payment provider.</p>
          <p>Never send your full card information, PIN, password, or verification code to another person through chat.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I have enough funds but the payment still fails?</h3>
        <div>
          <p>Having sufficient funds does not always guarantee that a transaction will succeed.</p>
          <p>The payment provider may have additional security checks, transaction limits, merchant restrictions, or temporary service problems.</p>
          <p>Contact your payment provider if the issue continues.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the payment provider is unavailable?</h3>
        <div>
          <p>If the payment provider is experiencing an outage or temporary service issue, wait and try again later.</p>
          <p>You may also select another available payment method if your order supports it.</p>
        </div>
      </div>

      <div className="card">
        <h3>Should I try paying again?</h3>
        <div>
          <p>You may retry a failed payment if the transaction clearly shows as unsuccessful.</p>
          <p>Before trying again, check whether:</p>
          <p>• The order is still awaiting payment.</p>
          <p>• No successful transaction was recorded.</p>
          <p>• Your account was not already charged.</p>
          <p>If money was deducted, do not repeatedly attempt payment. Follow the process for a deducted-but-unconfirmed payment instead.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I was charged after a failed payment?</h3>
        <div>
          <p>Check your bank, card, or payment provider transaction history.</p>
          <p>If the payment was deducted but the XMARKET order was not confirmed, do not make another payment immediately.</p>
          <p>Contact XMARKET Support or follow the applicable payment-resolution process.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order was cancelled after the payment failed?</h3>
        <div>
          <p>Check the order status and payment information.</p>
          <p>If a payment was actually completed despite the cancellation, a refund or reversal may be processed according to the applicable payment and refund procedures.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Read the payment error message carefully.</p>
          <p>• Do not repeatedly submit a payment if a transaction may already be processing.</p>
          <p>• Use only supported payment methods.</p>
          <p>• Keep transaction references and confirmation details.</p>
          <p>• Never share your password, verification code, card PIN, or Wallet PIN.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What payment methods are available on XMARKET?</p>
          <p>• How do I pay for my order?</p>
          <p>• Why was my payment declined?</p>
          <p>• My payment was deducted but my order was not confirmed. What should I do?</p>
          <p>• How do I check my payment history?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your payment continues to fail, contact XMARKET Support with the order number, payment method, error message, and relevant transaction information.</p>
        </div>
      </div>
    </div>
  );
}
