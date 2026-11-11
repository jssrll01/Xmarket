import React from 'react';

export default function PaymentProcessing() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why is my payment still processing?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>A payment may remain in a Pending or Processing state while XMARKET or the payment provider is confirming the transaction.</p>
          <p>A processing payment does not necessarily mean that the payment failed.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why can a payment remain processing?</h3>
        <div>
          <p>Possible reasons include:</p>
          <p>• Payment provider processing time</p>
          <p>• Bank processing delay</p>
          <p>• Additional security verification</p>
          <p>• Temporary network problems</p>
          <p>• High transaction volume</p>
          <p>• Payment-system synchronization delay</p>
          <p>• Delayed confirmation from the payment provider</p>
          <p>• Temporary technical issue</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do while my payment is processing?</h3>
        <div>
          <p>1. Check your XMARKET order status.</p>
          <p>2. Check your payment provider's transaction status.</p>
          <p>3. Confirm whether the transaction is pending or completed.</p>
          <p>4. Do not immediately submit another payment.</p>
          <p>5. Wait for the payment status to update.</p>
          <p>6. Contact XMARKET Support if the transaction remains unresolved for an unusually long period.</p>
        </div>
      </div>

      <div className="card">
        <h3>Should I pay again?</h3>
        <div>
          <p>No, not immediately.</p>
          <p>If the first payment is still processing, making another payment could potentially result in duplicate charges.</p>
          <p>Wait for the original transaction to be resolved or follow instructions from XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order is still awaiting payment?</h3>
        <div>
          <p>If the order shows that payment is still pending, wait for the payment status to update.</p>
          <p>Do not assume that the order has failed simply because confirmation is delayed.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my payment shows completed but XMARKET still says processing?</h3>
        <div>
          <p>Save your payment confirmation and transaction reference.</p>
          <p>If the XMARKET order does not update after a reasonable processing period, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the payment eventually fails?</h3>
        <div>
          <p>If the transaction changes from processing to failed:</p>
          <p>1. Confirm whether the funds were returned or reversed.</p>
          <p>2. Check your order status.</p>
          <p>3. Use another payment method if necessary.</p>
          <p>4. Place a new order only after confirming that the original payment has been resolved.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the payment is processing but the order is cancelled?</h3>
        <div>
          <p>Check the order and payment status.</p>
          <p>If money was deducted, the payment may require a reversal or refund depending on the circumstances and payment method.</p>
          <p>Contact Support if the status remains unclear.</p>
        </div>
      </div>

      <div className="card">
        <h3>How long will processing take?</h3>
        <div>
          <p>Processing time depends on:</p>
          <p>• Payment method</p>
          <p>• Bank or payment provider</p>
          <p>• Transaction conditions</p>
          <p>• Security checks</p>
          <p>• Technical circumstances</p>
          <p>The exact processing time may vary.</p>
        </div>
      </div>

      <div className="card">
        <h3>When should I contact Support?</h3>
        <div>
          <p>Contact XMARKET Support if:</p>
          <p>• The payment remains processing for an unusually long time.</p>
          <p>• Your account was charged but the order is not confirmed.</p>
          <p>• The order was cancelled but the payment remains unresolved.</p>
          <p>• You were charged more than once.</p>
          <p>• The payment status appears incorrect.</p>
          <p>Provide the order and transaction information requested by Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Do not repeatedly retry a processing payment.</p>
          <p>• Check both your order and payment-provider status.</p>
          <p>• Keep your transaction reference.</p>
          <p>• Monitor your account until the payment is resolved.</p>
          <p>• Never share your password, verification code, card PIN, or Wallet PIN.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• My payment was deducted but my order was not confirmed. What should I do?</p>
          <p>• Why did my payment fail?</p>
          <p>• Why was my payment declined?</p>
          <p>• What should I do if I was charged twice?</p>
          <p>• Where can I view my payment history?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your payment remains processing beyond the expected processing period, contact XMARKET Support with your order number and payment transaction details.</p>
        </div>
      </div>
    </div>
  );
}
