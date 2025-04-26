// server/server.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

// Suppress deprecation warning for strictQuery in Mongoose 7
mongoose.set('strictQuery', true);

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const socketIo = require('socket.io');

// Authentication middleware
const { protect } = require('./middleware/auth');
const protectDriver = protect('driver');

// Route handlers
const authRoutes       = require('./routes/auth');
const bookingRoutes    = require('./routes/bookings');
const pricingRoutes    = require('./routes/pricing');
const trackingRoutes   = require('./routes/tracking');
const assignmentRoutes = require('./routes/assignment');
const driverRoutes     = require('./routes/drivers');

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// 1. Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// 2. Body parsing & sanitization
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());

// 3. API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', protect(), bookingRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/drivers', protectDriver, driverRoutes);

// 4. Serve React build (production only)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// 5. WebSocket setup
io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});
app.locals.io = io;

// 6. Database connection & server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Cmartllc'
    });
    console.log('MongoDB connected successfully');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

startServer();

// 7. Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});

// 8. Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});
