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
import Vouchers from './pages/Vouchers';
import Mall from './pages/Mall';
import Advertising from './pages/Advertising';
import OffPlatformAds from './pages/OffPlatformAds';
import Coins from './pages/Coins';
import MegaVoucher from './pages/MegaVoucher';
import Settings from './pages/Settings';
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

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </CartProvider>
  );
}
