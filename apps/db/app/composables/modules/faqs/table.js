export const useFaqTable = () => {
  const service = useFaqsService();

  const pageIndex = ref(1);
  const pageSize = ref(10);

  const { data: tableData } = useNuxtData(service.CACHE_KEY);
  const items = computed(() => tableData.value?.data || []);
  const total = computed(() => tableData.value?.total || 0);

  const deleteId = ref(null);

  const deleteItem = async (record) => {
    deleteId.value = record._id;
    try {
      await service.remove(record._id);
      await refreshNuxtData(service.CACHE_KEY);
    } finally {
      deleteId.value = null;
    }
  };

  return {
    pageIndex,
    pageSize,
    items,
    total,
    deleteId,
    deleteItem
  };
};
