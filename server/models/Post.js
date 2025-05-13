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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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


// Helper function to format date and time in Israeli timezone
const formatIsraelDateTime = (date) => {
  if (!date) return null;
  
  // Ensure we have a valid Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return null;
  
  // Format date as DD/MM/YYYY
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Jerusalem'
  });
  
  // Format time as HH:MM:SS
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  
  return `${formattedDate} ${formattedTime}`;
};

// Pre-save middleware to format dates
postSchema.pre('save', function(next) {
  const now = new Date();
  
  // Format all date fields
  if (this.isNew) {
    this.createdAt = formatIsraelDateTime(now);
  }
  this.updatedAt = formatIsraelDateTime(now);
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
