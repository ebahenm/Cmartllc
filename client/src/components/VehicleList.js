// client/src/components/VehicleList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get('/api/vehicles')
      .then(r => setVehicles(r.data.vehicles))
      .catch(console.error);
  }, []);

  return (
    <div className="fleet">
      {vehicles.map(v => (
        <div key={v._id} className="vehicle-card">
          <img src={v.imageUrl} alt={v.name} className="vehicle-img"/>
          <h3>{v.name}</h3>
          <p>{v.description}</p>
          <ul>
            <li>Capacity: {v.capacity}</li>
            <li>Rate: ${v.rate}/km</li>
          </ul>
        </div>
      ))}
    </div>
  );
}
