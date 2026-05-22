# Railway Environment Variables Reference
# Copy and modify for your Railway project dashboard

## Backend Variables
# Set these in Railway Backend Service → Variables

# Server Configuration
NODE_ENV=production
PORT=8080

# Database Connection
# Option 1: Using Railway MongoDB Service
MONGODB_URI=${{ services.mongodb.DATABASE_URL }}

# Option 2: Using MongoDB Atlas (replace with your credentials)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-change-this
JWT_EXPIRES_IN=7d

# CORS Configuration (set to your frontend URL)
FRONTEND_URL=https://your-frontend-domain.up.railway.app

# Optional: API Configuration
API_PORT=8080
LOG_LEVEL=info

---

## Frontend Variables
# Set these in Railway Frontend Service → Variables

# API Base URL (set to your backend domain)
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api

---

## How to Generate Secure JWT_SECRET

# Run this in terminal:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online: https://generate-secret.vercel.app
