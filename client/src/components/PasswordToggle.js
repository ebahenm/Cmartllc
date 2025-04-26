// src/components/PasswordToggle.js
import React from 'react';

export default function PasswordToggle({ showPassword, onToggle }) {
  return (
    <button
      type="button"
      className="password-toggle"
      onClick={onToggle}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  );
}