// src/components/BookingForm.js
import React, { useState } from 'react';

function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    pickup_time: '',
    pickup_location: '',
    dropoff_location: '',
    special_requests: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    try {
      // Use relative URL so that it works with your proxy or reverse proxy setup
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setResponseMessage(result.message || 'Booking created successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          vehicle: '',
          pickup_time: '',
          pickup_location: '',
          dropoff_location: '',
          special_requests: '',
        });
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (error) {
      setResponseMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="bookingForm" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(123) 456-7890"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicle">Vehicle Type</label>
          <select
            id="vehicle"
            name="vehicle"
            required
            value={formData.vehicle}
            onChange={handleChange}
          >
            <option value="">Select a vehicle</option>
            <option value="Chevrolet Suburban 2023">Chevrolet Suburban 2023</option>
            <option value="Kia Sedona 2020">Kia Sedona 2020</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="pickup_time">Pickup Date &amp; Time</label>
        <input
          type="datetime-local"
          id="pickup_time"
          name="pickup_time"
          required
          value={formData.pickup_time}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pickup_location">Pickup Location</label>
          <input
            type="text"
            id="pickup_location"
            name="pickup_location"
            placeholder="123 Main St, Kenner, LA"
            required
            value={formData.pickup_location}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dropoff_location">Dropoff Location</label>
          <input
            type="text"
            id="dropoff_location"
            name="dropoff_location"
            placeholder="456 Elm St, New Orleans, LA"
            required
            value={formData.dropoff_location}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="special_requests">Special Requests (Optional)</label>
        <textarea
          id="special_requests"
          name="special_requests"
          rows="3"
          placeholder="Child seats, extra luggage, etc."
          value={formData.special_requests}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit" className="btn" id="submitBtn" disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
      {responseMessage && (
        <div
          id="responseMessage"
          className={responseMessage.includes('successfully') ? 'success' : 'error'}
        >
          {responseMessage}
        </div>
      )}
    </form>
  );
}

export default BookingForm;
