// src/components/VerifyPhone.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

export default function VerifyPhone({ onVerify }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone;
  const bookingData = state?.bookingData;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  // Redirect back if someone hits this URL directly
  useEffect(() => {
    if (!phone) {
      navigate('/', { replace: true });
    }
  }, [phone, navigate]);

  if (!phone) return <Navigate to="/" replace />;

  const handleVerify = async e => {
    e.preventDefault();
    if (code.length < 4) {
      setError('Please enter the full code.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1) verify-code → returns { token }
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Invalid code');
      const { token } = body;

      // 2) store JWT
      onVerify(token);

      // 3) if we came from a booking, auto–post it
      if (bookingData) {
        const [date, time] = bookingData.pickup_time.split('T');
        const payload = {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          vehicle: bookingData.vehicle,
          pickupLocation: bookingData.pickup_location,
          dropoffLocation: bookingData.dropoff_location,
          date,
          time,
          special_requests: bookingData.special_requests || ''
        };
        const bkRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const bkJson = await bkRes.json();
        if (!bkRes.ok) throw new Error(bkJson.error || 'Booking failed');
        return navigate('/confirmation', { state: { booking: bkJson.booking } });
      }

      // 4) otherwise send to signup to finish profile
      navigate('/signup', { state: { phone, verified: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResent(false);
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (!res.ok) throw new Error('Could not resend code');
      setResent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Verify Phone</h2>
      <p>We sent a code to <strong>{phone}</strong>.</p>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          maxLength={6}
          placeholder="Enter code"
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {resent && <p className="success">Code resent!</p>}

      <button onClick={handleResend} disabled={loading} className="link-button">
        Resend code
      </button>
    </div>
  );
}
