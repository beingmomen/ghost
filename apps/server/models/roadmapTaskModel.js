const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    weekId: {
      type: mongoose.Schema.ObjectId,
      ref: 'RoadmapWeek',
      required: [true, 'weekId is required'],
      index: true
    },
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['learn', 'practice', 'explain'],
      default: null
    },
    done: {
      type: Boolean,
      default: false
    },
    doneAt: {
      type: Date,
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

schema.index({ weekId: 1, order: 1 });

const RoadmapTask = mongoose.model('RoadmapTask', schema);

module.exports = RoadmapTask;
