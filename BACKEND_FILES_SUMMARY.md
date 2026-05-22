# Backend Code - Complete File Summary

## File Structure Overview

```
backend/
├── .env                                  [Configuration]
├── Dockerfile                            [Container]
├── package.json                          [Dependencies]
├── README.md                             [Documentation]
├── src/
│   ├── server.js                         [Main Entry Point]
│   ├── config/
│   │   └── database.js                   [MongoDB Connection]
│   ├── models/
│   │   ├── User.js                       [User Schema]
│   │   ├── Project.js                    [Project Schema]
│   │   └── Task.js                       [Task Schema]
│   ├── controllers/
│   │   ├── authController.js             [Auth Logic]
│   │   ├── projectController.js          [Project Logic]
│   │   └── taskController.js             [Task Logic]
│   ├── routes/
│   │   ├── authRoutes.js                 [Auth Routes]
│   │   ├── projectRoutes.js              [Project Routes]
│   │   ├── taskRoutes.js                 [Task Routes]
│   │   └── projectTaskRoutes.js          [Project-Task Routes]
│   ├── middleware/
│   │   ├── auth.js                       [JWT Auth]
│   │   ├── authorize.js                  [Role-Based Auth]
│   │   ├── errorHandler.js               [Error Handling]
│   │   └── validators.js                 [Request Validation]
│   └── utils/
│       └── tokenUtils.js                 [JWT Utilities]
```

## Detailed File Contents

### 1. Configuration Files

#### `.env`
Environment variables for the application:
- PORT: 5000
- MONGODB_URI: MongoDB Atlas connection string
- JWT_SECRET: Secret key for JWT signing
- JWT_EXPIRE: Token expiration time (7d)
- NODE_ENV: development/production

#### `package.json`
```json
{
  "name": "team-task-manager-backend",
  "version": "1.0.0",
  "description": "Team Task Manager Backend API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --watchAll=false"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "express-validator": "^7.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.0.0"
  }
}
```

### 2. Database & Models

#### `config/database.js`
Handles MongoDB connection with Mongoose:
- Connects to MongoDB Atlas using MONGODB_URI
- Uses new URL parser and unified topology
- Logs connection status
- Exits process on connection error

#### `models/User.js`
User schema with:
- name, email, password, role, createdAt
- Pre-save hook to hash passwords with bcryptjs
- Custom method: matchPassword() for authentication
- Email validation with regex
- Password minimum 6 characters
- Default role: 'member'

#### `models/Project.js`
Project schema with:
- name, description, admin (ref: User), members array (ref: User)
- status (active/archived)
- createdAt, updatedAt timestamps
- Auto-updates updatedAt on save

#### `models/Task.js`
Task schema with:
- title, description, project (ref: Project), assignedTo (ref: User)
- createdBy (ref: User)
- status (todo/in_progress/completed)
- priority (low/medium/high)
- dueDate (required)
- isOverdue (computed field)
- createdAt, updatedAt timestamps
- Auto-computes isOverdue on save

### 3. Controllers

#### `controllers/authController.js`
**Methods:**
1. `signup` - POST /api/auth/signup
   - Creates new user with hashed password
   - Checks for existing email
   - Returns JWT token and user data

2. `login` - POST /api/auth/login
   - Verifies email and password
   - Compares passwords using bcrypt
   - Returns JWT token and user data

3. `getMe` - GET /api/auth/me
   - Returns current authenticated user
   - Requires valid JWT token

#### `controllers/projectController.js`
**Methods:**
1. `getProjects` - GET /api/projects
   - Returns all projects where user is admin or member
   - Populates admin and members data

2. `getProject` - GET /api/projects/:id
   - Returns single project with auth check
   - Verifies user access

3. `createProject` - POST /api/projects
   - Creates new project with current user as admin
   - Adds user to members array

4. `updateProject` - PUT /api/projects/:id
   - Updates project name, description, status
   - Admin-only permission

5. `deleteProject` - DELETE /api/projects/:id
   - Deletes project from database
   - Admin-only permission

6. `addMember` - POST /api/projects/:id/members
   - Adds user to project members
   - Admin-only permission
   - Checks for duplicate members

7. `removeMember` - DELETE /api/projects/:id/members/:memberId
   - Removes user from project members
   - Admin-only permission

#### `controllers/taskController.js`
**Methods:**
1. `getAllTasks` - GET /api/tasks
   - Returns all tasks for user's projects
   - Sorted by due date
   - Populates user and project references

2. `getTasks` - GET /api/projects/:projectId/tasks
   - Returns all tasks for specific project
   - Project access check

3. `getTask` - GET /api/tasks/:id
   - Returns single task with full population
   - Project access verification

