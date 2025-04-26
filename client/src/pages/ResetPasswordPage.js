// client/src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PasswordCriteria from '../components/PasswordCriteria';

export default function ResetPasswordPage({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [passwordValid, setValid]   = useState(false);

  // Extract token from URL once
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (!t) {
      setError('Invalid reset link');
      navigate('/login');
    } else {
      setToken(t);
    }
  }, [location.search, navigate]);

  const validatePassword = pwd => {
    const valid = pwd.length >= 8 &&
                  /[A-Z]/.test(pwd) &&
                  /\d/.test(pwd) &&
                  /[\W_]/.test(pwd);
    setValid(valid);
    return valid;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      return setError('Password does not meet requirements');
    }
    if (password !== confirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Password reset failed');

      // auto-login with returned token
      onLogin(body.token);
      navigate('/', { replace: true, state: { passwordReset: true } });
    } catch (err) {
      setError(err.message.replace('Token', 'Reset link'));
      if (err.message.toLowerCase().includes('expired')) {
        navigate('/forgot-password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Reset Password</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); validatePassword(e.target.value); }}
            disabled={loading}
            required
          />
          <PasswordCriteria password={password} />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn primary"
          disabled={loading || !passwordValid}
        >
          {loading ? 'Updating…' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
