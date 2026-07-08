export const useContactsService = () => {
  const { patch, remove, loading, create } = useBaseService();
  const BASE_URL = '/contacts';
  const CACHE_KEY = 'contacts';

  return {
    BASE_URL,
    CACHE_KEY,
    loading,
    create: (body) => create(BASE_URL, body),
    update: (id, body) => patch(`${BASE_URL}/${id}`, body),
    remove: (id) => remove(`${BASE_URL}/${id}`)
  };
};
