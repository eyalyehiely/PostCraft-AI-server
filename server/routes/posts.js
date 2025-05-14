const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const Post = require('../models/Post');
const User = require('../models/User');
const { generateLimiter, apiLimiter } = require('../middleware/rateLimiter');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const redisHandler = require('../middleware/redisHandler');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate blog post
router.post('/generate', generateLimiter, ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { topic, style, wordLimit, pronounStyle } = req.body;
    const clerkId = req.auth.userId;

    if (!topic || !style) {
      return res.status(400).json({ error: 'Topic and style are required' });
    }

    let prompt = `Write a ${style} blog post about ${topic}.`;
    
    if (wordLimit) {
      prompt += ` don't exceed ${wordLimit} words!`;
    }
    
    if (pronounStyle) {
      switch (pronounStyle.toLowerCase()) {
        case 'first':
          prompt += ' Write in first person (using "I", "we").';
          break;
        case 'second':
          prompt += ' Write in second person (using "you").';
          break;
        case 'third':
          prompt += ' Write in third person (using "he", "she", "they").';
          break;
      }
    }

    prompt += ' Make it engaging and informative.';

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const generatedContent = completion.choices[0].message.content;
    
    res.json({
      title: topic,
      content: generatedContent,
      style,
      wordLimit,
      pronounStyle
    });
  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
});

// Save post
router.post('/save', 
  apiLimiter, 
  ClerkExpressRequireAuth(),
  redisHandler.deleteFromCache('user_posts'),
  async (req, res) => {
    try {
      const { title, content, style, wordLimit, pronounStyle } = req.body;
      const clerkId = req.auth.userId;

      let user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const post = new Post({
        title,
        content,
        wordLimit,
        pronounStyle,
        style,
        author: user._id,
        clerkId,
        isPublic: false
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error('Error saving post:', error);
      res.status(500).json({ error: 'Failed to save post' });
    }
});

// Get user's posts
router.get('/user', 
  apiLimiter, 
  ClerkExpressRequireAuth(),
  redisHandler.getFromCache('user_posts'),
  async (req, res) => {
    try {
      const clerkId = req.auth.userId;
      const user = await User.findOne({ clerkId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const posts = await Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .populate('author', 'email');
      
      res.json(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
},
redisHandler.setToCache('user_posts', 300)
);

// Get single post by UUID
router.get('/:uuid', 
  apiLimiter, 
  ClerkExpressRequireAuth(),
  redisHandler.getFromCache('post'),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      const clerkId = req.auth.userId;

      const post = await Post.findOne({ uuid }).populate('author', 'email');
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (!post.isPublic && post.clerkId !== clerkId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
},
redisHandler.setToCache('post', 3600)
);

// Get public post by publicId
router.get('/public/:publicId', 
  apiLimiter, 
  redisHandler.getFromCache('public_post'),
  async (req, res) => {
    try {
      const { publicId } = req.params;
      const post = await Post.findOne({ publicId, isPublic: true })
        .populate('author', 'email first_name last_name');
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching public post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
},
redisHandler.setToCache('public_post', 3600)
);

// Update post
router.put('/:uuid', 
  apiLimiter, 
  ClerkExpressRequireAuth(),
  redisHandler.deleteMultipleFromCache(['post', 'user_posts', 'public_post']),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      const { title, content, style, isPublic } = req.body;
      const clerkId = req.auth.userId;

      const post = await Post.findOne({ uuid });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.clerkId !== clerkId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Update post fields
      post.title = title || post.title;
      post.content = content || post.content;
      post.style = style || post.style;
      post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;
      post.updatedAt = new Date();

      await post.save();
      res.json(post);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete post
router.delete('/:uuid', 
  apiLimiter, 
  ClerkExpressRequireAuth(),
  redisHandler.deleteFromCache(req => `user_posts:${req.auth.userId}`),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      const clerkId = req.auth.userId;

      const post = await Post.findOne({ uuid });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.clerkId !== clerkId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await post.deleteOne();
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router; 