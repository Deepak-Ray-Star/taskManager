const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { validateProject, validateRequest } = require('../middleware/validators');

const router = express.Router();

// All project routes require authentication
router.use(auth);

// Project routes
router.get('/', getProjects);
router.post('/', validateProject, validateRequest, createProject);
router.get('/:id', getProject);
router.put('/:id', validateProject, validateRequest, updateProject);
router.delete('/:id', deleteProject);

// Team member routes
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', removeMember);

module.exports = router;
