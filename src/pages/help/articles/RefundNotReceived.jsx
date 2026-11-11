import React from 'react';

export default function RefundNotReceived() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why have I not received my refund yet?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>If your refund has been approved but you have not received the funds, the refund may still be processing through XMARKET or your payment provider.</p>
          <p>First, check the refund status and destination before taking further action.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I check first?</h3>
        <div>
          <p>1. Sign in to XMARKET.</p>
          <p>2. Open My Account.</p>
          <p>3. Select Orders.</p>
          <p>4. Open the affected order.</p>
          <p>5. Check the return/refund status.</p>
          <p>6. Check whether the refund has been approved or completed.</p>
          <p>7. Check the stated refund destination.</p>
          <p>8. Review your bank, card, or e-wallet transaction history.</p>
          <p>9. Check whether the applicable processing period has passed.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why might my refund be delayed?</h3>
        <div>
          <p>Common reasons may include:</p>
          <p>• Refund is still under review.</p>
          <p>• Return has not yet been received.</p>
          <p>• Returned product is still being inspected.</p>
          <p>• Refund has been approved but not processed.</p>
          <p>• Bank processing delay.</p>
          <p>• E-wallet processing delay.</p>
          <p>• Card issuer processing delay.</p>
          <p>• Payment provider delay.</p>
          <p>• Weekend or holiday processing.</p>
          <p>• Technical or synchronization issue.</p>
          <p>• Additional verification is required.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the refund says "Processing"?</h3>
        <div>
          <p>A Processing status generally means the refund has not yet completed.</p>
          <p>Wait for the applicable processing period shown by XMARKET and continue checking the refund status.</p>
          <p>Avoid submitting another refund request for the same transaction unless instructed.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the refund says "Completed"?</h3>
        <div>
          <p>If XMARKET shows Completed but the funds are not visible:</p>
          <p>1. Confirm the refund destination.</p>
          <p>2. Check your payment provider's transaction history.</p>
          <p>3. Check the original payment method.</p>
          <p>4. Allow the provider's processing time.</p>
          <p>5. Contact the payment provider if necessary.</p>
          <p>6. Contact XMARKET Support if the refund remains missing.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I used a card?</h3>
        <div>
          <p>Check the card account associated with the original transaction.</p>
          <p>Some card issuers may display a refund separately or adjust the original transaction rather than showing a new incoming transaction.</p>
          <p>If the refund is confirmed as completed but remains unavailable, contact your card issuer and XMARKET Support as appropriate.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I used an e-wallet?</h3>
        <div>
          <p>Check the e-wallet's transaction history and balance.</p>
          <p>If XMARKET confirms the refund but the funds are not visible after the applicable processing period, contact the payment provider and XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I used XMARKET Wallet?</h3>
        <div>
          <p>Check your Wallet balance and transaction history.</p>
          <p>If the refund is marked completed but your balance has not been updated, contact XMARKET Support with the relevant transaction information.</p>
        </div>
      </div>

      <div className="card">
        <h3>What information should I provide to Support?</h3>
        <div>
          <p>When contacting XMARKET Support, provide:</p>
          <p>• Order number</p>
          <p>• Refund request details</p>
          <p>• Refund status</p>
          <p>• Refund amount</p>
          <p>• Payment method</p>
          <p>• Refund date, if shown</p>
          <p>• Relevant transaction or reference number</p>
          <p>• Screenshots of the refund status when useful</p>
          <p>Never provide your password, Wallet PIN, or verification code.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the refund period has already passed?</h3>
        <div>
          <p>If the applicable processing period has passed and your refund is still missing, contact XMARKET Support.</p>
          <p>Support may need to investigate the refund with the relevant payment provider.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Check the refund status before assuming the refund failed.</p>
          <p>• Verify where the refund was sent.</p>
          <p>• Allow the applicable payment-provider processing time.</p>
          <p>• Do not submit duplicate claims unnecessarily.</p>
          <p>• Keep refund references and transaction records.</p>
          <p>• Never pay an unofficial person to release a refund.</p>
          <p>• Never share security codes, passwords, or PINs.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I check my return/refund status?</p>
          <p>• How long does a refund take?</p>
          <p>• Where will my refund be sent?</p>
          <p>• How do I request a refund?</p>
          <p>• Can I cancel a return/refund request?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your refund has not arrived after the applicable processing period, contact XMARKET Support with your order number, refund status, and payment information.</p>
        </div>
      </div>
    </div>
  );
}
