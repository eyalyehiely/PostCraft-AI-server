const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true,
    enum: ['casual', 'professional', 'creative', 'technical']
  },
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  publicId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate a public ID when post is made public
postSchema.pre('save', async function(next) {
  if (this.isPublic && !this.publicId) {
    // Generate a shorter, URL-friendly public ID
    this.publicId = Math.random().toString(36).substring(2, 8);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
