export const useRoadmap = () => {
  const service = useRoadmapService();
  const { data } = useNuxtData(service.CACHE_KEY);

  const roadmap = computed(
    () => data.value || { settings: {}, stats: {}, phases: [] }
  );
  const settings = computed(() => roadmap.value.settings || {});
  const stats = computed(() => roadmap.value.stats || {});
  const phases = computed(() => roadmap.value.phases || []);

  const refresh = () => refreshNuxtData(service.CACHE_KEY);

  // Tracks the id of the entity currently mutating (to disable its controls).
  const busyId = ref(null);

  const withBusy = async (id, fn) => {
    busyId.value = id;
    try {
      await fn();
      await refresh();
    } finally {
      busyId.value = null;
    }
  };

  // ─── Tasks ──────────────────────────────────────────────────────────────────
  const toggleTask = (task) =>
    withBusy(task.id, () => service.updateTask(task.id, { done: !task.done }));

  const createTask = (weekId, body) =>
    withBusy(`new-task-${weekId}`, () =>
      service.createTask({ weekId, ...body })
    );

  const updateTask = (id, body) =>
    withBusy(id, () => service.updateTask(id, body));

  const removeTask = (id) => withBusy(id, () => service.removeTask(id));

  // ─── Weeks ──────────────────────────────────────────────────────────────────
  const createWeek = (phaseId, body) =>
    withBusy(`new-week-${phaseId}`, () =>
      service.createWeek({ phaseId, ...body })
    );

  const updateWeek = (id, body) =>
    withBusy(id, () => service.updateWeek(id, body));

  const removeWeek = (id) => withBusy(id, () => service.removeWeek(id));

  // ─── Phases ───────────────────────────────────────────────────────────────────
  const createPhase = (body) =>
    withBusy('new-phase', () => service.createPhase(body));

  const updatePhase = (id, body) =>
    withBusy(id, () => service.updatePhase(id, body));

  const removePhase = (id) => withBusy(id, () => service.removePhase(id));

  // ─── Settings ─────────────────────────────────────────────────────────────────
  const updateSettings = (body) =>
    withBusy('settings', () => service.updateSettings(body));

  // ─── Reorder (▲▼) ─────────────────────────────────────────────────────────────
  const move = async (items, index, dir, reorderFn) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const ids = items.map((i) => i.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await withBusy(items[index].id, () => reorderFn(ids));
  };

  const movePhase = (index, dir) =>
    move(phases.value, index, dir, service.reorderPhases);

  const moveWeek = (weeks, index, dir) =>
    move(weeks, index, dir, service.reorderWeeks);

  const moveTask = (tasks, index, dir) =>
    move(tasks, index, dir, service.reorderTasks);

  return {
    loading: service.loading,
    busyId,
    roadmap,
    settings,
    stats,
    phases,
    refresh,
    // tasks
    toggleTask,
    createTask,
    updateTask,
    removeTask,
    // weeks
    createWeek,
    updateWeek,
    removeWeek,
    // phases
    createPhase,
    updatePhase,
    removePhase,
    // settings
    updateSettings,
    // reorder
    movePhase,
    moveWeek,
    moveTask
  };
};
