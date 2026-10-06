import React from 'react';

export default function TechCart() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Why is my cart not updating?</h2>

      <div className="card">
        <h3>Overview</h3>
        <div>
          <p>Your XMARKET cart may not update because of a connection problem, inventory changes, cached data, account synchronization issues, or a temporary technical problem.</p>
        </div>
      </div>

      <div className="card">
        <h3>What should I do?</h3>
        <div>
          <p>1. Refresh your cart.</p>
          <p>2. Check your internet connection.</p>
          <p>3. Close and reopen XMARKET.</p>
          <p>4. Sign out and sign back in if necessary.</p>
          <p>5. Check whether the product is still available.</p>
          <p>6. Try changing the quantity again.</p>
          <p>7. Remove and re-add the affected product.</p>
          <p>8. Update the XMARKET app or browser.</p>
          <p>9. Try another supported device or browser.</p>
          <p>10. Contact Support if the problem continues.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why did an item disappear from my cart?</h3>
        <div>
          <p>A product may disappear because:</p>
          <p>• It sold out.</p>
          <p>• The seller removed the listing.</p>
          <p>• The listing became unavailable.</p>
          <p>• The selected variation is no longer available.</p>
          <p>• The product was removed from the marketplace.</p>
          <p>• Your cart was synchronized with updated inventory.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why can't I change the quantity?</h3>
        <div>
          <p>The requested quantity may exceed available inventory or a purchase limit.</p>
          <p>Check the available quantity and any applicable purchase restrictions.</p>
        </div>
      </div>

      <div className="card">
        <h3>Why did the price change?</h3>
        <div>
          <p>Cart prices may change if:</p>
          <p>• A promotion ended.</p>
          <p>• A seller changed the price.</p>
          <p>• A voucher expired.</p>
          <p>• Product eligibility changed.</p>
          <p>• Inventory or promotional conditions changed.</p>
          <p>Review the final checkout price before placing your order.</p>
        </div>
      </div>

      <div className="card">
        <h3>Important reminders</h3>
        <div>
          <p>• Adding a product to your cart does not necessarily reserve inventory or promotional pricing.</p>
          <p>• Always check the final checkout total.</p>
          <p>• Do not assume that an item in your cart is still available.</p>
        </div>
      </div>

      <div className="card">
        <h3>Related Questions</h3>
        <div>
          <p>• How do I add an item to my cart?</p>
          <p>• How do I buy multiple products?</p>
          <p>• Why is a promotion unavailable for my order?</p>
          <p>• Why am I unable to place an order?</p>
        </div>
      </div>

      <div className="card">
        <h3>Need More Help?</h3>
        <div>
          <p>If your cart remains incorrect after troubleshooting, contact XMARKET Support with screenshots and the affected product information.</p>
        </div>
      </div>
    </div>
  );
}
