import React from 'react';

export default function TrackingNotUpdated() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why has my tracking information not updated?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Tracking information does not always update immediately after a parcel moves or reaches another location.</p>
          <p>A delay between physical movement and the next tracking scan can occur because of courier processing, transportation, system synchronization, weekends, holidays, or other logistical circumstances.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why is my tracking information not updating?</h3>
        <div>
          <p>Possible reasons include:</p>
          <p>• The parcel has not received its next scan.</p>
          <p>• The courier is processing the shipment.</p>
          <p>• The parcel is between facilities.</p>
          <p>• Tracking information is being synchronized.</p>
          <p>• The courier is experiencing high shipment volume.</p>
          <p>• Transportation has been delayed.</p>
          <p>• The parcel was recently handed to the courier.</p>
          <p>• There is a temporary technical issue.</p>
          <p>• Other unexpected logistics conditions.</p>
        </div>
      </div>

      <div className="card">
        <h3>How long should I wait for an update?</h3>
        <div>
          <p>There is no single update period that applies to every shipment.</p>
          <p>The timing depends on:</p>
          <p>• Courier</p>
          <p>• Shipping method</p>
          <p>• Delivery location</p>
          <p>• Current tracking status</p>
          <p>• Distance between facilities</p>
          <p>• Shipment volume</p>
          <p>Check the estimated delivery date and the latest tracking event rather than relying only on the time since the last scan.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do if tracking has not updated?</h3>
        <div>
          <p>1. Open XMARKET.</p>
          <p>2. Go to My Account.</p>
          <p>3. Open Orders.</p>
          <p>4. Select the affected order.</p>
          <p>5. Review the latest tracking event.</p>
          <p>6. Check the estimated delivery date.</p>
          <p>7. Refresh the tracking information.</p>
          <p>8. Contact Support if the shipment remains inactive for an unusually long period.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my parcel was recently shipped?</h3>
        <div>
          <p>If the seller has only recently handed the parcel to the courier, tracking may take some time to become active.</p>
          <p>Wait for the courier's first scan or tracking update before assuming there is a problem.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my parcel is already in transit?</h3>
        <div>
          <p>A parcel may remain under an In Transit status while traveling between facilities.</p>
          <p>It may not receive a new scan at every point along its route.</p>
          <p>If the shipment remains inactive beyond a reasonable period or passes its estimated delivery date, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the estimated delivery date has passed?</h3>
        <div>
          <p>If the estimated delivery date has passed:</p>
          <p>1. Review the latest tracking status.</p>
          <p>2. Check for a revised estimated date.</p>
          <p>3. Look for a delivery attempt.</p>
          <p>4. Confirm your delivery address.</p>
          <p>5. Contact XMARKET Support if the order remains unresolved.</p>
        </div>
      </div>

      <div className="card">
        <h3>Could the package be lost?</h3>
        <div>
          <p>A lack of tracking updates does not automatically mean the package is lost.</p>
          <p>However, if tracking remains inactive for an unusually long period, the package is significantly overdue, or the courier indicates a problem, contact XMARKET Support for further assistance.</p>
        </div>
      </div>

      <div className="card">
        <h3>Should I contact the seller?</h3>
        <div>
          <p>You may contact the seller if the order has not yet been shipped or if you need information about seller-side processing.</p>
          <p>Once the parcel has been handed to the courier, the courier or XMARKET Support may be better positioned to investigate shipment movement.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the tracking information is incorrect?</h3>
        <div>
          <p>If the tracking information appears inconsistent with your order:</p>
          <p>• Check the order number.</p>
          <p>• Verify the tracking number.</p>
          <p>• Confirm the courier.</p>
          <p>• Take a screenshot of the tracking information.</p>
          <p>• Contact XMARKET Support.</p>
          <p>Do not attempt to modify tracking information yourself.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Tracking updates may be delayed.</p>
          <p>• A missing scan does not automatically mean that a parcel is lost.</p>
          <p>• Use the tracking information provided through your official XMARKET order.</p>
          <p>• Check the estimated delivery date.</p>
          <p>• Contact Support if the shipment becomes significantly overdue.</p>
          <p>• Never provide passwords, verification codes, or Wallet PINs to someone claiming to fix your tracking information.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• What does my tracking status mean?</p>
          <p>• How can I track my parcel?</p>
          <p>• What happens if the courier cannot deliver my order?</p>
          <p>• What should I do if my order is delayed?</p>
          <p>• What should I do if my order has not arrived?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your tracking information has not updated for an unusually long period, contact XMARKET Support with your order number and tracking number.</p>
        </div>
      </div>
    </div>
  );
}
