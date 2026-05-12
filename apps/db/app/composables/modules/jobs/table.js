export const useJobTable = () => {
  const service = useJobsService();

  const pageIndex = ref(1);
  const pageSize = ref(20);

  const { data: tableData } = useNuxtData(service.CACHE_KEY);
  const filters = useJobFilters();

  const rawItems = computed(() => tableData.value?.data || []);
  const items = computed(() => {
    const min = filters.minMatchScore.value;
    if (!min) return rawItems.value;
    return rawItems.value.filter(job => (job?.latestMatch?.score ?? 0) >= min);
  });
  const total = computed(() => {
    const apiTotal = tableData.value?.total || 0;
    if (!filters.minMatchScore.value) return apiTotal;
    return items.value.length;
  });

  const updateStatus = async (id, status) => {
    await service.update(id, { status });
    await refreshNuxtData(service.CACHE_KEY);
  };

  return {
    pageIndex,
    pageSize,
    items,
    total,
    updateStatus,
    ...filters
  };
};
