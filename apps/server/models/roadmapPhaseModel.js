const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Phase title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    order: {
      type: Number,
      default: 0
    },
    weeksEstimate: {
      type: Number,
      required: [true, 'Weeks estimate is required'],
      min: 0,
      default: 0
    },
    milestoneLevel: {
      type: String,
      enum: ['mid', 'mid_advanced', 'senior'],
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

schema.index({ order: 1 });

const RoadmapPhase = mongoose.model('RoadmapPhase', schema);

module.exports = RoadmapPhase;
