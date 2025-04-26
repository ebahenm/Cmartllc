import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const driverId = localStorage.getItem('driverId');
  const token    = localStorage.getItem('driverToken');
  const URL      = `/api/drivers/${driverId}/bookings`;

  useEffect(() => {
    if (!driverId) return;
    axios.get(URL, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRides(res.data))
      .catch(console.error);
  }, [driverId, token, URL]);

  useEffect(() => {
    if (!driverId) return;
    const socket = io('/', { transports: ['websocket'] });
    socket.on('newBooking', booking => {
      if (booking.driver === driverId) {
        setRides(prev => [booking, ...prev]);
      }
    });
    return () => socket.disconnect();
  }, [driverId]);

  return (
    <>
      <h2 className="mb-4">Upcoming Rides</h2>
      {rides.length === 0 && <p>No rides assigned yet.</p>}
      {rides.map(ride => (
        <div key={ride._id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <p><strong>Vehicle:</strong> {ride.vehicle}</p>
            <p><strong>Pickup:</strong> {ride.pickupLocation}</p>
            <p><strong>Dropoff:</strong> {ride.dropoffLocation}</p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(ride.date).toLocaleDateString()} at {ride.time}
            </p>
            {ride.special_requests && (
              <p><strong>Notes:</strong> {ride.special_requests}</p>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
