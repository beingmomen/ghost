export const useSkillsService = () => {
  const { get, create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/skills';
  const CACHE_KEY = 'skills';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: (options) => get(BASE_URL, options),
    getOne: (id) => get(`${BASE_URL}/${id}`),
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
