// client/src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { formatPhoneNumber, validatePhoneNumber } from '../utils/phoneUtils';

export default function ForgotPasswordPage() {
  const [phone, setPhone]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validatePhoneNumber(phone)) {
      setError('Enter a valid 10-digit US phone number.');
      return;
    }

    setLoading(true);
    try {
      const clean = phone.replace(/\D/g, '');
      await axios.post('/api/auth/forgot-password', { phone: clean });
      setMessage('If that number exists, you’ll receive reset instructions shortly.');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Reset Your Password</h2>

      {message && <div className="success-message">{message}</div>}
      {error   && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={phone}
            onChange={e => setPhone(formatPhoneNumber(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <p className="signup-prompt">
        Remembered your password? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
