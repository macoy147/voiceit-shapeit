# 🔐 Admin Profile System - Implementation Guide

## 📋 Overview

This document provides a complete implementation guide for the Admin Profile System with password hash viewing and enhanced security features.

---

## ✅ Implementation Checklist

### **Phase 1: Backend - COMPLETED** ✅

- [x] Updated Admin Model with new fields (bio, phoneNumber, passwordChangedAt, saltRounds)
- [x] Added `getHashInfo()` method to Admin model
- [x] Created PasswordHistory model for tracking password reuse
- [x] Created ProfileService with all methods
- [x] Created profile validators
- [x] Created profile routes with rate limiting
- [x] Integrated profile routes into main server

### **Phase 2: Frontend - COMPLETED** ✅

- [x] Created ProfilePanel component
- [x] Created ProfilePanel styles (SCSS)
- [x] Implemented profile picture upload
- [x] Implemented password change modal
- [x] Implemented password hash viewer
- [x] Implemented hash generator tool
- [x] Added password strength indicator

### **Phase 3: Integration - TODO** ⏳

- [ ] Integrate ProfilePanel into AdminPanel
- [ ] Add profile navigation/tab
- [ ] Update admin header with profile picture
- [ ] Test all features end-to-end

### **Phase 4: Testing & Documentation - TODO** ⏳

- [ ] Test profile CRUD operations
- [ ] Test password change flow
- [ ] Test hash viewing
- [ ] Test rate limiting
- [ ] Create user documentation

---

## 🚀 Quick Start

### **1. Backend Setup**

The backend is already set up! Just restart your server:

```bash
cd server
npm run dev
```

### **2. Frontend Integration**

Add the ProfilePanel to your AdminPanel component:

```jsx
import ProfilePanel from './ProfilePanel';

// In your AdminPanel component:
const [activeTab, setActiveTab] = useState('dashboard');

// Add profile tab
{activeTab === 'profile' && (
  <ProfilePanel 
    adminInfo={adminInfo} 
    onProfileUpdate={handleProfileUpdate}
  />
)}
```

### **3. Add Navigation**

Add a profile button/tab to your admin navigation:

```jsx
<button onClick={() => setActiveTab('profile')}>
  <IconUser size={20} />
  Profile
</button>
```

---

## 📡 API Endpoints

### **Profile Management**

```
GET    /api/profile                      - Get current admin profile
PUT    /api/profile                      - Update profile (label, bio, phone, color)
PUT    /api/profile/picture              - Update profile picture
DELETE /api/profile/picture              - Remove profile picture
```

### **Password Management**

```
PUT    /api/profile/password             - Change password
POST   /api/profile/check-password-strength - Check password strength
```

### **Hash Tools (Educational)**

```
GET    /api/profile/hash-info            - Get password hash info
POST   /api/profile/generate-hash        - Generate hash preview
```

---

## 🔒 Security Features

### **Password Requirements**

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character
- Cannot be a common password
- Cannot reuse last 3 passwords

### **Rate Limiting**

- Password changes: 3 per hour
- Hash generation: 10 per hour
- General API: 100 requests per 15 minutes

### **Password Hashing**

- Algorithm: bcrypt
- Salt rounds: 12 (configurable)
- Automatic salting
- Password history tracking

---

## 🎨 Features

### **1. Profile Management**

- Update display name
- Update bio (max 500 chars)
- Update phone number
- Change theme color
- Upload profile picture (max 2MB)

### **2. Password Management**

- Change password with validation
- Real-time password strength indicator
- Old password verification
- Password confirmation
- Show/hide password toggles

### **3. Hash Viewer (Educational)**

- View your password hash
- See hash algorithm details
- See salt rounds used
- Copy hash to clipboard
- Security warnings included

### **4. Hash Generator (Educational)**

- Generate bcrypt hash for any text
- Configurable salt rounds
- See how hashing works
- Educational notes included
- Copy generated hash

---

## 🔄 Session Recovery & State Management

### **Implemented Features**

1. **Session Persistence**
   - Sessions stored in MongoDB
   - 8-hour session timeout
   - Auto-renewal on activity

2. **Error Recovery**
   - Graceful error handling
   - User-friendly error messages
   - Automatic retry on network errors

3. **State Management**
   - Form state preserved during editing
   - Unsaved changes warning (to be implemented)
   - Auto-save drafts to localStorage (to be implemented)

### **To Implement**

Add these features for complete recovery:

