// client/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Components
import Header           from './components/Header';
import Footer           from './components/Footer';
import LoadingSpinner   from './components/LoadingSpinner';
import ProtectedRoute   from './components/ProtectedRoute';
import VerifyPhone      from './components/VerifyPhone';
import NotFoundPage     from './pages/NotFoundPage';

// Pages
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import ForgotPasswordPage  from './pages/ForgotPasswordPage';
import ResetPasswordPage   from './pages/ResetPasswordPage';
import CustomerHome     from './pages/CustomerHome';
import RideStatusPage   from './pages/RideStatusPage';
import FareEstimatePage from './pages/FareEstimatePage';
import ConfirmationPage from './pages/ConfirmationPage';

// Misc
import BookingForm      from './components/BookingForm';
import { API_BASE_URL } from './config';

export default function App() {
  const [authState, setAuthState] = useState(() => ({
    token: localStorage.getItem('userToken'),
    loading: true,
    error: null
  }));
  const location = useLocation();
  const navigate = useNavigate();

  // Apply baseURL and Authorization header whenever token changes
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  // Verify token on mount & route change
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (authState.token) {
          await axios.get('/api/auth/verify');
          setAuthState(prev => ({ ...prev, loading: false, error: null }));
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Authentication error:', error);
        handleLogout('Session expired. Please log in again.');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    verifyToken();
  }, [location.pathname]);

  const handleLogin = newToken => {
    localStorage.setItem('userToken', newToken);
    setAuthState({ token: newToken, loading: false, error: null });
    navigate(location.state?.from || '/', { replace: true });
  };

  const handleLogout = message => {
    localStorage.removeItem('userToken');
    setAuthState({ token: null, loading: false, error: message || 'Logged out successfully' });
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
          {/* public / guest-only */}
          <Route path="/login" element={
            <GuestRoute token={authState.token}>
              <LoginPage onLogin={handleLogin} />
            </GuestRoute>
          }/>
          <Route path="/signup" element={
            <GuestRoute token={authState.token}>
              <SignupPage onSignup={handleLogin} />
            </GuestRoute>
          }/>

          {/* always public */}
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

          <Route path="/resetpassword" element={
            <GuestRoute token={authState.token}>
              <ResetPasswordPage onLogin={handleLogin} />
            </GuestRoute>
          }/>

          {/* semi-public */}
          <Route path="/book" element={<BookingForm onLogin={handleLogin} />} />
          <Route path="/fare-estimate" element={<FareEstimatePage />} />

          {/* must verify phone */}
          <Route element={<ProtectedRoute token={authState.token} requiresVerification />}>
            <Route path="/verify-phone" element={<VerifyPhone onVerify={handleLogin} />} />
          </Route>

          {/* fully protected */}
          <Route element={<ProtectedRoute token={authState.token} />}>
            <Route path="/" element={<CustomerHome />} />
            <Route path="/ride-status" element={<RideStatusPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
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

const GuestRoute = ({ children, token }) => {
  return token ? <Navigate to="/" replace /> : children;
};
