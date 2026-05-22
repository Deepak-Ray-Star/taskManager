# API Specification

Complete REST API specification for Team Task Manager.

## Base URL

Development: `http://localhost:5000/api`  
Production: `https://your-backend.railway.app/api`

## Authentication

All endpoints except `/auth/signup` and `/auth/login` require JWT token in header:

```
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "count": 1,
  "token": "jwt_token"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "param": "field_name",
      "msg": "Field error message"
    }
  ]
}
```

## Endpoints

### 1. Authentication

#### 1.1 Signup
```
POST /auth/signup
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Success Response (201):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}

Error Response (400):
{
  "success": false,
  "message": "User already exists"
}
```

#### 1.2 Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Success Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 1.3 Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

Error Response (401):
{
  "success": false,
  "message": "Token is not valid"
}
```

### 2. Projects

#### 2.1 Get All Projects
```
GET /projects
Authorization: Bearer <token>

Query Parameters:
- status: active | archived (optional)
- limit: number (optional, default: all)
- skip: number (optional, default: 0)

Success Response (200):
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Project Alpha",
      "description": "First project",
      "admin": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 2.2 Get Single Project
```
GET /projects/:projectId
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Project Alpha",
    "description": "First project",
    "admin": { /* user object */ },
    "members": [ /* user objects */ ],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}

Error Response (403):
{
  "success": false,
  "message": "Not authorized to access this project"
}
```

#### 2.3 Create Project
```
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "New Project",
  "description": "Project description"
}

Success Response (201):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Project",
    "description": "Project description",
    "admin": { /* current user */ },
    "members": [ /* current user */ ],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}

Error Response (400):
{
  "success": false,
  "errors": [
    {
      "param": "name",
      "msg": "Project name is required"
    }
  ]
}
```

#### 2.4 Update Project
```
PUT /projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "archived"
}

Success Response (200):
{
  "success": true,
  "data": { /* updated project object */ }
}

Error Response (403):
{
  "success": false,
  "message": "Not authorized to update this project"
}
```

#### 2.5 Delete Project
```
DELETE /projects/:projectId
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "message": "Project deleted"
}

Error Response (403):
{
  "success": false,
  "message": "Not authorized to delete this project"
}
```

#### 2.6 Add Team Member
```
POST /projects/:projectId/members
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "memberId": "507f1f77bcf86cd799439013"
}

Success Response (200):
{
  "success": true,
  "data": { /* updated project with new member */ }
}

Error Response (400):
{
  "success": false,
  "message": "Member already added"
}
```

#### 2.7 Remove Team Member
```
DELETE /projects/:projectId/members/:memberId
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "data": { /* updated project without member */ }
}
```

### 3. Tasks

#### 3.1 Get Project Tasks
```
GET /projects/:projectId/tasks
Authorization: Bearer <token>

Query Parameters:
- status: todo | in_progress | completed (optional)
- priority: low | medium | high (optional)
- assignedTo: userId (optional)
- limit: number (optional)
- skip: number (optional)

Success Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Fix login bug",
      "description": "Login button not responding",
      "project": "507f1f77bcf86cd799439010",
      "assignedTo": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "createdBy": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "John Admin",
        "email": "john@example.com"
      },
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-20T18:00:00Z",
      "isOverdue": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

#### 3.2 Get Single Task
```
GET /tasks/:taskId
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "data": { /* task object */ }
}
```

#### 3.3 Create Task
```
POST /projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Implement user profile",
  "description": "Create user profile page with edit functionality",
  "assignedTo": "507f1f77bcf86cd799439012",
  "dueDate": "2024-01-25T18:00:00Z",
  "priority": "medium"
}

Success Response (201):
{
  "success": true,
  "data": { /* created task object */ }
}

Error Response (400):
{
  "success": false,
  "errors": [
    {
      "param": "title",
      "msg": "Task title is required"
    },
    {
      "param": "dueDate",
      "msg": "Valid due date is required"
    }
  ]
}
```

#### 3.4 Update Task
```
PUT /tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "assignedTo": "507f1f77bcf86cd799439013",
  "dueDate": "2024-01-26T18:00:00Z"
}

Possible Status Values:
- todo
- in_progress
- completed

Possible Priority Values:
- low
- medium
- high

Success Response (200):
{
  "success": true,
  "data": { /* updated task object */ }
}

Error Response (403):
{
  "success": false,
  "message": "Not authorized to update this task"
}
```

#### 3.5 Delete Task
```
DELETE /tasks/:taskId
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "message": "Task deleted"
}

Error Response (403):
{
  "success": false,
  "message": "Not authorized to delete this task"
}
```

### 4. Dashboard

#### 4.1 Get Dashboard Statistics
```
GET /tasks/dashboard/stats
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "data": {
    "totalTasks": 15,
    "completedTasks": 8,
    "pendingTasks": 5,
    "overdueTasks": 2,
    "myTasks": 7,
    "myCompletedTasks": 3,
    "myPendingTasks": 4
  }
}
```

### 5. Health Check

#### 5.1 Server Health
```
GET /health

Success Response (200):
{
  "status": "OK",
  "message": "Server is running"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

## Error Messages

| Error | Description | Fix |
|-------|-------------|-----|
| Token is not valid | JWT token invalid/expired | Login again |
| No token | No authorization header | Add Authorization header |
| Invalid credentials | Wrong email/password | Check credentials |
| User already exists | Email already registered | Use different email |
| Project not found | Project doesn't exist | Check project ID |
| Not authorized | No permission for action | Only admins can do this |
| Member already added | Member already in project | Check member list |

## Rate Limiting

Currently no rate limiting. Consider adding:
- Login attempts: 5 per minute
- API requests: 100 per minute per user

## Pagination

For list endpoints, use:
- `skip`: Number of items to skip (default: 0)
- `limit`: Number of items to return (default: 50, max: 100)

Example:
```
GET /projects?skip=20&limit=10
```

## Sorting

Sort queries by field name:
```
GET /tasks?sort=createdAt:-1
```

- `1` for ascending
- `-1` for descending

## Filtering

Filter tasks by status and priority:
```
GET /projects/123/tasks?status=in_progress&priority=high
```

## Webhooks (Future Enhancement)

Could add webhooks for:
- Task status changes
- Project updates
- Member additions
- Task assignments

## API Versioning

Current version: v1 (implicit in /api prefix)

Future versions:
- `/api/v2/` for new API versions
- Maintain backward compatibility

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## CORS

Allowed origins:
- Development: `http://localhost:3000`
- Production: Your frontend URL

## Testing the API

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Get Projects (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Create new collection
2. Add each endpoint as described above
3. Set variables for base_url and token
4. Use Tests tab for validation

### Using Insomnia

1. Import API specification
2. Set environment variables
3. Test each endpoint

## Documentation

Full Swagger/OpenAPI documentation available at:
```
GET /api/docs
```

## Support

For API issues:
1. Check status codes and error messages
2. Verify authentication token
3. Check request body format
4. Review server logs
5. Contact support team
