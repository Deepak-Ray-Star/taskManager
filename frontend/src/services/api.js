import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
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

// Auth Service
export const authService = {
  signup: (name, email, password) => 
    api.post('/auth/signup', { name, email, password }),
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// Project Service
export const projectService = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (name, description) => 
    api.post('/projects', { name, description }),
  updateProject: (id, data) => 
    api.put(`/projects/${id}`, data),
  deleteProject: (id) => 
    api.delete(`/projects/${id}`),
  addMember: (projectId, memberId) => 
    api.post(`/projects/${projectId}/members`, { memberId }),
  removeMember: (projectId, memberId) => 
    api.delete(`/projects/${projectId}/members/${memberId}`),
};

// Task Service
export const taskService = {
  getProjectTasks: (projectId) => 
    api.get(`/projects/${projectId}/tasks`),
  getTask: (id) => 
    api.get(`/tasks/${id}`),
  createTask: (projectId, data) => 
    api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (id, data) => 
    api.put(`/tasks/${id}`, data),
  deleteTask: (id) => 
    api.delete(`/tasks/${id}`),
  getDashboardStats: () => 
    api.get('/tasks/dashboard/stats'),
};

export default api;
