# Team Task Manager - Backend

REST API for Team Task Manager application built with Node.js, Express, and MongoDB.

## Features

- ✅ User Authentication (Signup/Login) with JWT
- ✅ Role-Based Access Control (Admin/Member)
- ✅ Project Management (CRUD operations)
- ✅ Task Management (Create, Assign, Track Status)
- ✅ Dashboard Statistics
- ✅ Input Validation
- ✅ Error Handling Middleware
- ✅ Security (Helmet, CORS, bcrypt)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

4. Update `.env` with your configuration
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:id` - Get single project (Protected)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)
- `POST /api/projects/:id/members` - Add member (Protected)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (Protected)

### Tasks
- `GET /api/projects/:projectId/tasks` - Get project tasks (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/projects/:projectId/tasks` - Create task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)
- `GET /api/tasks/dashboard/stats` - Get dashboard stats (Protected)

### Health
- `GET /api/health` - Health check

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── projectController.js # Project logic
│   │   └── taskController.js    # Task logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── authorize.js         # Role-based authorization
│   │   ├── errorHandler.js      # Error handling
│   │   └── validators.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Project.js           # Project schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   ├── projectRoutes.js     # Project routes
│   │   ├── taskRoutes.js        # Task routes
│   │   └── projectTaskRoutes.js # Nested task routes
│   ├── utils/
│   │   └── tokenUtils.js        # JWT utilities
│   └── server.js                # Express app setup
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  createdAt: Date
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  admin: ObjectId (User),
  members: [ObjectId] (User),
  status: 'active' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  status: 'todo' | 'in_progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment to Railway

1. Create account on [Railway.app](https://railway.app)

2. Install Railway CLI
```bash
npm i -g @railway/cli
```

3. Login to Railway
```bash
railway login
```

4. Initialize project
```bash
railway init
```

5. Add MongoDB plugin from Railway dashboard

6. Set environment variables in Railway dashboard
```
PORT=5000
MONGODB_URI=<Railway MongoDB URI>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=<your-frontend-railway-url>
```

7. Deploy
```bash
railway up
```

8. Get deployment URL from Railway dashboard

## Testing

Using Postman or similar API client:

1. Sign up: POST `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

2. Login: POST `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

3. Create Project: POST `/api/projects`
```json
{
  "name": "My Project",
  "description": "Project description"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Error handling without sensitive info

## License

ISC
