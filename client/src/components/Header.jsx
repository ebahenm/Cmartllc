// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../App.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <nav className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="logo-link">
            <span className="logo-text">CMART LLC</span>
          </Link>
          
          <button 
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}></div>
          </button>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" exact="true" className="nav-item">
            Home
          </NavLink>
          <NavLink to="/fare-estimate" className="nav-item">
            Fare Estimate
          </NavLink>
          <NavLink to="/login" className="nav-item auth-link">
            Login
          </NavLink>
          <NavLink to="/signup" className="nav-item cta-button">
            Sign Up
          </NavLink>
        </div>
      </nav>
    </header>
  );
}