// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>CMART LLC</div>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Home</Link>
          {/* Add a link to the confirmation page */}
          <Link to="/confirmation" style={styles.link}>Confirmation</Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #2c3e50, #1a252f)',
    padding: '10px 0',
    color: 'white',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px'
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 700,
  },
  nav: {
    display: 'flex',
    gap: '15px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 600
  }
};
