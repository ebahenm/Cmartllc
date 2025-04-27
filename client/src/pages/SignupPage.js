// client/src/pages/SignupPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';

export default function SignupPage({ onSignup }) {
  const location = useLocation();
  const navigate = useNavigate();

  // If coming from booking flow, these will be set
  const bookingData = location.state?.bookingData || null;
  const initialPhone = location.state?.phone || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  // Prefill phone if passed in
  useEffect(() => {
    if (initialPhone) {
      setFormData(prev => ({ ...prev, phone: initialPhone }));
    }
  }, [initialPhone]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (value && !/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email address';
        break;
      case 'phone': {
        const clean = value.replace(/\D/g, '');
        if (!/^\d{10}$/.test(clean)) return 'Enter a 10-digit phone number';
        if (phoneExists) return 'Phone already registered';
        break;
      }
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'At least one uppercase letter';
        if (!/\d/.test(value)) return 'At least one number';
        if (!/[\W_]/.test(value)) return 'At least one special character';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'phone') {
      setPhoneExists(false);
    }
  };

  const handlePhoneBlur = async () => {
    const clean = formData.phone.replace(/\D/g, '');
    if (clean.length !== 10) return;
    setCheckingPhone(true);
    try {
      const res = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean })
      });
      const { exists } = await res.json();
      setPhoneExists(exists);
      if (exists) {
        setErrors(prev => ({ ...prev, phone: 'Phone already registered. Please log in.' }));
      }
    } catch (err) {
      console.error('Phone check error', err);
    } finally {
      setCheckingPhone(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate all fields
    const newErrors = {};
    Object.entries(formData).forEach(([field, val]) => {
      if (field === 'email' && !val) return;
      const err = validateField(field, val);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/\D/g, ''),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Signup failed');

      onSignup(body.token);
      navigate('/', { replace: true });

      if (bookingData) {
        const [date, time] = bookingData.pickup_time.split('T');
        const bookingRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${body.token}`,
          },
          body: JSON.stringify({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            vehicle: bookingData.vehicle,
            pickupLocation: bookingData.pickup_location,
            dropoffLocation: bookingData.dropoff_location,
            date,
            time,
            special_requests: bookingData.special_requests || '',
          }),
        });
        const bookingJson = await bookingRes.json();
        if (!bookingRes.ok) throw new Error(bookingJson.error || 'Booking failed');
        navigate('/confirmation', { state: { booking: bookingJson.booking } });
      }
    } catch (err) {
      setErrors({ general: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <section className="auth-section">
        <div className="auth-card">
          <h2>Create an Account</h2>
          {errors.general && <div className="form-error">{errors.general}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handlePhoneBlur}
                disabled={isSubmitting || !!initialPhone}
                className={errors.phone ? 'error' : ''}
              />
              {checkingPhone && <div className="field-note">Checking phone…</div>}
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <button type="submit" className="btn" disabled={isSubmitting || phoneExists}>
              {isSubmitting ? 'Creating Account…' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? 👉 <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </>
  );
}
