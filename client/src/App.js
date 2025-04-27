// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Components
import Header           from './components/Header';
import Footer           from './components/Footer';
import LoadingSpinner   from './components/LoadingSpinner';
import ProtectedRoute   from './components/ProtectedRoute';
import NotFoundPage     from './pages/NotFoundPage';

// Pages
import LoginPage            from './pages/LoginPage';
import SignupPage           from './pages/SignupPage';
import ForgotPasswordPage   from './pages/ForgotPasswordPage';
import ResetPasswordPage    from './pages/ResetPasswordPage';
import CustomerHome         from './pages/CustomerHome';
import RideStatusPage       from './pages/RideStatusPage';
import FareEstimatePage     from './pages/FareEstimatePage';
import ConfirmationPage     from './pages/ConfirmationPage';

// Misc
import BookingForm      from './components/BookingForm';
import { API_BASE_URL } from './config';

export default function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('userToken'),
    loading: true,
    error: null
  });

  const location = useLocation();
  const navigate = useNavigate();

  // axios default config
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  // verify token on route change
  useEffect(() => {
    async function verify() {
      if (!authState.token) {
        setAuthState(s => ({ ...s, loading: false }));
        return;
      }
      try {
        await axios.get('/api/auth/verify');
        setAuthState(s => ({ ...s, loading: false, error: null }));
      } catch {
        handleLogout('Session expired. Please log in again.');
        setAuthState(s => ({ ...s, loading: false }));
      }
    }
    verify();
  }, [location.pathname]);

  const handleLogin = newToken => {
    localStorage.setItem('userToken', newToken);
    setAuthState({ token: newToken, loading: false, error: null });
    navigate(location.state?.from || '/', { replace: true });
  };

  const handleLogout = message => {
    localStorage.removeItem('userToken');
    setAuthState({ token: null, loading: false, error: message || null });
    navigate('/login', { state: { message } });
  };

  // hide header/footer on auth pages
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const showLayout = !authRoutes.includes(location.pathname);

  if (authState.loading) {
    return <LoadingSpinner fullScreen message="Authenticating..." />;
  }

  return (
    <div className="app-container">
      {showLayout && <Header token={authState.token} onLogout={handleLogout} />}

      <main className="main-content">
        <Routes>
          {/* Public Home */}
          <Route path="/" element={<CustomerHome />} />

          {/* Guest-only */}
          <Route
            path="/login"
            element={
              authState.token
                ? <Navigate to="/" replace />
                : <LoginPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/signup"
            element={
              authState.token
                ? <Navigate to="/" replace />
                : <SignupPage onSignup={handleLogin} />
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password"
            element={
              authState.token
                ? <Navigate to="/" replace />
                : <ResetPasswordPage onLogin={handleLogin} />
            }
          />

          {/* Booking workflow without verify/login */}
          <Route path="/book" element={<BookingForm />} />
          <Route path="/fare-estimate" element={<FareEstimatePage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />

          {/* Protected: ride status */}
          <Route element={<ProtectedRoute token={authState.token} />}>
            <Route path="/ride-status" element={<RideStatusPage />} />
          </Route>

          {/* 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      {showLayout && <Footer />}
    </div>
  );
}
