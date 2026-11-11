import React from 'react';

export default function CheckOrderStatus() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>How do I check my order status?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>You can check your XMARKET order status from the Orders section of your account.</p>
          <p>Your order status helps you understand where your order currently is in the purchasing, processing, shipping, or delivery process.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I check my order status?</h3>
        <div>
          <p>Follow these steps:</p>
          <p><strong>Step 1: Sign in to XMARKET</strong></p>
          <p>Open XMARKET and sign in to the account used to place the order.</p>
          <p><strong>Step 2: Open your account</strong></p>
          <p>Go to your Account, Profile, or account menu.</p>
          <p><strong>Step 3: Open Orders</strong></p>
          <p>Select Orders, Orders, or the applicable order-management option.</p>
          <p><strong>Step 4: Find your order</strong></p>
          <p>Locate the order you want to check.</p>
          <p>You may use available categories, filters, or search options.</p>
          <p><strong>Step 5: Open the order</strong></p>
          <p>Select the order to view its details and current status.</p>
          <p><strong>Step 6: Review the latest status</strong></p>
          <p>Check the order-status information shown on the order page.</p>
        </div>
      </div>

      <div className="card">
        <h3>What do the different order statuses mean?</h3>
        <div>
          <p>The exact status names may vary depending on XMARKET's available features, but common statuses may include:</p>
          <p><strong>To Pay</strong></p>
          <p>The order has been created but payment has not yet been completed.</p>
          <p><strong>Payment Processing</strong></p>
          <p>Your payment is being processed or confirmed.</p>
          <p><strong>To Ship</strong></p>
          <p>The order has been placed and is waiting for the seller to prepare or ship it.</p>
          <p><strong>Preparing to Ship</strong></p>
          <p>The seller is preparing the products for shipment.</p>
          <p><strong>Shipped</strong></p>
          <p>The seller or courier has dispatched the package.</p>
          <p><strong>In Transit</strong></p>
          <p>The package is moving through the delivery network.</p>
          <p><strong>Out for Delivery</strong></p>
          <p>The package is with the courier and may be delivered soon.</p>
          <p><strong>Delivered</strong></p>
          <p>The delivery has been recorded as completed.</p>
          <p><strong>Completed</strong></p>
          <p>The order has reached its completed state according to the applicable XMARKET order process.</p>
          <p><strong>Cancelled</strong></p>
          <p>The order has been cancelled.</p>
          <p><strong>Refunded</strong></p>
          <p>A refund has been processed or recorded for the applicable order.</p>
          <p>Not every order will display every status.</p>
        </div>
      </div>

      <div className="card">
        <h3>How often does my order status update?</h3>
        <div>
          <p>Order status updates depend on events such as:</p>
          <p>• Payment confirmation</p>
          <p>• Seller order processing</p>
          <p>• Shipment handover</p>
          <p>• Courier scanning</p>
          <p>• Delivery attempts</p>
          <p>• Delivery completion</p>
          <p>• Cancellation</p>
          <p>• Refund processing</p>
          <p>Some updates may appear shortly after an event, while others may take additional time to appear.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why hasn't my order status changed?</h3>
        <div>
          <p>An order status may remain unchanged temporarily because:</p>
          <p>• The seller has not processed the order yet.</p>
          <p>• The package has not been handed to the courier.</p>
          <p>• The courier has not scanned the package.</p>
          <p>• The system has not received the latest update.</p>
          <p>• A weekend or holiday is affecting processing.</p>
          <p>• There is a technical or operational delay.</p>
          <p>If the status remains unchanged beyond the expected processing period, check the order details and contact XMARKET Support when necessary.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order says "Shipped" but there is no tracking update?</h3>
        <div>
          <p>A shipment may be marked as shipped before the courier's tracking system receives or displays its first scan.</p>
          <p>If tracking information is available, allow time for the first update to appear.</p>
          <p>If the tracking information remains unchanged for an extended period, contact XMARKET Support or use the applicable order-help option.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order says "Delivered" but I did not receive it?</h3>
        <div>
          <p>If your order shows Delivered but you have not received the package:</p>
          <p>1. Check the delivery address.</p>
          <p>2. Ask household members or authorized recipients whether they accepted it.</p>
          <p>3. Check the usual delivery location.</p>
          <p>4. Review available tracking information.</p>
          <p>5. Contact the courier if appropriate.</p>
          <p>6. Contact XMARKET Support if the package cannot be located.</p>
          <p>Report the issue as soon as possible.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order is taking too long?</h3>
        <div>
          <p>Check:</p>
          <p>• Current order status</p>
          <p>• Estimated delivery date</p>
          <p>• Tracking information</p>
          <p>• Seller processing information</p>
          <p>• Courier updates</p>
          <p>If the order has exceeded the applicable delivery timeframe, use the available order-help or Support options.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I change an order after checking its status?</h3>
        <div>
          <p>Order changes depend on the current order status.</p>
          <p>For example, an order that has not yet been processed may have different available options from an order that has already been shipped.</p>
          <p>Open the order details to see which actions are available.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order was automatically cancelled?</h3>
        <div>
          <p>An order may be cancelled automatically under certain circumstances, depending on applicable XMARKET policies and the circumstances of the order.</p>
          <p>Open the order details to check the cancellation information.</p>
          <p>If you believe the cancellation was incorrect, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the status is incorrect?</h3>
        <div>
          <p>If the displayed status does not match what happened:</p>
          <p>1. Open the order details.</p>
          <p>2. Review the latest available information.</p>
          <p>3. Refresh or reopen XMARKET.</p>
          <p>4. Check tracking information if available.</p>
          <p>5. Contact XMARKET Support if the status remains incorrect.</p>
          <p>Keep your order number available when contacting Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Order status may take time to update.</p>
          <p>• Different orders may move through different statuses.</p>
          <p>• Courier tracking updates may not appear immediately.</p>
          <p>• An order status is not always the same as a courier tracking status.</p>
          <p>• Always check the estimated delivery information when available.</p>
          <p>• Contact Support if your order remains unresolved beyond the applicable timeframe.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• Where can I view my orders?</p>
          <p>• How do I track my order?</p>
          <p>• What should I do if my order is delayed?</p>
          <p>• What should I do if my order has not arrived?</p>
          <p>• What should I do if my order says delivered but I did not receive it?</p>
          <p>• How do I cancel an order?</p>
          <p>• How do I request a return or refund?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your order status appears incorrect, has not updated for an extended period, or you need help understanding an order status, contact XMARKET Support through the available official support channels.</p>
        </div>
      </div>
    </div>
  );
}
