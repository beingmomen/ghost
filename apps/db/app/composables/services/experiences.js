export const useExperiencesService = () => {
  const { create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/experiences';
  const CACHE_KEY = 'experiences';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
