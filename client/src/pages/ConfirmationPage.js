// client/src/pages/ConfirmationPage.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const booking    = state?.booking;

  if (!booking) {
    return <div style={{padding:20}}><h1>No booking data</h1><Link to="/">Back home</Link></div>;
  }

  const { driver, vehicle, pickupLocation, dropoffLocation, date, time } = booking;

  return (
    <div style={{maxWidth:600,margin:'0 auto',padding:20}}>
      <h1>✔️ Ride Confirmed!</h1>
      <h2>Your Driver</h2>
      <ul>
        <li><strong>Name:</strong> {driver.name}</li>
        <li><strong>Phone:</strong> <a href={`tel:${driver.phone}`}>{driver.phone}</a></li>
        <li><strong>Email:</strong> <a href={`mailto:${driver.email}`}>{driver.email}</a></li>
      </ul>

      <h2>Ride Details</h2>
      <ul>
        <li><strong>Vehicle:</strong> {vehicle}</li>
        <li><strong>Pickup:</strong> {pickupLocation}</li>
        <li><strong>Drop‑off:</strong> {dropoffLocation}</li>
        <li><strong>Date:</strong> {date}</li>
        <li><strong>Time:</strong> {time}</li>
      </ul>

      <p><Link to="/">Book another ride</Link></p>
    </div>
  );
}
