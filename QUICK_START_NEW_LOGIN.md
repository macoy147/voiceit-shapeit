# 🚀 Quick Start: New Admin Login System

## ⚡ 3-Step Setup

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Seed Admin Accounts
```bash
npm run seed:admins
```

**Expected Output:**
```
Connected to MongoDB
Seeding admin accounts...
✓ Created admin: ssg2526pres (President)
✓ Created admin: ssg2526vp (Vice President)
✓ Created admin: ssg2526cote (CoTE Governor)
✓ Created admin: ssg2526coed (CoEd Governor)
✓ Created admin: ssg2526presssec (Press Secretary)
✓ Created admin: ssg2526netsec (Secretary on Networks)
✓ Created admin: ssg2526dev (Developer)
✓ Created admin: ssg2526mathrep (BSED-Math Representative)
✓ Created admin: ssg2526smm (Social Media Manager)

✅ Successfully seeded 9 admin accounts!

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

**💾 SAVE THESE CREDENTIALS!** Copy them to a secure location.

### Step 3: Start Server
```bash
npm run dev
```

---

## ✅ Verify Setup

### Test Login via cURL
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ssg2526dev","password":"Developer2526!"}'
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

---

## 🎯 Next Steps

1. **Update Frontend** - See `MIGRATION_GUIDE.md`
2. **Test Login** - Try logging in with each account
3. **Change Passwords** - Update default passwords
4. **Distribute Credentials** - Share with admins securely

---

## 📚 Full Documentation

- `ADMIN_LOGIN_SYSTEM.md` - Complete guide
- `ADMIN_CREDENTIALS.md` - All credentials
- `MIGRATION_GUIDE.md` - Migration steps
- `IMPLEMENTATION_SUMMARY_LOGIN_SYSTEM.md` - Technical details

---

## 🆘 Troubleshooting

**Seed script fails?**
- Check MongoDB connection in `.env`
- Verify `MONGODB_URI` is correct
- Ensure MongoDB is running

**bcryptjs not found?**
```bash
npm install bcryptjs
```

**Need to reset?**
```bash
npm run seed:admins
```
This will clear and recreate all admin accounts.

---

**That's it! You're ready to go! 🎉**
