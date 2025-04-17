// client/src/pages/ConfirmationPage.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="container" style={{ padding: '20px' }}>
        <h1>No booking data</h1>
        <p><Link to="/">Go back home</Link></p>
      </div>
    );
  }

  const { driver, vehicle, pickupLocation, dropoffLocation, date, time } = booking;

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>🎉 Your Ride Is Confirmed!</h1>
      <p>Here’s your driver’s information:</p>
      <ul>
        <li><strong>Name:</strong> {driver.name}</li>
        <li><strong>Phone:</strong> <a href={`tel:${driver.phone}`}>{driver.phone}</a></li>
        <li><strong>Email:</strong> <a href={`mailto:${driver.email}`}>{driver.email}</a></li>
      </ul>
      <h2>Ride Details</h2>
      <ul>
        <li><strong>Vehicle:</strong> {vehicle}</li>
        <li><strong>Pickup:</strong> {pickupLocation}</li>
        <li><strong>Dropoff:</strong> {dropoffLocation}</li>
        <li><strong>Date:</strong> {date}</li>
        <li><strong>Time:</strong> {time}</li>
      </ul>
      <p><Link to="/">Book another ride</Link></p>
    </div>
  );
}