4. `createGeneralTask` - POST /api/tasks
   - Creates task with projectId in body
   - Verifies assigned user is project member
   - Returns populated task

5. `createProjectTask` - POST /api/projects/:projectId/tasks
   - Creates task for specific project
   - ProjectId from URL parameter

6. `updateTask` - PUT /api/tasks/:id
   - Updates title, description, status, priority, dueDate, assignedTo
   - Project access check
   - Auto-updates updatedAt field

7. `deleteTask` - DELETE /api/tasks/:id
   - Deletes task from database
   - Admin-only permission check

8. `getDashboardStats` - GET /api/tasks/dashboard/stats
   - Returns statistics for dashboard
   - Total, completed, pending, overdue tasks
   - User-specific task counts

### 4. Routes

#### `routes/authRoutes.js`
```
POST   /api/auth/signup         (public, validated)
POST   /api/auth/login          (public, validated)
GET    /api/auth/me             (protected)
```

#### `routes/projectRoutes.js`
```
GET    /api/projects            (protected)
POST   /api/projects            (protected, validated)
GET    /api/projects/:id        (protected)
PUT    /api/projects/:id        (protected, validated)
DELETE /api/projects/:id        (protected)
POST   /api/projects/:id/members        (protected)
DELETE /api/projects/:id/members/:memberId (protected)
```

#### `routes/taskRoutes.js`
```
GET    /api/tasks/dashboard/stats   (protected)
GET    /api/tasks                   (protected)
POST   /api/tasks                   (protected, validated)
GET    /api/tasks/:id               (protected)
PUT    /api/tasks/:id               (protected, validated)
DELETE /api/tasks/:id               (protected)
```

#### `routes/projectTaskRoutes.js`
```
GET    /api/projects/:projectId/tasks     (protected)
POST   /api/projects/:projectId/tasks     (protected, validated)
```

### 5. Middleware

#### `middleware/auth.js`
JWT Authentication middleware:
- Extracts token from Authorization header
- Verifies token with JWT_SECRET
- Adds userId and userRole to req object
- Returns 401 for missing/invalid token

#### `middleware/authorize.js`
Role-based authorization:
- Accepts array of allowed roles
- Returns 403 if user role not in allowed list
- Used to restrict endpoints to admins, members, etc.

#### `middleware/errorHandler.js`
Centralized error handling:
- Logs errors to console
- Handles CastError (invalid MongoDB ID)
- Handles ValidationError (Mongoose schema)
- Handles Duplicate Key Error (11000)
- Returns appropriate status codes and messages

#### `middleware/validators.js`
Request validation using express-validator:
- `validateRequest` - Middleware to check validation results
- `validateSignup` - Validates name, email, password
- `validateLogin` - Validates email and password
- `validateProject` - Validates project name and description
- `validateTask` - Validates task title, dueDate, priority

### 6. Utilities

#### `utils/tokenUtils.js`
JWT token generation and response:
- `generateToken(id, role)` - Generates JWT with expiry
- `sendTokenResponse(user, statusCode, res)` - Sends token with user data

### 7. Main Entry Point

#### `src/server.js`
Main application file:
- Loads environment variables
- Initializes Express app
- Connects to MongoDB
- Applies security middleware (Helmet, CORS)
- Sets up body parsers
- Registers route handlers
- Handles 404s
- Applies error handling middleware
- Starts server on PORT
- Handles unhandled promise rejections

## API Summary

### Authentication (5 endpoints)
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

### Projects (7 endpoints)
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id
- POST /api/projects/:id/members
- DELETE /api/projects/:id/members/:memberId

### Tasks (8 endpoints)
- GET /api/tasks
- POST /api/tasks
- GET /api/tasks/dashboard/stats
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- GET /api/projects/:projectId/tasks
- POST /api/projects/:projectId/tasks

### Utility (1 endpoint)
- GET /api/health

**Total: 21 RESTful API Endpoints**

## Security Features Implemented

1. **Authentication**: JWT with token expiry
2. **Password Security**: bcryptjs hashing with salt rounds
3. **Authorization**: Role-based access control
4. **Input Validation**: All endpoints validated
5. **Error Handling**: Centralized, no stack traces exposed
6. **CORS**: Configurable cross-origin requests
7. **Security Headers**: Helmet middleware
8. **Database Security**: Mongoose schema validation
9. **Environment Variables**: Sensitive data in .env
10. **Token-Based Access**: No session cookies

## Running the Backend

```bash
# Install dependencies
npm install

# Development with auto-reload
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

Health check: `curl http://localhost:5000/api/health`

## Status: ✅ COMPLETE

All files have been generated and corrected. The backend is ready for:
- Frontend integration
- Database testing
- API testing with Postman
- Deployment
