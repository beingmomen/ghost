const { body } = require('express-validator');

exports.createProjectRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters.')
    .escape(),
  body('tag')
    .trim()
    .notEmpty()
    .withMessage('Tag is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Tag must be between 2 and 50 characters.')
    .escape(),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.')
    .isLength({ min: 60, max: 200 })
    .withMessage('Description must be between 60 and 200 characters.'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required.')
    .isURL()
    .withMessage('Please provide a valid URL.'),
  body('skillIds')
    .isArray({ min: 3 })
    .withMessage('Project must have at least 3 skills.'),
  body('skillIds.*').isMongoId().withMessage('Each skill must be a valid ID.'),
  body('detailSlug')
    .customSanitizer(v => (v === '' || v == null ? undefined : v))
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('detailSlug must be between 2 and 50 characters.')
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .withMessage(
      'detailSlug must be lowercase letters, numbers, and hyphens only.'
    ),
  body('productionOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('productionOrder must be a non-negative integer.'),
  body('altText')
    .trim()
    .notEmpty()
    .withMessage('Alt text is required.')
    .isLength({ min: 2, max: 200 })
    .withMessage('Alt text must be between 2 and 200 characters.')
    .escape()
];

exports.updateProjectRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters.')
    .escape(),
  body('tag')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tag must be between 2 and 50 characters.')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 60, max: 200 })
    .withMessage('Description must be between 60 and 200 characters.'),
  body('url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL.'),
  body('skillIds')
    .optional()
    .isArray({ min: 3 })
    .withMessage('Project must have at least 3 skills.'),
  body('skillIds.*')
    .optional()
    .isMongoId()
    .withMessage('Each skill must be a valid ID.'),
  body('detailSlug')
    .customSanitizer(v => (v === '' || v == null ? undefined : v))
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('detailSlug must be between 2 and 50 characters.')
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .withMessage(
      'detailSlug must be lowercase letters, numbers, and hyphens only.'
    ),
  body('productionOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('productionOrder must be a non-negative integer.'),
  body('altText')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Alt text must be between 2 and 200 characters.')
    .escape()
];
