// src/components/Header.js
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Header({ token, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="container d-flex align-items-center">
        <Link className="brand" to="/">CMART LLC Driver</Link>

        {/* only render toggle if logged in */}
        {token && (
          <button
            className="menu-btn ms-auto"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* nav‑links get an “open” class when menu is toggled */}
        {token && (
          <div className={`nav-links${open ? ' open' : ''}`}>
            <NavLink to="/"      end>Home</NavLink>
            <NavLink to="/assignment">Assignments</NavLink>
            <NavLink to="/tracker">Tracker</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
