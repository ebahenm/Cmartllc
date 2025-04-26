import React from 'react';

export default function LoadingSpinner({ size = 'medium', message }) {
  const sizes = {
    small: '1rem',
    medium: '2rem',
    large: '3rem'
  };

  return (
    <div className="loading-spinner">
      <div 
        className="spinner" 
        style={{ width: sizes[size], height: sizes[size] }}
      ></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}