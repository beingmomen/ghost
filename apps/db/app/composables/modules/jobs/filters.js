export const useJobFilters = () => {
  const source = ref(null);
  const status = ref(null);
  const seniority = ref(null);
  const keyword = ref('');
  const minMatchScore = ref(0);

  const activeFilters = computed(() => ({
    ...(source.value && { source: source.value }),
    ...(status.value && { status: status.value }),
    ...(seniority.value && { seniority: seniority.value }),
    ...(keyword.value && { keyword: keyword.value }),
    ...(minMatchScore.value > 0 && { minMatchScore: minMatchScore.value })
  }));

  const resetFilters = () => {
    source.value = null;
    status.value = null;
    seniority.value = null;
    keyword.value = '';
    minMatchScore.value = 0;
  };

  return {
    source,
    status,
    seniority,
    keyword,
    minMatchScore,
    activeFilters,
    resetFilters
  };
};
