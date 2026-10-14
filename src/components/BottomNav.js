import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, ClipboardList, Heart, User } from 'lucide-react';
import { useCart } from '../CartContext';

const TABS = [
  { to: '/',         icon: Home,          label: 'Home' },
  { to: '/cart',     icon: ShoppingCart,  label: 'Cart',   showBadge: true },
  { to: '/orders',   icon: ClipboardList, label: 'Orders' },
  { to: '/wishlist', icon: Heart,         label: 'Wishlist' },
  { to: '/account',  icon: User,          label: 'Account' },
];

export default function BottomNav() {
  const { items } = useCart();
  const location = useLocation();
  const navRef = useRef(null);
  const pillRef = useRef(null);

  const cartCount = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  const activeIndex = Math.max(0, TABS.findIndex(t => t.to === '/' ? location.pathname === '/' : location.pathname.startsWith(t.to)));

  // animate the sliding pill to the active tab
  useEffect(() => {
    if (!navRef.current || !pillRef.current) return;
    const tab = navRef.current.children[activeIndex];
    if (!tab) return;
    const navRect = navRef.current.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const left = tabRect.left - navRect.left + (tabRect.width - tabRect.width) / 2;
    pillRef.current.style.transform = `translateX(${left}px)`;
    pillRef.current.style.width = `${tabRect.width}px`;
  }, [activeIndex]);

  return (
    <nav className="bottom-nav" ref={navRef}>
      <div className="bottom-nav-pill" ref={pillRef} />
      {TABS.map(({ to, icon: Icon, label, showBadge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => 'bottom-nav-tab' + (isActive ? ' active' : '')}
        >
          <span className="bottom-nav-icon">
            <Icon size={20} />
            {showBadge && cartCount > 0 && (
              <span className="bottom-nav-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </span>
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
