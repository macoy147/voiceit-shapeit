# 🧪 Test Login System

## Quick Test Checklist

### ✅ Step 1: Server Running
Check that the server started without errors. You should see:
```
Server running on port 5000
Environment: development
Connected to MongoDB
```

### ✅ Step 2: Seed Admin Accounts

Open a new terminal and run:
```bash
cd server
npm run seed:admins
```

**Expected Output:**
```
Connected to MongoDB
Seeding admin accounts...
✓ Created admin: ssg2526pres (President)
✓ Created admin: ssg2526vp (Vice President)
...
✅ Successfully seeded 9 admin accounts!
```

### ✅ Step 3: Test Login API

Test with cURL or Postman:

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526dev\",\"password\":\"Developer2526!\"}"
```

**Expected Response:**
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

### ✅ Step 4: Test Invalid Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"wronguser\",\"password\":\"wrongpass\"}"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### ✅ Step 5: Verify Database

Check MongoDB to see the admins collection:

**MongoDB Compass:**
1. Connect to your database
2. Look for `admins` collection
3. Should see 9 documents

**MongoDB Shell:**
```javascript
use your_database_name
db.admins.find().count()  // Should return 9
db.admins.findOne({ username: "ssg2526dev" })
```

### ✅ Step 6: Test All Admin Accounts

Test each account to ensure they all work:

```bash
# President
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526pres\",\"password\":\"President2526!\"}"

# Vice President
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526vp\",\"password\":\"VicePresident2526!\"}"

# CoTE Governor
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526cote\",\"password\":\"CoTEGov2526!\"}"

# CoEd Governor
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526coed\",\"password\":\"CoEdGov2526!\"}"

# Press Secretary
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526presssec\",\"password\":\"PressSec2526!\"}"

# Network Secretary
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526netsec\",\"password\":\"NetSec2526!\"}"

# Developer
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526dev\",\"password\":\"Developer2526!\"}"

# Math Representative
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526mathrep\",\"password\":\"MathRep2526!\"}"

# Social Media Manager
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ssg2526smm\",\"password\":\"SocialMedia2526!\"}"
```

All should return `"success": true`

---

## 🐛 Troubleshooting

### Server won't start
**Error:** `Cannot find module 'bcryptjs'`
**Fix:**
```bash
cd server
npm install bcryptjs
```

### Seed script fails
**Error:** `MongoServerError: E11000 duplicate key error`
**Fix:** Admins already exist. To reset:
```javascript
// In MongoDB shell
db.admins.deleteMany({})
```
Then run seed script again.

### Login returns 401
**Possible causes:**
1. Seed script not run - Run `npm run seed:admins`
2. Wrong password - Check case sensitivity
3. Account inactive - Check `isActive: true` in database

### Session not working
**Check:**
1. `SESSION_SECRET` is set in `.env`
2. MongoDB connection is working
3. `sessions` collection exists in database

---

## ✅ Success Criteria

All tests pass when:
- [x] Server starts without errors
- [x] Seed script creates 9 accounts
- [x] Login API returns success for valid credentials
- [x] Login API returns 401 for invalid credentials
- [x] All 9 admin accounts can login
- [x] Database shows 9 admin documents
- [x] Passwords are hashed (not plain text)

---

## 🎉 Next Steps

Once all tests pass:
1. ✅ Backend is ready
2. 📝 Update frontend login component
3. 🚀 Deploy to production
4. 🔐 Change default passwords

---

**Test Date:** _____________  
**Tested By:** _____________  
**All Tests Passed:** ☐ Yes ☐ No  
**Issues Found:** _____________
