# ✅ SIMPLE NGROK SETUP (ONE TUNNEL ONLY)

## 📋 Current Setup Status:
- ✅ client/.env already configured with relative paths
- ✅ vite.config.js already has proxy setup
- ⏳ Need to start ngrok and update server/.env

---

## 🚀 OPTION 1: Automatic Setup (Recommended)

Run this command in PowerShell:
```powershell
.\start-ngrok.ps1
```

This will:
1. Start ngrok on port 3000
2. Get your ngrok URL
3. Update server/.env automatically
4. Show you the URL to use on your phone

Then just run:
```powershell
npm run dev
```

---

## 🔧 OPTION 2: Manual Setup

### Step 1: Start ngrok
```powershell
ngrok http 3000
```

You'll see something like:
```
Forwarding https://abcd-1234-5678.ngrok-free.app -> http://localhost:3000
```

**Copy the https URL** (e.g., `https://abcd-1234-5678.ngrok-free.app`)

### Step 2: Update server/.env

Open `server/.env` and change:
```
CLIENT_URL=http://localhost:3000
```

To (use YOUR ngrok URL):
```
CLIENT_URL=https://abcd-1234-5678.ngrok-free.app
```

### Step 3: Start Development Server
```powershell
npm run dev
```

Wait for both servers to start (you'll see "Server running on port 5000" and "VITE ready")

### Step 4: Open on Phone 📱

Open your phone browser and go to:
```
https://abcd-1234-5678.ngrok-free.app
```

(Use YOUR ngrok URL from Step 1)

---

## ⚠️ Important Notes:

1. **Keep ngrok terminal open** - Closing it stops the tunnel
2. **Free ngrok URLs change** - Each time you restart ngrok, update server/.env
3. **Both servers must run** - Backend (5000) and Frontend (3000)
4. **No need to restart ngrok** - Just keep it running

---

## 🐛 Troubleshooting:

### If login doesn't work:
1. Check server/.env has correct ngrok URL
2. Restart dev server (npm run dev)
3. Hard refresh browser on phone (Ctrl+Shift+R or clear cache)

### If you see "Tunnel not found":
- Make sure ngrok is running
- Check you're using the correct URL

### If backend doesn't connect:
- Make sure both client and server are running
- Check terminal for any errors
