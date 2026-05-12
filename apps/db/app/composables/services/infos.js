export const useInfosService = () => {
  const { get, create, patch, loading } = useBaseService();
  const BASE_URL = '/infos';
  const CACHE_KEY = 'infos';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: (options) => get(BASE_URL, options),
    create: (body) => create(BASE_URL, body),
    update: (body) => patch(BASE_URL, body)
  };
};
