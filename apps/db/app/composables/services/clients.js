export const useClientsService = () => {
  const { create, patch, remove, loading } = useBaseService();
  const BASE_URL = '/clients';
  const CACHE_KEY = 'clients';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
