// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerHome     from './pages/CustomerHome';
import ConfirmationPage from './pages/ConfirmationPage';
import Header           from './components/Header';
import Footer           from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
