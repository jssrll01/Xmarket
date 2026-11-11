import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="err-glow" />
      <div className="err-code">404</div>
      <h1 className="err-title">Page not found</h1>
      <p className="err-msg">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="err-actions">
        <button className="btn-primary" onClick={() => navigate('/')}>
          <Home size={16} /> Go home
        </button>
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    </div>
  );
}
