# 🔧 Online Status Fix - Profile Update Issue

## Problem

When an admin updated their profile (especially the `label` field) and saved changes, they would appear as **offline** shortly after, even though they were still logged in and active.

## Root Cause

The online admin tracking system was using the admin's **label** (display name) as the key in the `onlineAdmins` Map:

```javascript
// OLD CODE - Using label as key
onlineAdmins.set(adminInfo.label, { ...adminInfo });
```

### What Went Wrong:

1. **Admin logs in** with label "President"
   - `onlineAdmins.set("President", {...})` is called
   
2. **Admin updates profile** and changes label to "New President"
   - Database is updated with new label
   
3. **Heartbeat is sent** (every 30 seconds)
   - Heartbeat tries to update using the old key "President"
   - But the fresh data from database has label "New President"
   - This creates a mismatch
   
4. **Next online check** (every 30 seconds)
   - System can't properly track the admin
   - Admin appears offline

## Solution

Changed the online admin tracking to use **username** instead of **label** as the key. Username is a stable, immutable identifier that never changes.

### Changes Made:

#### 1. `authService.js` - Updated tracking methods

```javascript
// NEW CODE - Using username as key
setAdminOnline(adminInfo) {
  onlineAdmins.set(adminInfo.username, { ...adminInfo });
}

setAdminOffline(username) {
  onlineAdmins.delete(username);
}

async updateHeartbeat(username, adminInfo) {
  const admin = await Admin.findOne({ username: username.toLowerCase() });
  // ... update using username as key
}
```

#### 2. `adminRoutes.js` - Updated route handlers

```javascript
// Logout
authService.setAdminOffline(req.adminInfo.username);

// Heartbeat
await authService.updateHeartbeat(req.adminInfo.username, req.adminInfo);

// Logout beacon
authService.setAdminOffline(req.adminInfo.username);
```

## Benefits

✅ **Stable Tracking**: Username never changes, so online status is always accurate
✅ **Profile Updates**: Admins can update their label/display name without going offline
✅ **Consistent Behavior**: Online status works reliably across all profile changes
✅ **No Breaking Changes**: Frontend code doesn't need any changes

## Testing

To verify the fix:

1. Log in as an admin
2. Check that you appear in the "Online Admins" list
3. Go to Profile tab
4. Change your display name (label)
5. Save changes
6. Wait 30 seconds
7. ✅ You should still appear as online

## Technical Details

### Before:
- **Key**: `label` (mutable, can be changed by user)
- **Problem**: Key mismatch after profile updates
- **Result**: Admin appears offline

### After:
- **Key**: `username` (immutable, never changes)
- **Solution**: Consistent key across all operations
- **Result**: Admin stays online

## Files Modified

1. `server/src/services/authService.js`
   - `setAdminOnline()` - Use username as key
   - `setAdminOffline()` - Accept username parameter
   - `updateHeartbeat()` - Accept username parameter
   - `getOnlineAdmins()` - Iterate using username

2. `server/src/routes/adminRoutes.js`
   - `/logout` - Pass username to setAdminOffline
   - `/heartbeat` - Pass username to updateHeartbeat
   - `/logout-beacon` - Pass username to setAdminOffline

## Related Issues

This fix also resolves:
- Admins appearing offline after changing bio
- Admins appearing offline after changing phone number
- Admins appearing offline after changing theme color
- Any profile field update causing offline status

---

**Status**: ✅ Fixed
**Date**: May 22, 2026
**Impact**: All profile updates now work without affecting online status
