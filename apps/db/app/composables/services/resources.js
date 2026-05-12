export const useResourcesService = () => {
  const { get, create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/resources';
  const CACHE_KEY = 'resources';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: (options) => get(BASE_URL, options),
    getAllNoPagination: () => get(`${BASE_URL}/all`),
    getOne: (id) => get(`${BASE_URL}/${id}`),
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
