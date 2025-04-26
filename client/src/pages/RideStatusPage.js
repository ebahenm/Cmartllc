// client/src/RideStatusPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import MapTracker from '../components/MapTracker';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RideDetailsCard from '../components/RideDetailsCard';

export default function RideStatusPage() {
  const [ride, setRide] = useState(undefined);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const rideId = searchParams.get('rideId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (!rideId) {
      setError('Missing ride ID in URL');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRideDetails = async () => {
      try {
        const res = await axios.get(`/api/bookings/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        
        if (!res.data.booking) {
          throw new Error('Ride not found');
        }

        setRide(res.data.booking);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.response?.data?.error || err.message || 'Failed to fetch ride details');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRideDetails();

    return () => controller.abort();
  }, [rideId, token, navigate, location]);

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/bookings/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRide(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to refresh ride status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container center-content">
        <LoadingSpinner message="Loading ride details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage 
          message={error}
          onRetry={rideId ? handleRefresh : undefined}
          retryLabel="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="container ride-status-container">
      <div className="ride-status-header">
        <h1 className="page-title">Ride Status</h1>
        <button 
          onClick={handleRefresh}
          className="btn refresh-btn"
          aria-label="Refresh status"
        >
          ↻ Refresh
        </button>
      </div>

      <RideDetailsCard ride={ride} />

      <div className="map-container">
        <MapTracker
          pickup={ride.pickupLocation}
          dropoff={ride.dropoffLocation}
          liveCoords={ride.currentLocation}
          driverName={ride.driver.name}
          vehicle={ride.vehicle}
        />
      </div>

      <div className="status-timeline">
        <div className={`timeline-step ${ride.status === 'pending' ? 'active' : ''}`}>
          <div className="step-indicator"></div>
          <span className="step-label">Driver Assigned</span>
        </div>
        <div className={`timeline-step ${ride.status === 'enroute' ? 'active' : ''}`}>
          <div className="step-indicator"></div>
          <span className="step-label">On the Way</span>
        </div>
        <div className={`timeline-step ${ride.status === 'completed' ? 'active' : ''}`}>
          <div className="step-indicator"></div>
          <span className="step-label">Completed</span>
        </div>
      </div>
    </div>
  );
}