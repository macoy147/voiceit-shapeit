import mongoose from 'mongoose';

const passwordHistorySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
passwordHistorySchema.index({ adminId: 1, changedAt: -1 });

// Auto-cleanup: Keep only last 3 passwords per admin
passwordHistorySchema.statics.addPasswordHistory = async function(adminId, passwordHash) {
  // Add new password to history
  await this.create({ adminId, passwordHash });
  
  // Get all passwords for this admin, sorted by date (newest first)
  const allPasswords = await this.find({ adminId }).sort({ changedAt: -1 });
  
  // If more than 3, delete the oldest ones
  if (allPasswords.length > 3) {
    const toDelete = allPasswords.slice(3).map(p => p._id);
    await this.deleteMany({ _id: { $in: toDelete } });
  }
};

// Check if password was used recently
passwordHistorySchema.statics.isPasswordReused = async function(adminId, newPasswordHash) {
  const bcrypt = await import('bcryptjs');
  
  // Get last 3 passwords
  const recentPasswords = await this.find({ adminId })
    .sort({ changedAt: -1 })
    .limit(3);
  
  // Check if new password matches any recent password
  for (const record of recentPasswords) {
    const isMatch = await bcrypt.default.compare(newPasswordHash, record.passwordHash);
    if (isMatch) {
      return true;
    }
  }
  
  return false;
};

const PasswordHistory = mongoose.model('PasswordHistory', passwordHistorySchema);

export default PasswordHistory;
