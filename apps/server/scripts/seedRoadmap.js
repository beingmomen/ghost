/* eslint-disable no-console */
/**
 * Seed the Learning Roadmap with the curriculum from the feature spec (section 5),
 * but only if the roadmap is empty. Run with:
 *
 *   npm run seed:roadmap            # seed if empty
 *   npm run seed:roadmap -- --force # wipe roadmap data then reseed
 */

const path = require('path');
const mongoose = require('mongoose');
const loadEnv = require('../utils/loadEnv');

loadEnv(path.join(__dirname, '..'));

const Phase = require('../models/roadmapPhaseModel');
const Week = require('../models/roadmapWeekModel');
const Task = require('../models/roadmapTaskModel');
const Settings = require('../models/roadmapSettingsModel');
const seedData = require('./roadmapSeedData');

const force = process.argv.includes('--force');

const run = async () => {
  const DB = process.env.DATABASE_ATLAS;
  await mongoose.connect(DB);
  console.log('DB connection successful!');

  const existing = await Phase.countDocuments();

  if (existing > 0 && !force) {
    console.log(
      `Roadmap already has ${existing} phase(s). Skipping. Use --force to reseed.`
    );
    await mongoose.connection.close();
    return;
  }

  if (force) {
    console.log('Force mode: clearing existing roadmap data...');
    await Promise.all([
      Phase.deleteMany({}),
      Week.deleteMany({}),
      Task.deleteMany({})
    ]);
  }

  // Settings (singleton).
  await Settings.deleteMany({});
  await Settings.create({
    hoursPerWeek: seedData.settings.hoursPerWeek,
    levelOverride: seedData.settings.levelOverride,
    startDate: new Date()
  });

  let phaseCount = 0;
  let weekCount = 0;
  let taskCount = 0;

  for (let p = 0; p < seedData.phases.length; p += 1) {
    const phaseData = seedData.phases[p];
    // eslint-disable-next-line no-await-in-loop
    const phase = await Phase.create({
      title: phaseData.title,
      description: phaseData.description,
      weeksEstimate: phaseData.weeksEstimate,
      milestoneLevel: phaseData.milestoneLevel,
      order: p
    });
    phaseCount += 1;

    for (let w = 0; w < phaseData.weeks.length; w += 1) {
      const weekData = phaseData.weeks[w];
      // eslint-disable-next-line no-await-in-loop
      const week = await Week.create({
        phaseId: phase._id,
        title: weekData.title,
        focus: weekData.focus,
        order: w
      });
      weekCount += 1;

      const tasksToCreate = weekData.tasks.map((task, t) => ({
        weekId: week._id,
        text: task.text,
        type: task.type,
        order: t
      }));
      // eslint-disable-next-line no-await-in-loop
      await Task.insertMany(tasksToCreate);
      taskCount += tasksToCreate.length;
    }
  }

  console.log(
    `Seeded ${phaseCount} phases, ${weekCount} weeks, ${taskCount} tasks.`
  );
  await mongoose.connection.close();
};

run()
  .then(() => {
    console.log('Roadmap seeding complete.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Roadmap seeding failed:', err);
    process.exit(1);
  });
