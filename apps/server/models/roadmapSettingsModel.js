const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      default: Date.now
    },
    hoursPerWeek: {
      type: Number,
      min: 1,
      default: 14
    },
    levelOverride: {
      type: String,
      enum: ['junior_mid', 'mid', 'mid_advanced', 'senior'],
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Singleton helper: always work with the single settings document.
schema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const RoadmapSettings = mongoose.model('RoadmapSettings', schema);

module.exports = RoadmapSettings;
