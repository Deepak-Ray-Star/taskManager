# Setup Guide

Complete guide to set up and run the Team Task Manager application locally.

## System Requirements

- Node.js v14 or higher
- MongoDB (Local or Atlas)
- Git
- npm or yarn

## Local Setup

### 1. Clone or Extract Project

```bash
cd projectMaker
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**MongoDB Options:**

**Option A: Local MongoDB**
- Install MongoDB: https://docs.mongodb.com/manual/installation/
- Start MongoDB service
- Use: `mongodb://localhost:27017/team-task-manager`

**Option B: MongoDB Atlas (Cloud)**
- Create account: https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Replace username/password in connection string

#### 2.3 Start Backend

```bash
npm run dev
```

You should see: `Server running in development mode on port 5000`

Test health endpoint:
```bash
curl http://localhost:5000/api/health
```

### 3. Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend

```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.4 Start Frontend

```bash
npm run dev
```

You should see: `Local: http://localhost:3000`

## Accessing the Application

1. Open browser
2. Visit: `http://localhost:3000`
3. You will be redirected to login page

## Testing the Application

### Test Flow

#### Step 1: Create Account

1. Click "Sign Up"
2. Fill in details:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Sign Up"
4. You'll be logged in and redirected to dashboard

#### Step 2: View Dashboard

- See your statistics:
  - Total Tasks: 0
  - Completed: 0
  - Pending: 0
  - Overdue: 0

#### Step 3: Create a Project

1. Click "Projects" in navbar
2. Click "+ New Project"
3. Fill in:
   - Name: `My First Project`
   - Description: `A test project`
4. Click "Create Project"

#### Step 4: Create a Task

1. Click on the project card
2. Click "+ New Task"
3. Fill in:
   - Title: `Fix login bug`
   - Assign To: `John Doe`
   - Due Date: Tomorrow's date
   - Priority: High
   - Description: `Login button not working`
4. Click "Create Task"

#### Step 5: Update Task Status

1. Click "Start" to change status to "In Progress"
2. Click "Complete" to mark as completed
3. Check dashboard for updated statistics

#### Step 6: Create Another User

1. Open incognito window
2. Visit `http://localhost:3000`
3. Sign up with different email:
   - Email: `jane@example.com`
   - Password: `password123`

#### Step 7: Add Team Member

1. Go back to first account (refresh page)
2. Go to Projects
3. Click on your project
4. Click "Add Member" 
5. Select Jane's account
6. Assign her a task
7. Jane can see tasks assigned to her

## Development Commands

### Backend

```bash
# Development mode (auto-reload with nodemon)
npm run dev

# Production mode
npm start

# Run tests (if configured)
npm test
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Database

### View MongoDB Data

**Using MongoDB Compass:**

1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse collections:
   - `users`
   - `projects`
   - `tasks`

**Using mongosh CLI:**

```bash
mongosh
use team-task-manager
db.users.find()
db.projects.find()
db.tasks.find()
```

## API Testing

### Using Postman

1. Import these requests

**Signup**
```
POST http://localhost:5000/api/auth/signup
Body (JSON):
{
  "name": "John",
  "email": "john@test.com",
  "password": "password123"
}
```

**Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@test.com",
  "password": "password123"
}
```

**Get Projects** (add token to Authorization header)
```
GET http://localhost:5000/api/projects
Header: Authorization: Bearer <your-token>
```

## Troubleshooting

### Backend Won't Start

**Error: Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

**Error: Cannot connect to MongoDB**
- Ensure MongoDB is running: `mongosh` should connect
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

**Error: JWT errors**
- Ensure `JWT_SECRET` is set in `.env`
- Try restarting backend

### Frontend Won't Start

**Error: Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

**Error: Cannot reach API**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

**Error: Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Authentication Issues

**Token not persisting**
- Check browser localStorage: `F12 → Application → LocalStorage`
- Should have `token` key with JWT value

**Login button not working**
- Check browser console (F12) for errors
- Verify backend is running
- Check network tab to see API response

## Performance Optimization

### Backend
- Use database indexing on MongoDB
- Implement caching strategies
- Optimize database queries
- Use pagination for large datasets

### Frontend
- Code splitting with React.lazy()
- Image optimization
- CSS minification (Tailwind handles this)
- Remove console.logs in production

## Security Notes

1. **Never commit `.env` files**
   - Add to `.gitignore`
   - Share only `.env.example`

2. **Change JWT_SECRET in production**
   - Use strong random string
   - Don't use the default value

3. **Use HTTPS in production**
   - Railway provides free HTTPS

4. **Sanitize user inputs**
   - Already implemented with validators

5. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

## Next Steps

1. **Customize UI** - Modify Tailwind colors/styles
2. **Add more features** - Filters, notifications, exports
3. **Setup CI/CD** - GitHub Actions for auto-deploy
4. **Add tests** - Jest for unit tests
5. **Deploy to Railway** - Follow DEPLOYMENT_GUIDE.md

## Useful Links

- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Vite Docs: https://vitejs.dev/
- Railway Docs: https://docs.railway.app/

## Support

For issues:
1. Check error messages carefully
2. Review browser console and terminal logs
3. Ensure all dependencies are installed
4. Try restarting both servers
5. Check that MongoDB is running
6. Review TROUBLESHOOTING section above

Happy coding! 🚀
