# BossFlow - Backend

Backend for the BossFlow application developed with Node.js, Express and MongoDB.

## Prerequisites

- Node.js v24.11.0
- MongoDB
- npm

## Installation

### 1. Install MongoDB (if you don't have it)

**Option 1: MongoDB Community Server (Recommended)**

1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Select your operating system (Windows)
3. Download the MSI installer
4. Run the installer and follow the steps:
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Keep default options (port 27017)
5. The MongoDB service will start automatically

**Option 2: MongoDB Compass (GUI included)**

If you installed MongoDB Community Server with default options, MongoDB Compass is already installed. If not:

1. Download from: https://www.mongodb.com/try/download/compass
2. Install and run MongoDB Compass
3. Connect to `mongodb://localhost:27017`

**Verify installation:**

```powershell
Get-Service -Name MongoDB
```

It should show "Running". If it shows "Stopped", start it:

```powershell
Start-Service -Name MongoDB
```

### 2. Install project dependencies

```bash
npm install
```

### 3. Configure MongoDB

**Verify MongoDB is running:**

Windows:
```powershell
Get-Service -Name MongoDB
```

If it is not running, start it from **MongoDB Compass** or from Windows Services.

**Database configuration:**

The backend connects by default to:
- Host: `127.0.0.1`
- Port: `27017`
- Database: `bossflowDB`

The `bossflowDB` database will be created automatically the first time you run the server.

If you need to change the configuration, edit `config/db.js`:

```javascript
await mongoose.connect("mongodb://127.0.0.1:27017/bossflowDB", {
  // Change the URL if you need a different host/port/database
});
```

## Run the server

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server will start at `http://localhost:8080`

## Available endpoints

- `GET /api` - Verify the API is working
- `POST /api/eco` - Test endpoint that returns what it receives

## Project structure

```
backend/
├── config/
│   └── db.js           # MongoDB configuration
├── routes/
│   └── index.js        # API routes
├── server.js           # Server entry point
└── package.json        # Dependencies and scripts
```

## Troubleshooting

### Error: MongoDB connection failed

**Issue:** `❌ Error connecting to MongoDB`

**Solutions:**

1. Verify MongoDB is running:
```powershell
Get-Service -Name MongoDB
```

2. If it is not running, start it:
```powershell
Start-Service -Name MongoDB
```

3. Verify connection with MongoDB Compass:
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - If it connects, the issue is in the backend configuration

4. If MongoDB is not installed, follow the "Install MongoDB" section of this README

### Error: Port 8080 already in use

**Issue:** Port 8080 is already in use

**Solution:**

Change the port in `server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Change 8080 to your preferred port
```

## Available scripts

- `npm start` - Run server in production mode
- `npm run dev` - Run server with nodemon (auto-reload)

## Technologies

- Node.js v24.11.0
- Express v5.1.0
- Mongoose v8.19.3
- MongoDB