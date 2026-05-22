import express from 'express';
import profileService from '../services/profileService.js';
import { verifyAdminAuth } from '../middleware/adminMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import {
  updateProfileValidator,
  updateProfilePictureValidator,
  changePasswordValidator,
  generateHashValidator,
  checkPasswordStrengthValidator
} from '../validators/profile.validator.js';
import adminService from '../services/adminService.js';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

const router = express.Router();

// Rate limiters
const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { 
    success: false, 
    message: 'Too many password change attempts. Please try again after 1 hour.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const hashGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { 
    success: false, 
    message: 'Too many hash generation requests. Please try again after 1 hour.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/profile - Get current admin profile
router.get('/', verifyAdminAuth, async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.adminInfo.id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Error in get profile endpoint', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// PUT /api/profile - Update profile (label, bio, phone, color)
router.put(
  '/',
  verifyAdminAuth,
  updateProfileValidator,
  handleValidationErrors,
  async (req, res) => {
    try {
      const updateData = {
        label: req.body.label,
        bio: req.body.bio,
        phoneNumber: req.body.phoneNumber,
        color: req.body.color
      };

      const updatedProfile = await profileService.updateProfile(
        req.adminInfo.id,
        updateData
      );

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Log activity
      await adminService.logActivity(req, 'update_profile', {
        extra: { updatedFields: Object.keys(updateData).filter(k => updateData[k] !== undefined) }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      logger.error('Error in update profile endpoint', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }
);

// PUT /api/profile/picture - Update profile picture
router.put(
  '/picture',
  verifyAdminAuth,
  updateProfilePictureValidator,
  handleValidationErrors,
  async (req, res) => {
    try {
      const updatedProfile = await profileService.updateProfilePicture(
        req.adminInfo.id,
        req.body.profilePicture
      );

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Log activity
      await adminService.logActivity(req, 'update_profile_picture', {});

      res.json({
        success: true,
        message: 'Profile picture updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      logger.error('Error in update profile picture endpoint', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile picture'
      });
    }
  }
);

// PUT /api/profile/password - Change password
router.put(
  '/password',
  verifyAdminAuth,
  passwordChangeLimiter,
  changePasswordValidator,
  handleValidationErrors,
  async (req, res) => {
    try {
      const result = await profileService.changePassword(
        req.adminInfo.id,
        req.body.oldPassword,
        req.body.newPassword
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }

      // Log activity
      await adminService.logActivity(req, 'change_password', {});

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error in change password endpoint', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }
);

// GET /api/profile/hash-info - Get password hash info (educational)
router.get('/hash-info', verifyAdminAuth, async (req, res) => {
  try {
    const hashInfo = await profileService.getHashInfo(req.adminInfo.id);
    
    if (!hashInfo) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Log activity
    await adminService.logActivity(req, 'view_hash_info', {});

    res.json({
      success: true,
      data: hashInfo
    });
  } catch (error) {
    logger.error('Error in get hash info endpoint', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hash info'
    });
  }
});

// POST /api/profile/generate-hash - Generate hash preview (educational)
router.post(
  '/generate-hash',
  verifyAdminAuth,
  hashGenerationLimiter,
  generateHashValidator,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { plainText, saltRounds } = req.body;
      
      const hashPreview = await profileService.generateHashPreview(
        plainText,
        saltRounds || 12
      );

      // Log activity
      await adminService.logActivity(req, 'generate_hash_preview', {
        extra: { saltRounds: saltRounds || 12 }
      });

      res.json({
        success: true,
        data: hashPreview
      });
    } catch (error) {
      logger.error('Error in generate hash endpoint', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to generate hash'
      });
    }
  }
);

// POST /api/profile/check-password-strength - Check password strength
router.post(
  '/check-password-strength',
  verifyAdminAuth,
  checkPasswordStrengthValidator,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { password } = req.body;
      
      const strengthInfo = profileService.calculatePasswordStrength(password);

      res.json({
        success: true,
        data: strengthInfo
      });
    } catch (error) {
      logger.error('Error in check password strength endpoint', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to check password strength'
      });
    }
  }
);

// DELETE /api/profile/picture - Remove profile picture
router.delete('/picture', verifyAdminAuth, async (req, res) => {
  try {
    const updatedProfile = await profileService.updateProfilePicture(
      req.adminInfo.id,
      null
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Log activity
    await adminService.logActivity(req, 'remove_profile_picture', {});

    res.json({
      success: true,
      message: 'Profile picture removed successfully',
      data: updatedProfile
    });
  } catch (error) {
    logger.error('Error in remove profile picture endpoint', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to remove profile picture'
    });
  }
});

export default router;
