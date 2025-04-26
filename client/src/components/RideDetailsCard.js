import React from 'react';

export default function RideDetailsCard({ ride }) {
  return (
    <div className="ride-details-card">
      <h3 className="ride-status">Status: {ride.status}</h3>
      <div className="detail-row">
        <span className="detail-label">Driver:</span>
        <span className="detail-value">{ride.driver?.name || 'N/A'} ({ride.driver?.phone || '---'})</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Vehicle:</span>
        <span className="detail-value">{ride.vehicle}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Pickup:</span>
        <span className="detail-value">{ride.pickupLocation}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Dropoff:</span>
        <span className="detail-value">{ride.dropoffLocation}</span>
      </div>
    </div>
  );
}