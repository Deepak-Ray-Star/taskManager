# Team Task Manager - Complete Backend API Documentation

## Project Overview
Complete backend implementation for Team Task Manager using Express.js and MongoDB with MVC architecture, JWT authentication, and role-based authorization.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB (Mongoose ODM 7.0.0)
- **Authentication**: JWT (jsonwebtoken 9.0.0)
- **Password Hashing**: bcryptjs 2.4.3
- **Validation**: express-validator 7.0.0
- **Security**: 
  - CORS (cors 2.8.5)
  - Helmet (helmet 7.0.0)
- **Environment**: dotenv 16.0.3
- **Development**: nodemon 2.0.20

## Architecture

### MVC Structure
```
backend/
├── src/
│   ├── server.js                    # Express app entry point
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Project.js               # Project schema
│   │   └── Task.js                  # Task schema
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── projectController.js     # Project management logic
│   │   └── taskController.js        # Task management logic
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── projectRoutes.js         # Project endpoints
│   │   ├── taskRoutes.js            # Task endpoints (general)
│   │   └── projectTaskRoutes.js     # Task endpoints (project-specific)
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── authorize.js             # Role-based authorization
│   │   ├── errorHandler.js          # Centralized error handling
│   │   └── validators.js            # Request validation
│   └── utils/
│       └── tokenUtils.js            # JWT token generation
├── .env                              # Environment variables
├── package.json                      # Dependencies
└── Dockerfile                        # Container configuration
```

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['admin', 'member'], default: 'member'),
  createdAt: Date (default: now)
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  admin: ObjectId (ref: User, required),
  members: [ObjectId] (ref: User),
  status: String (enum: ['active', 'archived'], default: 'active'),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  project: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, required),
  createdBy: ObjectId (ref: User, required),
  status: String (enum: ['todo', 'in_progress', 'completed'], default: 'todo'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate: Date (required),
  isOverdue: Boolean (computed),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

## API Endpoints

### Authentication Routes `/api/auth`

#### POST /api/auth/signup
Register a new user
```
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

#### POST /api/auth/login
Login user
```
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

#### GET /api/auth/me
Get current logged-in user (Protected)
```
Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### Project Routes `/api/projects` (Protected)

#### GET /api/projects
Get all projects for current user
```
Response (200):
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "project_id",
      "name": "Project Name",
      "description": "Description",
      "admin": {...},
      "members": [...],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/projects
Create new project
```
Request:
{
  "name": "New Project",
  "description": "Project description"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "project_id",
    "name": "New Project",
    "description": "Project description",
    "admin": {...},
    "members": [...],
    "status": "active"
  }
}
```

#### GET /api/projects/:id
Get single project details
```
Response (200):
{
  "success": true,
  "data": {
    "_id": "project_id",
    "name": "Project Name",
    ...
  }
}
```

#### PUT /api/projects/:id
Update project (admin only)
```
Request:
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "archived"
}

Response (200):
{
  "success": true,
  "data": {...}
}
```

#### DELETE /api/projects/:id
Delete project (admin only)
```
Response (200):
{
  "success": true,
  "message": "Project deleted"
}
```

#### POST /api/projects/:id/members
Add member to project (admin only)
```
Request:
{
  "memberId": "user_id"
}

Response (200):
{
  "success": true,
  "data": {...}
}
```

#### DELETE /api/projects/:id/members/:memberId
Remove member from project (admin only)
```
Response (200):
{
  "success": true,
  "data": {...}
}
```

### Task Routes `/api/tasks` (Protected)

#### GET /api/tasks
Get all tasks for current user
```
Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task description",
      "project": {...},
      "assignedTo": {...},
      "createdBy": {...},
      "status": "todo",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00Z",
      "isOverdue": false
    }
  ]
}
```

#### POST /api/tasks
Create new task
```
Request:
{
  "projectId": "project_id",
  "title": "New Task",
  "description": "Task description",
  "assignedTo": "user_id",
  "dueDate": "2024-01-15T00:00:00Z",
  "priority": "high"
}

Response (201):
{
  "success": true,
  "data": {...}
}
```

#### GET /api/tasks/dashboard/stats
Get dashboard statistics (Protected)
```
Response (200):
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "completedTasks": 3,
    "pendingTasks": 7,
    "overdueTasks": 2,
    "myTasks": 5,
    "myCompletedTasks": 1,
    "myPendingTasks": 4
  }
}
```

#### GET /api/tasks/:id
Get single task
```
Response (200):
{
  "success": true,
  "data": {...}
}
```

#### PUT /api/tasks/:id
Update task
```
Request:
{
  "title": "Updated Title",
  "status": "in_progress",
  "priority": "medium",
  "assignedTo": "user_id"
}

Response (200):
{
  "success": true,
  "data": {...}
}
```

#### DELETE /api/tasks/:id
Delete task (project admin only)
```
Response (200):
{
  "success": true,
  "message": "Task deleted"
}
```

### Project Task Routes `/api/projects/:projectId/tasks` (Protected)

#### GET /api/projects/:projectId/tasks
Get all tasks for specific project
```
Response (200):
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### POST /api/projects/:projectId/tasks
Create task for specific project
```
Request:
{
  "title": "New Task",
  "description": "Description",
  "assignedTo": "user_id",
  "dueDate": "2024-01-15T00:00:00Z",
  "priority": "high"
}

Response (201):
{
  "success": true,
  "data": {...}
}
```

### Utility Routes

#### GET /api/health
Health check endpoint
```
Response (200):
{
  "status": "OK",
  "message": "Server is running"
}
```

## Authentication & Authorization

### JWT Token
- Payload: `{ id: userId, role: userRole }`
- Secret: `JWT_SECRET` from environment
- Expiry: `JWT_EXPIRE` from environment (default: 7d)
- Header: `Authorization: Bearer <token>`

### Middleware Chain
1. **auth.js** - Verifies JWT token and extracts user info
2. **authorize.js** - Role-based authorization (if needed)
3. **validators.js** - Request body validation

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Resource created
- **400**: Bad request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **500**: Server error

### Error Response Format
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Handled Errors
- CastError: Invalid MongoDB ID format
- ValidationError: Mongoose schema validation
- Duplicate Key Error (11000): Unique field conflict
- Token Errors: Expired or invalid JWT

## Security Features

1. **Password Hashing**: bcryptjs with salt rounds (10)
2. **JWT Authentication**: Token-based auth with expiry
3. **CORS**: Configurable cross-origin requests
4. **Helmet**: HTTP security headers
5. **Input Validation**: express-validator for all requests
6. **Role-Based Access Control**: Admin vs Member permissions

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running the Server

### Development
```bash
cd backend
npm install
npm run dev
```

### Production
```bash
cd backend
npm install
npm start
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Testing the API

### Example: Complete Flow

1. **Register User**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

2. **Create Project**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

3. **Create Task**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project_id",
    "title": "Task 1",
    "assignedTo": "user_id",
    "dueDate": "2024-01-15T00:00:00Z",
    "priority": "high"
  }'
```

## Database Relationships

```
User (1) ──→ (M) Project (as admin)
User (1) ──→ (M) Project (as members)
User (1) ──→ (M) Task (createdBy)
User (1) ──→ (M) Task (assignedTo)
Project (1) ──→ (M) Task
```

## Key Features Implemented

✅ Complete MVC Architecture
✅ JWT Authentication
✅ bcrypt Password Hashing
✅ Role-Based Authorization
✅ Request Validation
✅ Centralized Error Handling
✅ CORS Support
✅ Security Headers (Helmet)
✅ MongoDB Integration
✅ RESTful API Design
✅ Comprehensive Route Coverage
✅ Dashboard Statistics
✅ Overdue Task Detection
✅ Team Member Management
✅ Project Status Tracking

## Code Quality Improvements

- Error handling with try-catch blocks
- Consistent response format
- Request validation on all inputs
- Proper HTTP status codes
- Security best practices
- Environment-based configuration
- Scalable folder structure
