import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Import global styling if needed

// const rootElement = document.getElementById('root');
// if (!rootElement) {
//   console.error("Could not find element with id 'root'");
// } else {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(<App />);
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);