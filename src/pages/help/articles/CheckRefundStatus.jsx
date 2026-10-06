import React from 'react';

export default function CheckRefundStatus() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>How do I check my return/refund status?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>You can check the status of a return or refund request through your XMARKET account when the applicable tracking feature is available.</p>
          <p>The status can help you determine whether your request is still being reviewed, approved, awaiting a return, or being processed for a refund.</p>
        </div>
      </div>

      <div className="card">
        <h3>How to check your return/refund status</h3>
        <div>
          <p>1. Sign in to XMARKET.</p>
          <p>2. Open My Account.</p>
          <p>3. Select Orders or My Orders.</p>
          <p>4. Find the order associated with your return or refund.</p>
          <p>5. Open the order details.</p>
          <p>6. Select Return/Refund, Refund Details, or the applicable option.</p>
          <p>7. Review the current request status.</p>
          <p>8. Check for any additional instructions or required actions.</p>
        </div>
      </div>

      <div className="card">
        <h3>What do the statuses mean?</h3>
        <div>
          <p>Status names may vary depending on XMARKET's available features, but they may include:</p>
          <p><strong>Request Submitted</strong> — Your request has been successfully submitted and is awaiting review.</p>
          <p><strong>Under Review</strong> — XMARKET or the seller is reviewing your request and evidence.</p>
          <p><strong>Additional Information Required</strong> — More information or evidence may be needed.</p>
          <p><strong>Return Required</strong> — You need to return the product according to the provided instructions.</p>
          <p><strong>Return in Transit</strong> — The returned product is being transported.</p>
          <p><strong>Return Received</strong> — The returned product has been received for review.</p>
          <p><strong>Refund Processing</strong> — The refund is being processed.</p>
          <p><strong>Refund Completed</strong> — The refund has been processed.</p>
          <p><strong>Approved</strong> — Your request has been approved for the applicable resolution.</p>
          <p><strong>Rejected</strong> — Your request was not approved.</p>
          <p><strong>Cancelled</strong> — The return/refund request was cancelled.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the status has not changed?</h3>
        <div>
          <p>A status may remain unchanged while XMARKET, the seller, courier, or payment provider completes the required processing.</p>
          <p>Check whether the request has a stated processing period.</p>
          <p>If the request remains unchanged beyond the applicable period, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I need to provide more information?</h3>
        <div>
          <p>Follow the instructions shown on your return/refund request.</p>
          <p>Submit the requested information before the specified deadline when one is provided.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my refund says completed but I cannot see the money?</h3>
        <div>
          <p>Check the refund destination and your payment provider's transaction history.</p>
          <p>Refunds may take additional time to appear depending on the payment method and provider.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Check your return/refund status regularly.</p>
          <p>• Follow any additional instructions shown in your request.</p>
          <p>• Keep your return tracking information when applicable.</p>
          <p>• Do not submit duplicate requests for the same issue unless instructed.</p>
          <p>• Never share your password, Wallet PIN, or verification code to receive a refund.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I request a return?</p>
          <p>• How do I request a refund?</p>
          <p>• Can I cancel a return/refund request?</p>
          <p>• How long does a refund take?</p>
          <p>• Why have I not received my refund yet?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your status appears incorrect or has remained unchanged beyond the applicable processing period, contact XMARKET Support with your order and return/refund details.</p>
        </div>
      </div>
    </div>
  );
}
