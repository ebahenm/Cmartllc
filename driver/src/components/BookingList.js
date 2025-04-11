import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BookingList({ driverId }) {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/api/drivers/${driverId}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const response = await axios.post(
        `/api/drivers/${driverId}/booking/${bookingId}/status`,
        { status }
      );
      setMessage(response.data.message);
      // refresh the list
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status', error);
      setMessage('Failed to update booking status');
    }
  };

  return (
    <div>
      <h2>Assigned Bookings</h2>
      {message && <p>{message}</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b._id}>
            <p>Pickup: {b.pickupLocation}</p>
            <p>Dropoff: {b.dropoffLocation}</p>
            <p>Date: {new Date(b.date).toLocaleDateString()}</p>
            <p>Time: {b.time}</p>
            <p>Status: {b.status}</p>
            <button onClick={() => updateStatus(b._id, 'assigned')}>
              Accept
            </button>
            <button onClick={() => updateStatus(b._id, 'completed')}>
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingList;
