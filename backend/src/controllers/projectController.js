const Project = require('../models/Project');
const User = require('../models/User');

// @desc Get all projects for user
// @route GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { admin: req.userId },
        { members: req.userId }
      ]
    }).populate('admin').populate('members');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single project
// @route GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin')
      .populate('members');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or member
    if (project.admin._id.toString() !== req.userId && !project.members.some(member => member._id.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create project
// @route POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      admin: req.userId,
      members: [req.userId]
    });

    const populatedProject = await project.populate('admin members');

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update project
// @route PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of project
    if (project.admin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { name, description, status } = req.body;

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;

    project = await project.save();
    project = await project.populate('admin members');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete project
// @route DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of project
    if (project.admin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add member to project
// @route POST /api/projects/:id/members
exports.addMember = async (req, res, next) => {
  try {
    const { memberId } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of project
    if (project.admin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Check if member already exists
    if (project.members.some(m => m.toString() === memberId)) {
      return res.status(400).json({ message: 'Member already added' });
    }

    project.members.push(memberId);
    project = await project.save();
    project = await project.populate('admin members');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc Remove member from project
// @route DELETE /api/projects/:id/members/:memberId
exports.removeMember = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin of project
    if (project.admin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }

    project.members = project.members.filter(m => m.toString() !== req.params.memberId);
    project = await project.save();
    project = await project.populate('admin members');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};
