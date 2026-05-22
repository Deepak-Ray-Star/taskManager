const express = require('express');
const { getTasks, createProjectTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTask, validateRequest } = require('../middleware/validators');

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(auth);

// Get tasks for a project
router.get('/', getTasks);

// Create task for a project
router.post('/', validateTask, validateRequest, createProjectTask);

module.exports = router;
