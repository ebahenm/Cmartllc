import React, { useState } from 'react';
import axios from 'axios';

function BookingForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [message, setMessage] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/bookings', {
        name,
        phone,
        email,
        pickupLocation,
        dropoffLocation,
        date,
        time,
        vehicleId
      });

      setMessage(response.data.message || 'Booking successfully created!');
    } catch (error) {
      console.error(error);
      setMessage('Error creating booking.');
    }
  };

  return (
    <div>
      <h2>Book a Ride</h2>
      <form onSubmit={handleBooking}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div>
          <label>Phone:</label>
          <input 
            type="text" 
            required 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <div>
          <label>Email (optional):</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Pickup Location:</label>
          <input 
            type="text" 
            required 
            value={pickupLocation} 
            onChange={(e) => setPickupLocation(e.target.value)} 
          />
        </div>
        <div>
          <label>Dropoff Location:</label>
          <input 
            type="text" 
            required 
            value={dropoffLocation} 
            onChange={(e) => setDropoffLocation(e.target.value)} 
          />
        </div>
        <div>
          <label>Date:</label>
          <input 
            type="date" 
            required 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
        <div>
          <label>Time:</label>
          <input 
            type="time" 
            required 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
          />
        </div>
        <div>
          <label>Vehicle ID:</label>
          <input 
            type="text" 
            required 
            placeholder="Enter Vehicle ID from your DB" 
            value={vehicleId} 
            onChange={(e) => setVehicleId(e.target.value)} 
          />
        </div>
        <button type="submit">Submit Booking</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default BookingForm;
