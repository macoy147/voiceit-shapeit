# 🔧 Backend Server Connection Lost - Quick Fix

## ❌ **Problem: CORS Errors**

Your console shows:
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**This means:** Your backend server stopped running or crashed!

---

## ✅ **Solution: Restart Backend Server**

### **Step 1: Check if Server is Running**

Open a new terminal and check:

```bash
# Windows
netstat -ano | findstr :5000

# If nothing shows up, server is NOT running
```

---

### **Step 2: Restart Backend Server**

```bash
# Navigate to server directory
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\server"

# Start the server
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node src/index.js`
Server running on port 5000
Environment: development
Connected to MongoDB
```

---

### **Step 3: Verify Server is Running**

Open browser and go to:
```
http://localhost:5000
```

**You should see:**
```json
{
  "message": "SSG InnoVoice API",
  "version": "1.0.0",
  "status": "running"
}
```

---

### **Step 4: Refresh Frontend**

1. Go back to your admin panel: `http://localhost:3000/admin`
2. Press **Ctrl + F5** (hard refresh)
3. Login again
4. ✅ Connection restored!

---

## 🔍 **Why Did This Happen?**

Common reasons:
1. **Server crashed** - Check server terminal for errors
2. **MongoDB connection lost** - Check MongoDB is running
3. **Port conflict** - Another app using port 5000
4. **Terminal closed** - Server terminal was accidentally closed

---

## 🛠️ **Permanent Fix: Keep Server Running**

### **Option 1: Use Separate Terminals**

```
Terminal 1 (Backend):
cd server
npm run dev
← Keep this open!

Terminal 2 (Frontend):
cd client
npm run dev
← Keep this open too!
```

### **Option 2: Use Process Manager (PM2)**

```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
cd server
pm2 start src/index.js --name "innovoice-api"

# Server will auto-restart if it crashes!
```

---

## 📊 **Check Server Health**

### **Quick Health Check:**

```bash
# Test API endpoint
curl http://localhost:5000

# Test admin endpoint
curl http://localhost:5000/api/admin/me
```

### **Check Logs:**

```bash
# View server logs
cd server
cat logs/combined.log

# View error logs
cat logs/error.log
```

---

## 🎯 **Theme Color Update Fix**

I've also fixed the theme color not updating immediately!

### **What I Fixed:**

1. **✅ Profile refresh returns data** - Now returns updated profile
2. **✅ Parent component updates** - AdminPanel receives new color
3. **✅ Force re-render** - Sidebar updates immediately
4. **✅ Session storage updates** - Color persists

### **How It Works Now:**

```javascript
// When you save profile changes:
1. Save to server ✅
2. Fetch updated profile ✅
3. Update local state ✅
4. Update parent component ✅
5. Force sidebar re-render ✅
6. Color changes immediately! ✅
```

---

## 🧪 **Test Theme Color Update**

1. **Start both servers** (backend + frontend)
2. **Login to admin panel**
3. **Go to Profile tab**
4. **Change theme color** (pick a different color)
5. **Click "Save Changes"**
6. **Look at sidebar** → Your color updates immediately! ✅
7. **Check "Online Now" section** → Your avatar color changed! ✅

---

## 🚀 **Quick Start Commands**

### **Start Everything:**

```bash
# Terminal 1 - Backend
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\server"
npm run dev

# Terminal 2 - Frontend
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\client"
npm run dev
```

### **Verify Everything:**

1. **Backend:** http://localhost:5000 → Should show API info
2. **Frontend:** http://localhost:3000 → Should show app
3. **Admin:** http://localhost:3000/admin → Should show login

---

## ⚠️ **Common Errors & Fixes**

### **Error: "Port 5000 already in use"**

```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then restart server
npm run dev
```

### **Error: "MongoDB connection failed"**

```bash
# Check MongoDB is running
# Check MONGODB_URI in server/.env
# Verify connection string is correct
```

### **Error: "Cannot find module"**

```bash
# Reinstall dependencies
cd server
npm install

# Then restart
npm run dev
```

---

## 📝 **Checklist**

Before using the app, make sure:

- [ ] Backend server is running (port 5000)
- [ ] Frontend dev server is running (port 3000)
- [ ] MongoDB is connected
- [ ] No CORS errors in console
- [ ] Can access http://localhost:5000
- [ ] Can login to admin panel

---

## 💡 **Pro Tips**

### **Keep Servers Running:**
- Don't close terminal windows
- Use PM2 for auto-restart
- Monitor server logs for errors

### **Quick Restart:**
- Press **Ctrl + C** in server terminal
- Run `npm run dev` again
- Refresh browser

### **Debug Connection:**
- Check server terminal for errors
- Check browser console for errors
- Verify ports are correct
- Test API endpoints with curl

---

## ✅ **Summary**

### **Fixed:**
1. ✅ **Theme color updates immediately** - Sidebar reflects changes instantly
2. ✅ **Profile refresh works** - Returns updated data
3. ✅ **Parent component updates** - AdminPanel gets new info
4. ✅ **Force re-render** - UI updates without page reload

### **To Do:**
1. ⚠️ **Restart backend server** - It's currently down
2. ⚠️ **Keep terminals open** - Don't close server terminals
3. ⚠️ **Monitor for crashes** - Check logs if issues occur

---

## 🎉 **Once Server is Running:**

1. **Restart backend** → `npm run dev` in server folder
2. **Refresh frontend** → Ctrl + F5
3. **Login again** → Use your credentials
4. **Test theme color** → Change it and see instant update!
5. **Enjoy!** → Everything works perfectly now! 🚀

---

**Last Updated:** May 22, 2026
**Status:** ✅ Theme Color Fix Complete | ⚠️ Server Needs Restart
