import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Use your domain with HTTPS as appropriate (adjust protocol if needed)
const SOCKET_SERVER_URL = "https://driver.cmartllc.com";
// If your API is served on the same domain by your reverse proxy, you can use a relative URL.
const BOOKINGS_API_URL = "/api/bookings"; 

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);

  // Fetch existing bookings on component mount.
  useEffect(() => {
    axios.get(BOOKINGS_API_URL)
      .then(response => {
        // Assuming your API responds with { bookings: [...] }
        console.log("Fetched existing bookings:", response.data.bookings);
        setRides(response.data.bookings || []);
      })
      .catch(err => console.error("Error fetching bookings:", err));
  }, []);

  // Set up Socket.IO and listen for "newBooking" events.
  useEffect(() => {
    console.log('DriverDashboard mounted');
    // Connect to your domain (ensure your reverse proxy/Nginx is forwarding the socket requests)
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'], // you can adjust transports if necessary
    });

    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    socket.on("newBooking", (booking) => {
      console.log("Received new booking:", booking);
      setRides((prevRides) => [booking, ...prevRides]);
    });

    return () => {
      console.log('DriverDashboard unmounting, disconnecting socket');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="driver-dashboard" style={{ padding: '20px', background: '#fafafa' }}>
      <h1>CMART LLC - Driver Dashboard</h1>
      <h2>Upcoming Rides</h2>
      {rides.length === 0 ? (
        <p>No rides available yet.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {rides.map((ride) => (
            <li key={ride._id} style={{
              marginBottom: '15px',
              listStyle: 'none',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <p><strong>Vehicle:</strong> {ride.vehicle}</p>
              <p><strong>Pickup Location:</strong> {ride.pickupLocation}</p>
              <p><strong>Dropoff Location:</strong> {ride.dropoffLocation}</p>
              <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {ride.time}</p>
              {ride.special_requests && (
                <p><strong>Special Requests:</strong> {ride.special_requests}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;
