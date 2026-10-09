import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { ToastProvider } from './components/Toast';
import SiteFooter from './components/SiteFooter';
import useScrollTop from './hooks/useScrollTop';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Notifications from './pages/Notifications';
import CustomerService from './pages/CustomerService';
import Help from './pages/Help';
import HelpArticle from './pages/help/HelpArticle';
import More from './pages/More';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Returns from './pages/Returns';
import Bundles from './pages/Bundles';
import FlashSale from './pages/FlashSale';
import Xmall from './pages/Xmall';
import Xwallet from './pages/Xwallet';
import Xcards from './pages/Xcards';
import MyReports from './pages/report/MyReports';
import BugReport from './pages/report/BugReport';
import OrderReport from './pages/report/OrderReport';
import ShopReport from './pages/report/ShopReport';
import ContentReport from './pages/report/ContentReport';
import SecurityReport from './pages/report/SecurityReport';
import Vouchers from './pages/Vouchers';
import Mall from './pages/Mall';
import Advertising from './pages/Advertising';
import OffPlatformAds from './pages/OffPlatformAds';
import Coins from './pages/Coins';
import MegaVoucher from './pages/MegaVoucher';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import SellerProfile from './pages/SellerProfile';
import Rewards from './pages/Rewards';
import Following from './pages/Following';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function Router() {
  useScrollTop();
  const location = useLocation();
  const hideFooter = location.pathname === '/checkout';

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/help" element={<Help />} />
        <Route path="/help/:slug" element={<HelpArticle />} />
        <Route path="/more" element={<More />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/store/:store" element={<SellerProfile />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/bundles" element={<Bundles />} />
        <Route path="/flash-sale" element={<FlashSale />} />
        <Route path="/xmall" element={<Xmall />} />
        <Route path="/xwallet" element={<Xwallet />} />
        <Route path="/xcards" element={<Xcards />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/report/bug" element={<BugReport />} />
        <Route path="/report/order" element={<OrderReport />} />
        <Route path="/report/shop" element={<ShopReport />} />
        <Route path="/report/content" element={<ContentReport />} />
        <Route path="/report/security" element={<SecurityReport />} />
        <Route path="/following" element={<Following />} />
        <Route path="/account" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/mall" element={<Mall />} />
        <Route path="/advertising" element={<Advertising />} />
        <Route path="/off-platform-ads" element={<OffPlatformAds />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/mega-voucher" element={<MegaVoucher />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <SiteFooter />}
    </>
  );
}

function NewDeviceAlert() {
  React.useEffect(() => {
    const handler = () => {
      const id = 'xmarket-new-device-toast';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.style.cssText = 'position:fixed;top:16px;left:16px;right:16px;z-index:9999;padding:14px 16px;background:#FEF3C7;color:#78350F;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,0.1)';
        el.textContent = 'New sign-in from this device. If this wasn\'t you, change your password.';
        document.body.appendChild(el);
        setTimeout(() => el && el.remove(), 7000);
      }
    };
    window.addEventListener('xmarket:new-device', handler);
    return () => window.removeEventListener('xmarket:new-device', handler);
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <NewDeviceAlert />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
