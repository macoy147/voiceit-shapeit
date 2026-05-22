# 🏗️ Admin Login System Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         INNOVOICE SYSTEM                        │
│                     Admin Authentication v2.0                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   FRONTEND   │────────▶│   BACKEND    │────────▶│   DATABASE   │
│  React App   │         │  Express.js  │         │   MongoDB    │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │                         │                         │
   Login Form            Auth Service              admins collection
   Username +            Password Hash             9 admin accounts
   Password              Session Mgmt              bcrypt hashed
```

---

## 🔐 Authentication Flow

### Login Process

```
1. USER ACTION
   ┌─────────────────┐
   │  Admin enters   │
   │  username +     │
   │  password       │
   └────────┬────────┘
            │
            ▼
2. FRONTEND
   ┌─────────────────┐
   │ POST /api/admin │
   │     /login      │
   │                 │
   │ {               │
   │   username,     │
   │   password      │
   │ }               │
   └────────┬────────┘
            │
            ▼
3. BACKEND - Validator
   ┌─────────────────┐
   │ adminLogin      │
   │ Validator       │
   │                 │
   │ ✓ Username 3-50 │
   │ ✓ Password 6+   │
   └────────┬────────┘
            │
            ▼
4. BACKEND - Auth Service
   ┌─────────────────┐
   │ authService     │
   │   .login()      │
   │                 │
   │ 1. Find user    │
   │ 2. Check active │
   │ 3. Verify pass  │
   │ 4. Update login │
   └────────┬────────┘
            │
            ▼
5. DATABASE
   ┌─────────────────┐
   │ admins          │
   │ collection      │
   │                 │
   │ Find by         │
   │ username        │
   │                 │
   │ Compare bcrypt  │
   │ hash            │
   └────────┬────────┘
            │
            ▼
6. BACKEND - Session
   ┌─────────────────┐
   │ Create session  │
   │                 │
   │ req.session     │
   │   .admin = {    │
   │     id,         │
   │     username,   │
   │     role,       │
   │     label,      │
   │     color       │
   │   }             │
   └────────┬────────┘
            │
            ▼
7. RESPONSE
   ┌─────────────────┐
   │ {               │
   │   success: true │
   │   admin: {...}  │
   │ }               │
   │                 │
   │ + Set-Cookie    │
   └────────┬────────┘
            │
            ▼
8. FRONTEND
   ┌─────────────────┐
   │ Store admin     │
   │ info in state   │
   │                 │
   │ Redirect to     │
   │ dashboard       │
   └─────────────────┘
```

---

## 🗄️ Database Schema

### admins Collection

```javascript
{
  _id: ObjectId("..."),
  
  // Authentication
  username: "ssg2526pres",           // Unique, lowercase
  password: "$2a$10$...",             // bcrypt hashed
  
  // Profile
  role: "executive",                 // enum: executive, press_secretary, 
                                     //       network_secretary, developer
  label: "President",                // Display name
  color: "#8b5cf6",                  // UI color
  
  // Status
  isActive: true,                    // Account enabled/disabled
  lastLogin: ISODate("2026-05-22"),  // Last login timestamp
  
  // Metadata
  createdBy: "seed_script",          // Who created this account
  createdAt: ISODate("2026-05-22"),  // Creation timestamp
  updatedAt: ISODate("2026-05-22")   // Last update timestamp
}
```

### Indexes

```javascript
// Unique index on username
db.admins.createIndex({ username: 1 }, { unique: true })

// Index on role for filtering
db.admins.createIndex({ role: 1 })

