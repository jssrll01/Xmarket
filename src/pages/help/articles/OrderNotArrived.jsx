import React from 'react';

export default function OrderNotArrived() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>What should I do if my order has not arrived?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>If your order has not arrived, first check its current order status, tracking information, and estimated delivery date.</p>
          <p>A package may still be in transit even if it has not arrived by the expected date. If the order appears unusually delayed or the tracking information indicates a problem, additional action may be required.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I check first?</h3>
        <div>
          <p>1. Sign in to XMARKET.</p>
          <p>2. Open My Account.</p>
          <p>3. Select Orders or My Orders.</p>
          <p>4. Open the affected order.</p>
          <p>5. Check the order status.</p>
          <p>6. Review the tracking information.</p>
          <p>7. Check the estimated delivery date.</p>
          <p>8. Confirm that the delivery address is correct.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the estimated delivery date has not passed?</h3>
        <div>
          <p>If the estimated delivery date has not passed, your package may still be within the expected delivery period.</p>
          <p>Continue monitoring the tracking information unless there is another indication that the shipment has encountered a problem.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the estimated delivery date has passed?</h3>
        <div>
          <p>If the expected delivery date has passed:</p>
          <p>1. Check the latest tracking update.</p>
          <p>2. Look for a new estimated delivery date.</p>
          <p>3. Check whether a delivery attempt was made.</p>
          <p>4. Confirm your delivery information.</p>
          <p>5. Contact XMARKET Support if the order remains unresolved.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if there is no tracking information?</h3>
        <div>
          <p>Some orders may not have detailed tracking depending on the available shipping method.</p>
          <p>If tracking information should be available but is missing:</p>
          <p>• Refresh the order page.</p>
          <p>• Check again later.</p>
          <p>• Contact the seller if appropriate.</p>
          <p>• Contact XMARKET Support if the information remains unavailable.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if tracking has stopped updating?</h3>
        <div>
          <p>A tracking status may remain unchanged while a package is being transported or processed.</p>
          <p>If there has been no update for an unusually long period:</p>
          <p>1. Record the latest tracking event.</p>
          <p>2. Check the estimated delivery date.</p>
          <p>3. Contact XMARKET Support.</p>
          <p>4. Provide the order and tracking information.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the courier says there was a failed delivery?</h3>
        <div>
          <p>Review the tracking information for the reason.</p>
          <p>You may need to:</p>
          <p>• Confirm your address.</p>
          <p>• Ensure someone is available to receive the package.</p>
          <p>• Follow the courier's redelivery instructions.</p>
          <p>• Contact the courier through its official channel if appropriate.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the package was returned to the seller?</h3>
        <div>
          <p>If tracking shows that the package has been returned:</p>
          <p>1. Review the return reason.</p>
          <p>2. Check your order status.</p>
          <p>3. Determine whether a refund or replacement process is available.</p>
          <p>4. Contact XMARKET Support if you need assistance.</p>
          <p>Do not place another order until you understand what happened to the original order.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I think the package is lost?</h3>
        <div>
          <p>If the package has not arrived and tracking suggests that it may be lost, contact XMARKET Support.</p>
          <p>Provide:</p>
          <p>• Order number</p>
          <p>• Tracking number</p>
          <p>• Latest tracking status</p>
          <p>• Expected delivery date</p>
          <p>• Relevant delivery information</p>
          <p>XMARKET may provide the appropriate resolution according to its applicable policies.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I cancel an order that has not arrived?</h3>
        <div>
          <p>Cancellation may depend on the order's current status.</p>
          <p>If a Cancel Order option is available, follow the cancellation process.</p>
          <p>If the order has already shipped, cancellation may no longer be available and another resolution may apply.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I no longer need the product?</h3>
        <div>
          <p>Do not simply ignore the delivery.</p>
          <p>Check whether cancellation is still available. If the order cannot be cancelled, follow the applicable return/refund process after delivery, if eligible.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Check tracking before assuming that an order is lost.</p>
          <p>• Confirm your delivery address.</p>
          <p>• Keep your order and tracking information available.</p>
          <p>• Do not pay additional fees through suspicious links or unofficial messages.</p>
          <p>• Never provide passwords, verification codes, or Wallet PINs to couriers or unknown individuals.</p>
          <p>• Follow XMARKET's applicable shipping, cancellation, return, and refund policies.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I track my order?</p>
          <p>• What should I do if my order is delayed?</p>
          <p>• What should I do if my order says delivered but I did not receive it?</p>
          <p>• What should I do if my package is lost?</p>
          <p>• Can I cancel my order?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your order has not arrived after the expected delivery period, contact XMARKET Support with your order number and tracking information.</p>
        </div>
      </div>
    </div>
  );
}
