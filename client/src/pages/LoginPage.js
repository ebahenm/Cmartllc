// client/src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PasswordToggle from '../components/PasswordToggle';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneExists, setPhoneExists] = useState(null);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('rememberedPhone');
    if (saved) {
      const formatted = `(${saved.slice(0,3)}) ${saved.slice(3,6)}-${saved.slice(6)}`;
      setFormData(prev => ({ ...prev, phone: formatted, rememberMe: true }));
      setPhoneExists(true);
    }
  }, []);

  const formatInput = digits => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
  };

  const handlePhoneChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: formatInput(digits) }));
    setError('');
    setPhoneExists(null);
  };

  const handlePhoneBlur = async () => {
    const clean = formData.phone.replace(/\D/g, '');
    if (clean.length !== 10) return;
    setCheckingPhone(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/check-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean }),
        credentials: 'include'
      });
      const { exists } = await res.json();
      setPhoneExists(exists);
      if (!exists) setError('No account found. Please sign up.');
    } catch (err) {
      console.error('Phone check failed', err);
    } finally {
      setCheckingPhone(false);
    }
  };

  const handlePasswordChange = e => {
    setFormData(prev => ({ ...prev, password: e.target.value }));
    setError('');
  };

  const handleToggle = () => setShowPassword(show => !show);

  const handleRememberChange = e => {
    setFormData(prev => ({ ...prev, rememberMe: e.target.checked }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (phoneExists === false) return;
    setLoading(true);

    try {
      const clean = formData.phone.replace(/\D/g, '');
      if (clean.length !== 10) throw new Error('Invalid phone number');

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { phone: clean, password: formData.password },
        { withCredentials: true }
      );

      const { token } = res.data;
      if (!token) throw new Error('Authentication failed');

      localStorage.setItem('userToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onLogin(token);

      if (formData.rememberMe) {
        localStorage.setItem('rememberedPhone', clean);
      } else {
        localStorage.removeItem('rememberedPhone');
      }

      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Login failed';
      setError(msg.includes('ECONNREFUSED') ? 'Connection error' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-container">
        <h2>Log In</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              required
            />
            {checkingPhone && <div className="field-note">Checking phone…</div>}
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handlePasswordChange}
                required
              />
              <PasswordToggle showPassword={showPassword} onToggle={handleToggle} />
            </div>
          </div>

          <div className="form-options">
            <label>
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleRememberChange}
              /> Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || phoneExists === false}
            className="btn"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="signup-prompt">
          Need an account? 👉 <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </>
  );
}
