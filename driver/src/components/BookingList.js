import React from 'react';

function BookingList({ bookings }) {
  return (
    <div className="booking-list">
      {bookings.length === 0 ? (
        <p>No new bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <h3>New Booking</h3>
            <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
            <p><strong>Dropoff:</strong> {booking.dropoffLocation}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookingList;
