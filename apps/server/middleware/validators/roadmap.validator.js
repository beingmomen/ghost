const { body } = require('express-validator');

const MILESTONE_LEVELS = ['mid', 'mid_advanced', 'senior'];
const TASK_TYPES = ['learn', 'practice', 'explain'];
const LEVELS = ['junior_mid', 'mid', 'mid_advanced', 'senior'];

const orderedIdsRule = body('orderedIds')
  .isArray({ min: 1 })
  .withMessage('orderedIds must be a non-empty array.')
  .bail()
  .custom(ids => ids.every(id => typeof id === 'string' && id.length > 0))
  .withMessage('orderedIds must contain valid ids.');

// ─── Phases ───────────────────────────────────────────────────────────────────

exports.createPhaseRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters.'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters.'),
  body('weeksEstimate')
    .notEmpty()
    .withMessage('Weeks estimate is required.')
    .isInt({ min: 0 })
    .withMessage('Weeks estimate must be a non-negative integer.'),
  body('milestoneLevel')
    .optional({ nullable: true })
    .isIn(MILESTONE_LEVELS)
    .withMessage(
      `milestoneLevel must be one of: ${MILESTONE_LEVELS.join(', ')}.`
    )
];

exports.updatePhaseRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters.'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters.'),
  body('weeksEstimate')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Weeks estimate must be a non-negative integer.'),
  body('milestoneLevel')
    .optional({ nullable: true })
    .isIn(MILESTONE_LEVELS)
    .withMessage(
      `milestoneLevel must be one of: ${MILESTONE_LEVELS.join(', ')}.`
    ),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer.')
];

// ─── Weeks ──────────────────────────────────────────────────────────────────

exports.createWeekRules = [
  body('phaseId')
    .trim()
    .notEmpty()
    .withMessage('phaseId is required.')
    .isMongoId()
    .withMessage('phaseId must be a valid id.'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters.'),
  body('focus')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Focus must be at most 300 characters.')
];

exports.updateWeekRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters.'),
  body('focus')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Focus must be at most 300 characters.'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer.')
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

exports.createTaskRules = [
  body('weekId')
    .trim()
    .notEmpty()
    .withMessage('weekId is required.')
    .isMongoId()
    .withMessage('weekId must be a valid id.'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Text is required.')
    .isLength({ min: 1, max: 500 })
    .withMessage('Text must be between 1 and 500 characters.'),
  body('type')
    .optional({ nullable: true })
    .isIn(TASK_TYPES)
    .withMessage(`type must be one of: ${TASK_TYPES.join(', ')}.`)
];

exports.updateTaskRules = [
  body('text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Text must be between 1 and 500 characters.'),
  body('type')
    .optional({ nullable: true })
    .isIn(TASK_TYPES)
    .withMessage(`type must be one of: ${TASK_TYPES.join(', ')}.`),
  body('done').optional().isBoolean().withMessage('done must be a boolean.'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer.')
];

// ─── Settings ─────────────────────────────────────────────────────────────────

exports.updateSettingsRules = [
  body('hoursPerWeek')
    .optional()
    .isInt({ min: 1 })
    .withMessage('hoursPerWeek must be a positive integer.'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid date.'),
  body('levelOverride')
    .optional({ nullable: true })
    .isIn(LEVELS)
    .withMessage(`levelOverride must be one of: ${LEVELS.join(', ')}.`)
];

// ─── Reorder (shared) ─────────────────────────────────────────────────────────

exports.reorderRules = [orderedIdsRule];
