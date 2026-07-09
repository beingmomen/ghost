const express = require('express');
const controller = require('../controllers/_homeFeaturedController');
const authController = require('../controllers/authController');
const v = require('../middleware/validators');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// GET عام للـ client landing (cross-origin بدون auth).
router.route('/populated').get(controller.getHomeFeaturedPopulated);

router
  .route('/')
  // GET عام للـ dashboard (raw ids). protect على الكتابة بس (نمط infoRoutes).
  .get(controller.getHomeFeatured)
  .post(
    authController.protect,
    authController.restrictTo([ROLES.ADMIN, ROLES.DEV]),
    v.updateHomeFeaturedRules,
    v.validate,
    controller.createHomeFeatured
  )
  .patch(
    authController.protect,
    authController.restrictTo([ROLES.ADMIN, ROLES.DEV]),
    v.updateHomeFeaturedRules,
    v.validate,
    controller.updateHomeFeatured
  );

module.exports = router;
