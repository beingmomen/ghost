export const useCareerProfileService = () => {
  const { get, patch, loading } = useBaseService();
  const BASE_URL = '/career-profile';
  const CACHE_KEY = 'careerProfile';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getProfile: () => get(BASE_URL),
    updateSettings: (body) => patch(`${BASE_URL}/settings`, body)
  };
};
