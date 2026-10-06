import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ARTICLES = {
  'what-is-xmarket': lazy(() => import('./articles/WhatIsXmarket')),
  'create-account': lazy(() => import('./articles/CreateAccount')),
  'search-products': lazy(() => import('./articles/SearchProducts')),
  'search-shop': lazy(() => import('./articles/SearchShop')),
  'view-product-details': lazy(() => import('./articles/ViewProductDetails')),
  'add-to-cart': lazy(() => import('./articles/AddToCart')),
  'place-order': lazy(() => import('./articles/PlaceOrder')),
  'buy-multiple': lazy(() => import('./articles/BuyMultiple')),
  'save-for-later': lazy(() => import('./articles/SaveForLater')),
  'favorite-shop': lazy(() => import('./articles/FavoriteShop')),
  'share-product': lazy(() => import('./articles/ShareProduct')),
  'contact-seller': lazy(() => import('./articles/ContactSeller')),
  'leave-review': lazy(() => import('./articles/LeaveReview')),
  'edit-review': lazy(() => import('./articles/EditReview')),
  'trusted-sellers': lazy(() => import('./articles/TrustedSellers')),
  'verified-seller': lazy(() => import('./articles/VerifiedSeller')),
  'change-password': lazy(() => import('./articles/ChangePassword')),
  'change-email': lazy(() => import('./articles/ChangeEmail')),
  'change-phone': lazy(() => import('./articles/ChangePhone')),
  'change-username': lazy(() => import('./articles/ChangeUsername')),
  'update-profile': lazy(() => import('./articles/UpdateProfile')),
  'delete-account': lazy(() => import('./articles/DeleteAccount')),
  'recover-account': lazy(() => import('./articles/RecoverAccount')),
  'secure-account': lazy(() => import('./articles/SecureAccount')),
  'account-accessed': lazy(() => import('./articles/AccountAccessed')),
  'unknown-code': lazy(() => import('./articles/UnknownCode')),
  'verify-identity': lazy(() => import('./articles/VerifyIdentity')),
  'orders-place': lazy(() => import('./articles/OrdersPlace')),
  'view-orders': lazy(() => import('./articles/ViewOrders')),
  'check-order-status': lazy(() => import('./articles/CheckOrderStatus')),
  'track-order': lazy(() => import('./articles/TrackOrder')),
  'cancel-order': lazy(() => import('./articles/CancelOrder')),
  'auto-cancelled': lazy(() => import('./articles/AutoCancelled')),
  'after-order': lazy(() => import('./articles/AfterOrder')),
  'change-order': lazy(() => import('./articles/ChangeOrder')),
  'change-address': lazy(() => import('./articles/ChangeAddress')),
  'wrong-product-order': lazy(() => import('./articles/WrongProductOrder')),
  'order-delayed': lazy(() => import('./articles/OrderDelayed')),
  'order-not-arrived': lazy(() => import('./articles/OrderNotArrived')),
  'marked-delivered': lazy(() => import('./articles/MarkedDelivered')),
  'received-wrong': lazy(() => import('./articles/ReceivedWrong')),
  'missing-item': lazy(() => import('./articles/MissingItem')),
  'delivery-options': lazy(() => import('./articles/DeliveryOptions')),
  'delivery-fee': lazy(() => import('./articles/DeliveryFee')),
  'delivery-time': lazy(() => import('./articles/DeliveryTime')),
  'eta': lazy(() => import('./articles/Eta')),
  'track-parcel': lazy(() => import('./articles/TrackParcel')),
  'tracking-status': lazy(() => import('./articles/TrackingStatus')),
  'tracking-not-updated': lazy(() => import('./articles/TrackingNotUpdated')),
  'courier-cannot-deliver': lazy(() => import('./articles/CourierCannotDeliver')),
  'someone-else-receive': lazy(() => import('./articles/SomeoneElseReceive')),
  'parcel-damaged': lazy(() => import('./articles/ParcelDamaged')),
  'parcel-lost': lazy(() => import('./articles/ParcelLost')),
  'parcel-returned': lazy(() => import('./articles/ParcelReturned')),
  'payment-methods': lazy(() => import('./articles/PaymentMethods')),
  'pay-order': lazy(() => import('./articles/PayOrder')),
  'payment-failed': lazy(() => import('./articles/PaymentFailed')),
  'payment-declined': lazy(() => import('./articles/PaymentDeclined')),
  'deducted-no-order': lazy(() => import('./articles/DeductedNoOrder')),
  'change-payment': lazy(() => import('./articles/ChangePayment')),
  'payment-history': lazy(() => import('./articles/PaymentHistory')),
  'payment-secure': lazy(() => import('./articles/PaymentSecure')),
  'charged-twice': lazy(() => import('./articles/ChargedTwice')),
  'payment-processing': lazy(() => import('./articles/PaymentProcessing')),
  'multiple-payments': lazy(() => import('./articles/MultiplePayments')),
  'wallet-what': lazy(() => import('./articles/WalletWhat')),
  'wallet-activate': lazy(() => import('./articles/WalletActivate')),
  'wallet-add-money': lazy(() => import('./articles/WalletAddMoney')),
  'wallet-use': lazy(() => import('./articles/WalletUse')),
  'wallet-balance': lazy(() => import('./articles/WalletBalance')),
  'wallet-transactions': lazy(() => import('./articles/WalletTransactions')),
  'wallet-pending': lazy(() => import('./articles/WalletPending')),
  'wallet-incorrect': lazy(() => import('./articles/WalletIncorrect')),
  'wallet-withdraw': lazy(() => import('./articles/WalletWithdraw')),
  'wallet-no-access': lazy(() => import('./articles/WalletNoAccess')),
  'wallet-pin': lazy(() => import('./articles/WalletPin')),
  'wallet-reset-pin': lazy(() => import('./articles/WalletResetPin')),
  'voucher-what': lazy(() => import('./articles/VoucherWhat')),
  'voucher-claim': lazy(() => import('./articles/VoucherClaim')),
  'voucher-use': lazy(() => import('./articles/VoucherUse')),
  'voucher-cant-use': lazy(() => import('./articles/VoucherCantUse')),
  'voucher-expired': lazy(() => import('./articles/VoucherExpired')),
  'voucher-uses': lazy(() => import('./articles/VoucherUses')),
  'voucher-combine': lazy(() => import('./articles/VoucherCombine')),
  'voucher-transfer': lazy(() => import('./articles/VoucherTransfer')),
  'promos-find': lazy(() => import('./articles/PromosFind')),
  'flash-deals': lazy(() => import('./articles/FlashDeals')),
  'limited-time-deals': lazy(() => import('./articles/LimitedTimeDeals')),
  'exclusive-deals': lazy(() => import('./articles/ExclusiveDeals')),
  'promo-unavailable': lazy(() => import('./articles/PromoUnavailable')),
  'return-policy': lazy(() => import('./articles/ReturnPolicy')),
  'returnable-products': lazy(() => import('./articles/ReturnableProducts')),
  'non-returnable': lazy(() => import('./articles/NonReturnable')),
  'request-return': lazy(() => import('./articles/RequestReturn')),
  'request-refund': lazy(() => import('./articles/RequestRefund')),
  'return-reasons': lazy(() => import('./articles/ReturnReasons')),
  'return-evidence': lazy(() => import('./articles/ReturnEvidence')),
  'defective-product': lazy(() => import('./articles/DefectiveProduct')),
  'received-wrong-return': lazy(() => import('./articles/ReceivedWrongReturn')),
  'missing-item-return': lazy(() => import('./articles/MissingItemReturn')),
  'damaged-parcel': lazy(() => import('./articles/DamagedParcel')),
  'never-arrived': lazy(() => import('./articles/NeverArrived')),
  'check-refund-status': lazy(() => import('./articles/CheckRefundStatus')),
  'cancel-refund-request': lazy(() => import('./articles/CancelRefundRequest')),
  'refund-duration': lazy(() => import('./articles/RefundDuration')),
  'refund-destination': lazy(() => import('./articles/RefundDestination')),
  'refund-not-received': lazy(() => import('./articles/RefundNotReceived')),
  'seller-become': lazy(() => import('./articles/SellerBecome')),
  'seller-create': lazy(() => import('./articles/SellerCreate')),
  'seller-verify': lazy(() => import('./articles/SellerVerify')),
  'seller-add-product': lazy(() => import('./articles/SellerAddProduct')),
  'seller-edit-product': lazy(() => import('./articles/SellerEditProduct')),
  'seller-photos': lazy(() => import('./articles/SellerPhotos')),
  'seller-price': lazy(() => import('./articles/SellerPrice')),
  'seller-inventory': lazy(() => import('./articles/SellerInventory')),
  'seller-process-order': lazy(() => import('./articles/SellerProcessOrder')),
  'seller-ship': lazy(() => import('./articles/SellerShip')),
  'seller-communicate': lazy(() => import('./articles/SellerCommunicate')),
  'seller-voucher': lazy(() => import('./articles/SellerVoucher')),
  'seller-promotion': lazy(() => import('./articles/SellerPromotion')),
  'seller-view-sales': lazy(() => import('./articles/SellerViewSales')),
  'seller-earnings': lazy(() => import('./articles/SellerEarnings')),
  'seller-fees': lazy(() => import('./articles/SellerFees')),
  'seller-prohibited': lazy(() => import('./articles/SellerProhibited')),
  'seller-listing-removed': lazy(() => import('./articles/SellerListingRemoved')),
  'seller-restricted': lazy(() => import('./articles/SellerRestricted')),
  'seller-appeal': lazy(() => import('./articles/SellerAppeal')),
  'chat-seller': lazy(() => import('./articles/ChatSeller')),
  'chat-photos': lazy(() => import('./articles/ChatPhotos')),
  'chat-videos': lazy(() => import('./articles/ChatVideos')),
  'seller-unresponsive': lazy(() => import('./articles/SellerUnresponsive')),
  'buyer-unresponsive': lazy(() => import('./articles/BuyerUnresponsive')),
  'report-messages': lazy(() => import('./articles/ReportMessages')),
  'block-user': lazy(() => import('./articles/BlockUser')),
  'cant-send-message': lazy(() => import('./articles/CantSendMessage')),
  'tech-not-loading': lazy(() => import('./articles/TechNotLoading')),
  'tech-blank-page': lazy(() => import('./articles/TechBlankPage')),
  'tech-crashing': lazy(() => import('./articles/TechCrashing')),
  'tech-cant-login': lazy(() => import('./articles/TechCantLogin')),
  'tech-cant-order': lazy(() => import('./articles/TechCantOrder')),
  'tech-cart': lazy(() => import('./articles/TechCart')),
  'tech-upload-image': lazy(() => import('./articles/TechUploadImage')),
  'tech-payment-page': lazy(() => import('./articles/TechPaymentPage')),
  'tech-report': lazy(() => import('./articles/TechReport')),
  'tech-info': lazy(() => import('./articles/TechInfo')),
  'general-what': lazy(() => import('./articles/GeneralWhat')),
  'general-area': lazy(() => import('./articles/GeneralArea')),
  'general-mobile': lazy(() => import('./articles/GeneralMobile')),
  'general-contact': lazy(() => import('./articles/GeneralContact')),
  'general-report-seller': lazy(() => import('./articles/GeneralReportSeller')),
  'general-report-product': lazy(() => import('./articles/GeneralReportProduct')),
  'general-report-suspicious': lazy(() => import('./articles/GeneralReportSuspicious')),
  'general-protect-buyers': lazy(() => import('./articles/GeneralProtectBuyers')),
  'general-protect-sellers': lazy(() => import('./articles/GeneralProtectSellers')),
  'general-feedback': lazy(() => import('./articles/GeneralFeedback')),
  'policy-community': lazy(() => import('./articles/PolicyCommunity')),
  'policy-prohibited': lazy(() => import('./articles/PolicyProhibited')),
  'policy-seller': lazy(() => import('./articles/PolicySeller')),
  'policy-buyer': lazy(() => import('./articles/PolicyBuyer')),
  'policy-shipping': lazy(() => import('./articles/PolicyShipping')),
  'policy-ip': lazy(() => import('./articles/PolicyIp')),
  'policy-security': lazy(() => import('./articles/PolicySecurity')),
};

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 20, color: 'var(--text)', textAlign: 'center' }}>
      <h2 style={{ marginBottom: 8 }}>Article not available yet</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16 }}>
        This help article hasn't been written yet.
      </p>
      <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '10px 20px' }}>
        Go Back
      </button>
    </div>
  );
}

export default function HelpArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const Component = ARTICLES[slug];

  return (
    <div style={{ padding: 16, paddingBottom: 60, color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 12 }}>
        <ArrowLeft size={20} />
      </button>

      {Component ? (
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12 }}>
            <span className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
            <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Loading article...</div>
          </div>
        }>
          <Component />
        </Suspense>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
