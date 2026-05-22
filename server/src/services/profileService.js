import Admin from '../models/Admin.js';
import PasswordHistory from '../models/PasswordHistory.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

class ProfileService {
  /**
   * Get admin profile
   */
  async getProfile(adminId) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return null;
      }
      
      return admin.toPublicJSON();
    } catch (error) {
      logger.error('Error fetching profile', { error: error.message });
      throw error;
    }
  }

  /**
   * Update admin profile (label, bio, phone)
   */
  async updateProfile(adminId, updateData) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return null;
      }

      // Update allowed fields
      if (updateData.label) {
        admin.label = updateData.label.trim();
      }
      if (updateData.bio !== undefined) {
        admin.bio = updateData.bio.trim();
      }
      if (updateData.phoneNumber !== undefined) {
        admin.phoneNumber = updateData.phoneNumber.trim();
      }
      if (updateData.color) {
        admin.color = updateData.color;
      }

      await admin.save();
      
      logger.info('Profile updated', { 
        adminId, 
        username: admin.username 
      });
      
      return admin.toPublicJSON();
    } catch (error) {
      logger.error('Error updating profile', { error: error.message });
      throw error;
    }
  }

  /**
   * Update profile picture
   */
  async updateProfilePicture(adminId, base64Image) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return null;
      }

      // Validate base64 image
      if (!base64Image.startsWith('data:image/')) {
        throw new Error('Invalid image format');
      }

      // Check size (max 2MB for base64)
      const sizeInBytes = (base64Image.length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      if (sizeInMB > 2) {
        throw new Error('Image size exceeds 2MB limit');
      }

      admin.profilePicture = base64Image;
      await admin.save();
      
      logger.info('Profile picture updated', { 
        adminId, 
        username: admin.username 
      });
      
      return admin.toPublicJSON();
    } catch (error) {
      logger.error('Error updating profile picture', { error: error.message });
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(adminId, oldPassword, newPassword) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }

      // Verify old password
      const isOldPasswordValid = await admin.comparePassword(oldPassword);
      
      if (!isOldPasswordValid) {
        logger.warn('Password change failed - incorrect old password', { 
          adminId, 
          username: admin.username 
        });
        return { success: false, message: 'Current password is incorrect' };
      }

      // Check password strength
      const strengthCheck = this.validatePasswordStrength(newPassword);
      if (!strengthCheck.valid) {
        return { success: false, message: strengthCheck.message };
      }

      // Check if password was used recently
      const isReused = await PasswordHistory.isPasswordReused(adminId, newPassword);
      if (isReused) {
        return { 
          success: false, 
          message: 'Cannot reuse any of your last 3 passwords' 
        };
      }

      // Save old password to history before changing
      await PasswordHistory.addPasswordHistory(adminId, admin.password);

      // Update password (will be hashed by pre-save hook)
      admin.password = newPassword;
      await admin.save();
      
      logger.info('Password changed successfully', { 
        adminId, 
        username: admin.username 
      });
      
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Error changing password', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    if (password.length < 8) {
      return { 
        valid: false, 
        message: 'Password must be at least 8 characters long' 
      };
    }

    if (!/[a-z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one lowercase letter' 
      };
    }

    if (!/[A-Z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one uppercase letter' 
      };
    }

    if (!/[0-9]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one number' 
      };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one special character' 
      };
    }

    // Check for common passwords
    const commonPasswords = [
      'password', 'password123', '12345678', 'qwerty123', 
      'admin123', 'welcome123', 'letmein123'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      return { 
        valid: false, 
        message: 'Password is too common. Please choose a stronger password' 
      };
    }

    return { valid: true };
  }

  /**
   * Get password hash info (for educational purposes)
   */
  async getHashInfo(adminId) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return null;
      }

      return {
        username: admin.username,
        hashInfo: admin.getHashInfo(),
        fullHash: admin.password, // Full hash for educational viewing
        securityNote: 'This hash is displayed for educational purposes. In production, never expose password hashes.'
      };
    } catch (error) {
      logger.error('Error fetching hash info', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate hash preview for any text (educational tool)
   */
  async generateHashPreview(plainText, saltRounds = 12) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(plainText, salt);
      
      return {
        plainText: plainText,
        hash: hash,
        algorithm: 'bcrypt',
        saltRounds: saltRounds,
        hashLength: hash.length,
        generatedAt: new Date(),
        note: 'This is a demonstration hash. Each time you hash the same text, you get a different result due to the random salt.'
      };
    } catch (error) {
      logger.error('Error generating hash preview', { error: error.message });
      throw error;
    }
  }

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    // Length
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    if (password.length < 8) {
      feedback.push('Use at least 8 characters');
    }

    // Character variety
    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add uppercase letters');
    }

    if (/[0-9]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add numbers');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add special characters');
    }

    // Determine strength level
    let strength = 'weak';
    if (score >= 80) strength = 'strong';
    else if (score >= 60) strength = 'medium';

    return {
      score,
      strength,
      feedback: feedback.length > 0 ? feedback : ['Password is strong!']
    };
  }
}

export default new ProfileService();
