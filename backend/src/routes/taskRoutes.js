const express = require('express');
const {
  getAllTasks,
  getTask,
  createGeneralTask,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTask, validateUpdateTask, validateRequest } = require('../middleware/validators');

const router = express.Router();

// All task routes require authentication
router.use(auth);

// Dashboard route - must come before /:id routes
router.get('/dashboard/stats', getDashboardStats);

// Get all tasks for user
router.get('/', getAllTasks);

// Create new task
router.post('/', validateTask, validateRequest, createGeneralTask);

// Get, update, delete single task
router.get('/:id', getTask);
router.put('/:id', validateUpdateTask, validateRequest, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
