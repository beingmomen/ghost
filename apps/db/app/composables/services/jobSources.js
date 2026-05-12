export const useJobSourcesService = () => {
  const { get, loading } = useBaseService();
  const BASE_URL = '/job-sources';
  const CACHE_KEY = 'jobSources';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: () => get(BASE_URL),
    getWuzzufHealth: () => get(`${BASE_URL}/wuzzuf/health`),
    getLinkedinHealth: () => get(`${BASE_URL}/linkedin/health`)
  };
};
