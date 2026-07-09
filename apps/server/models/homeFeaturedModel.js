const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    projects: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Project'
        }
      ],
      validate: {
        validator(val) {
          return val.length <= 3;
        },
        message: 'Home featured projects must be 3 or fewer'
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Singleton helper: always work with the single home-featured document.
schema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeFeatured = mongoose.model('HomeFeatured', schema);

module.exports = HomeFeatured;
