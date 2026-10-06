import React from 'react';

export default function TrackingStatus() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>What does my tracking status mean?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Your parcel's tracking status shows the latest known stage of the delivery process. Tracking information may be updated as the parcel moves from the seller to the courier and eventually to the delivery address.</p>
          <p>Tracking terminology may vary depending on the courier and shipping service.</p>
        </div>
      </div>

      <div className="card">
        <h3>Common tracking statuses</h3>
        <div>
          <p><strong>Order Placed</strong></p>
          <p>Your order has been successfully placed and is waiting for further processing.</p>
          <p><strong>Payment Confirmed</strong></p>
          <p>Payment has been successfully confirmed, where applicable, and the order can proceed to fulfillment.</p>
          <p><strong>Preparing to Ship</strong></p>
          <p>The seller is preparing and packaging your order for shipment.</p>
          <p><strong>Ready for Pickup</strong></p>
          <p>The parcel is prepared and waiting for the courier to collect it.</p>
          <p><strong>Picked Up</strong></p>
          <p>The courier has received the parcel from the seller.</p>
          <p><strong>In Transit</strong></p>
          <p>The parcel is moving between facilities or locations.</p>
          <p><strong>Arrived at Facility</strong></p>
          <p>The parcel has reached a courier sorting or processing facility.</p>
          <p><strong>Departed Facility</strong></p>
          <p>The parcel has left a courier facility and is continuing toward its destination.</p>
          <p><strong>Out for Delivery</strong></p>
          <p>The parcel is with the delivery courier and is expected to be delivered soon.</p>
          <p><strong>Delivery Attempted</strong></p>
          <p>The courier attempted delivery but was unable to complete it.</p>
          <p><strong>Delivered</strong></p>
          <p>The courier has reported that the parcel was delivered.</p>
          <p><strong>Delivery Delayed</strong></p>
          <p>The shipment has encountered a delay that may affect the expected delivery time.</p>
          <p><strong>Returned</strong></p>
          <p>The parcel is being returned to the seller or another designated location.</p>
          <p><strong>Cancelled</strong></p>
          <p>The shipment or order has been cancelled and will not continue through the normal delivery process.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why does my tracking status look different?</h3>
        <div>
          <p>Different couriers may use different terminology for similar delivery events.</p>
          <p>For example:</p>
          <p>• In Transit may appear as On the Way.</p>
          <p>• Out for Delivery may appear as With Courier.</p>
          <p>• Delivered may appear as Successfully Delivered.</p>
          <p>Check the tracking details and shipment history for the most accurate information.</p>
        </div>
      </div>

      <div className="card">
        <h3>What does "In Transit" mean?</h3>
        <div>
          <p>"In Transit" generally means that the parcel is moving through the courier network.</p>
          <p>The parcel may be:</p>
          <p>• Traveling between facilities</p>
          <p>• Waiting for transportation</p>
          <p>• Being processed at a sorting facility</p>
          <p>• Moving toward the destination area</p>
          <p>An "In Transit" status does not necessarily mean the parcel is currently inside a vehicle.</p>
        </div>
      </div>

      <div className="card">
        <h3>What does "Out for Delivery" mean?</h3>
        <div>
          <p>"Out for Delivery" generally means the parcel has been assigned for delivery and is expected to reach the delivery address.</p>
          <p>Make sure someone is available to receive the parcel if required.</p>
        </div>
      </div>

      <div className="card">
        <h3>What does "Delivery Attempted" mean?</h3>
        <div>
          <p>This means the courier attempted to deliver the parcel but could not complete the delivery.</p>
          <p>Possible reasons may include:</p>
          <p>• Recipient unavailable</p>
          <p>• Incorrect address</p>
          <p>• Unable to access the delivery location</p>
          <p>• Courier unable to contact the recipient</p>
          <p>• Other delivery circumstances</p>
          <p>Check the tracking information for additional instructions.</p>
        </div>
      </div>

      <div className="card">
        <h3>What does "Delivered" mean?</h3>
        <div>
          <p>"Delivered" means the courier has reported that the parcel was successfully delivered.</p>
          <p>If you cannot find the parcel, check with household members, authorized recipients, building reception, or security personnel where applicable.</p>
          <p>If it still cannot be located, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What does "Returned" mean?</h3>
        <div>
          <p>"Returned" means the parcel is being sent back to the seller or another designated location.</p>
          <p>This may happen because of:</p>
          <p>• Failed delivery attempts</p>
          <p>• Incorrect or incomplete address</p>
          <p>• Recipient unavailable</p>
          <p>• Shipping restrictions</p>
          <p>• Refused delivery</p>
          <p>• Other courier or order issues</p>
          <p>Check your order details for the reason when available.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my status has not changed?</h3>
        <div>
          <p>A tracking status may remain unchanged while the parcel is being transported or processed.</p>
          <p>If the status remains unchanged for an unusually long period, review:</p>
          <p>• Latest tracking event</p>
          <p>• Estimated delivery date</p>
          <p>• Courier information</p>
          <p>• Order status</p>
          <p>Contact XMARKET Support if the shipment appears significantly delayed.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Tracking terminology may vary between couriers.</p>
          <p>• Tracking information may not update immediately.</p>
          <p>• An estimated delivery date may change.</p>
          <p>• Do not assume a parcel is lost solely because tracking has not changed for a short period.</p>
          <p>• Never provide your password, verification code, or Wallet PIN to someone claiming to be a courier.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How can I track my parcel?</p>
          <p>• Why has my tracking information not updated?</p>
          <p>• What happens if the courier cannot deliver my order?</p>
          <p>• What should I do if my order is delayed?</p>
          <p>• What should I do if my order says delivered but I did not receive it?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you do not understand a tracking status or believe the information is incorrect, contact XMARKET Support with your order and tracking details.</p>
        </div>
      </div>
    </div>
  );
}
