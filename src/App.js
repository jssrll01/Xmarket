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
import More from './pages/More';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

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
        <Route path="/more" element={<More />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
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
