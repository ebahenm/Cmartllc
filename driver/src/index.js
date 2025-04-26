// src/index.js

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';  

 const container = document.getElementById('root');
 const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,  document.getElementById('root')

);
