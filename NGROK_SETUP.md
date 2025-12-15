# Ngrok Setup Guide

## Step 1: Install ngrok
If you haven't installed ngrok yet:
```bash
# Download from https://ngrok.com/download
# Or install via chocolatey:
choco install ngrok
```

## Step 2: Start Your Development Servers
Make sure your app is running:
```bash
npm run dev
```

## Step 3: Create Ngrok Tunnels

Open **TWO NEW** PowerShell/Terminal windows and run:

### Terminal 1 - Backend Tunnel:
```bash
ngrok http 5000
```
You'll get a URL like: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

### Terminal 2 - Frontend Tunnel:
```bash
ngrok http 3000
```
You'll get a URL like: `https://yyyy-yy-yy-yy-yy.ngrok-free.app`

## Step 4: Update Environment Variables

### Update `client/.env`:
```env
VITE_API_URL=https://YOUR-BACKEND-NGROK-URL.ngrok-free.app/api
VITE_SOCKET_URL=https://YOUR-BACKEND-NGROK-URL.ngrok-free.app
```

### Update `server/.env`:
Add/Update these lines:
```env
CLIENT_URL=https://YOUR-FRONTEND-NGROK-URL.ngrok-free.app
```

## Step 5: Restart the Servers
Stop the servers (Ctrl+C) and restart:
```bash
npm run dev
```

## Step 6: Access on Your Phone
Open your browser on your phone and go to:
```
https://YOUR-FRONTEND-NGROK-URL.ngrok-free.app
```

## Important Notes:
- ⚠️ Free ngrok URLs change every time you restart ngrok
- ⚠️ You need to update the .env files whenever ngrok URLs change
- ⚠️ Always use HTTPS (not HTTP) with ngrok URLs
- ✅ Make sure both tunnels are running
- ✅ The backend tunnel should point to port 5000
- ✅ The frontend tunnel should point to port 3000

## Example Configuration:
If your ngrok URLs are:
- Backend: `https://abc123.ngrok-free.app`
- Frontend: `https://xyz789.ngrok-free.app`

Then:
- `client/.env`: `VITE_API_URL=https://abc123.ngrok-free.app/api`
- `server/.env`: `CLIENT_URL=https://xyz789.ngrok-free.app`
