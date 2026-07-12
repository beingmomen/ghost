const catchAsync = require('../utils/catchAsync');
const Project = require('../models/projectModel');
const Testimonial = require('../models/testimonialModel');
const Client = require('../models/clientModel');
const Info = require('../models/infoModel');
const Experience = require('../models/experienceModel');
const Faq = require('../models/faqModel');

exports.getLandingData = catchAsync(async (req, res, next) => {
  const [
    testimonials,
    projects,
    projectsCount,
    clients,
    info,
    experiences,
    faqs
  ] = await Promise.all([
    Testimonial.find({ isConfirmed: true })
      .select('name description image -_id')
      .sort('-createdAt')
      .limit(20)
      .lean(),

    Project.find({ isActive: true })
      .select('title tag skills skillIds url image altText -_id')
      .sort('-createdAt')
      .limit(6)
      .populate({
        path: 'skills',
        select: 'title -_id'
      })
      .lean(),

    Project.countDocuments({ isActive: true }),

    Client.find().select('image name -_id').sort('-createdAt').limit(20).lean(),

    Info.findOne().select('resumeUrl bio skills images -_id').lean(),

    Experience.find()
      .select(
        'company position employmentType workPlace startDate endDate responsibilities linkedInUrl companySiteUrl iconName imageAlt order -_id'
      )
      .sort('order')
      .lean(),

    Faq.find()
      .select('category question answer order -_id')
      .sort('category order')
      .lean()
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      testimonials,
      projects,
      projectsTotal: projectsCount,
      clients,
      info,
      experiences,
      faqs
    }
  });
});
