export const useBlogsService = () => {
  const { get, create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/blogs';
  const CACHE_KEY = 'blogs';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    getAll: (options) => get(BASE_URL, options),
    getOne: (id) => get(`${BASE_URL}/${id}`),
    getBySlug: (slug) => get(`${BASE_URL}/slug/${slug}`),
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
