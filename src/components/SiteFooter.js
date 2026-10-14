import React from 'react';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="brand">
        <span className="gradient-text">X</span>MARKET
      </div>
      <div className="tagline">More Products. Lower Prices.</div>
      <div className="copy">
        © {new Date().getFullYear()} XMARKET. All rights reserved.
      </div>
    </footer>
  );
}
