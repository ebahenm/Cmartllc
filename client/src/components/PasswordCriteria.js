// client/src/components/PasswordCriteria.js
import React from 'react';

/**
 * Renders a checklist of password rules.
 * Expects a `password` prop string.
 */
export default function PasswordCriteria({ password }) {
  const rules = [
    { label: 'At least 8 characters',       valid: password.length >= 8 },
    { label: 'An uppercase letter',          valid: /[A-Z]/.test(password) },
    { label: 'A number',                     valid: /\d/.test(password) },
    { label: 'A special character (e.g. !@#$)', valid: /[\W_]/.test(password) },
  ];

  return (
    <ul className="password-criteria">
      {rules.map(({ label, valid }) => (
        <li key={label} className={valid ? 'valid' : 'invalid'}>
          {valid ? '✔︎' : '✖︎'} {label}
        </li>
      ))}
    </ul>
  );
}
