import React from 'react';
import BookingForm from '../components/BookingForm';

function CustomerHome() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero animate__animated animate__fadeIn">
        <div className="hero-content">
          <h1>Luxury Transportation Done Right</h1>
          <p>Experience comfort, style, and reliability with our premium fleet</p>
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
            <img src="https://cars.usnews.com/static/images/Auto/izmo/i159616253/2024_chevrolet_suburban_angularfront.jpg" alt="Chevrolet Suburban 2023" className="vehicle-img" />
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
            <img src="https://65e81151f52e248c552b-fe74cd567ea2f1228f846834bd67571e.ssl.cf1.rackcdn.com/ldm-images/2020-Kia-Sedona-exterior-1.jpg" alt="Kia Sedona 2020" className="vehicle-img" />
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
          <BookingForm />
        </div>
      </section>
    </div>
  );
}

export default CustomerHome;
