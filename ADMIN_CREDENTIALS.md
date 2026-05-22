# 🔐 Admin Login Credentials

## Default Admin Accounts

After running `npm run seed:admins`, the following admin accounts will be created:

| # | Username | Password | Role | Position |
|---|----------|----------|------|----------|
| 1 | `ssg2526pres` | `President2526!` | Executive | President |
| 2 | `ssg2526vp` | `VicePresident2526!` | Executive | Vice President |
| 3 | `ssg2526cote` | `CoTEGov2526!` | Executive | CoTE Governor |
| 4 | `ssg2526coed` | `CoEdGov2526!` | Executive | CoEd Governor |
| 5 | `ssg2526presssec` | `PressSec2526!` | Press Secretary | Press Secretary |
| 6 | `ssg2526netsec` | `NetSec2526!` | Network Secretary | Secretary on Networks |
| 7 | `ssg2526dev` | `Developer2526!` | Developer | Developer |
| 8 | `ssg2526mathrep` | `MathRep2526!` | Executive | BSED-Math Representative |
| 9 | `ssg2526smm` | `SocialMedia2526!` | Press Secretary | Social Media Manager |

---

## 🚀 Quick Start

### 1. Seed the Database
```bash
cd server
npm run seed:admins
```

### 2. Login to Admin Panel
1. Go to: `http://localhost:3000/admin` (or your deployed URL)
2. Enter username and password from the table above
3. Click "Login"

---

## 🔒 Security Notes

### ⚠️ IMPORTANT - Production Deployment

**DO NOT use these default passwords in production!**

After initial setup:
1. Login with default credentials
2. Change all passwords immediately
3. Use strong passwords (12+ characters, mixed case, numbers, symbols)
4. Store passwords securely (password manager)
5. Never commit passwords to version control

### Password Requirements
- Minimum length: 6 characters (increase for production)
- Recommended: 12+ characters with mixed case, numbers, and symbols
- Avoid common words or patterns
- Use unique passwords for each admin

---

## 👥 Role Permissions

### Executive
- Full access to all suggestions
- Can update status and priority
- Can view activity logs
- Can archive suggestions

### Press Secretary
- Full access to all suggestions
- Can update status and priority
- Can view activity logs
- Can archive suggestions

### Network Secretary
- Full access to all suggestions
- Can update status and priority
- Can view activity logs
- Can archive suggestions

### Developer
- **All permissions above, plus:**
- Can delete suggestions
- Can bulk delete suggestions
- Can clean up activity logs
- Can manage admin accounts (future feature)

---

## 🔄 Changing Passwords

### Option 1: Through Database (MongoDB Compass/Shell)
```javascript
// Connect to your MongoDB database
use your_database_name

// Update password for a specific admin
// Note: Password will be automatically hashed on save
db.admins.updateOne(
  { username: "ssg2526pres" },
  { $set: { password: "NewSecurePassword123!" } }
)
```

### Option 2: Through Seed Script (Resets All)
1. Edit `server/src/scripts/seedAdmins.js`
2. Update passwords in the `ADMIN_ACCOUNTS` array
3. Run: `npm run seed:admins`
4. **Warning:** This will reset ALL admin accounts

### Option 3: Programmatically (Developer)
```javascript
import authService from './services/authService.js';

// Update password for specific admin
await authService.updateAdmin(adminId, {
  password: 'NewSecurePassword123!'
});
```

---

## 🧪 Testing Credentials

### Test Login via cURL
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ssg2526dev",
    "password": "Developer2526!"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": "...",
    "username": "ssg2526dev",
    "role": "developer",
    "label": "Developer",
    "color": "#6366f1"
  }
}
```

---

## 📊 Account Status

### Check Active Accounts
```javascript
// In MongoDB shell
db.admins.find({ isActive: true }).count()
```

### View All Admins
```javascript
db.admins.find({}, { username: 1, label: 1, role: 1, isActive: 1, lastLogin: 1 })
```

### Deactivate Account
```javascript
db.admins.updateOne(
  { username: "ssg2526pres" },
  { $set: { isActive: false } }
)
```

---

## 🆘 Troubleshooting

### "Invalid username or password"
- Check username is lowercase
- Verify password matches exactly (case-sensitive)
- Ensure account is active: `isActive: true`
- Check if seed script was run successfully

### "Admin authentication required"
- Session may have expired (8-hour timeout)
- Clear browser cookies and login again
- Check if `SESSION_SECRET` is set in `.env`

### Cannot Login After Seeding
1. Check MongoDB connection
2. Verify admins collection exists
3. Check server logs for errors
4. Try rerunning seed script

### Forgot Password
1. Run seed script to reset: `npm run seed:admins`
2. Or manually update in database (see "Changing Passwords")

---

## 📝 Distribution Checklist

When distributing credentials to admins:

- [ ] Send credentials via secure channel (encrypted email, password manager)
- [ ] Instruct admins to change password on first login
- [ ] Provide login URL
- [ ] Include this documentation
- [ ] Set password expiration policy
- [ ] Enable two-factor authentication (future feature)

---

## 🔐 Best Practices

1. **Never share passwords** - Each admin should have their own account
2. **Use password managers** - Store credentials securely
3. **Regular password rotation** - Change passwords every 90 days
4. **Monitor login activity** - Check activity logs regularly
5. **Deactivate unused accounts** - Set `isActive: false` for inactive admins
6. **Audit access logs** - Review who accessed what and when
7. **Use HTTPS in production** - Ensure secure transmission
8. **Backup database regularly** - Protect against data loss

---

**Last Updated:** May 22, 2026  
**System Version:** 2.0.0  
**Security Level:** Enhanced with bcrypt hashing
