# 🚀 How to Start the Server (SOLUTION TO PORT ERRORS)

## ✅ RECOMMENDED METHOD

### Use the Batch File (Easiest!)
```bash
.\start.bat
```

This will:
1. Kill all Node.js processes automatically
2. Wait 2 seconds
3. Start the dev server cleanly

---

## Alternative Methods

### Method 1: PowerShell Script
```powershell
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

### Method 2: Manual Kill + Start
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Wait a moment
timeout /t 2

# Start server
npm run dev
```

### Method 3: Find and Kill Specific Port
```powershell
# Find process on port 3005
netstat -ano | findstr :3005

# Kill the specific PID (replace XXXX with actual PID)
taskkill /F /PID XXXX

# Start server
npm run dev
```

---

## 🔴 Why Does This Happen?

The `EADDRINUSE` error occurs when:
1. A previous Node.js process didn't shut down properly
2. Nodemon crashes but leaves the port occupied
3. You have multiple terminals running the server

---

## 💡 Best Practices

### 1. Always Use `start.bat`
Instead of running `npm run dev` directly, use:
```bash
.\start.bat
```

### 2. Stop Server Properly
When stopping the server:
- Press `Ctrl+C` in the terminal
- Wait for it to fully stop
- If it hangs, use `start.bat` next time

### 3. One Server at a Time
- Only run the server in ONE terminal
- Check Task Manager if unsure (look for node.exe processes)

---

## 🛠️ Troubleshooting

### Error: "EADDRINUSE: address already in use :::3005"
**Solution**: Use `.\start.bat` - it will automatically fix this!

### Error: Server keeps crashing
**Check**:
1. Database connection (is MySQL running?)
2. `.env` file (are credentials correct?)
3. Recent code changes (any syntax errors?)

### Error: Can't find start.bat
**Solution**: You're in the wrong directory!
```bash
cd "c:\Users\durva\Downloads\EmsAdmin (2)\unicharm-nodejs"
.\start.bat
```

---

## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `.\start.bat` | **RECOMMENDED** - Clean start |
| `npm run dev` | Normal start (may fail if port busy) |
| `npm start` | Production start |
| `Ctrl+C` | Stop server |
| `rs` | Restart (when nodemon is running) |

---

## ✅ Current Server Status

**Port**: 3005
**Environment**: development
**API Base URL**: http://localhost:3005/api

**All pagination updates are active and working!**

---

## 🎯 Remember

**Always use `.\start.bat` to avoid port conflicts!**

This is the easiest and most reliable way to start your server.
