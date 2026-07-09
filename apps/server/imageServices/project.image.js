const createImageService = require('./imageService');
const Model = require('../models/projectModel');

module.exports = createImageService(
  [
    {
      name: 'image',
      maxCount: 1,
      resize: { width: 1200, height: 675, fit: 'cover', quality: 85 },
      gifResize: { width: 800, height: 450, fit: 'cover', quality: 85 }
    }
  ],
  Model
);
