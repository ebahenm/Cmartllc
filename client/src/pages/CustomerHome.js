// src/pages/CustomerHome.js
import React from 'react';
import BookingForm from '../components/BookingForm';

function CustomerHome() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero animate__animated animate__fadeIn">
        <div className="hero-content">
          <h1>Luxury Transportation Done Right</h1>
          <p>
            Experience comfort, style, and reliability with our premium fleet
          </p>
          <div className="hero-buttons">
            <a href="#book" className="btn">Book Now</a>
            <a href="tel:+15026396216" className="btn btn-outline">Call Now</a>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="container">
        <h2 className="section-title animate__animated animate__fadeIn">Our Fleet</h2>
        <div className="fleet">
          <div className="vehicle-card animate__animated animate__fadeInLeft">
            <img
              src="https://cars.usnews.com/static/images/Auto/izmo/i159616253/2024_chevrolet_suburban_angularfront.jpg"
              alt="Chevrolet Suburban 2023"
              className="vehicle-img"
            />
            <div className="vehicle-info">
              <h3>Chevrolet Suburban 2023</h3>
              <p>Spacious luxury SUV with premium amenities for up to 8 passengers.</p>
              <ul>
                <li><i className="fas fa-user"></i> 8 Passengers</li>
                <li><i className="fas fa-suitcase"></i> 6 Large Bags</li>
                <li><i className="fas fa-wifi"></i> Free WiFi</li>
              </ul>
            </div>
          </div>

          <div className="vehicle-card animate__animated animate__fadeInRight">
            <img
              src="https://65e81151f52e248c552b-fe74cd567ea2f1228f846834bd67571e.ssl.cf1.rackcdn.com/ldm-images/2020-Kia-Sedona-exterior-1.jpg"
              alt="Kia Sedona 2020"
              className="vehicle-img"
            />
            <div className="vehicle-info">
              <h3>Kia Sedona 2020</h3>
              <p>Comfortable minivan perfect for family transportation or group travel.</p>
              <ul>
                <li><i className="fas fa-user"></i> 7 Passengers</li>
                <li><i className="fas fa-suitcase"></i> 4 Large Bags</li>
                <li><i className="fas fa-child"></i> Child Seats Available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section" id="book">
        <div className="container">
          <h2 className="section-title animate__animated animate__fadeIn">Book Your Ride</h2>
          <div className="booking-form animate__animated animate__fadeInUp">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section animate__animated animate__fadeIn">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-container">
            <div className="contact-card">
              <h3>Lamine Elghadhy</h3>
              <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                Owner, CMART LLC Transportation
              </p>
              <ul className="contact-info">
                <li>
                  <i className="fas fa-phone"></i>
                  <a href="tel:+15026396216">+1 (502) 639-6216</a>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:ouldm1969@gmail.com">ouldm1969@gmail.com</a>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:m11221969@hotmail.com">m11221969@hotmail.com</a>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  Kenner, LA 70065
                </li>
              </ul>
              <div className="call-now">
                <a href="tel:+15026396216" className="btn" style={{ display: 'inline-block' }}>
                  <i className="fas fa-phone"></i> Call Now
                </a>
              </div>
            </div>

            <div className="map-card">
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789012345678!2d-90.24177568456789!3d29.98765432101234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8620a123456789ab%3A0x1234567890abcdef!2sKenner%2C%20LA%2070065!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  allowFullScreen
                  loading="lazy"
                  title="Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <h3>CMART LLC Transportation</h3>
          <p className="footer-contact">Professional Service Since 2016</p>
          <div className="footer-links">
            <a href="#book">Book a Ride</a>
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
    </div>
  );
}

export default CustomerHome;
