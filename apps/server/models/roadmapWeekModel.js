const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    phaseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'RoadmapPhase',
      required: [true, 'phaseId is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Week title is required'],
      trim: true
    },
    focus: {
      type: String,
      trim: true,
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

schema.index({ phaseId: 1, order: 1 });

const RoadmapWeek = mongoose.model('RoadmapWeek', schema);

module.exports = RoadmapWeek;
