import React from 'react';

export default function TechCantOrder() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why am I unable to place an order?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>An order may fail because of product availability, delivery restrictions, payment problems, account restrictions, checkout errors, or temporary technical issues.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I check?</h3>
        <div>
          <p>1. Confirm that the product is still available.</p>
          <p>2. Check the selected variation and quantity.</p>
          <p>3. Confirm your delivery address.</p>
          <p>4. Check whether delivery is available to your address.</p>
          <p>5. Review the delivery method.</p>
          <p>6. Check applicable vouchers and promotions.</p>
          <p>7. Confirm your payment method.</p>
          <p>8. Check that your payment information is correct.</p>
          <p>9. Review the final order total.</p>
          <p>10. Try checkout again if the problem is temporary.</p>
        </div>
      </div>

      <div className="card">
        <h3>Common reasons an order cannot be placed</h3>
        <div>
          <p>An order may fail because:</p>
          <p>• Product is out of stock.</p>
          <p>• Selected variation is unavailable.</p>
          <p>• Quantity exceeds available inventory.</p>
          <p>• Seller is unavailable.</p>
          <p>• Delivery is unavailable for the address.</p>
          <p>• Payment method failed.</p>
          <p>• Voucher requirements are not met.</p>
          <p>• Account requires additional verification.</p>
          <p>• Order contains an unsupported combination of products.</p>
          <p>• Temporary technical problem occurred.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I was charged but the order was not created?</h3>
        <div>
          <p>Do not immediately pay again.</p>
          <p>Check:</p>
          <p>• Orders</p>
          <p>• Payment history</p>
          <p>• Bank or e-wallet transaction</p>
          <p>• XMARKET Wallet transaction history</p>
          <p>If the payment was deducted but there is no confirmed order, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if checkout keeps failing?</h3>
        <div>
          <p>Try:</p>
          <p>• Refreshing XMARKET</p>
          <p>• Restarting the app</p>
          <p>• Checking your connection</p>
          <p>• Removing and re-adding the affected item</p>
          <p>• Using another supported payment method</p>
          <p>• Trying another supported device or browser</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Review your order before submitting it.</p>
          <p>• Do not repeatedly submit payment if checkout is failing.</p>
          <p>• Check whether an order was created before trying again.</p>
          <p>• Keep payment references for failed or interrupted transactions.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• Why did my payment fail?</p>
          <p>• My payment was deducted but my order was not confirmed. What should I do?</p>
          <p>• Why isn't my payment page loading?</p>
          <p>• Why is my cart not updating?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you cannot place an order after troubleshooting, contact XMARKET Support with the error details and order information.</p>
        </div>
      </div>
    </div>
  );
}
