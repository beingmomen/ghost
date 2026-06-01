const express = require('express');
const controller = require('../controllers/roadmapController');
const authController = require('../controllers/authController');
const v = require('../middleware/validators');
const { ROLES } = require('../utils/constants');

const router = express.Router();

const protect = [
  authController.protect,
  authController.restrictTo([ROLES.ADMIN, ROLES.DEV])
];

// ─── Read (public for Website + Dashboard) ────────────────────────────────────
router.get('/', controller.getRoadmap);

// ─── Settings ─────────────────────────────────────────────────────────────────
router
  .route('/settings')
  .get(controller.getSettings)
  .patch(
    ...protect,
    v.updateSettingsRules,
    v.validate,
    controller.updateSettings
  );

// ─── Phases ───────────────────────────────────────────────────────────────────
router.post(
  '/phases',
  ...protect,
  v.createPhaseRules,
  v.validate,
  controller.createPhase
);
router.patch(
  '/phases/reorder',
  ...protect,
  v.reorderRules,
  v.validate,
  controller.reorderPhases
);
router
  .route('/phases/:id')
  .patch(...protect, v.updatePhaseRules, v.validate, controller.updatePhase)
  .delete(...protect, controller.deletePhase);

// ─── Weeks ──────────────────────────────────────────────────────────────────
router.post(
  '/weeks',
  ...protect,
  v.createWeekRules,
  v.validate,
  controller.createWeek
);
router.patch(
  '/weeks/reorder',
  ...protect,
  v.reorderRules,
  v.validate,
  controller.reorderWeeks
);
router
  .route('/weeks/:id')
  .patch(...protect, v.updateWeekRules, v.validate, controller.updateWeek)
  .delete(...protect, controller.deleteWeek);

// ─── Tasks ────────────────────────────────────────────────────────────────────
router.post(
  '/tasks',
  ...protect,
  v.createTaskRules,
  v.validate,
  controller.createTask
);
router.patch(
  '/tasks/reorder',
  ...protect,
  v.reorderRules,
  v.validate,
  controller.reorderTasks
);
router
  .route('/tasks/:id')
  .patch(...protect, v.updateTaskRules, v.validate, controller.updateTask)
  .delete(...protect, controller.deleteTask);

module.exports = router;
