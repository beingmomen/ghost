export const useRoadmapService = () => {
  const { create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/roadmap';
  const CACHE_KEY = 'roadmap';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,

    // Phases
    createPhase: (body) => create(`${BASE_URL}/phases`, body),
    updatePhase: (id, body) => patch(`${BASE_URL}/phases/${id}`, body),
    removePhase: (id) => remove(`${BASE_URL}/phases/${id}`),
    reorderPhases: (orderedIds) =>
      patch(`${BASE_URL}/phases/reorder`, { orderedIds }),

    // Weeks
    createWeek: (body) => create(`${BASE_URL}/weeks`, body),
    updateWeek: (id, body) => patch(`${BASE_URL}/weeks/${id}`, body),
    removeWeek: (id) => remove(`${BASE_URL}/weeks/${id}`),
    reorderWeeks: (orderedIds) =>
      patch(`${BASE_URL}/weeks/reorder`, { orderedIds }),

    // Tasks
    createTask: (body) => create(`${BASE_URL}/tasks`, body),
    updateTask: (id, body) => patch(`${BASE_URL}/tasks/${id}`, body),
    removeTask: (id) => remove(`${BASE_URL}/tasks/${id}`),
    reorderTasks: (orderedIds) =>
      patch(`${BASE_URL}/tasks/reorder`, { orderedIds }),

    // Settings
    updateSettings: (body) => patch(`${BASE_URL}/settings`, body)
  };
};
