// driver/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverDashboard from './components/DriverDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
       <Header />
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
