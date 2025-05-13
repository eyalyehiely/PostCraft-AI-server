const { redisClient } = require('../config/redis');

// Redis operations wrapper
const withRedis = async (operation, key, value = null, ttl = null) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  try {
    switch (operation) {
      case 'get':
        const cachedData = await redisClient.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
      
      case 'set':
        if (ttl) {
          await redisClient.setEx(key, ttl, JSON.stringify(value));
        } else {
          await redisClient.set(key, JSON.stringify(value));
        }
        return true;
      
      case 'del':
        await redisClient.del(key);
        return true;
      
      default:
        return null;
    }
  } catch (error) {
    console.warn(`Redis ${operation} operation failed for key ${key}:`, error.message);
    return null;
  }
};

// Middleware to handle Redis operations
const redisHandler = {
  // Get data from cache
  getFromCache: (key) => async (req, res, next) => {
    const cachedData = await withRedis('get', key);
    if (cachedData) {
      return res.json(cachedData);
    }
    next();
  },

  // Set data to cache
  setToCache: (key, ttl = 300) => async (req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
      withRedis('set', key, data, ttl);
      return originalJson.call(this, data);
    };
    next();
  },

  // Delete from cache
  deleteFromCache: (key) => async (req, res, next) => {
    await withRedis('del', key);
    next();
  },

  // Delete multiple keys from cache
  deleteMultipleFromCache: (keys) => async (req, res, next) => {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    await Promise.all(keysArray.map(key => withRedis('del', key)));
    next();
  }
};

module.exports = redisHandler; 