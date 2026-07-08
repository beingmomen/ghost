export const useTestimonialsService = () => {
  const { patch, remove, create, loading } = useBaseService();
  const BASE_URL = '/testimonials';
  const CACHE_KEY = 'testimonials';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    create: (body) => create(BASE_URL, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
