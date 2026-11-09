import React from 'react';
import GlobalProductPreview from './GlobalProductPreview';

// Auto-refresh removed: pages load when opened and update after user actions.
export default function LiveRoutes({ children }) {
  return <>{children}<GlobalProductPreview /></>;
}
