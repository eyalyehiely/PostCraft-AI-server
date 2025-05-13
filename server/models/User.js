// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  first_name: {
    type: String,
    required: false,
    trim: true
  },
  last_name: {
    type: String,
    required: false,
    trim: true
  },
  image_url: {
    type: String,
    default: null
  },
  
  isRegistrationComplete: {
    type: Boolean,
    default: false
  },
  
  
  lastSignInAt: {
    type: String,
    default: null
  },
  createdAt: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: String
  },
  isTrialUsed: {
    type: Boolean,
    default: false
  },
  trialAnalysisCount: {
    type: Number,
    default: 0
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, {
  timestamps: true
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
UserSchema.pre('save', function(next) {
  const now = new Date();
  
  // Format all date fields
  if (this.isNew) {
    this.createdAt = formatIsraelDateTime(now);
  }
  this.updatedAt = formatIsraelDateTime(now);
  
  if (this.paymentUpdatedAt) {
    this.paymentUpdatedAt = formatIsraelDateTime(new Date(this.paymentUpdatedAt));
  }
  
  if (this.lastCheckoutAttempt?.timestamp) {
    this.lastCheckoutAttempt.timestamp = formatIsraelDateTime(new Date(this.lastCheckoutAttempt.timestamp));
  }
  
  if (this.lastSignInAt) {
    this.lastSignInAt = formatIsraelDateTime(new Date(this.lastSignInAt));
  }
  
  if (this.resetPasswordExpires) {
    this.resetPasswordExpires = formatIsraelDateTime(new Date(this.resetPasswordExpires));
  }
  
  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  // Add safety check to prevent bcrypt errors
  if (!this.password) {
    console.log('No password hash stored for user');
    return false;
  }
  
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Fix: Check if model exists before creating it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;