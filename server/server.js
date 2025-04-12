// server/server.js

// Load environment variables from .env in your project root
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');

const bookingsRoute = require('./routes/bookings');
const driversRoute = require('./routes/drivers');

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Set Mongoose's strictQuery option to avoid deprecation warnings
mongoose.set('strictQuery', false);

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  const cors = require('cors');
  app.use(cors());
  
// Set up API routes
app.use('/api/bookings', bookingsRoute);
app.use('/api/drivers', driversRoute);

// Serve static files from your React production build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Fallback route: serve React's index.html (supports client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// ------ SOCKET.IO SETUP ------

// Create an HTTP server from the Express app
const http = require('http');
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const socketIo = require('socket.io');
const io = socketIo(server);

// When a client connects, log the socket id
io.on('connection', (socket) => {
  console.log('Client connected: ' + socket.id);
});

// Make the io instance available to your routes via app.locals
app.locals.io = io;

// ------------------------------

// Define the port (use PORT from environment or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server (listening on all interfaces)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://147.93.46.237:${PORT}`);
});
