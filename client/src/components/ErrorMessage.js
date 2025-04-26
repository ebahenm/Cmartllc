import React from 'react';

export default function ErrorMessage({ message, onRetry, retryLabel = 'Retry' }) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button 
          className="btn retry-btn"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}