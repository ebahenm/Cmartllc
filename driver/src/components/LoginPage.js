import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/driver-login', { phone, password });
      const { token, driverId } = res.data;
      onLogin(token, driverId);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 56px - 60px)' }}>
      <div className="card shadow-sm" style={{ maxWidth: 380, width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-3">Driver Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                id="phone"
                type="tel"
                className="form-control"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 15041234567"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
