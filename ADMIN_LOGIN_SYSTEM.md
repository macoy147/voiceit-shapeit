# Admin Login System - Implementation Guide

## 🔐 Overview

The InnoVoice system has been upgraded with a proper username/password authentication system for admins. Admin credentials are now securely stored in MongoDB with bcrypt password hashing.

---

## 🆕 What Changed?

### Before (Old System)
- ❌ Single password for all admins
- ❌ Password stored in environment variables
- ❌ No individual admin accounts
- ❌ Password-based authentication only

### After (New System)
- ✅ Individual admin accounts with usernames
- ✅ Passwords securely hashed with bcrypt
- ✅ Stored in MongoDB `admins` collection
- ✅ Username + password authentication
- ✅ Session-based authentication
- ✅ Last login tracking
- ✅ Account activation/deactivation

---

## 📦 New Components

### 1. **Admin Model** (`server/src/models/Admin.js`)
MongoDB schema for admin accounts with:
- Username (unique, lowercase)
- Password (bcrypt hashed)
- Role (executive, press_secretary, network_secretary, developer)
- Label (display name)
- Color (for UI)
- Active status
- Last login timestamp

### 2. **Auth Service** (`server/src/services/authService.js`)
Handles:
- Login authentication
- Online admin tracking
- Admin CRUD operations
- Session management

### 3. **Seed Script** (`server/src/scripts/seedAdmins.js`)
Creates initial admin accounts in database

### 4. **Updated Middleware** (`server/src/middleware/adminMiddleware.js`)
- `verifyAdminAuth` - Session-based authentication
- `requireDeveloperRole` - Developer-only access control

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install the new `bcryptjs` dependency for password hashing.

### Step 2: Seed Admin Accounts

Run the seed script to create initial admin accounts:

```bash
npm run seed:admins
```

This will:
1. Connect to your MongoDB database
2. Clear existing admin accounts (if any)
3. Create 9 admin accounts with default credentials
4. Display the credentials in the console

**Output Example:**
```
📋 ADMIN CREDENTIALS:
═══════════════════════════════════════════════════════════
Username: ssg2526pres      | Password: President2526!      | Role: President
Username: ssg2526vp        | Password: VicePresident2526!  | Role: Vice President
Username: ssg2526cote      | Password: CoTEGov2526!        | Role: CoTE Governor
Username: ssg2526coed      | Password: CoEdGov2526!        | Role: CoEd Governor
Username: ssg2526presssec  | Password: PressSec2526!       | Role: Press Secretary
Username: ssg2526netsec    | Password: NetSec2526!         | Role: Secretary on Networks
Username: ssg2526dev       | Password: Developer2526!      | Role: Developer
Username: ssg2526mathrep   | Password: MathRep2526!        | Role: BSED-Math Representative
Username: ssg2526smm       | Password: SocialMedia2526!    | Role: Social Media Manager
═══════════════════════════════════════════════════════════

⚠️  IMPORTANT: Change these passwords in production!
```

### Step 3: Update Frontend Login Component

The frontend needs to be updated to send username and password instead of just password.

**Old API Call:**
```javascript
POST /api/admin/verify
{
  "password": "ssg2526pres"
}
```

**New API Call:**
```javascript
POST /api/admin/login
{
  "username": "ssg2526pres",
  "password": "President2526!"
}
```

---

## 👥 Default Admin Accounts

| Username | Password | Role | Label |
|----------|----------|------|-------|
| `ssg2526pres` | `President2526!` | executive | President |
| `ssg2526vp` | `VicePresident2526!` | executive | Vice President |
| `ssg2526cote` | `CoTEGov2526!` | executive | CoTE Governor |
| `ssg2526coed` | `CoEdGov2526!` | executive | CoEd Governor |
| `ssg2526presssec` | `PressSec2526!` | press_secretary | Press Secretary |
| `ssg2526netsec` | `NetSec2526!` | network_secretary | Secretary on Networks |
| `ssg2526dev` | `Developer2526!` | developer | Developer |
| `ssg2526mathrep` | `MathRep2526!` | executive | BSED-Math Representative |
| `ssg2526smm` | `SocialMedia2526!` | press_secretary | Social Media Manager |

**⚠️ SECURITY WARNING:** Change these default passwords immediately in production!

---

## 🔌 API Endpoints

### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "ssg2526pres",
  "password": "President2526!"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": "...",
    "username": "ssg2526pres",
    "role": "executive",
    "label": "President",
    "color": "#8b5cf6"
  }
}
```

### Get Current Admin
```http
GET /api/admin/me

Response:
{
  "success": true,
  "admin": {
    "username": "ssg2526pres",
    "role": "executive",
    "label": "President",
    "color": "#8b5cf6"
  }
}
```

### Logout
```http
POST /api/admin/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔒 Security Features

### Password Hashing
- Passwords are hashed using bcrypt with salt rounds of 10
- Original passwords are never stored in the database
- Passwords are hashed automatically before saving

### Session Management
- Session-based authentication using express-session
- Sessions stored in MongoDB
- 8-hour session timeout
- Secure cookies in production (HTTPS only)
- CSRF protection via SameSite cookies

### Account Security
- Minimum password length: 6 characters
- Username validation (3-50 characters)
- Account activation/deactivation
- Last login tracking
- Failed login attempt logging

---

## 🛠️ Admin Management (Developer Only)

Developers can manage admin accounts through the auth service:

### Create New Admin
```javascript
import authService from './services/authService.js';

const newAdmin = await authService.createAdmin({
  username: 'newadmin',
  password: 'SecurePassword123!',
  role: 'executive',
  label: 'New Admin',
  color: '#ff6b6b',
  createdBy: 'developer_username'
});
```

### Update Admin
```javascript
await authService.updateAdmin(adminId, {
  label: 'Updated Label',
  color: '#00ff00',
  isActive: true
});
```

### Change Password
```javascript
await authService.updateAdmin(adminId, {
  password: 'NewSecurePassword123!'
});
```

### Deactivate Admin
```javascript
await authService.updateAdmin(adminId, {
  isActive: false
});
```

### Delete Admin
```javascript
await authService.deleteAdmin(adminId);
```

---

## 📊 Database Schema

### Admins Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  password: String (bcrypt hashed),
  role: String (enum),
  label: String,
  color: String,
  isActive: Boolean,
  lastLogin: Date,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Migration from Old System

### For Existing Deployments

1. **Backup your database** before running migrations
2. Run the seed script: `npm run seed:admins`
3. Update frontend to use new login endpoint
4. Test login with new credentials
5. Remove old `ADMIN_PASSWORD` from environment variables
6. Update deployment documentation

### Backward Compatibility

The old `/api/admin/verify` endpoint now returns:
```json
{
  "success": false,
  "message": "This endpoint is deprecated. Please use /api/admin/login with username and password.",
  "deprecated": true
}
```

---

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ssg2526dev","password":"Developer2526!"}'
```

### Test Session
```bash
# Login first to get session cookie
curl -X GET http://localhost:5000/api/admin/me \
  -H "Cookie: innovoice.sid=<session-cookie>"
```

---

## 📝 Frontend Update Checklist

- [ ] Update login form to include username field
- [ ] Change API endpoint from `/verify` to `/login`
- [ ] Update request body to include both username and password
- [ ] Update error messages for invalid credentials
- [ ] Test login flow with new credentials
- [ ] Update admin documentation
- [ ] Inform admins of new login credentials

---

## 🚨 Important Notes

1. **Change Default Passwords**: The seed script creates accounts with default passwords. Change them immediately in production!

2. **Session Security**: Ensure `SESSION_SECRET` is set to a strong random string in production.

3. **HTTPS Required**: In production, sessions require HTTPS for secure cookies.

4. **Database Backup**: Always backup your database before running the seed script.

5. **Password Policy**: Consider implementing stronger password requirements for production.

---

## 🆘 Troubleshooting

### "Cannot find module 'bcryptjs'"
```bash
cd server
npm install bcryptjs
```

### "Admin not found" error
Run the seed script:
```bash
npm run seed:admins
```

### Session not persisting
Check:
- MongoDB connection is working
- `SESSION_SECRET` is set in `.env`
- Cookies are enabled in browser
- HTTPS is enabled in production

### Password not working
- Ensure you're using the correct username (lowercase)
- Check if account is active
- Verify password matches the seeded credentials
- Check server logs for authentication errors

---

## 📞 Support

For issues or questions:
1. Check server logs: `server/logs/combined.log`
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Review this documentation

---

**Last Updated:** May 22, 2026
**Version:** 2.0.0
