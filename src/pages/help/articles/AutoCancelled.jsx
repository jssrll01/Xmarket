import React from 'react';

export default function AutoCancelled() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why was my order automatically cancelled?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>An XMARKET order may be automatically cancelled when certain conditions prevent the order from being completed.</p>
          <p>Automatic cancellation can happen for reasons related to payment, inventory, seller processing, delivery availability, security, or other applicable marketplace rules.</p>
          <p>The exact reason should be checked in your order details or cancellation notification when available.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why was my order automatically cancelled?</h3>
        <div>
          <p>Possible reasons include:</p>
          <p><strong>Payment was not completed</strong></p>
          <p>The payment may not have been successfully completed within the required timeframe.</p>
          <p><strong>Payment failed</strong></p>
          <p>The selected payment method may have been declined, rejected, or otherwise unsuccessful.</p>
          <p><strong>Seller did not process the order</strong></p>
          <p>A seller may fail to process or ship an order within the applicable processing period.</p>
          <p><strong>Product became unavailable</strong></p>
          <p>The product may have become unavailable after the order was placed.</p>
          <p><strong>Stock became unavailable</strong></p>
          <p>The seller may no longer have sufficient inventory to fulfill the order.</p>
          <p><strong>Delivery is unavailable</strong></p>
          <p>The delivery address may not be eligible for the selected shipping method.</p>
          <p><strong>Order information could not be verified</strong></p>
          <p>An order may require additional information or verification before it can proceed.</p>
          <p><strong>Security or policy issue</strong></p>
          <p>An order may be cancelled if activity associated with it triggers applicable security or marketplace rules.</p>
          <p><strong>System or technical issue</strong></p>
          <p>A temporary technical problem may prevent an order from being successfully processed.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I find out why my order was cancelled?</h3>
        <div>
          <p>Follow these steps:</p>
          <p>1. Sign in to XMARKET.</p>
          <p>2. Open Account → Orders.</p>
          <p>3. Find the cancelled order.</p>
          <p>4. Open the order details.</p>
          <p>5. Review the cancellation reason or notification.</p>
          <p>6. Check any related payment or refund information.</p>
          <p>If no reason is provided, contact XMARKET Support with your order number.</p>
        </div>
      </div>

      <div className="card">
        <h3>Will I receive a refund?</h3>
        <div>
          <p>If you already paid for an automatically cancelled order, an applicable refund may be processed according to XMARKET's refund policy and the payment method used.</p>
          <p>Refund timing may vary depending on the payment provider.</p>
          <p>If the order is cancelled but the expected refund does not appear within the applicable timeframe, contact XMARKET Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my payment was deducted before the order was cancelled?</h3>
        <div>
          <p>Do not immediately place another order.</p>
          <p>First:</p>
          <p>1. Check your Orders section.</p>
          <p>2. Confirm that the order was cancelled.</p>
          <p>3. Check your payment or Wallet transaction history.</p>
          <p>4. Check whether a refund or reversal has been initiated.</p>
          <p>5. Contact XMARKET Support if the payment remains unresolved.</p>
          <p>Keep your transaction information available when contacting Support.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the seller did not ship my order?</h3>
        <div>
          <p>An order may be automatically cancelled if the seller does not process or ship it within the applicable timeframe.</p>
          <p>If this happens:</p>
          <p>• Check the cancellation reason.</p>
          <p>• Check the refund status.</p>
          <p>• Review the order details.</p>
          <p>• Contact Support if you need additional assistance.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the product went out of stock?</h3>
        <div>
          <p>If the seller cannot fulfill the order because the product is no longer available, the order may be cancelled.</p>
          <p>If you have already paid, check the applicable refund information.</p>
          <p>You may choose to look for another available listing if you still want the product.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can I prevent automatic cancellation?</h3>
        <div>
          <p>You may not be able to prevent all automatic cancellations because some are triggered by circumstances outside your control.</p>
          <p>However, when placing an order, you can help avoid preventable issues by:</p>
          <p>• Using a valid payment method.</p>
          <p>• Completing payment within the required timeframe.</p>
          <p>• Providing a complete delivery address.</p>
          <p>• Completing required verification.</p>
          <p>• Reviewing your order before confirmation.</p>
          <p>• Monitoring your order status after placing the order.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I believe the cancellation was a mistake?</h3>
        <div>
          <p>If you believe your order was cancelled incorrectly:</p>
          <p>1. Open the cancelled order.</p>
          <p>2. Review the cancellation reason.</p>
          <p>3. Check your payment information.</p>
          <p>4. Take note of the order number.</p>
          <p>5. Contact XMARKET Support.</p>
          <p>6. Provide relevant information about the order.</p>
          <p>Support may be able to explain the cancellation or advise you on the next available option.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can an automatically cancelled order be restored?</h3>
        <div>
          <p>A cancelled order may not be restorable.</p>
          <p>If the product is still available, you may need to place a new order.</p>
          <p>Before placing another order, make sure you understand why the previous order was cancelled so the same issue does not happen again.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the same order keeps getting cancelled?</h3>
        <div>
          <p>If multiple attempts are automatically cancelled:</p>
          <p>1. Review the cancellation reason.</p>
          <p>2. Check your payment method.</p>
          <p>3. Confirm your delivery information.</p>
          <p>4. Check whether the product is still available.</p>
          <p>5. Complete any required verification.</p>
          <p>6. Contact XMARKET Support before repeatedly placing another order.</p>
          <p>Repeated attempts may not resolve the underlying problem.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Automatic cancellation does not necessarily mean that you did something wrong.</p>
          <p>• Always check the cancellation reason when available.</p>
          <p>• If you were charged, check the refund or payment status.</p>
          <p>• Do not repeatedly place the same order without understanding why it was cancelled.</p>
          <p>• Keep your order number and transaction information for Support.</p>
          <p>• Never provide your password, verification code, or Wallet PIN to resolve an order issue.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• Can I cancel my order?</p>
          <p>• What happens after I place an order?</p>
          <p>• How do I check my order status?</p>
          <p>• What should I do if my payment was deducted but my order is not confirmed?</p>
          <p>• When will I receive my refund?</p>
          <p>• How do I request a return or refund?</p>
          <p>• Why did my payment fail?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If you do not understand why your order was automatically cancelled or believe the cancellation was incorrect, contact XMARKET Support through the available official support channels.</p>
        </div>
      </div>
    </div>
  );
}
