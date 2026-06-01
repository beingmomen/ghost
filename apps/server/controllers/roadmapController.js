const Phase = require('../models/roadmapPhaseModel');
const Week = require('../models/roadmapWeekModel');
const Task = require('../models/roadmapTaskModel');
const Settings = require('../models/roadmapSettingsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { buildRoadmap } = require('../utils/roadmapStats');

// ─── Read: full tree + computed stats ─────────────────────────────────────────

exports.getRoadmap = catchAsync(async (req, res) => {
  const [phases, weeks, tasks, settings] = await Promise.all([
    Phase.find().sort('order').lean(),
    Week.find().sort('order').lean(),
    Task.find().sort('order').lean(),
    Settings.getSingleton()
  ]);

  const { phases: enrichedPhases, stats } = buildRoadmap({
    phases,
    weeks,
    tasks,
    settings
  });

  res.status(200).json({
    status: 'success',
    data: {
      settings: {
        startDate: settings.startDate,
        hoursPerWeek: settings.hoursPerWeek,
        levelOverride: settings.levelOverride
      },
      stats,
      phases: enrichedPhases
    }
  });
});

// ─── Generic reorder helper ───────────────────────────────────────────────────

const reorder = Model =>
  catchAsync(async (req, res, next) => {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return next(new AppError('orderedIds must be a non-empty array', 400));
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        Model.findByIdAndUpdate(id, { order: index })
      )
    );

    res.status(200).json({
      status: 'success',
      message: 'Reordered successfully',
      data: null
    });
  });

// ─── Phases ───────────────────────────────────────────────────────────────────

exports.createPhase = catchAsync(async (req, res) => {
  const { title, description, weeksEstimate, milestoneLevel } = req.body;
  const last = await Phase.findOne().sort('-order').select('order').lean();
  const order = last ? last.order + 1 : 0;

  const phase = await Phase.create({
    title,
    description,
    weeksEstimate,
    milestoneLevel,
    order
  });

  res.status(201).json({
    status: 'success',
    message: 'Created successfully',
    data: phase
  });
});

exports.updatePhase = catchAsync(async (req, res, next) => {
  const phase = await Phase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!phase) return next(new AppError('No phase found with that ID', 404));

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: phase
  });
});

exports.deletePhase = catchAsync(async (req, res, next) => {
  const phase = await Phase.findByIdAndDelete(req.params.id);
  if (!phase) return next(new AppError('No phase found with that ID', 404));

  // Cascade: remove the phase's weeks and their tasks.
  const weeks = await Week.find({ phaseId: phase._id }).select('_id').lean();
  const weekIds = weeks.map(w => w._id);
  await Promise.all([
    Task.deleteMany({ weekId: { $in: weekIds } }),
    Week.deleteMany({ phaseId: phase._id })
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Deleted successfully',
    data: null
  });
});

exports.reorderPhases = reorder(Phase);

// ─── Weeks ──────────────────────────────────────────────────────────────────

exports.createWeek = catchAsync(async (req, res, next) => {
  const { phaseId, title, focus } = req.body;

  const phase = await Phase.findById(phaseId).select('_id').lean();
  if (!phase) return next(new AppError('No phase found with that ID', 404));

  const last = await Week.findOne({ phaseId })
    .sort('-order')
    .select('order')
    .lean();
  const order = last ? last.order + 1 : 0;

  const week = await Week.create({ phaseId, title, focus, order });

  res.status(201).json({
    status: 'success',
    message: 'Created successfully',
    data: week
  });
});

exports.updateWeek = catchAsync(async (req, res, next) => {
  const week = await Week.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!week) return next(new AppError('No week found with that ID', 404));

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: week
  });
});

exports.deleteWeek = catchAsync(async (req, res, next) => {
  const week = await Week.findByIdAndDelete(req.params.id);
  if (!week) return next(new AppError('No week found with that ID', 404));

  await Task.deleteMany({ weekId: week._id });

  res.status(200).json({
    status: 'success',
    message: 'Deleted successfully',
    data: null
  });
});

exports.reorderWeeks = reorder(Week);

// ─── Tasks ────────────────────────────────────────────────────────────────────

exports.createTask = catchAsync(async (req, res, next) => {
  const { weekId, text, type } = req.body;

  const week = await Week.findById(weekId).select('_id').lean();
  if (!week) return next(new AppError('No week found with that ID', 404));

  const last = await Task.findOne({ weekId })
    .sort('-order')
    .select('order')
    .lean();
  const order = last ? last.order + 1 : 0;

  const task = await Task.create({ weekId, text, type, order });

  res.status(201).json({
    status: 'success',
    message: 'Created successfully',
    data: task
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const update = { ...req.body };

  // Toggle behaviour: keep doneAt in sync with the done flag.
  if (Object.prototype.hasOwnProperty.call(update, 'done')) {
    update.doneAt = update.done ? new Date() : null;
  }

  const task = await Task.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true
  });

  if (!task) return next(new AppError('No task found with that ID', 404));

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: task
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(new AppError('No task found with that ID', 404));

  res.status(200).json({
    status: 'success',
    message: 'Deleted successfully',
    data: null
  });
});

exports.reorderTasks = reorder(Task);

// ─── Settings ─────────────────────────────────────────────────────────────────

exports.getSettings = catchAsync(async (req, res) => {
  const settings = await Settings.getSingleton();

  res.status(200).json({
    status: 'success',
    data: settings
  });
});

exports.updateSettings = catchAsync(async (req, res) => {
  const settings = await Settings.getSingleton();
  const { hoursPerWeek, startDate, levelOverride } = req.body;

  if (hoursPerWeek !== undefined) settings.hoursPerWeek = hoursPerWeek;
  if (startDate !== undefined) settings.startDate = startDate;
  if (levelOverride !== undefined) settings.levelOverride = levelOverride;

  await settings.save();

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: settings
  });
});
