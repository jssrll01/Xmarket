import React from 'react';

export default function MultiplePayments() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Can I pay using multiple payment methods?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Whether you can use multiple payment methods for a single XMARKET order depends on the payment features supported by XMARKET.</p>
          <p>If payment splitting is supported, the available options and applicable rules will be displayed during checkout.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I know if multiple payment methods are supported?</h3>
        <div>
          <p>1. Add your products to the cart.</p>
          <p>2. Proceed to checkout.</p>
          <p>3. Review the total amount.</p>
          <p>4. Open the Payment Method section.</p>
          <p>5. Check whether an option to combine or split payment is available.</p>
          <p>6. Follow the instructions shown by XMARKET.</p>
          <p>If only one payment method can be selected, the order cannot be split through the available checkout flow.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I combine XMARKET Wallet with another payment method?</h3>
        <div>
          <p>This depends on whether XMARKET supports Wallet-and-other-payment combinations.</p>
          <p>If supported, the checkout page should show the applicable option and amount breakdown.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I combine a voucher with multiple payment methods?</h3>
        <div>
          <p>A voucher is different from a payment method.</p>
          <p>You may be able to apply an eligible voucher while using a supported payment method, but voucher restrictions may apply.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I use two bank cards?</h3>
        <div>
          <p>This depends on whether XMARKET supports split payments between multiple cards.</p>
          <p>If no split-payment option is available, you will need to use one supported payment method for the transaction.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I pay part of the order first and the rest later?</h3>
        <div>
          <p>This depends on the payment features available for the order.</p>
          <p>Do not send a partial payment directly to a seller unless XMARKET's official checkout process specifically supports it.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my payment method does not cover the full amount?</h3>
        <div>
          <p>If XMARKET does not support split payments, choose another payment method that can cover the full order total.</p>
          <p>Do not manually transfer the remaining amount to the seller unless the official XMARKET payment process instructs you to do so.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I am trying to buy products from different sellers?</h3>
        <div>
          <p>Multiple products or sellers may have different payment, shipping, or checkout conditions.</p>
          <p>XMARKET may allow them to be paid together or may separate them into different transactions depending on the available checkout system.</p>
          <p>Review the payment information shown before confirming the order.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I accidentally make two payments?</h3>
        <div>
          <p>Do not make another payment.</p>
          <p>Check your order and payment history to determine whether both transactions were successful, pending, or failed.</p>
          <p>If you were charged twice, follow the applicable duplicate-charge process.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I change how I split the payment after ordering?</h3>
        <div>
          <p>If payment splitting is supported, changes may only be possible before the payment is completed.</p>
          <p>After payment has been processed, changing the payment allocation may not be possible.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Use only payment combinations shown through official XMARKET checkout.</p>
          <p>• Do not manually split payments through seller chat.</p>
          <p>• Do not send additional money to a seller to complete an order unless XMARKET explicitly supports that payment process.</p>
          <p>• Check the final amount before confirming payment.</p>
          <p>• Never share passwords, verification codes, card PINs, or Wallet PINs.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What payment methods are available on XMARKET?</p>
          <p>• How do I pay for my order?</p>
          <p>• Can I change my payment method after ordering?</p>
          <p>• What should I do if I was charged twice?</p>
          <p>• Are my payment details secure?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you need to combine payment methods but the option is not available during checkout, contact XMARKET Support to confirm whether the order is eligible for split payment.</p>
        </div>
      </div>
    </div>
  );
}
