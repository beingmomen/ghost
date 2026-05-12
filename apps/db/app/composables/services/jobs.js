export const useJobsService = () => {
  const { get, patch, create, loading } = useBaseService();
  const BASE_URL = '/jobs';
  const CACHE_KEY = 'jobs';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: (options) => get(BASE_URL, options),
    getOne: (id) => get(`${BASE_URL}/${id}`),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    analyze: (id) => create(`${BASE_URL}/${id}/analyze`, {}),
    getDrafts: (id) => get(`${BASE_URL}/${id}/resume-drafts`),
    createDraft: (id) => create(`${BASE_URL}/${id}/resume-drafts`, {})
  };
};
