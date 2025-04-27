// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ConfirmationPage from '../pages/ConfirmationPage';
import '../App.css';

export default function Header({ token, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <header className="main-header">
      <nav className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="logo-link">
            <span className="logo-text">CMART LLC</span>
          </Link>
          <button
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} />
          </button>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className="nav-item">
            Home
          </NavLink>
          <NavLink to="/fare-estimate" className="nav-item">
            Fare Estimate
          </NavLink>

          {token ? (
            <>
              <NavLink to="/ride-status" className="nav-item">
                Ride Status
              </NavLink>
              <button
                onClick={handleLogout}
                className="nav-item auth-link"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-item auth-link">
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-item cta-button">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
