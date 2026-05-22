# Railway Deployment - Quick Start (15 minutes)

## Step-by-Step Deployment

### Step 1: Prepare Your Code (2 minutes)

**1a. Update Backend Server Port**

Open [backend/src/server.js](backend/src/server.js) and verify it uses the PORT environment variable:

```javascript
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**1b. Update Frontend API Configuration**

Open [frontend/src/services/api.js](frontend/src/services/api.js) and add:

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 2: Commit to GitHub (2 minutes)

```bash
# From project root directory
git add .
git commit -m "Add Railway configuration files and updates"
git push origin main
```

### Step 3: Create Railway Project (2 minutes)

1. Visit [railway.app](https://railway.app)
2. Log in with GitHub account
3. Click **"Create a new project"**
4. Select **"Empty Project"**
5. Name it: `team-task-manager` (or your project name)

### Step 4: Connect GitHub Repository (2 minutes)

1. In your Railway project, click **"Add Service"**
2. Select **"GitHub Repo"**
3. Click **"Authorize Railway"** and grant permissions
4. Select your repository
5. Select branch: `main` (or your default branch)
6. Click **"Deploy"**

*Railway will now watch this repo and auto-deploy on push*

### Step 5: Deploy Backend Service (2 minutes)

1. Click **"Add Service"** → **"GitHub Repo"**
2. Select your repo (should be pre-selected)
3. In **"Settings"**:
   - **Service Name**: `team-task-manager-backend`
   - **Root Directory**: `backend`
   
4. Go to **"Variables"** and add:

```
NODE_ENV=production
JWT_SECRET=[generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
FRONTEND_URL=https://your-frontend-domain.up.railway.app
```

*Get frontend domain after deploying frontend*

### Step 6: Deploy MongoDB (2 minutes)

**Option A: Railway MongoDB (Easiest)**
1. Click **"Add Service"** → **"Database"** → **"MongoDB"**
2. Railway auto-generates `DATABASE_URL`
3. In Backend service **Variables**, add: `MONGODB_URI=${{ services.mongodb.DATABASE_URL }}`

**Option B: MongoDB Atlas (Production)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and database user
3. Get connection string
4. In Backend **Variables**, add: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Step 7: Deploy Frontend Service (2 minutes)

1. Click **"Add Service"** → **"GitHub Repo"**
2. Select your repo
3. In **"Settings"**:
   - **Service Name**: `team-task-manager-frontend`
   - **Root Directory**: `frontend`

4. Go to **"Variables"** and add:

```
VITE_API_URL=https://your-backend-domain.up.railway.app/api
```

*Get backend domain from Backend service dashboard*

### Step 8: Update Backend FRONTEND_URL (1 minute)

1. Get your frontend domain from Frontend service dashboard
2. Update Backend **Variables**:
   - `FRONTEND_URL=https://your-frontend-domain.up.railway.app`

### Step 9: Test Your Deployment (2 minutes)

1. **Test Backend**:
   ```
   GET https://your-backend-domain.up.railway.app/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit `https://your-frontend-domain.up.railway.app`
   - Check browser console (F12) for API errors
   - Try signing up or logging in

3. **Check Logs** if issues:
   - Click service → **"Deployments"** → Latest → **"Logs"**

---

## Domain Names

After deployment, you'll get domains:
- Backend: `your-app-backend.up.railway.app`
- Frontend: `your-app-frontend.up.railway.app`
- MongoDB: Managed by Railway (no public domain needed)

---

## Environment Variables Quick Reference

| Variable | Backend | Frontend | Value Example |
|----------|---------|----------|----------------|
| `NODE_ENV` | ✓ | | `production` |
| `PORT` | Auto | Auto | (auto-set by Railway) |
| `MONGODB_URI` | ✓ | | `${{ services.mongodb.DATABASE_URL }}` |
| `JWT_SECRET` | ✓ | | (generate new random key) |
| `FRONTEND_URL` | ✓ | | `https://frontend.up.railway.app` |
| `VITE_API_URL` | | ✓ | `https://backend.up.railway.app/api` |

---

## If Deployment Fails

**Check these first:**

1. **Backend won't start**
   - View logs: Service → Deployments → Latest → Logs
   - Ensure `NODE_ENV=production` is set
   - Verify `MONGODB_URI` is correct
   - Check `JWT_SECRET` is set

2. **Frontend shows blank**
   - Check build output in logs
   - Verify `VITE_API_URL` is set
   - Clear browser cache (Ctrl+Shift+Delete)
   - Check console for errors (F12)

3. **Frontend can't reach backend**
   - Verify `VITE_API_URL` has correct backend domain
   - Check CORS is enabled in backend:
     ```javascript
     app.use(cors({
       origin: process.env.FRONTEND_URL,
       credentials: true,
     }));
     ```
   - Ensure backend is running (test `/api/health`)

4. **Database connection fails**
   - If Railway MongoDB: Check service is running (dashboard)
   - If MongoDB Atlas: Whitelist Railway IP or use 0.0.0.0/0
   - Verify `MONGODB_URI` format is correct

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `CORS blocked` | Set `FRONTEND_URL` in backend variables |
| `Cannot find module` | Ensure dependencies in `package.json` |
| `EADDRINUSE: port already in use` | Use `process.env.PORT` instead of hardcoded port |
| `MongooseError: Timeout` | Check MongoDB service running or connection string |
| `JWT_SECRET undefined` | Add `JWT_SECRET` to backend variables |
| `API returns 404` | Verify `VITE_API_URL` is correct |
| `Blank frontend page` | Check browser console for build errors |

---

## Next: Custom Domain (Optional)

After deployment works:
1. In Railway project settings
2. Add custom domain
3. Update DNS records
4. Update `FRONTEND_URL` and `VITE_API_URL`

---

## Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Issues? Check service logs in Railway dashboard
- See [RAILWAY_DEPLOYMENT_GUIDE.md](RAILWAY_DEPLOYMENT_GUIDE.md) for detailed troubleshooting
