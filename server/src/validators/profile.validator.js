import { body, param } from 'express-validator';

// Validate profile update
export const updateProfileValidator = [
  body('label')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Label must be between 2 and 100 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]*$/)
    .withMessage('Invalid phone number format')
    .isLength({ max: 20 })
    .withMessage('Phone number must not exceed 20 characters'),
  
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid color format (must be hex color like #6366f1)')
];

// Validate profile picture update
export const updateProfilePictureValidator = [
  body('profilePicture')
    .notEmpty()
    .withMessage('Profile picture is required')
    .matches(/^data:image\/(jpeg|jpg|png|webp);base64,/)
    .withMessage('Invalid image format. Only JPEG, PNG, and WebP are allowed')
    .custom((value) => {
      // Check base64 size (approximate)
      const sizeInBytes = (value.length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      if (sizeInMB > 2) {
        throw new Error('Image size exceeds 2MB limit');
      }
      return true;
    })
];

// Validate password change
export const changePasswordValidator = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('New password must contain at least one special character'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// Validate hash generation
export const generateHashValidator = [
  body('plainText')
    .notEmpty()
    .withMessage('Text to hash is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Text must be between 1 and 200 characters'),
  
  body('saltRounds')
    .optional()
    .isInt({ min: 10, max: 15 })
    .withMessage('Salt rounds must be between 10 and 15')
];

// Validate password strength check
export const checkPasswordStrengthValidator = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Password must be between 1 and 200 characters')
];
