# Railway Deployment Guide

This guide will help you deploy the Team Task Manager application to Railway.

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. Railway CLI installed
```bash
npm install -g @railway/cli
```

## Step 1: Prepare Your Repository

```bash
# Ensure you have both backend and frontend folders
# backend/
# frontend/
```

## Step 2: Backend Deployment

### 2.1 Deploy Backend Service

```bash
cd backend

# Login to Railway
railway login

# Initialize new project
railway init

# This will create a railway.json file
```

### 2.2 Add MongoDB

From Railway Dashboard:
1. Go to your project
2. Click "Add service"
3. Select "Add from Marketplace"
4. Search and add "MongoDB"
5. Accept the plugin installation

### 2.3 Set Environment Variables

In Railway Dashboard:
1. Select the backend service
2. Go to "Variables" tab
3. Add these variables:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=<generate-a-strong-secret-key>
JWT_EXPIRE=7d
FRONTEND_URL=<your-frontend-railway-url>
```

The `MONGODB_URI` will be automatically set by the MongoDB plugin.

### 2.4 Deploy

```bash
railway up
```

Get your backend URL from the Railway dashboard:
- It will be something like: `https://your-backend.railway.app`

## Step 3: Frontend Deployment

### 3.1 Deploy Frontend Service

```bash
cd frontend

# Initialize new Railway project
railway init
```

### 3.2 Create railway.json

Create/update `railway.json`:

```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm install && npm run build"
  },
  "start": "npm install -g serve && serve -s dist -l 3000"
}
```

### 3.3 Set Environment Variables

In Railway Dashboard:
1. Select the frontend service
2. Go to "Variables" tab
3. Add:

```
VITE_API_URL=<your-backend-railway-url>/api
```

### 3.4 Deploy

```bash
railway up
```

Get your frontend URL from the Railway dashboard.

## Step 4: Verify Deployment

1. Visit your frontend URL
2. Try signing up with a test account
3. Create a project
4. Create tasks
5. Check the dashboard

## Troubleshooting

### Backend Issues

**Connection refused**
- Check MongoDB is running in Railway
- Verify `MONGODB_URI` environment variable

**JWT errors**
- Ensure `JWT_SECRET` is set
- Make sure `FRONTEND_URL` matches your frontend domain

**CORS errors**
- Verify `FRONTEND_URL` environment variable
- Should be: `https://your-frontend.railway.app` (without trailing slash)

### Frontend Issues

**API not responding**
- Check `VITE_API_URL` is correct
- Verify backend is running
- Check browser console for CORS errors

**Build fails**
- Ensure `npm install` works locally
- Check for missing dependencies
- Verify `package.json` exists

## Environment Variables Checklist

### Backend
- [ ] `PORT=5000`
- [ ] `MONGODB_URI=<Railway MongoDB>`
- [ ] `JWT_SECRET=<strong-random-string>`
- [ ] `JWT_EXPIRE=7d`
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=<frontend-url>`

### Frontend
- [ ] `VITE_API_URL=<backend-url>/api`

## Custom Domain (Optional)

1. Go to Railway project settings
2. Find "Domain" section
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring

In Railway Dashboard:
- View logs: Deployments tab
- Monitor resources: Resources tab
- Check environment variables: Variables tab

## Rolling Back

If something goes wrong:
1. Go to Deployments tab
2. Click the previous deployment
3. Click "Redeploy"

## Updating Your Deployment

To push new changes:

```bash
# Backend
cd backend
git add .
git commit -m "Update backend"
railway up

# Frontend
cd frontend
git add .
git commit -m "Update frontend"
railway up
```

## Performance Tips

1. **Enable compression** in Express
2. **Optimize images** on frontend
3. **Use lazy loading** for routes
4. **Monitor database queries**
5. **Set up caching** strategies

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong passwords
- [ ] Enable HTTPS (Railway does this by default)
- [ ] Keep dependencies updated
- [ ] Monitor for suspicious activity
- [ ] Regular backups of MongoDB

## Support

For Railway support: https://railway.app/support

For application issues, check logs in Railway Dashboard or run locally for debugging.
