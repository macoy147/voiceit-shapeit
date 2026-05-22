import { body, query } from 'express-validator';

// Validator for admin login (username + password)
export const adminLoginValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Legacy validator for backward compatibility (deprecated)
export const adminVerifyValidator = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validator for activity log queries
export const activityLogQueryValidator = [
  query('adminRole')
    .optional()
    .isIn(['all', 'executive', 'press_secretary', 'network_secretary', 'developer'])
    .withMessage('Invalid admin role'),
  query('action')
    .optional()
    .isString()
    .withMessage('Action must be a string'),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateFrom'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateTo'),
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];
