# 🔄 Migration Guide: Old Password System → New Login System

## Overview

This guide helps you migrate from the old single-password system to the new username/password authentication system.

---

## 📋 Pre-Migration Checklist

- [ ] Backup your MongoDB database
- [ ] Note current admin access patterns
- [ ] Prepare to update frontend code
- [ ] Schedule maintenance window (minimal downtime)
- [ ] Inform admins of upcoming changes
- [ ] Test in development environment first

---

## 🔧 Backend Migration Steps

### Step 1: Update Dependencies

```bash
cd server
npm install bcryptjs
```

### Step 2: Run Database Seed

```bash
npm run seed:admins
```

**What this does:**
- Creates `admins` collection in MongoDB
- Generates 9 admin accounts with hashed passwords
- Displays credentials in console (save these!)

**Output:**
```
✓ Created admin: ssg2526pres (President)
✓ Created admin: ssg2526vp (Vice President)
...
✅ Successfully seeded 9 admin accounts!

📋 ADMIN CREDENTIALS:
═══════════════════════════════════════════════════════════
Username: ssg2526pres      | Password: President2526!      | Role: President
...
```

### Step 3: Update Environment Variables

**Remove (no longer needed):**
```env
ADMIN_PASSWORD=your_secure_admin_password
```

**Keep these:**
```env
SESSION_SECRET=your_session_secret
SESSION_NAME=innovoice.sid
MONGODB_URI=your_mongodb_uri
```

### Step 4: Restart Server

```bash
npm run dev
```

---

## 💻 Frontend Migration Steps

### Step 1: Update Login Component

**Old Code (Password Only):**
```javascript
// AdminPanel.jsx or Login component
const handleLogin = async () => {
  const response = await fetch(`${API_URL}/api/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: passwordInput })
  });
  
  if (response.ok) {
    // Login successful
  }
};
```

**New Code (Username + Password):**
```javascript
// AdminPanel.jsx or Login component
const handleLogin = async () => {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for session cookies
    body: JSON.stringify({ 
      username: usernameInput,
      password: passwordInput 
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    // data.admin contains: { id, username, role, label, color }
  }
};
```

### Step 2: Update Login Form UI

**Add Username Field:**
```jsx
<div className="login-form">
  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    autoComplete="username"
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="current-password"
  />
  <button onClick={handleLogin}>Login</button>
</div>
```

### Step 3: Update API Calls

**Ensure all admin API calls include credentials:**
```javascript
fetch(`${API_URL}/api/admin/suggestions`, {
  credentials: 'include', // This sends session cookie
  headers: { 'Content-Type': 'application/json' }
})
```

### Step 4: Update Error Messages

```javascript
if (response.status === 401) {
  setError('Invalid username or password');
} else if (response.status === 410) {
  setError('Please update to the new login system');
}
```

---

## 🧪 Testing Migration

### Test 1: Backend Seed Script
```bash
cd server
npm run seed:admins
```
**Expected:** 9 admin accounts created, credentials displayed

### Test 2: Login API
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ssg2526dev","password":"Developer2526!"}'
```
**Expected:** `{"success": true, "admin": {...}}`

### Test 3: Session Persistence
```bash
# Login first, save cookie
curl -c cookies.txt -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ssg2526dev","password":"Developer2526!"}'

# Test session
curl -b cookies.txt http://localhost:5000/api/admin/me
```
**Expected:** Admin info returned without re-authentication

### Test 4: Frontend Login
1. Open admin panel: `http://localhost:3000/admin`
2. Enter username: `ssg2526dev`
3. Enter password: `Developer2526!`
4. Click Login
**Expected:** Successful login, dashboard loads

### Test 5: Old Endpoint (Should Fail)
```bash
curl -X POST http://localhost:5000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"password":"ssg2526pres"}'
```
**Expected:** `{"success": false, "deprecated": true}`

---

## 📊 Database Changes

### New Collection: `admins`

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  username: "ssg2526pres",
  password: "$2a$10$...", // bcrypt hashed
  role: "executive",
  label: "President",
  color: "#8b5cf6",
  isActive: true,
  lastLogin: ISODate("2026-05-22T..."),
  createdBy: "seed_script",
  createdAt: ISODate("2026-05-22T..."),
  updatedAt: ISODate("2026-05-22T...")
}
```

### Verify Collection Created
```javascript
// MongoDB shell
use your_database_name
db.admins.find().pretty()
```

---

## 🔄 Rollback Plan (If Needed)

### If Migration Fails:

1. **Restore Database Backup**
```bash
mongorestore --uri="your_mongodb_uri" --drop /path/to/backup
```

2. **Revert Code Changes**
```bash
git checkout HEAD~1 server/src/
```

3. **Restore Old Environment Variables**
```env
ADMIN_PASSWORD=your_old_password
```

4. **Restart Server**
```bash
npm run dev
```

---

## 📝 Post-Migration Tasks

### Immediate (Day 1)
- [ ] Verify all admins can login
- [ ] Test all admin panel features
- [ ] Monitor server logs for errors
- [ ] Check session persistence
- [ ] Verify real-time notifications still work

### Short-term (Week 1)
- [ ] Distribute credentials to all admins securely
- [ ] Instruct admins to change default passwords
- [ ] Update deployment documentation
- [ ] Update admin training materials
- [ ] Archive old password system documentation

### Long-term (Month 1)
- [ ] Implement password change feature in UI
- [ ] Add password strength requirements
- [ ] Enable password expiration policy
- [ ] Add two-factor authentication (optional)
- [ ] Audit admin access patterns

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
cd server
npm install bcryptjs
```

