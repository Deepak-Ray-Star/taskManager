# Railway Deployment Guide

Complete step-by-step guide to deploy Express backend, React frontend, and MongoDB on Railway.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Railway Project Setup](#railway-project-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [MongoDB Setup](#mongodb-setup)
6. [Environment Variables](#environment-variables)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub account with your project repo
- Git installed locally
- Your project files ready

---

## Railway Project Setup

### Step 1: Create a New Railway Project

1. **Log in to Railway**: Go to [railway.app](https://railway.app) and log in
2. **Create new project**: Click "Create a new project" button
3. **Choose template**: Select "Empty Project" 
4. **Name your project**: Give it a meaningful name (e.g., "Team Task Manager")

### Step 2: Connect GitHub Repository

1. Go to your project dashboard
2. Click "Add Service" → "GitHub Repo"
3. Authorize Railway to access your GitHub account
4. Select your repository
5. Choose the branch to deploy (typically `main` or `master`)

---

## Backend Deployment

### Step 1: Add Backend Service

1. In your Railway project, click "Add Service" → "GitHub Repo"
2. Select your repository if not already connected
3. You'll need to create a Nixpacks file for proper configuration

### Step 2: Create `backend/Procfile`

Create a file at `/backend/Procfile`:

```
web: node src/server.js
```

### Step 3: Create `backend/nixpacks.toml`

Create `/backend/nixpacks.toml` for build configuration:

```toml
[build]
pkgManager = "npm"

[build.nixpkgs]
# Node.js 18 LTS
nodejs = "18"

[[phases]]
name = "setup"
cmds = ["npm install"]

[[phases]]
name = "build"
cmds = []

[[phases]]
name = "start"
cmds = ["npm start"]
```

### Step 4: Backend Start Command

In Railway dashboard for the backend service:
- Go to **Settings**
- Set **Start Command**: `node src/server.js`
- Set **Build Command**: `npm install`

---

## Frontend Deployment

### Step 1: Add Frontend Service

1. Click "Add Service" → "GitHub Repo"
2. Select your repository
3. The frontend needs a separate service configuration

### Step 2: Create `frontend/nixpacks.toml`

Create `/frontend/nixpacks.toml`:

```toml
[build]
pkgManager = "npm"

[build.nixpkgs]
nodejs = "18"

[[phases]]
name = "setup"
cmds = ["npm install"]

[[phases]]
name = "build"
cmds = ["npm run build"]
```

### Step 3: Create `frontend/.nixpacks/Dockerfile`

Create the directory and file `/frontend/.nixpacks/Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 4: Frontend Deployment Settings

In Railway dashboard for frontend:
- **Start Command**: `serve -s dist -l $PORT` (Railway uses dynamic PORT)
- **Build Command**: `npm install && npm run build`

---

## MongoDB Setup

### Option 1: Railway MongoDB (Recommended for Quick Start)

1. In your Railway project, click "Add Service"
2. Search for "MongoDB"
3. Click to add MongoDB service
4. Railway automatically provides connection string
5. Connection string available as `DATABASE_URL` environment variable

### Option 2: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

---

## Environment Variables

### Backend Environment Variables

Set these in Railway dashboard (Backend service → Variables):

```
# Server
NODE_ENV=production
PORT=8080

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/team-task-manager
# OR if using Railway MongoDB:
MONGODB_URI=${{ services.mongodb.DATABASE_URL }}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-frontend-domain.up.railway.app

# API (optional)
API_PORT=8080
```

### Frontend Environment Variables

Set these in Railway dashboard (Frontend service → Variables):

```
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

Then use in your frontend code:

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});
```

---

## Build and Start Commands

### Backend

**Build Command**:
```bash
npm install
```

**Start Command**:
```bash
node src/server.js
```

### Frontend

**Build Command**:
```bash
npm install && npm run build
```

**Start Command**:
```bash
serve -s dist -l $PORT
```

*Note: Railway sets the PORT environment variable dynamically*

---

## Connecting Services

### Link Backend to MongoDB

1. Go to Backend service in Railway
2. Click on "Variables"
3. You can reference MongoDB connection string:
   - If Railway MongoDB: `${{ services.mongodb.DATABASE_URL }}`
   - If MongoDB Atlas: Paste your connection string

### Link Frontend to Backend

1. Go to Frontend service in Railway
2. Set variable: `VITE_API_BASE_URL=${{ services.backend.RAILWAY_PUBLIC_DOMAIN }}/api`
3. Or manually set the backend domain URL after deployment

---

## Deployment Step-by-Step

### Complete Deployment Flow

1. **Push code to GitHub** (Railway watches your repo)
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Create Railway Project** → Link GitHub repo

3. **Add Backend Service**
   - Select GitHub repo
   - Configure environment variables
   - Wait for build and deployment

4. **Add MongoDB Service**
   - Railway MongoDB or use MongoDB Atlas

5. **Add Frontend Service**
   - Select GitHub repo
   - Set frontend environment variables
   - Wait for build and deployment

6. **Verify Deployment**
   - Backend: Visit `https://your-backend.up.railway.app/api/health`
   - Frontend: Visit `https://your-frontend.up.railway.app`

---

## Common Issues & Solutions

### Issue 1: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
```javascript
// backend/src/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Set correct `FRONTEND_URL` in Railway variables:
```
FRONTEND_URL=https://your-frontend-domain.up.railway.app
```

### Issue 2: MongoDB Connection Timeout

**Error**: `MongoServerError: connect ETIMEDOUT`

**Solutions**:
1. Check MongoDB URI is correct
2. If MongoDB Atlas, whitelist Railway IPs (or allow all: 0.0.0.0/0)
3. Verify DATABASE_URL in environment variables
4. Check MongoDB service is running (Railway dashboard)

```javascript
// backend/src/config/database.js
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
```

### Issue 3: Frontend Can't Find Backend

**Error**: `Failed to fetch from API` or `ERR_NAME_NOT_RESOLVED`

**Solutions**:
1. Check `VITE_API_BASE_URL` is set correctly
2. Verify backend domain is correct and accessible
3. Check backend service is running

```javascript
// Add this to frontend for debugging
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

### Issue 4: Build Fails - Port Already in Use

**Error**: `EADDRINUSE: address already in use :::8080`

**Solutions**:
```javascript
// backend/src/server.js
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Railway sets PORT automatically, so use it!

### Issue 5: Build Fails - Dependencies Not Found

**Error**: `npm ERR! 404 Not Found`

**Solutions**:
1. Check all dependencies in `package.json` are published
2. Delete `package-lock.json` and recommit:
   ```bash
   rm package-lock.json
   npm install
   git add package-lock.json
   git push
   ```
3. Check Node version compatibility

### Issue 6: Frontend Shows Blank Page

**Error**: Page loads but shows nothing, check console for errors

**Solutions**:
1. Check build output: `npm run build` locally
2. Verify `index.html` references are correct
3. Check for hardcoded URLs instead of environment variables
4. Ensure `public` folder files are included in build

### Issue 7: JWT Token Issues

**Error**: `Invalid token` or `401 Unauthorized`

**Solutions**:
```bash
# Generate new JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set in Railway backend variables:
```
JWT_SECRET=your-newly-generated-secret
JWT_EXPIRES_IN=7d
```

Ensure frontend sends token correctly:
```javascript
// src/services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Issue 8: Hot Reload Not Working (Expected in Production)

**Note**: Hot reload/HMR doesn't work on Railway (production)

**Solution**: This is normal. Use `npm run dev` locally for development

### Issue 9: Dockerfile Errors

**Error**: `docker build failed`

**Solutions**:
- Delete custom Dockerfile if using nixpacks
- Let Railway auto-detect with `nixpacks.toml`
- Or ensure Dockerfile is valid Node.js Dockerfile

### Issue 10: Variables Not Loading in Frontend

**Error**: `import.meta.env.VITE_API_BASE_URL` is undefined

**Solutions**:
1. Rebuild frontend after adding variables
2. Check variable name starts with `VITE_`
3. Verify build step includes new variables
4. Clear browser cache

```javascript
// Add fallback
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
console.log('Using API:', API_URL);
```

---

## Debugging Tips

### View Logs

1. Click on service in Railway dashboard
2. Go to "Deployments" tab
3. Click latest deployment
4. View "Logs" for build and runtime output

### Check Status

```
Backend: GET https://your-backend.up.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Restart Service

1. Go to service settings
2. Click "Redeploy" to restart

### View Environment Variables

1. Click service → "Variables"
2. See all set variables and values

---

## Quick Reference

| Component | Build | Start | Port |
|-----------|-------|-------|------|
| Backend | `npm install` | `node src/server.js` | $PORT (dynamic) |
| Frontend | `npm install && npm run build` | `serve -s dist -l $PORT` | $PORT (dynamic) |
| MongoDB | N/A | Managed by Railway | 27017 |

---

## Next Steps

1. Deploy to Railway
2. Test all endpoints
3. Set up monitoring/alerting in Railway
4. Configure custom domain (if needed)
5. Set up backups for MongoDB

---

## Useful Resources

- [Railway Docs](https://docs.railway.app)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Nixpacks Documentation](https://nixpacks.com)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas)
- [Express.js Documentation](https://expressjs.com)
- [React/Vite Documentation](https://vitejs.dev)

