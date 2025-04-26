import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import DriverDashboard from './components/DriverDashboard';
import RideAssignment from './components/RideAssignment';
import CurrentRideTracker from './components/CurrentRideTracker';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('driverToken'));

  // Sync axios & localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('driverToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('driverToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const handleLogin = (newToken, driverId) => {
    localStorage.setItem('driverId', driverId);
    setToken(newToken);
  };
  const handleLogout = () => {
    localStorage.removeItem('driverId');
    setToken(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header token={token} onLogout={handleLogout} />

      <main className="flex-grow-1 container my-4">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />

          <Route
            path="/"
            element={
              token
                ? <DriverDashboard />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/assignment/:id"
            element={
              token
                ? <RideAssignment />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/tracker/:id"
            element={
              token
                ? <CurrentRideTracker />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="*"
            element={<Navigate to={token ? '/' : '/login'} replace />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
