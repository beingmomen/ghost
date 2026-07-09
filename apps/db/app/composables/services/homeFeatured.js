export const useHomeFeaturedService = () => {
  const { create, patch, loading } = useBaseService();
  const BASE_URL = '/home-featured';
  const CACHE_KEY = 'home-featured';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    create: (body) => create(BASE_URL, body),
    update: (body) => patch(BASE_URL, body)
  };
};
