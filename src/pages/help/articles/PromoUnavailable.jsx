import React from 'react';

export default function PromoUnavailable() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why is a promotion unavailable for my order?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>A promotion may be unavailable when your order does not meet the promotion's requirements or when the promotional offer is no longer active.</p>
          <p>Promotions can have restrictions involving products, sellers, customers, payment methods, order amounts, locations, validity periods, and usage limits.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why is a promotion unavailable?</h3>
        <div>
          <p>Common reasons include:</p>
          <p>• Promotion has expired.</p>
          <p>• Promotion has not started yet.</p>
          <p>• Promotional quantity has sold out.</p>
          <p>• Usage limit has been reached.</p>
          <p>• Minimum order value was not met.</p>
          <p>• Product is not eligible.</p>
          <p>• Seller is not participating.</p>
          <p>• Category is excluded.</p>
          <p>• Account is not eligible.</p>
          <p>• Promotion is limited to selected customers.</p>
          <p>• Required payment method is not selected.</p>
          <p>• Promotion cannot be combined with another offer.</p>
          <p>• Order does not meet location or delivery requirements.</p>
          <p>• Technical issue occurred.</p>
        </div>
      </div>

      <div className="card">
        <h3>How do I check the promotion requirements?</h3>
        <div>
          <p>1. Open the promotion.</p>
          <p>2. Read the promotion details.</p>
          <p>3. Check the validity period.</p>
          <p>4. Check the eligible products.</p>
          <p>5. Check participating sellers.</p>
          <p>6. Check the minimum purchase requirement.</p>
          <p>7. Check payment-method requirements.</p>
          <p>8. Check usage limits.</p>
          <p>9. Review any customer eligibility requirements.</p>
          <p>10. Return to checkout and verify your order.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the promotion has expired?</h3>
        <div>
          <p>An expired promotion cannot normally be applied to a new order.</p>
          <p>Check XMARKET's current promotions for another available offer.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the promotion has not started?</h3>
        <div>
          <p>Some promotions are scheduled to begin at a specific date and time.</p>
          <p>Wait until the promotion becomes active before attempting to use it.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the promotion is sold out?</h3>
        <div>
          <p>Limited-quantity promotions may become unavailable once the promotional allocation has been reached.</p>
          <p>The promotion may remain visible while showing that its promotional quantity is no longer available.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if my order does not meet the minimum spend?</h3>
        <div>
          <p>Check which products and charges count toward the promotion's minimum spending requirement.</p>
          <p>Add eligible products if you want to meet the requirement, provided the promotion is still active.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the product is not eligible?</h3>
        <div>
          <p>Some promotions apply only to selected products.</p>
          <p>Check the promotion's eligible product list and make sure the items in your order qualify.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the seller is not participating?</h3>
        <div>
          <p>Seller-specific promotions only apply to participating sellers.</p>
          <p>If the seller is not included, the promotion may not be available for that product.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if I am not eligible?</h3>
        <div>
          <p>Some promotions may be limited to:</p>
          <p>• New customers</p>
          <p>• Selected accounts</p>
          <p>• Specific customer groups</p>
          <p>• Customers using a particular payment method</p>
          <p>• Customers meeting specific campaign requirements</p>
          <p>Eligibility requirements should be reviewed in the promotion details.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if another voucher is already applied?</h3>
        <div>
          <p>Some promotions cannot be combined with certain vouchers or discounts.</p>
          <p>Try reviewing the available promotion combinations and compare the final price before choosing an offer.</p>
        </div>
      </div>

      <div className="card">
        <h3>What if the promotion should apply but does not?</h3>
        <div>
          <p>If your order appears to meet all requirements:</p>
          <p>1. Take a screenshot of the promotion terms.</p>
          <p>2. Take a screenshot of the checkout page.</p>
          <p>3. Note the promotion name or code.</p>
          <p>4. Check the product and seller.</p>
          <p>5. Confirm the order total.</p>
          <p>6. Contact XMARKET Support.</p>
          <p>Do not complete payment if the promotional discount you expected is not reflected in the final checkout total.</p>
        </div>
      </div>

      <div className="card">
        <h3>Can a promotion become unavailable after I add a product to my cart?</h3>
        <div>
          <p>Yes, depending on how the promotion works.</p>
          <p>Promotional inventory, eligibility, or validity may change before the order is confirmed.</p>
          <p>Adding a product to your cart does not necessarily reserve a promotion.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Always read the promotion's terms.</p>
          <p>• Check the promotion's validity period.</p>
          <p>• Confirm product and seller eligibility.</p>
          <p>• Check minimum-spend and usage requirements.</p>
          <p>• Review the final checkout price before payment.</p>
          <p>• Do not rely on screenshots of old promotions if the current promotion terms have changed.</p>
          <p>• Use only official XMARKET promotional pages.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• Where can I find current XMARKET promotions?</p>
          <p>• What are Flash Deals?</p>
          <p>• What are Limited-Time Deals?</p>
          <p>• What are XMARKET exclusive deals?</p>
          <p>• Why can't I use my voucher?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If a promotion should be available for your order but remains unavailable, contact XMARKET Support with the promotion name, product information, order details, and relevant screenshots.</p>
        </div>
      </div>
    </div>
  );
}