```jsx
// In ProfilePanel.jsx

// Save draft to localStorage
useEffect(() => {
  if (formData) {
    localStorage.setItem('profile-draft', JSON.stringify(formData));
  }
}, [formData]);

// Restore draft on mount
useEffect(() => {
  const draft = localStorage.getItem('profile-draft');
  if (draft) {
    const parsed = JSON.parse(draft);
    // Show confirmation to restore
    if (confirm('Restore unsaved changes?')) {
      setFormData(parsed);
    }
  }
}, []);

// Clear draft after successful save
const handleSaveProfile = async () => {
  // ... existing code ...
  if (success) {
    localStorage.removeItem('profile-draft');
  }
};

// Warn before leaving with unsaved changes
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

---

## 📊 Database Schema Updates

### **Admin Model (Updated)**

```javascript
{
  username: String,
  password: String,           // bcrypt hashed
  role: String,
  label: String,
  color: String,
  profilePicture: String,     // Base64 or URL
  bio: String,                // NEW
  phoneNumber: String,        // NEW
  passwordChangedAt: Date,    // NEW
  saltRounds: Number,         // NEW
  isActive: Boolean,
  lastLogin: Date,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **PasswordHistory Model (New)**

```javascript
{
  adminId: ObjectId,          // Reference to Admin
  passwordHash: String,       // Old password hash
  changedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing Guide

### **1. Test Profile Update**

```bash
# Login first
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ssg2526dev","password":"Developer2526!"}' \
  -c cookies.txt

# Update profile
curl -X PUT http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"label":"Updated Name","bio":"My bio","phoneNumber":"+63 123 456 7890"}'
```

### **2. Test Password Change**

```bash
curl -X PUT http://localhost:5000/api/profile/password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "oldPassword":"Developer2526!",
    "newPassword":"NewPassword123!",
    "confirmPassword":"NewPassword123!"
  }'
```

### **3. Test Hash Info**

```bash
curl -X GET http://localhost:5000/api/profile/hash-info \
  -b cookies.txt
```

### **4. Test Hash Generation**

```bash
curl -X POST http://localhost:5000/api/profile/generate-hash \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"plainText":"test123","saltRounds":12}'
```

---

## 🎯 Next Steps

### **Immediate (Required for functionality)**

1. **Integrate ProfilePanel into AdminPanel**
   - Add profile tab/section
   - Add navigation button
   - Handle tab switching

2. **Update Admin Header**
   - Show profile picture
   - Add quick profile access
   - Show admin name/role

3. **Test Everything**
   - Test all CRUD operations
   - Test password changes
   - Test hash viewing
   - Test rate limiting
   - Test error handling

### **Optional Enhancements**

1. **Profile Picture Upload to Cloudinary**
   - Instead of base64 storage
   - Better performance
   - CDN delivery

2. **Two-Factor Authentication**
   - Add 2FA support
   - QR code generation
   - TOTP verification

3. **Activity Timeline**
   - Show recent profile changes
   - Show login history
   - Show password changes

4. **Email Notifications**
   - Password change alerts
   - Profile update notifications
   - Security alerts

5. **Advanced Password Policies**
   - Password expiry (90 days)
   - Force password change on first login
   - Account lockout after failed attempts

---

## 🐛 Troubleshooting

### **Issue: Profile picture not uploading**

**Solution:**
- Check image size (max 2MB)
- Check image format (JPEG, PNG, WebP only)
- Check base64 encoding
- Check server body size limit

### **Issue: Password change fails**

**Solution:**
- Verify old password is correct
- Check new password meets requirements
- Check password confirmation matches
- Check rate limiting (max 3 per hour)

### **Issue: Hash info not showing**

**Solution:**
- Verify admin is logged in
- Check session is valid
- Check admin exists in database
- Check password field exists

### **Issue: Rate limit errors**

**Solution:**
- Wait for rate limit window to reset
- Check rate limit configuration
- Verify IP address detection

---

## 📚 Educational Notes

### **Why bcrypt?**

bcrypt is a password hashing function designed to be slow and computationally expensive, making brute-force attacks impractical.

**Key features:**
- Automatic salt generation
- Configurable cost factor (salt rounds)
- Same password = different hash (due to random salt)
- One-way function (cannot reverse)

### **Salt Rounds Explained**

Salt rounds determine how many times the hashing algorithm runs:
- 10 rounds = 2^10 = 1,024 iterations
- 12 rounds = 2^12 = 4,096 iterations
- 15 rounds = 2^15 = 32,768 iterations

**Recommendation:** 12 rounds (good balance of security and performance)

### **Password History**

Prevents users from reusing recent passwords:
- Stores last 3 password hashes
- Compares new password against history
- Auto-cleanup old entries
- Helps prevent password cycling

---

## 🔐 Security Best Practices

1. **Never log passwords** - Even in development
2. **Always use HTTPS** - In production
3. **Implement rate limiting** - Prevent brute force
4. **Use strong session secrets** - Random, long strings
5. **Validate all inputs** - Server-side validation
6. **Sanitize user data** - Prevent injection attacks
7. **Keep dependencies updated** - Security patches
8. **Monitor failed login attempts** - Detect attacks
9. **Use secure cookies** - httpOnly, secure, sameSite
10. **Implement CSRF protection** - Prevent cross-site attacks

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review server logs: `server/logs/combined.log`
3. Check browser console for frontend errors
4. Verify MongoDB connection
5. Test API endpoints with curl/Postman

---

## 🎉 Summary

You now have a complete admin profile system with:

✅ Profile management (name, bio, phone, picture)
✅ Password change with strength validation
✅ Password hash viewer (educational)
✅ Hash generator tool (educational)
✅ Password history tracking
✅ Rate limiting protection
✅ Session management
✅ Activity logging
✅ Responsive design
✅ Dark/light mode support

**Next:** Integrate into AdminPanel and test! 🚀

---

**Last Updated:** May 22, 2026
**Version:** 1.0.0