// Index on isActive for queries
db.admins.createIndex({ isActive: 1 })
```

---

## 🔧 Backend Components

### 1. Admin Model (`models/Admin.js`)

```
┌─────────────────────────────────────┐
│         Admin Model                 │
├─────────────────────────────────────┤
│ Schema Definition                   │
│ • username (unique, lowercase)      │
│ • password (hashed)                 │
│ • role, label, color                │
│ • isActive, lastLogin               │
│                                     │
│ Pre-save Hook                       │
│ • Hash password with bcrypt         │
│                                     │
│ Methods                             │
│ • comparePassword()                 │
│ • toPublicJSON()                    │
└─────────────────────────────────────┘
```

### 2. Auth Service (`services/authService.js`)

```
┌─────────────────────────────────────┐
│        Auth Service                 │
├─────────────────────────────────────┤
│ login(username, password)           │
│ • Find admin by username            │
│ • Check if active                   │
│ • Verify password                   │
│ • Update lastLogin                  │
│ • Return public info                │
│                                     │
│ getAdminById(id)                    │
│ • Fetch admin by ID                 │
│                                     │
│ Online Admin Tracking               │
│ • setAdminOnline()                  │
│ • setAdminOffline()                 │
│ • updateHeartbeat()                 │
│ • getOnlineAdmins()                 │
│                                     │
│ Admin Management (Developer)        │
│ • getAllAdmins()                    │
│ • createAdmin()                     │
│ • updateAdmin()                     │
│ • deleteAdmin()                     │
└─────────────────────────────────────┘
```

### 3. Middleware (`middleware/adminMiddleware.js`)

```
┌─────────────────────────────────────┐
│      Admin Middleware               │
├─────────────────────────────────────┤
│ verifyAdminAuth                     │
│ • Check req.session.admin           │
│ • Attach to req.adminInfo           │
│ • Return 401 if not authenticated   │
│                                     │
│ requireDeveloperRole                │
│ • Check role === 'developer'        │
│ • Return 403 if not developer       │
└─────────────────────────────────────┘
```

### 4. Routes (`routes/adminRoutes.js`)

```
┌─────────────────────────────────────┐
│        Admin Routes                 │
├─────────────────────────────────────┤
│ POST /api/admin/login               │
│ • Validate input                    │
│ • Call authService.login()          │
│ • Create session                    │
│ • Return admin info                 │
│                                     │
│ GET /api/admin/me                   │
│ • Verify session                    │
│ • Return current admin              │
│                                     │
│ POST /api/admin/logout              │
│ • Destroy session                   │
│ • Clear cookie                      │
│                                     │
│ All other routes                    │
│ • Protected by verifyAdminAuth      │
└─────────────────────────────────────┘
```

### 5. Validators (`validators/admin.validator.js`)

```
┌─────────────────────────────────────┐
│      Admin Validators               │
├─────────────────────────────────────┤
│ adminLoginValidator                 │
│ • username: 3-50 chars, required    │
│ • password: 6+ chars, required      │
│                                     │
│ activityLogQueryValidator           │
│ • adminRole: enum validation        │
│ • dateFrom/dateTo: ISO8601          │
│ • pagination: page, limit           │
└─────────────────────────────────────┘
```

---

## 🔄 Session Management

### Session Flow

```
┌─────────────────────────────────────────────────────────┐
│                    SESSION LIFECYCLE                    │
└─────────────────────────────────────────────────────────┘

1. LOGIN
   ┌──────────────┐
   │ User logs in │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Create new   │
   │ session      │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Store in     │
   │ MongoDB      │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Set cookie   │
   │ in browser   │
   └──────────────┘

2. AUTHENTICATED REQUESTS
   ┌──────────────┐
   │ Browser      │
   │ sends cookie │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Server reads │
   │ session from │
   │ MongoDB      │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Attach admin │
   │ to request   │
   └──────────────┘

3. HEARTBEAT (Every 30s)
   ┌──────────────┐
   │ POST         │
   │ /heartbeat   │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Update       │
   │ lastSeen     │
   └──────────────┘

4. LOGOUT
   ┌──────────────┐
   │ User logs    │
   │ out          │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Destroy      │
   │ session      │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Clear cookie │
   └──────────────┘

5. TIMEOUT (8 hours)
   ┌──────────────┐
   │ Session      │
   │ expires      │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Auto logout  │
   │ required     │
   └──────────────┘
```

### Session Storage

```
MongoDB Collection: sessions
{
  _id: "session_id",
  expires: ISODate("..."),
  session: {
    cookie: {
      originalMaxAge: 28800000,  // 8 hours
      httpOnly: true,
      secure: true,              // Production only
      sameSite: "none"           // Production only
    },
    admin: {
      id: "...",
      username: "ssg2526pres",
      role: "executive",
      label: "President",
      color: "#8b5cf6"
    }
  }
}
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                      │
└─────────────────────────────────────────────────────────┘

Layer 1: Password Hashing
┌──────────────────────────────────────┐
│ bcrypt with 10 salt rounds           │
│ • Original password never stored     │
│ • One-way hashing                    │
│ • Automatic on save                  │
└──────────────────────────────────────┘

