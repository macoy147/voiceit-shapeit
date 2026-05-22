# 🔧 CORS Error Fix Guide

## ❌ The Error You're Seeing

```
Access to fetch at 'http://localhost:5000/api/admin/me' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the 
requested resource.
```

## 🎯 Root Cause

**Your backend server is NOT running!**

The CORS error is misleading - it's actually a connection error. When the backend server isn't running, the browser can't connect to `http://localhost:5000`, so it shows a CORS error.

---

## ✅ Solution: Start Your Backend Server

### Step 1: Open a Terminal

Open a **new terminal/command prompt** window.

### Step 2: Navigate to Server Directory

```bash
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\server"
```

### Step 3: Start the Server

```bash
npm run dev
```

### Step 4: Verify Server is Running

You should see output like:

```
Server running on port 5000
Environment: development
Connected to MongoDB
```

---

## 🚀 Quick Start (Both Frontend & Backend)

### Option 1: Run Both Servers Separately

**Terminal 1 (Backend):**
```bash
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\server"
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\client"
npm run dev
```

### Option 2: Run Both from Root (Recommended)

**Single Terminal:**
```bash
cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice"
npm run dev
```

This will start both frontend and backend concurrently.

---

## 🔍 Troubleshooting

### Issue 1: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Option A: Kill the Process (Windows)**
```bash
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F
```

**Option B: Use a Different Port**

Edit `server/.env`:
```env
PORT=5001
```

Then update `client/.env`:
```env
VITE_API_URL=http://localhost:5001
```

### Issue 2: MongoDB Connection Failed

**Error:**
```
MongoServerError: Authentication failed
```

**Solution:**

1. Check your MongoDB URI in `server/.env`
2. Verify your MongoDB Atlas credentials
3. Ensure your IP is whitelisted in MongoDB Atlas
4. Check if MongoDB cluster is running

### Issue 3: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd server
npm install
```

### Issue 4: Environment Variables Not Loaded

**Error:**
```
SESSION_SECRET is not set. Sessions will be insecure.
```

**Solution:**

1. Ensure `server/.env` file exists
2. Check that `.env` is in the correct location
3. Restart the server after editing `.env`

---

## ✅ Verification Checklist

After starting the server, verify:

- [ ] Terminal shows "Server running on port 5000"
- [ ] Terminal shows "Connected to MongoDB"
- [ ] No error messages in terminal
- [ ] Can access http://localhost:5000 in browser
- [ ] Browser shows: `{"message":"SSG InnoVoice API","version":"1.0.0","status":"running"}`

---

## 🎯 Testing the Fix

### Test 1: Check Backend is Running

Open browser and go to:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "SSG InnoVoice API",
  "version": "1.0.0",
  "status": "running"
}
```

### Test 2: Check CORS is Working

Open your frontend:
```
http://localhost:3000/admin
```

Try to login. If the backend is running, you should:
- ✅ See the login form
- ✅ Be able to type username/password
- ✅ Get a response (success or error) when clicking login
- ❌ NOT see CORS errors in console

---

## 📝 Common Mistakes

### Mistake 1: Only Starting Frontend
```bash
# ❌ Wrong - only frontend running
cd client
npm run dev
```

**Fix:** Start backend too!

### Mistake 2: Wrong Directory
```bash
# ❌ Wrong - in wrong directory
cd InnoVoice
npm run dev  # This might not work if you're not in root
```

**Fix:** Make sure you're in the correct directory.

### Mistake 3: Closing Terminal
```bash
# ❌ Wrong - closing terminal stops server
npm run dev
# Then closing the terminal window
```

**Fix:** Keep terminal windows open while developing.

---

## 🔧 Development Workflow

### Recommended Setup

1. **Terminal 1: Backend Server**
   ```bash
   cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\server"
   npm run dev
   ```
   Keep this running. You'll see server logs here.

2. **Terminal 2: Frontend Server**
   ```bash
   cd "c:\Users\McCoy\Desktop\InnoVoice Mobile Application\InnoVoice\client"
   npm run dev
   ```
   Keep this running. You'll see frontend build logs here.

3. **Browser**
   - Open http://localhost:3000
   - Open DevTools (F12)
   - Check Console for errors
   - Check Network tab for API calls

---

## 🎨 Visual Guide

### What You Should See

**Terminal 1 (Backend):**
```
> ssg-innovoice-server@1.0.0 dev
> nodemon src/index.js

[nodemon] 3.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/index.js`
info: Server running on port 5000
info: Environment: development
info: Connected to MongoDB
```

**Terminal 2 (Frontend):**
```
> ssg-innovoice-client@1.0.0 dev
> vite

  VITE v5.1.0  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Browser Console (No Errors):**
```
✅ No CORS errors
✅ API calls succeed
✅ Login works
```

---

## 🆘 Still Having Issues?

### Check These:

1. **Is MongoDB Running?**
   - Check MongoDB Atlas dashboard
   - Verify cluster is active
   - Check connection string

2. **Are Dependencies Installed?**
   ```bash
   cd server
   npm install
   
   cd ../client
   npm install
   ```

3. **Is .env File Correct?**
   - Check `server/.env` exists
   - Verify MONGODB_URI is correct
   - Check ALLOWED_ORIGINS includes localhost:3000

4. **Firewall/Antivirus?**
   - Check if firewall is blocking port 5000
   - Temporarily disable antivirus to test

5. **Node Version?**
   ```bash
   node --version
   # Should be >= 18.0.0
   ```

---

## 📞 Quick Commands Reference

```bash
# Start both servers from root
npm run dev

# Start backend only
cd server && npm run dev

# Start frontend only
cd client && npm run dev

# Install all dependencies
npm run install:all

# Check if port 5000 is in use (Windows)
netstat -ano | findstr :5000

# Kill process on port 5000 (Windows)
taskkill /PID <PID> /F

# Check Node version
node --version

# Check npm version
npm --version
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend terminal shows "Server running on port 5000"
2. ✅ Backend terminal shows "Connected to MongoDB"
3. ✅ Frontend terminal shows "Local: http://localhost:3000/"
4. ✅ Browser shows login page at http://localhost:3000/admin
5. ✅ No CORS errors in browser console
6. ✅ Can login successfully
7. ✅ Can see dashboard after login

---

## 🎉 You're All Set!

Once both servers are running:

1. Open http://localhost:3000/admin
2. Login with your credentials
3. Enjoy your skeleton loaders! 💀✨

---

**Last Updated**: May 22, 2026  
**Status**: Ready to Use  
**Need Help?**: Check the troubleshooting section above
