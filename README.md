# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## 🚀 Features

- **User Authentication**
  - Signup/Login with JWT
  - Password hashing with bcrypt
  - Token persistence

- **Role-Based Access Control**
  - Admin role
  - Member role
  - Project-level permissions

- **Project Management**
  - Create, read, update, delete projects
  - Add/remove team members
  - Project admin controls

- **Task Management**
  - Create tasks with priority and due dates
  - Assign tasks to team members
  - Track task status (Todo, In Progress, Completed)
  - Overdue task detection

- **Dashboard**
  - Total tasks count
  - Completed tasks count
  - Pending tasks count
  - Overdue tasks count
  - Personal task overview

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, CORS
- **Validation**: express-validator

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Date Utilities**: date-fns

## 📁 Project Structure

```
projectMaker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Project Endpoints
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Task Endpoints
- `GET /api/projects/:projectId/tasks` - List project tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/dashboard/stats` - Get dashboard statistics

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Error handling without exposing sensitive info

## 📦 Deployment

### Deploy to Railway

#### Backend
```bash
cd backend
railway login
railway init
# Add MongoDB plugin from dashboard
railway up
```

#### Frontend
```bash
cd frontend
railway login
railway init
# Set VITE_API_URL to your backend Railway URL
railway up
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

**Frontend (.env)**
```
VITE_API_URL=<your-backend-api-url>
```

## 🧪 Testing the Application

1. **Signup**: Create a new account
2. **Create Project**: Create your first project
3. **Add Members**: Add team members to your project
4. **Create Tasks**: Create tasks and assign them
5. **Track Progress**: Update task statuses and monitor dashboard

## 📝 Database Schema

### Users
- name, email, password (hashed), role, createdAt

### Projects
- name, description, admin, members[], status, createdAt, updatedAt

### Tasks
- title, description, project, assignedTo, createdBy, status, priority, dueDate, isOverdue, createdAt, updatedAt

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

ISC

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using MERN Stack**
