const Model = require('../models/homeFeaturedModel');
const catchAsync = require('../utils/catchAsync');

// GET /  — الـ singleton الخام (ids) للـ dashboard.
// findOne() بترجع null لو السجل مش موجود → { data: [null] }
// (الـ db empty-state branching بيعتمد على الشكل ده). مش getSingleton().
exports.getHomeFeatured = catchAsync(async (req, res, next) => {
  const doc = await Model.findOne();

  res.status(200).json({
    status: 'success',
    data: [doc]
  });
});

// GET /populated — للـ client landing: مفلتر isActive، بالترتيب، بدون nulls.
exports.getHomeFeaturedPopulated = catchAsync(async (req, res, next) => {
  const doc = await Model.findOne().populate({
    path: 'projects',
    match: { isActive: true },
    populate: [{ path: 'skills' }]
  });

  // الـ singleton ممكن ما يكونش موجود على deploy جديد قبل أول POST →
  // null.projects بترمي → 500 → الـ client state="error" بدل "empty".
  // الـ guard بيرجّع { data: [] } @ 200 قبل أي وصول لـ doc.projects.
  if (!doc) {
    return res.status(200).json({
      status: 'success',
      data: []
    });
  }

  // populate بـ match بيستبعد الـ refs غير المطابقة؛ filter(Boolean) دفاعي للـ refs المكسورة.
  const projects = doc.projects.filter(Boolean);

  res.status(200).json({
    status: 'success',
    data: projects
  });
});

// POST / و PATCH / — upsert للـ singleton عبر getSingleton() + doc.save()
// عشان الـ custom array validator (max-3) يشتغل بـ document validation.
const saveHomeFeatured = catchAsync(async (req, res, next) => {
  const doc = await Model.getSingleton();
  doc.projects = req.body.projects;
  await doc.save();

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: doc
  });
});

exports.createHomeFeatured = saveHomeFeatured;
exports.updateHomeFeatured = saveHomeFeatured;
