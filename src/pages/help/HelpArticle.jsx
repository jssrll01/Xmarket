import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ARTICLES = {
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
};

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2 style={{ marginBottom: 8 }}>Article not available yet</h2>
      <p style={{ color: "#000000", fontSize: 13, marginBottom: 16 }}>
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
    <div className="help-article" style={{ padding: '16px 20px 60px' }}>
      <button onClick={() => navigate(-1)} className="icon-btn" style={{ marginBottom: 20 }}>
        <ArrowLeft size={20} />
      </button>

      {Component ? (
        <Suspense fallback={
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 60, gap: 12
          }}>
            <span className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
            <div style={{ color: "#000000", fontSize: 13 }}>Loading article...</div>
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
