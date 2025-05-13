// Load environment variables first, before any other code
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webhookRoutes = require('./routes/webhooks');
const profileRoutes = require('./routes/profile');
const postsRoutes = require('./routes/posts');
const rawBody = require('./middleware/raw-body');
const { connectRedis } = require('./config/redis');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');

// Initialize Clerk
app.use(ClerkExpressWithAuth());

// Trust proxy for rate limiter
app.set('trust proxy', 1);


// CORS middleware with explicit configuration
app.use(cors({
  origin: [ 'http://localhost:3000', 'http://localhost:3001','https://postcraft-ai.up.railway.app','https://postcraft-server.up.railway.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'svix-id', 'svix-timestamp', 'svix-signature'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

// Connect to MongoDB and Redis
connectDB();
connectRedis();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Apply raw body parsing for webhook routes
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use('/api/webhooks', webhookRoutes);

// Parse JSON and URL-encoded bodies for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other routes
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
