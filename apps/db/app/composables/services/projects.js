export const useProjectsService = () => {
  const { create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/projects';
  const CACHE_KEY = 'projects';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
