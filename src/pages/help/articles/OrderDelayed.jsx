import React from 'react';

export default function OrderDelayed() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>What should I do if my order is delayed?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>An order may sometimes take longer than expected because of seller processing, courier delays, weather, high order volume, incorrect delivery information, transportation issues, or other circumstances.</p>
          <p>If your order is delayed, first check the order status and tracking information on XMARKET. The available next steps depend on the current status of your order.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I check if my order is delayed?</h3>
        <div>
          <p>1. Sign in to your XMARKET account.</p>
          <p>2. Open My Account.</p>
          <p>3. Select Orders or My Orders.</p>
          <p>4. Select the delayed order.</p>
          <p>5. Review the order status.</p>
          <p>6. Open the tracking information if available.</p>
          <p>7. Compare the current status with the estimated delivery date.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why might my order be delayed?</h3>
        <div>
          <p>Common reasons may include:</p>
          <p>• Seller processing delays</p>
          <p>• Courier processing delays</p>
          <p>• High order volume</p>
          <p>• Severe weather</p>
          <p>• Transportation disruptions</p>
          <p>• Incorrect or incomplete delivery information</p>
          <p>• Delivery attempts that were unsuccessful</p>
          <p>• Package processing at a sorting facility</p>
          <p>• Unexpected logistical problems</p>
          <p>• Public holidays or other service interruptions</p>
          <p>Not every delay means that your package is lost.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do if tracking has not updated?</h3>
        <div>
          <p>If tracking has not changed for some time:</p>
          <p>1. Refresh the order and tracking page.</p>
          <p>2. Check the latest tracking event.</p>
          <p>3. Wait for the next tracking update if the package is still within the expected delivery period.</p>
          <p>4. Contact XMARKET Support if the package remains inactive for an unusually long period.</p>
          <p>Tracking updates may sometimes take time to appear after a package moves between facilities.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the estimated delivery date has passed?</h3>
        <div>
          <p>If the estimated delivery date has passed:</p>
          <p>1. Check the latest tracking status.</p>
          <p>2. Check whether a new estimated delivery date is provided.</p>
          <p>3. Review any delivery attempt information.</p>
          <p>4. Contact the courier through official contact information if appropriate.</p>
          <p>5. Contact XMARKET Support if the order remains unresolved.</p>
        </div>
      </div>

      <div className="card">
        <h3>Should I contact the seller?</h3>
        <div>
          <p>You may contact the seller through XMARKET chat if available.</p>
          <p>The seller may be able to provide information about the order's preparation or shipment.</p>
          <p>However, once the package has been handed to the courier, delivery timing may be outside the seller's direct control.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the order is stuck in transit?</h3>
        <div>
          <p>A package may remain under an In Transit status while moving between facilities.</p>
          <p>If there has been no meaningful update for an extended period:</p>
          <p>• Check the tracking details.</p>
          <p>• Confirm that the delivery address is correct.</p>
          <p>• Check for failed delivery attempts.</p>
          <p>• Contact XMARKET Support if the package appears unusually inactive.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the courier attempted delivery?</h3>
        <div>
          <p>Check the tracking information for details about the delivery attempt.</p>
          <p>Possible reasons may include:</p>
          <p>• Recipient unavailable</p>
          <p>• Incorrect address</p>
          <p>• Unable to access the delivery location</p>
          <p>• Courier unable to contact the recipient</p>
          <p>• Other delivery issues</p>
          <p>Follow the available redelivery instructions when provided.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I cancel a delayed order?</h3>
        <div>
          <p>Cancellation may be available depending on the order status and applicable XMARKET policies.</p>
          <p>Check the order page for a Cancel Order option.</p>
          <p>If cancellation is unavailable, contact XMARKET Support for assistance.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the package appears lost?</h3>
        <div>
          <p>If tracking suggests that the package may be lost or has remained inactive beyond a reasonable period, contact XMARKET Support.</p>
          <p>Provide:</p>
          <p>• Order number</p>
          <p>• Tracking number, if available</p>
          <p>• Latest tracking status</p>
          <p>• Estimated delivery date</p>
          <p>• Description of the problem</p>
          <p>Support may provide the appropriate next steps under XMARKET's applicable policies.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• A delay does not automatically mean that an order is lost.</p>
          <p>• Always check the latest tracking information first.</p>
          <p>• Delivery estimates are not always guarantees.</p>
          <p>• Keep your delivery information accurate.</p>
          <p>• Do not provide your password, verification code, or Wallet PIN to anyone claiming to be a courier or support representative.</p>
          <p>• Use official XMARKET or courier contact channels.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I track my order?</p>
          <p>• What should I do if my order has not arrived?</p>
          <p>• What should I do if my order says delivered but I did not receive it?</p>
          <p>• What happens after I place an order?</p>
          <p>• Can I cancel my order?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your order remains delayed beyond the expected delivery period, contact XMARKET Support with your order number and tracking information.</p>
        </div>
      </div>
    </div>
  );
}
