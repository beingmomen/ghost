const { body } = require('express-validator');

exports.updateHomeFeaturedRules = [
  body('projects')
    .isArray({ min: 0, max: 3 })
    .withMessage('Home featured projects must be 3 or fewer.'),
  body('projects.*').isMongoId().withMessage('Each project must be a valid ID.')
];