### Issue 2: Seed script fails with connection error
**Solution:**
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is running
- Check network connectivity
- Verify database credentials

### Issue 3: Login returns 401 even with correct credentials
**Solution:**
- Verify seed script ran successfully
- Check if account is active: `db.admins.findOne({username: "..."})`
- Check server logs for detailed error
- Verify password is correct (case-sensitive)

### Issue 4: Session not persisting
**Solution:**
- Ensure `SESSION_SECRET` is set in `.env`
- Check `credentials: 'include'` in fetch calls
- Verify cookies are enabled in browser
- Check CORS settings allow credentials

### Issue 5: Old password still works
**Solution:**
- This shouldn't happen - old endpoint is deprecated
- Check you're using `/api/admin/login` not `/api/admin/verify`
- Clear browser cache and cookies
- Restart server

---

## 📞 Support During Migration

### Before Migration
- Review this guide completely
- Test in development environment
- Prepare rollback plan
- Schedule maintenance window

### During Migration
- Monitor server logs: `tail -f server/logs/combined.log`
- Keep database backup accessible
- Have rollback commands ready
- Test each step before proceeding

### After Migration
- Verify all functionality works
- Collect admin feedback
- Document any issues encountered
- Update this guide with lessons learned

---

## ✅ Migration Completion Checklist

### Backend
- [ ] bcryptjs installed
- [ ] Seed script executed successfully
- [ ] 9 admin accounts created in database
- [ ] Old `ADMIN_PASSWORD` removed from `.env`
- [ ] Server restarted and running
- [ ] All API endpoints tested

### Frontend
- [ ] Login form updated with username field
- [ ] API endpoint changed to `/api/admin/login`
- [ ] `credentials: 'include'` added to fetch calls
- [ ] Error messages updated
- [ ] UI tested with new credentials

### Documentation
- [ ] Admin credentials documented securely
- [ ] Admins notified of new login system
- [ ] Training materials updated
- [ ] Deployment guide updated
- [ ] This migration guide completed

### Testing
- [ ] Login tested for all admin roles
- [ ] Session persistence verified
- [ ] All admin features working
- [ ] Real-time notifications working
- [ ] Activity logging working
- [ ] Logout working correctly

---

## 🎉 Migration Complete!

Once all checklist items are complete:

1. **Notify all admins** of the new login system
2. **Distribute credentials** securely
3. **Monitor for issues** in the first 24 hours
4. **Collect feedback** from admins
5. **Plan password change** for all accounts

---

**Migration Date:** _____________  
**Performed By:** _____________  
**Issues Encountered:** _____________  
**Resolution Time:** _____________

---

**Last Updated:** May 22, 2026  
**Version:** 2.0.0
