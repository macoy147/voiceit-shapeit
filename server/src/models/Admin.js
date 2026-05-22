import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['executive', 'press_secretary', 'network_secretary', 'developer']
  },
  label: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  color: {
    type: String,
    required: true,
    default: '#6366f1'
  },
  profilePicture: {
    type: String, // Base64 encoded image or Cloudinary URL
    default: null
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  saltRounds: {
    type: Number,
    default: 12
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(this.saltRounds || 12);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get public admin info (without password)
adminSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    role: this.role,
    label: this.label,
    color: this.color,
    profilePicture: this.profilePicture,
    bio: this.bio,
    phoneNumber: this.phoneNumber,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    passwordChangedAt: this.passwordChangedAt,
    createdAt: this.createdAt
  };
};

// Method to get hash info (for educational purposes)
adminSchema.methods.getHashInfo = function() {
  return {
    algorithm: 'bcrypt',
    saltRounds: this.saltRounds || 12,
    hashLength: this.password.length,
    passwordChangedAt: this.passwordChangedAt,
    // Only show first and last 10 chars of hash for security
    hashPreview: this.password.substring(0, 10) + '...' + this.password.substring(this.password.length - 10)
  };
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
