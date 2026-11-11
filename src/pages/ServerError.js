import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home } from 'lucide-react';

export default function ServerError({ error }) {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="err-glow" />
      <div className="err-code">500</div>
      <h1 className="err-title">Something went wrong</h1>
      <p className="err-msg">
        We hit an unexpected problem. Try again — if it keeps happening, contact Support.
      </p>
      {error && (
        <pre className="err-detail">{String(error).slice(0, 200)}</pre>
      )}
      <div className="err-actions">
        <button className="btn-primary" onClick={() => window.location.reload()}>
          <RefreshCw size={16} /> Reload
        </button>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          <Home size={16} /> Go home
        </button>
      </div>
    </div>
  );
}
