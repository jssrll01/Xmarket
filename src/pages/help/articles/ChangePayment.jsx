import React from 'react';

export default function ChangePayment() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Can I change my payment method after ordering?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Whether you can change your payment method after placing an order depends on the order status, payment status, and features supported by XMARKET.</p>
          <p>In many cases, payment methods cannot be changed after an order has been submitted because the payment process may already have started.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I check if I can change my payment method?</h3>
        <div>
          <p>1. Sign in to your XMARKET account.</p>
          <p>2. Open My Account.</p>
          <p>3. Select Orders.</p>
          <p>4. Open the order you want to change.</p>
          <p>5. Look for a Change Payment Method, Edit Payment, or similar option.</p>
          <p>6. If the option is available, follow the instructions.</p>
          <p>7. Review the new payment method.</p>
          <p>8. Confirm the change.</p>
          <p>9. Check the order again to make sure the payment method was updated.</p>
          <p>If no change option is available, the payment method may not be changeable for that order.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I change the payment method before paying?</h3>
        <div>
          <p>If the order has not been paid yet and XMARKET allows payment-method changes, you may be able to select another available payment method.</p>
          <p>Check the order's payment page for available options.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my payment failed?</h3>
        <div>
          <p>If the payment failed and the order is still awaiting payment, you may be able to select another supported payment method.</p>
          <p>Check the order and payment page before attempting another payment.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my payment is still processing?</h3>
        <div>
          <p>Do not immediately switch payment methods or submit another payment.</p>
          <p>First confirm whether the original transaction is still processing.</p>
          <p>Making another payment while the first transaction is unresolved may result in duplicate charges.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my payment was already completed?</h3>
        <div>
          <p>A completed payment generally cannot simply be switched to another payment method.</p>
          <p>If you need to correct a payment issue, follow XMARKET's applicable cancellation, refund, or payment-resolution process.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I cannot find a payment change option?</h3>
        <div>
          <p>This may mean that the order is no longer eligible for a payment-method change.</p>
          <p>Possible reasons include:</p>
          <p>• Payment already completed</p>
          <p>• Payment currently processing</p>
          <p>• Order already being processed</p>
          <p>• Order already shipped</p>
          <p>• Order cancelled</p>
          <p>• Payment method restrictions</p>
          <p>• Feature not supported for the order</p>
        </div>
      </div>

      <div className="card">
        <h3>Should I cancel my order and place a new one?</h3>
        <div>
          <p>Do not cancel an order solely to change the payment method unless necessary.</p>
          <p>First check whether XMARKET provides an official way to change or resolve the payment.</p>
          <p>If cancellation is necessary, make sure you understand the applicable cancellation and refund process.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Check your order status before changing payment information.</p>
          <p>• Do not make a second payment while the first transaction is unresolved.</p>
          <p>• Use only official XMARKET payment options.</p>
          <p>• Never provide your password, verification code, card PIN, or Wallet PIN.</p>
          <p>• Keep payment and transaction records until the order is completed.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What payment methods are available on XMARKET?</p>
          <p>• How do I pay for my order?</p>
          <p>• Why did my payment fail?</p>
          <p>• Why is my payment still processing?</p>
          <p>• My payment was deducted but my order was not confirmed. What should I do?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you need to change your payment method after ordering and no option is available, contact XMARKET Support with your order information.</p>
        </div>
      </div>
    </div>
  );
}
