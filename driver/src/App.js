import React from 'react';
import BookingList from './components/BookingList';

function App() {
  // Suppose driverId is "64ad...someObjectId"
  const driverId = '64abc123def456...'; // Replace with real ID from your DB

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <BookingList driverId={driverId} />
    </div>
  );
}

export default App;
