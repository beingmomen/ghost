const mongoose = require('mongoose');
const counterPlugin = require('./plugins/counterPlugin');
const { slug } = require('../utils/slug');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true,
      index: true
    },
    slug: {
      type: String,
      index: true
    },
    original_slug: String,
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    tag: {
      type: String,
      required: [true, 'Tag is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Url is required'],
      trim: true,
      validate: {
        validator(value) {
          return URL.canParse(value);
        },
        message: 'Please provide a valid URL'
      }
    },
    skillIds: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Skill'
        }
      ],
      required: [true, 'Skills are required'],
      validate: {
        validator(val) {
          return val.length >= 3;
        },
        message: 'Project must have at least 3 skills'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    altText: {
      type: String,
      required: [true, 'Alt text is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image is required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a user'],
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

schema.index({ slug: 1, user: 1 });
schema.index({ createdAt: -1, title: 1 });
schema.index({ isActive: 1, createdAt: -1 });

schema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slug(this.title);
    if (this.isNew) {
      this.original_slug = slug(this.title);
    }
  }
  next();
});

schema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slug(update.title);
  }
  next();
});

// شيل projectId من الـ HomeFeatured singleton لو موجود (cascade مشترك).
// mongoose.model('HomeFeatured') lazy عشان نتجنّب circular import.
const pullFromHomeFeatured = async projectId => {
  const HomeFeatured = mongoose.model('HomeFeatured');
  const featured = await HomeFeatured.findOne();
  if (!featured) return;

  featured.projects = featured.projects.filter(
    id => id.toString() !== projectId.toString()
  );
  await featured.save();
};

// لما مشروع مميّز يتعطّل (isActive:false) → شيله من HomeFeatured.projects.
// بنضيّق على «الـ update نفسه لمس isActive» (mongoSanitize بيلفّه في $set) عشان
// نتجنّب no-op re-saves على الـ singleton في تعديلات المشاريع الـ inactive المتزامنة.
schema.post('findOneAndUpdate', async function (doc) {
  const update = this.getUpdate() || {};
  const touchedIsActive =
    update.isActive !== undefined ||
    update.$set?.isActive !== undefined ||
    update.$unset?.isActive !== undefined;

  if (!touchedIsActive) return;
  if (!doc || doc.isActive !== false) return;

  await pullFromHomeFeatured(doc._id);
});

// لما مشروع مميّز يتمسح → شيله من HomeFeatured.projects (بدون شرط — المسح دايمًا إزالة).
// !doc guard: findByIdAndDelete بترجع null على المسح المكرر/المتزامن.
schema.post('findOneAndDelete', async doc => {
  if (!doc) return;

  await pullFromHomeFeatured(doc._id);
});

schema.virtual('skills', {
  ref: 'Skill',
  localField: 'skillIds',
  foreignField: '_id',
  justOne: false,
  options: { select: 'title' }
});

schema.plugin(counterPlugin);

const Project = mongoose.model('Project', schema);

module.exports = Project;
