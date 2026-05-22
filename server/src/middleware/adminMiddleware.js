import logger from '../utils/logger.js';

export const verifyAdminAuth = (req, res, next) => {
  // Check session-based auth
  if (req.session?.admin) {
    req.adminInfo = req.session.admin;
    return next();
  }

  logger.warn('Admin authentication failed: No valid session');
  return res.status(401).json({
    success: false,
    message: 'Admin authentication required. Please login.'
  });
};

export const requireDeveloperRole = (req, res, next) => {
  if (req.adminInfo.role !== 'developer') {
    logger.warn('Access denied: Developer role required', { 
      adminLabel: req.adminInfo.label,
      adminRole: req.adminInfo.role 
    });
    return res.status(403).json({
      success: false,
      message: 'Only developers can access this resource'
    });
  }
  next();
};
