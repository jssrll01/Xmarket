import React from 'react';

export default function RefundDestination() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Where will my refund be sent?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>The destination of your refund generally depends on the original payment method, XMARKET's supported refund methods, and the circumstances of the transaction.</p>
          <p>The available refund destination should be shown during the refund process or in your refund details.</p>
        </div>
      </div>

      <div className="card">
        <h3>Where can a refund be sent?</h3>
        <div>
          <p>Depending on the payment method and XMARKET's available features, a refund may be sent to:</p>
          <p>• The original card used for payment</p>
          <p>• The original bank payment method</p>
          <p>• The original e-wallet</p>
          <p>• XMARKET Wallet</p>
          <p>• Another supported refund destination</p>
          <p>Not every payment method supports every refund destination.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I choose where my refund goes?</h3>
        <div>
          <p>Not necessarily.</p>
          <p>The refund destination may be determined by the original payment method and XMARKET's applicable refund process.</p>
          <p>If multiple options are available, XMARKET may display them during the refund process.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I no longer have access to the original payment method?</h3>
        <div>
          <p>Contact XMARKET Support and explain the situation.</p>
          <p>Do not provide your payment credentials, password, PIN, or verification codes to another person claiming they can redirect the refund.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I paid using a card?</h3>
        <div>
          <p>If the applicable refund process sends the refund back to the original card, the refund may appear in the card account associated with the original transaction.</p>
          <p>Your card issuer may require additional processing time.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I paid using an e-wallet?</h3>
        <div>
          <p>If supported, the refund may be returned to the e-wallet used for the original payment.</p>
          <p>Check the transaction history of the relevant e-wallet.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I used XMARKET Wallet?</h3>
        <div>
          <p>If the applicable transaction supports Wallet refunds, the refund may be credited to your XMARKET Wallet balance.</p>
          <p>Check your Wallet transaction history after the refund is processed.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I used multiple payment methods?</h3>
        <div>
          <p>If an order was paid using multiple methods and XMARKET supports refunds for that transaction, the refund may be allocated according to the applicable payment and refund rules.</p>
          <p>Review your refund details for the exact breakdown.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the refund destination is incorrect?</h3>
        <div>
          <p>Do not provide payment details through an unofficial message to request a correction.</p>
          <p>Contact XMARKET Support through official channels and provide the relevant order and refund information.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Check your refund details for the applicable destination.</p>
          <p>• Refund destinations may depend on the original payment method.</p>
          <p>• Processing times may vary by provider.</p>
          <p>• Never share passwords, PINs, or verification codes.</p>
          <p>• Be cautious of anyone requesting payment to release or redirect a refund.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How long does a refund take?</p>
          <p>• Why have I not received my refund yet?</p>
          <p>• How do I check my return/refund status?</p>
          <p>• How do I request a refund?</p>
          <p>• Are my payment details secure?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you cannot determine where your refund was sent, contact XMARKET Support with your order and refund details.</p>
        </div>
      </div>
    </div>
  );
}
