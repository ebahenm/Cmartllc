import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RideAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token    = localStorage.getItem('driverToken');
  const driverId = localStorage.getItem('driverId');

  const [booking, setBooking] = useState(null);
  const [error, setError]     = useState('');

  useEffect(() => {
    axios.get(`/api/drivers/${driverId}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setBooking(res.data.find(b => b._id === id)))
    .catch(() => setError('Could not load booking'));
  }, [driverId, id, token]);

  const updateStatus = status => {
    axios.post(
      `/api/drivers/${driverId}/booking/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => navigate('/'))
    .catch(() => setError('Update failed'));
  };

  if (!booking) {
    return <div className="text-center py-5">Loading…</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">Manage Ride #{id}</h4>
        {error && <div className="alert alert-warning">{error}</div>}
        <p><strong>Passenger:</strong> {booking.user.name} ({booking.user.phone})</p>
        <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
        <p><strong>Dropoff:</strong> {booking.dropoffLocation}</p>
        <div className="mt-4">
          <button
            className="btn btn-success me-2"
            onClick={() => updateStatus('accepted')}
          >
            Accept
          </button>
          <button
            className="btn btn-danger"
            onClick={() => updateStatus('rejected')}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
