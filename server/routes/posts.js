const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const Post = require('../models/Post');
const User = require('../models/User');
const { redisClient } = require('../config/redis');
const { generateLimiter, apiLimiter } = require('../middleware/rateLimiter');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate blog post
router.post('/generate', generateLimiter, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { topic, style } = req.body;
    const clerkId = req.auth.userId;

    const prompt = `Write a ${style} blog post about ${topic}. Make it engaging and informative.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const generatedContent = completion.choices[0].message.content;
    
    res.json({
      title: topic,
      content: generatedContent,
      style
    });
  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
});

// Save post
router.post('/save', apiLimiter, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { title, content, style } = req.body;
    const clerkId = req.auth.userId;

    // Find or create user
    let user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = new Post({
      title,
      content,
      style,
      author: user._id,
      clerkId,
      isPublic: false
    });

    await post.save();

    // Invalidate user's posts cache
    await redisClient.del(`user_posts:${clerkId}`);
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to save post' });
  }
});

// Get user's posts
router.get('/user', apiLimiter, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    // Try to get from cache first
    const cachedPosts = await redisClient.get(`user_posts:${clerkId}`);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'email');
    
    // Cache the results for 5 minutes
    await redisClient.setEx(`user_posts:${clerkId}`, 300, JSON.stringify(posts));
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by UUID (internal API access)
router.get('/:uuid', apiLimiter, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { uuid } = req.params;
    const clerkId = req.auth.userId;
    
    // Try to get from cache first
    const cachedPost = await redisClient.get(`post:${uuid}`);
    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findOne({ uuid }).populate('author', 'email');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If the post is not public and the user is not the owner, return 403
    if (!post.isPublic && post.clerkId !== clerkId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Cache the result for 1 hour
    await redisClient.setEx(`post:${uuid}`, 3600, JSON.stringify(post));
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get public post by publicId (public access)
router.get('/public/:publicId', apiLimiter, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Try to get from cache first
    const cachedPost = await redisClient.get(`public_post:${publicId}`);
    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findOne({ publicId, isPublic: true })
      .populate('author', 'email');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Cache the result for 1 hour
    await redisClient.setEx(`public_post:${publicId}`, 3600, JSON.stringify(post));
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching public post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update post's public status
router.patch('/:uuid/public', apiLimiter, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { uuid } = req.params;
    const { isPublic } = req.body;
    const clerkId = req.auth.userId;

    const post = await Post.findOne({ uuid });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns the post
    if (post.clerkId !== clerkId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    post.isPublic = isPublic;
    await post.save();

    // Invalidate both caches
    await redisClient.del(`post:${uuid}`);
    if (post.publicId) {
      await redisClient.del(`public_post:${post.publicId}`);
    }
    await redisClient.del(`user_posts:${clerkId}`);

    res.json(post);
  } catch (error) {
    console.error('Error updating post public status:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

module.exports = router; 