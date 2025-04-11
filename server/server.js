// server/server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const bookingsRoute = require('./routes/bookings');

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Set Mongoose's strictQuery option to avoid deprecation warnings
mongoose.set('strictQuery', false);

// Get the MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// API Routes
app.use('/api/bookings', bookingsRoute);

// Serve static files from the React production build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// For any other route, serve the React app's index.html file (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Define the port from environment or default value (here, 443)
const PORT = process.env.PORT || 22;

// Start the server, listening on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://147.93.46.237:${PORT}`);
});
