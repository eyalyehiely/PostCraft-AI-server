const { createClient } = require('redis');

// Redis configuration that works both locally and on Railway
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('Redis max retries reached. Giving up...');
        return new Error('Redis max retries reached');
      }
      return Math.min(retries * 100, 3000);
    }
  }
};

// Log Redis configuration (excluding sensitive data)
console.log('Redis Configuration:', {
  url: redisConfig.url ? 'REDIS_URL is set' : 'Using default localhost URL',
  hasSocketConfig: !!redisConfig.socket
});

const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  console.error('Redis Error Details:', {
    code: err.code,
    message: err.message,
    stack: err.stack
  });
  // Don't throw the error, just log it
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.on('reconnecting', () => {
  console.log('Redis Client Reconnecting');
});

const connectRedis = async () => {
  try {
    console.log('Attempting to connect to Redis...');
    await redisClient.connect();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Redis connection error:', error);
    console.error('Redis Connection Error Details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    console.log('Continuing without Redis cache...');
  }
};

module.exports = {
  redisClient,
  connectRedis
}; 