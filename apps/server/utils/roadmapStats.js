/**
 * Roadmap level & progress computation.
 *
 * This is the single source of truth for all roadmap calculations (level,
 * progress, remaining time). The frontends never recompute — they consume
 * the `stats` object returned here. See the feature spec, section 4.
 */

const LEVEL_ORDER = ['mid', 'mid_advanced', 'senior'];

const round = n => Math.round(n);

/**
 * Build the full roadmap tree (phases → weeks → tasks) enriched with
 * per-phase progress numbers, plus the aggregate `stats` object.
 *
 * @param {Object} params
 * @param {Array}  params.phases   Lean phase docs (sorted by order asc).
 * @param {Array}  params.weeks    Lean week docs.
 * @param {Array}  params.tasks    Lean task docs.
 * @param {Object} params.settings Lean settings doc.
 * @returns {{ phases: Array, stats: Object }}
 */
const buildRoadmap = ({ phases, weeks, tasks, settings }) => {
  const hoursPerWeek = settings?.hoursPerWeek || 14;

  // Group weeks by phase and tasks by week (preserving order).
  const weeksByPhase = new Map();
  weeks.forEach(week => {
    const key = String(week.phaseId);
    if (!weeksByPhase.has(key)) weeksByPhase.set(key, []);
    weeksByPhase.get(key).push(week);
  });

  const tasksByWeek = new Map();
  tasks.forEach(task => {
    const key = String(task.weekId);
    if (!tasksByWeek.has(key)) tasksByWeek.set(key, []);
    tasksByWeek.get(key).push(task);
  });

  const sortByOrder = (a, b) => a.order - b.order;

  // ─── Per-phase aggregation ────────────────────────────────────────────────
  const orderedPhases = [...phases].sort(sortByOrder);

  const enrichedPhases = orderedPhases.map(phase => {
    const phaseWeeks = (weeksByPhase.get(String(phase._id)) || []).sort(
      sortByOrder
    );

    let phaseTotalTasks = 0;
    let phaseDoneTasks = 0;

    const enrichedWeeks = phaseWeeks.map(week => {
      const weekTasks = (tasksByWeek.get(String(week._id)) || []).sort(
        sortByOrder
      );
      phaseTotalTasks += weekTasks.length;
      phaseDoneTasks += weekTasks.filter(t => t.done).length;

      return {
        id: week._id,
        title: week.title,
        focus: week.focus,
        order: week.order,
        tasks: weekTasks.map(t => ({
          id: t._id,
          text: t.text,
          type: t.type,
          done: t.done,
          doneAt: t.doneAt,
          order: t.order
        }))
      };
    });

    const phaseProgress =
      phaseTotalTasks === 0 ? 1 : phaseDoneTasks / phaseTotalTasks;

    return {
      raw: phase,
      phaseTotalTasks,
      phaseDoneTasks,
      phaseProgress,
      payload: {
        id: phase._id,
        title: phase.title,
        description: phase.description,
        order: phase.order,
        weeksEstimate: phase.weeksEstimate,
        milestoneLevel: phase.milestoneLevel,
        phaseProgress,
        phasePercent: round(phaseProgress * 100),
        phaseTotalTasks,
        phaseDoneTasks,
        weeks: enrichedWeeks
      }
    };
  });

  // ─── Overall totals ─────────────────────────────────────────────────────────
  const totalTasks = enrichedPhases.reduce(
    (sum, p) => sum + p.phaseTotalTasks,
    0
  );
  const doneTasks = enrichedPhases.reduce(
    (sum, p) => sum + p.phaseDoneTasks,
    0
  );
  const overallProgress = totalTasks === 0 ? 0 : doneTasks / totalTasks;

  // ─── Remaining time to Senior ────────────────────────────────────────────────
  const weeksRemainingToSenior = round(
    enrichedPhases.reduce(
      (sum, p) => sum + p.raw.weeksEstimate * (1 - p.phaseProgress),
      0
    )
  );
  const hoursRemainingToSenior = weeksRemainingToSenior * hoursPerWeek;

  // ─── Current level ─────────────────────────────────────────────────────────
  // Walk phases in order; a milestone is "achieved" when every phase up to and
  // including the phase carrying that milestone is complete.
  const phaseComplete = p => p.phaseTotalTasks > 0 && p.phaseProgress === 1;

  const achievedMilestones = new Set();
  LEVEL_ORDER.forEach(level => {
    const milestoneIndex = enrichedPhases.findIndex(
      p => p.raw.milestoneLevel === level
    );
    if (milestoneIndex === -1) return;
    const allBeforeComplete = enrichedPhases
      .slice(0, milestoneIndex + 1)
      .every(phaseComplete);
    if (allBeforeComplete) achievedMilestones.add(level);
  });

  let computedLevel = 'junior_mid';
  if (achievedMilestones.has('senior')) computedLevel = 'senior';
  else if (achievedMilestones.has('mid_advanced'))
    computedLevel = 'mid_advanced';
  else if (achievedMilestones.has('mid')) computedLevel = 'mid';

  const currentLevel = settings?.levelOverride || computedLevel;

  // ─── Next milestone ──────────────────────────────────────────────────────────
  const nextMilestone =
    LEVEL_ORDER.find(level => {
      const exists = enrichedPhases.some(p => p.raw.milestoneLevel === level);
      return exists && !achievedMilestones.has(level);
    }) || null;

  // ─── Progress toward next milestone ──────────────────────────────────────────
  let progressToNextPercent = 100;
  let weeksToNextMilestone = 0;

  if (nextMilestone) {
    const milestoneIndex = enrichedPhases.findIndex(
      p => p.raw.milestoneLevel === nextMilestone
    );
    const scope = enrichedPhases.slice(0, milestoneIndex + 1);

    const scopeTotal = scope.reduce((sum, p) => sum + p.phaseTotalTasks, 0);
    const scopeDone = scope.reduce((sum, p) => sum + p.phaseDoneTasks, 0);

    progressToNextPercent =
      scopeTotal === 0 ? 100 : round((scopeDone / scopeTotal) * 100);
    weeksToNextMilestone = round(
      scope.reduce(
        (sum, p) => sum + p.raw.weeksEstimate * (1 - p.phaseProgress),
        0
      )
    );
  }

  const stats = {
    totalTasks,
    doneTasks,
    overallProgress,
    overallPercent: round(overallProgress * 100),
    currentLevel,
    nextMilestone,
    progressToNextPercent,
    weeksRemainingToSenior,
    hoursRemainingToSenior,
    weeksToNextMilestone
  };

  return {
    phases: enrichedPhases.map(p => p.payload),
    stats
  };
};

module.exports = { buildRoadmap, LEVEL_ORDER };
