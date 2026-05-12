export const useJobSearchRunsService = () => {
  const { get, create, loading } = useBaseService();
  const BASE_URL = '/job-search-runs';
  const CACHE_KEY = 'jobSearchRuns';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: (options) => get(BASE_URL, options),
    getOne: (id) => get(`${BASE_URL}/${id}`),
    create: (body) => create(BASE_URL, body)
  };
};
