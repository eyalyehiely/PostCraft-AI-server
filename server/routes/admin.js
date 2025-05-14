const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const redisHandler = require('../middleware/redisHandler');

router.get('/all-posts', 
  ClerkExpressRequireAuth(),
  redisHandler.getFromCache('admin:all-posts'),
  async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.status(200).json(posts.length);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },
  redisHandler.setToCache('admin:all-posts', 300)
);

router.get('/all-users', 
  ClerkExpressRequireAuth(),
  redisHandler.getFromCache('admin:all-users'),
  async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.status(200).json(users.length);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },
  redisHandler.setToCache('admin:all-users', 300)
);

router.get('/public-posts', 
  ClerkExpressRequireAuth(),
  redisHandler.getFromCache('admin:public-posts'),
  async (req, res) => {
    try {
      const posts = await Post.find({ isPublic: true });
      res.status(200).json(posts.length);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },
  redisHandler.setToCache('admin:public-posts', 300)
);

module.exports = router;