Layer 2: Session Security
┌──────────────────────────────────────┐
│ • HttpOnly cookies                   │
│ • Secure flag in production          │
│ • SameSite protection                │
│ • 8-hour timeout                     │
│ • Stored in MongoDB                  │
└──────────────────────────────────────┘

Layer 3: Input Validation
┌──────────────────────────────────────┐
│ • Express Validator                  │
│ • Username: 3-50 chars               │
│ • Password: 6+ chars                 │
│ • Sanitization                       │
└──────────────────────────────────────┘

Layer 4: Rate Limiting
┌──────────────────────────────────────┐
│ • 5 login attempts per 15 min        │
│ • Per IP address                     │
│ • Prevents brute force               │
└──────────────────────────────────────┘

Layer 5: CORS Protection
┌──────────────────────────────────────┐
│ • Allowed origins only               │
│ • Credentials required               │
│ • Preflight requests                 │
└──────────────────────────────────────┘

Layer 6: NoSQL Injection Prevention
┌──────────────────────────────────────┐
│ • express-mongo-sanitize             │
│ • Input sanitization                 │
│ • Query protection                   │
└──────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  COMPLETE DATA FLOW                     │
└─────────────────────────────────────────────────────────┘

FRONTEND                BACKEND                 DATABASE
   │                       │                        │
   │  1. Login Request     │                        │
   ├──────────────────────▶│                        │
   │  POST /login          │                        │
   │  {username, password} │                        │
   │                       │                        │
   │                       │  2. Validate Input     │
   │                       ├───────────┐            │
   │                       │           │            │
   │                       │◀──────────┘            │
   │                       │                        │
   │                       │  3. Find Admin         │
   │                       ├───────────────────────▶│
   │                       │  db.admins.findOne()   │
   │                       │                        │
   │                       │  4. Return Admin       │
   │                       │◀───────────────────────┤
   │                       │  {username, password}  │
   │                       │                        │
   │                       │  5. Compare Password   │
   │                       ├───────────┐            │
   │                       │  bcrypt   │            │
   │                       │◀──────────┘            │
   │                       │                        │
   │                       │  6. Update lastLogin   │
   │                       ├───────────────────────▶│
   │                       │  admin.save()          │
   │                       │                        │
   │                       │  7. Create Session     │
   │                       ├───────────────────────▶│
   │                       │  sessions.insert()     │
   │                       │                        │
   │  8. Login Response    │                        │
   │◀──────────────────────┤                        │
   │  {success, admin}     │                        │
   │  + Set-Cookie         │                        │
   │                       │                        │
   │  9. Fetch Suggestions │                        │
   ├──────────────────────▶│                        │
   │  GET /suggestions     │                        │
   │  Cookie: session_id   │                        │
   │                       │                        │
   │                       │  10. Verify Session    │
   │                       ├───────────────────────▶│
   │                       │  sessions.findOne()    │
   │                       │                        │
   │                       │  11. Return Session    │
   │                       │◀───────────────────────┤
   │                       │  {admin: {...}}        │
   │                       │                        │
   │                       │  12. Fetch Data        │
   │                       ├───────────────────────▶│
   │                       │  suggestions.find()    │
   │                       │                        │
   │  13. Data Response    │                        │
   │◀──────────────────────┤                        │
   │  {suggestions: [...]} │                        │
   │                       │                        │
```

---

## 🎯 Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│              COMPONENT INTERACTION MAP                  │
└─────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   Frontend   │
                    │  Login Form  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Routes     │
                    │ adminRoutes  │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
         ┌──────────┐         ┌──────────┐
         │Validators│         │Middleware│
         └────┬─────┘         └────┬─────┘
              │                    │
              └──────────┬─────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Auth Service │
                  └──────┬───────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
         ┌──────────┐      ┌──────────┐
         │  Admin   │      │ Activity │
         │  Model   │      │  Logger  │
         └────┬─────┘      └────┬─────┘
              │                 │
              └────────┬────────┘
                       │
                       ▼
                ┌──────────────┐
                │   MongoDB    │
                │   Database   │
                └──────────────┘
```

---

**Architecture Version:** 2.0.0  
**Last Updated:** May 22, 2026  
**Status:** Production Ready
