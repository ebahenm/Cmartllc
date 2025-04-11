import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <h3>CMART LLC Transportation</h3>
        <p className="footer-contact">
          Professional Service Since 2016
        </p>
        <div className="footer-links">
          {/* Change href to a valid fragment URL */}
          <a href="/#book">Book a Ride</a>
          <a href="tel:+15026396216">Call Now</a>
          <a href="mailto:ouldm1969@gmail.com">Email Us</a>
        </div>
        <div className="social-links">
          <a href="tel:+15026396216" aria-label="Call us">
            <i className="fas fa-phone"></i>
          </a>
          <a href="mailto:ouldm1969@gmail.com" aria-label="Email us">
            <i className="fas fa-envelope"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p>
          &copy; 2025 CMART LLC. All rights reserved.<br />
          Kenner, LA 70065
        </p>
      </div>
    </footer>
  );
}

export default Footer;
