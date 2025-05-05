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
            <a href="tel:+15046410004" className="btn">Call Now</a>
            <a href="#book" className="btn  btn-outline">Book Now</a>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="container">
        <h2 className="section-title animate__animated animate__fadeIn">Our Fleet</h2>
        <div className="fleet">
          <div className="vehicle-card animate__animated animate__fadeInLeft">
            <img
              src="/images/2024_chevrolet_suburbanjpg.jpg"
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
              src="/images/Kia_Sedona2020.jpg"
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
                  <a href="tel:+15046410004">+1 (504) 641-0004</a>
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
                <a href="tel:+15046410004" className="btn" style={{ display: 'inline-block' }}>
                  <i className="fas fa-phone"></i> Call Now
                </a>
              </div>
            </div>

            <div className="map-card">
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBV4a94wRik5Mqpot-IJqVCPSvqayb1sos&q=Kenner,LA,70065"
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
    </div>
  );
}

export default CustomerHome;