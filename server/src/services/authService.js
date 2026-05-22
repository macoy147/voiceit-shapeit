import Admin from '../models/Admin.js';
import logger from '../utils/logger.js';

// Track online admins (in-memory store)
const onlineAdmins = new Map();

class AuthService {
  /**
   * Authenticate admin with username and password
   */
  async login(username, password) {
    try {
      // Find admin by username
      const admin = await Admin.findOne({ username: username.toLowerCase() });
      
      if (!admin) {
        logger.warn('Login attempt with non-existent username', { username });
        return null;
      }

      // Check if admin is active
      if (!admin.isActive) {
        logger.warn('Login attempt with inactive account', { username });
        return null;
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        logger.warn('Login attempt with invalid password', { username });
        return null;
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      logger.info('Admin login successful', { 
        username: admin.username, 
        label: admin.label, 
        role: admin.role 
      });

      return admin.toPublicJSON();
    } catch (error) {
      logger.error('Error during login', { error: error.message });
      throw error;
    }
  }

  /**
   * Get admin by ID
   */
  async getAdminById(adminId) {
    try {
      const admin = await Admin.findById(adminId);
      return admin ? admin.toPublicJSON() : null;
    } catch (error) {
      logger.error('Error fetching admin by ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Set admin as online
   */
  setAdminOnline(adminInfo) {
    // Use username as key (stable identifier) instead of label
    onlineAdmins.set(adminInfo.username, {
      ...adminInfo,
      lastSeen: new Date(),
      loginTime: new Date()
    });
  }

  /**
   * Set admin as offline
   */
  setAdminOffline(username) {
    onlineAdmins.delete(username);
  }

  /**
   * Update admin heartbeat
   */
  async updateHeartbeat(username, adminInfo) {
    try {
      // Fetch fresh admin data from database to ensure we have latest profile info
      const admin = await Admin.findOne({ username: username.toLowerCase() });
      
      if (admin) {
        const freshAdminInfo = admin.toPublicJSON();
        
        if (onlineAdmins.has(username)) {
          const existing = onlineAdmins.get(username);
          onlineAdmins.set(username, {
            ...freshAdminInfo,
            lastSeen: new Date(),
            loginTime: existing.loginTime // Preserve original login time
          });
        } else {
          onlineAdmins.set(username, {
            ...freshAdminInfo,
            lastSeen: new Date(),
            loginTime: new Date()
          });
        }
      }
    } catch (error) {
      logger.error('Error updating heartbeat', { error: error.message });
      // Fallback to old behavior if database fetch fails
      if (onlineAdmins.has(username)) {
        const existing = onlineAdmins.get(username);
        onlineAdmins.set(username, {
          ...existing,
          lastSeen: new Date()
        });
      } else {
        onlineAdmins.set(username, {
          ...adminInfo,
          lastSeen: new Date(),
          loginTime: new Date()
        });
      }
    }
  }

  /**
   * Get list of online admins
   */
  getOnlineAdmins() {
    const now = new Date();
    const onlineTimeout = 35 * 1000; // 35 seconds
    
    const onlineList = [];
    
    onlineAdmins.forEach((admin, username) => {
      const timeSinceLastSeen = now - new Date(admin.lastSeen);
      if (timeSinceLastSeen < onlineTimeout) {
        onlineList.push(admin);
      } else {
        // Remove stale entries
        onlineAdmins.delete(username);
      }
    });
    
    return onlineList;
  }

  /**
   * Get all admins (for management purposes)
   */
  async getAllAdmins() {
    try {
      const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
      return admins.map(admin => admin.toPublicJSON());
    } catch (error) {
      logger.error('Error fetching all admins', { error: error.message });
      throw error;
    }
  }

  /**
   * Create new admin (developer only)
   */
  async createAdmin(adminData) {
    try {
      const admin = new Admin(adminData);
      await admin.save();
      
      logger.info('New admin created', { 
        username: admin.username, 
        label: admin.label 
      });
      
      return admin.toPublicJSON();
    } catch (error) {
      logger.error('Error creating admin', { error: error.message });
      throw error;
    }
  }

  /**
   * Update admin (developer only)
   */
  async updateAdmin(adminId, updateData) {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return null;
      }

      // Update allowed fields
      if (updateData.label) admin.label = updateData.label;
      if (updateData.color) admin.color = updateData.color;
      if (updateData.role) admin.role = updateData.role;
      if (typeof updateData.isActive === 'boolean') admin.isActive = updateData.isActive;
      
      // Update password if provided
      if (updateData.password) {
        admin.password = updateData.password;
      }

      await admin.save();
      
      logger.info('Admin updated', { 
        username: admin.username, 
        label: admin.label 
      });
      
      return admin.toPublicJSON();
    } catch (error) {
      logger.error('Error updating admin', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete admin (developer only)
   */
  async deleteAdmin(adminId) {
    try {
      const admin = await Admin.findByIdAndDelete(adminId);
      
      if (admin) {
        logger.info('Admin deleted', { 
          username: admin.username, 
          label: admin.label 
        });
      }
      
      return admin ? admin.toPublicJSON() : null;
    } catch (error) {
      logger.error('Error deleting admin', { error: error.message });
      throw error;
    }
  }
}

export default new AuthService();
