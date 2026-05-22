import ActivityLog from '../models/ActivityLog.js';
import logger from '../utils/logger.js';

class AdminService {

  async logActivity(req, action, details = {}) {
    try {
      const adminInfo =
        req.adminInfo ||
        req.session?.admin ||
        this.getAdminInfo(req.headers['x-admin-password']);
      
      if (!adminInfo) return;
      
      const log = new ActivityLog({
        adminRole: adminInfo.role,
        adminLabel: adminInfo.label,
        action,
        suggestionId: details.suggestionId || null,
        suggestionTitle: details.suggestionTitle || null,
        suggestionTrackingCode: details.suggestionTrackingCode || null,
        details: details.extra || {},
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent']
      });
      
      await log.save();
      logger.debug('Activity logged', { action, adminLabel: adminInfo.label });
    } catch (error) {
      logger.error('Error logging activity', { error: error.message });
    }
  }

  async getActivityLogs(filters, pagination) {
    try {
      const query = {};
      
      if (filters.adminRole && filters.adminRole !== 'all') {
        query.adminRole = filters.adminRole;
      }
      
      if (filters.action && filters.action !== 'all') {
        query.action = filters.action;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
      }
      
      if (filters.search) {
        query.$or = [
          { suggestionTrackingCode: { $regex: filters.search, $options: 'i' } },
          { suggestionTitle: { $regex: filters.search, $options: 'i' } },
          { adminLabel: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      const count = await ActivityLog.countDocuments(query);
      
      const logs = await ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .limit(pagination.limit)
        .skip((pagination.page - 1) * pagination.limit);
      
      return {
        logs,
        pagination: {
          total: count,
          page: pagination.page,
          pages: Math.ceil(count / pagination.limit),
          limit: pagination.limit
        }
      };
    } catch (error) {
      logger.error('Error fetching activity logs', { error: error.message });
      throw error;
    }
  }

  async getActivityLogStats() {
    try {
      const totalLogs = await ActivityLog.countDocuments();
      
      const byAdmin = await ActivityLog.aggregate([
        { $group: { _id: '$adminRole', count: { $sum: 1 }, label: { $first: '$adminLabel' } } },
        { $sort: { count: -1 } }
      ]);
      
      const byAction = await ActivityLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await ActivityLog.countDocuments({ createdAt: { $gte: today } });
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekCount = await ActivityLog.countDocuments({ createdAt: { $gte: weekAgo } });
      
      return {
        totalLogs,
        byAdmin,
        byAction,
        todayCount,
        weekCount
      };
    } catch (error) {
      logger.error('Error fetching activity log stats', { error: error.message });
      throw error;
    }
  }

  async getDeprecatedLogsCount() {
    try {
      const deprecatedRoles = ['president', 'vice_president', 'cote_governor', 'coed_governor', 'admin', 'executive_admin'];
      
      const count = await ActivityLog.countDocuments({
        adminRole: { $in: deprecatedRoles }
      });
      
      return { count, deprecatedRoles };
    } catch (error) {
      logger.error('Error counting deprecated logs', { error: error.message });
      throw error;
    }
  }

  async cleanupDeprecatedLogs() {
    try {
      const deprecatedRoles = ['president', 'vice_president', 'cote_governor', 'coed_governor', 'admin', 'executive_admin'];
      
      const result = await ActivityLog.deleteMany({
        adminRole: { $in: deprecatedRoles }
      });
      
      logger.info('Deprecated logs cleaned up', { deletedCount: result.deletedCount });
      
      return result.deletedCount;
    } catch (error) {
      logger.error('Error cleaning up deprecated logs', { error: error.message });
      throw error;
    }
  }
}

export default new AdminService();
