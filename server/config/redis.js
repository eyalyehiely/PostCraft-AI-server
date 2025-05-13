const { createClient } = require('redis');

// Default Redis configuration
const redisConfig = {
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
};

const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  // Don't throw the error, just log it
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
    console.log('Continuing without Redis cache...');
  }
};

module.exports = {
  redisClient,
  connectRedis
}; 