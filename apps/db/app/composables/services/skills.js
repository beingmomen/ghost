export const useSkillsService = () => {
  const { create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/skills';
  const CACHE_KEY = 'skills';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
