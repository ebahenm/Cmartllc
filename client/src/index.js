// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Global styling for the client site

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
