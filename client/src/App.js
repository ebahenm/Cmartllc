// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerHome from './pages/CustomerHome';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CustomerHome />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
