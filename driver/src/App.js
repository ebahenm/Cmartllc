import React, { useEffect, useState } from 'react'; 
import io from 'socket.io-client';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingList from './components/BookingList';

// Connect to your backend
const socket = io('http://147.93.46.237:5000');

// For testing, comment out driver ID filter
// const driverId = "67fc8da6215db7b1625af726";

function App() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Listen for new booking notifications from the backend
    socket.on('newBooking', (booking) => {
      console.log('Received new booking:', booking);
      // Uncomment below and adjust if you want to filter by driverId later:
      // if (booking.driver && booking.driver.toString() === driverId) {
      //   setBookings((prev) => [booking, ...prev]);
      // }
      // For testing, just add every booking
      setBookings((prev) => [booking, ...prev]);
    });
    
    // Cleanup the socket connection on component unmount
    return () => {
      socket.off('newBooking');
    };
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <h1>Driver Dashboard</h1>
        <p>Welcome! You will receive new ride notifications in real time below.</p>
        <BookingList bookings={bookings} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
