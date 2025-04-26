// client/src/components/MapTracker.js
import React, { useEffect, useRef } from 'react';

export default function MapTracker({ coords }) {
  const mapRef = useRef();

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: coords,
      zoom: 14,
    });
    new window.google.maps.Marker({ position: coords, map });
  }, [coords]);

  return <div ref={mapRef} style={{ width:'100%', height:'400px' }} />;
}
