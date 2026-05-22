const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc Get all tasks for current user
// @route GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    // Get all projects the user is part of
    const userProjects = await Project.find({
      $or: [
        { admin: req.userId },
        { members: req.userId }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Get all tasks in those projects
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignedTo')
      .populate('createdBy')
      .populate('project')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all tasks for project
// @route GET /api/projects/:projectId/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Check if user has access to project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.userId && !project.members.some(memberId => memberId.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo')
      .populate('createdBy');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single task
// @route GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo')
      .populate('createdBy')
      .populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(task.project._id);
    if (project.admin.toString() !== req.userId && !project.members.some(memberId => memberId.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create task
// @route POST /api/tasks
exports.createGeneralTask = async (req, res, next) => {
  try {
    const { projectId, title, description, assignedTo, dueDate, priority } = req.body;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.userId && !project.members.some(memberId => memberId.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    // Verify assignedTo user is a member of the project
    if (!project.members.some(memberId => memberId.toString() === assignedTo)) {
      return res.status(400).json({ message: 'Assigned user is not a member of this project' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.userId,
      dueDate,
      priority
    });

    const populatedTask = await task.populate('assignedTo createdBy project');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create task for project
// @route POST /api/projects/:projectId/tasks
exports.createProjectTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, dueDate, priority } = req.body;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.userId && !project.members.some(memberId => memberId.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.userId,
      dueDate,
      priority
    });

    const populatedTask = await task.populate('assignedTo createdBy');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to project
    const project = task.project;
    if (project.admin.toString() !== req.userId && !project.members.some(memberId => memberId.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    task = await task.save();
    task = await task.populate('assignedTo createdBy');

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is admin of project
    const project = task.project;
    if (project.admin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get dashboard stats
// @route GET /api/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { admin: req.userId },
        { members: req.userId }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    const allTasks = await Task.find({ project: { $in: projectIds } });
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const pendingTasks = allTasks.filter(t => t.status !== 'completed');
    const overdueTasks = allTasks.filter(t => t.isOverdue && t.status !== 'completed');
    const myTasks = allTasks.filter(t => t.assignedTo.toString() === req.userId);

    res.status(200).json({
      success: true,
      data: {
        totalTasks: allTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        overdueTasks: overdueTasks.length,
        myTasks: myTasks.length,
        myCompletedTasks: myTasks.filter(t => t.status === 'completed').length,
        myPendingTasks: myTasks.filter(t => t.status !== 'completed').length
      }
    });
  } catch (error) {
    next(error);
  }
};
