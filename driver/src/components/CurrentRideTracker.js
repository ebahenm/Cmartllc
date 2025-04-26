import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

export default function CurrentRideTracker() {
  const { id: rideId } = useParams();
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const socket = io('/', { transports: ['websocket'] });
    socket.on('locationUpdate', data => {
      if (data.rideId === rideId) setCoords(data.coords);
    });
    return () => socket.disconnect();
  }, [rideId]);

  return (
    <>
      <h2 className="mb-4">Live Tracking</h2>
      {!coords ? (
        <p>Waiting for driver location…</p>
      ) : (
        <div className="ratio ratio-16x9">
          <iframe
            title="live-map"
            src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}
