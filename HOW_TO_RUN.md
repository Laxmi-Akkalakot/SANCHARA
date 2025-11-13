# How to Run Sanchara Project

## Quick Start Guide

### Method 1: Using npm (Recommended)

1. **Open Terminal in VS Code:**
   - Press `Ctrl + `` (backtick) or go to `Terminal > New Terminal`
   - Make sure you're in the project root: `C:\Users\siddu\OneDrive\Documents\GitHub\SANCHARA`

2. **Install Dependencies (if not already installed):**
   ```bash
   cd server
   npm install
   ```

3. **Start the Server:**
   ```bash
   # From project root:
   npm start
   
   # OR from server directory:
   cd server
   node server.js
   ```

4. **Open in Browser:**
   - Open your browser and go to: `http://localhost:5000`
   - The server will be running on port 5000

### Method 2: Using VS Code Run Configuration

1. **Create `.vscode/launch.json`** (if it doesn't exist):
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Launch Sanchara Server",
         "skipFiles": ["<node_internals>/**"],
         "program": "${workspaceFolder}/server/server.js",
         "cwd": "${workspaceFolder}/server",
         "env": {
           "NODE_ENV": "development"
         }
       }
     ]
   }
   ```

2. **Run:**
   - Press `F5` or go to `Run > Start Debugging`
   - Or press `Ctrl+F5` to run without debugging

### Method 3: Using PowerShell/Command Prompt

1. **Open PowerShell or Command Prompt**

2. **Navigate to project:**
   ```powershell
   cd "C:\Users\siddu\OneDrive\Documents\GitHub\SANCHARA"
   ```

3. **Start server:**
   ```powershell
   npm start
   ```

## Running in Demo Mode (Without MongoDB)

If you don't have MongoDB installed, you can run in demo mode:

```powershell
# Set environment variable
$env:DEMO_MODE='true'
npm start
```

Or create a `.env` file in the `server` folder:
```
DEMO_MODE=true
PORT=5000
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use:
```powershell
# Change port in server/server.js or set environment variable
$env:PORT=3000
npm start
```

### Dependencies Not Installed
```powershell
cd server
npm install
```

### Server Not Starting
1. Check if Node.js is installed: `node --version`
2. Check if all dependencies are installed: `cd server && npm list`
3. Check for errors in the terminal output

### Browser Shows "Cannot Connect"
1. Make sure the server is running (check terminal)
2. Check the URL: `http://localhost:5000` (not `https://`)
3. Check if firewall is blocking the connection

## Project Structure

```
SANCHARA/
├── server/
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── config/            # Configuration files
├── public/
│   ├── index.html         # Home page
│   ├── chatbot.html       # Chatbot page
│   ├── login.html         # Login page
│   ├── register.html      # Register page
│   ├── js/                # JavaScript files
│   └── css/               # Stylesheets
└── package.json           # Project configuration
```

## Features Available

Once running, you can:
- ✅ Sign up / Login
- ✅ Chatbot with voice input
- ✅ Smart route options
- ✅ Live location tracking
- ✅ Weather alerts
- ✅ Emergency alerts
- ✅ All accessibility features

## Default URLs

- Home: `http://localhost:5000/`
- Chatbot: `http://localhost:5000/chatbot`
- Login: `http://localhost:5000/login`
- Register: `http://localhost:5000/register`
- API Health: `http://localhost:5000/api/health`

