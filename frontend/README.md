# Team Task Manager - Frontend

React + Vite + Tailwind CSS frontend for Team Task Manager application.

## Features

- ✅ User Authentication (Signup/Login)
- ✅ JWT Token Management
- ✅ Project Management UI
- ✅ Task Management UI
- ✅ Dashboard with Statistics
- ✅ Role-Based Access
- ✅ Responsive Design
- ✅ Protected Routes

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL
```
VITE_API_URL=http://localhost:5000/api
```

## Running the App

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

App will run on `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── ProtectedRoute.jsx   # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state management
│   ├── hooks/
│   │   └── useAuth.js           # Auth hook
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── Dashboard.jsx        # Dashboard page
│   │   ├── Projects.jsx         # Projects list page
│   │   └── ProjectDetail.jsx    # Project detail page
│   ├── services/
│   │   └── api.js               # API client
│   ├── utils/
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── index.html                   # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── .env.example                # Environment template
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies
└── README.md                   # This file
```

## Pages

### Login Page
- User login with email and password
- JWT token stored in localStorage
- Redirect to dashboard on success

### Signup Page
- New user registration
- Automatic login after signup
- Email validation
- Password requirements

### Dashboard
- Overview statistics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
  - My tasks
  - My completed tasks

### Projects
- View all projects
- Create new project
- Delete project (admin only)
- View project details
- Manage team members

### Project Detail
- View project information
- Create tasks
- Assign tasks to members
- Update task status
- Delete tasks (admin only)
- Track task progress

## API Integration

The app uses Axios for API calls. Token is automatically added to all requests from localStorage.

```javascript
import { projectService, taskService, authService } from '../services/api';

// Example usage
const projects = await projectService.getProjects();
const tasks = await taskService.getProjectTasks(projectId);
```

## Authentication Flow

1. User signs up/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with every API request
5. If token invalid, user redirected to login
6. Logout removes token from localStorage

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

4. Build the app
```bash
npm run build
```

5. Create railway.json
```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm install && npm run build"
  },
  "start": "npm install -g serve && serve -s dist -l 3000"
}
```

6. Deploy from backend directory (to connect to same Railway project)
```bash
railway link
railway up
```

Or deploy as separate service:
```bash
railway init
# Set environment variables
railway up
```

7. Set `VITE_API_URL` in Railway dashboard to your backend URL

## Environment Variables

Create `.env` file in frontend root:

```
VITE_API_URL=http://localhost:5000/api
```

For production, update to your deployed backend URL.

## Dependencies

### Runtime
- **react** - UI library
- **react-dom** - React DOM
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **date-fns** - Date utilities

### Development
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite
- **tailwindcss** - CSS framework
- **postcss** - CSS processor
- **autoprefixer** - CSS vendor prefixes

## Features Implementation

### Authentication Context
- Manages user state globally
- Handles signup/login/logout
- Token persistence

### Protected Routes
- Redirects unauthenticated users to login
- Shows loading spinner while checking auth
- Wraps protected pages

### API Service
- Centralized axios instance
- Auto-adds JWT token to requests
- Error handling

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Grid/Flex layouts

## Performance

- Code splitting with React Router
- Lazy loading of routes
- Tailwind CSS purging
- Optimized images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Support

For issues or questions, please contact the development team.
