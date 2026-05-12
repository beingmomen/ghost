export const useManualJobsService = () => {
  const { create, loading } = useBaseService();
  const BASE_URL = '/manual-jobs';
  const CACHE_KEY = 'manualJobs';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    import: (body) => create(`${BASE_URL}/import`, body)
  };
};
