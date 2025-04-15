// driver/src/components/DriverDashboard.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "http://147.93.46.237:5000";

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    console.log('DriverDashboard mounted');
    const socket = io(SOCKET_SERVER_URL);
    socket.on("newBooking", (booking) => {
      console.log("Received new booking:", booking);
      setRides((prevRides) => [booking, ...prevRides]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="driver-dashboard">
      <h1>CMART LLC - Driver Dashboard</h1>
      <h2>Upcoming Rides</h2>
      {rides.length === 0 ? (
        <p>No rides available yet.</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li
              key={ride._id}
              style={{
                marginBottom: '15px',
                listStyle: 'none',
                border: '1px solid #ccc',
                padding: '10px'
              }}
            >
              <p><strong>Ride ID:</strong> {ride._id}</p>
              <p><strong>Vehicle:</strong> {ride.vehicle}</p>
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Dropoff Location:</strong> {ride.dropoffLocation}</p>
              <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {ride.time}</p>
              {ride.special_requests && <p><strong>Special Requests:</strong> {ride.special_requests}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;
