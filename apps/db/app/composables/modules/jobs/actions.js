export const useJobActions = () => {
  const route = useRoute();
  const id = route.params.id;

  const service = useJobsService();

  const { data: jobData } = useNuxtData(`job-${id}`);
  const job = computed(() => jobData.value?.data || null);

  const drafts = ref([]);
  const draftsLoading = ref(false);
  const analyzeLoading = ref(false);
  const statusLoading = ref(false);

  const updateStatus = async (status) => {
    statusLoading.value = true;
    try {
      await service.update(id, { status });
      await refreshNuxtData(`job-${id}`);
    } finally {
      statusLoading.value = false;
    }
  };

  const analyze = async () => {
    analyzeLoading.value = true;
    try {
      await service.analyze(id);
      await refreshNuxtData(`job-${id}`);
    } finally {
      analyzeLoading.value = false;
    }
  };

  const loadDrafts = async () => {
    draftsLoading.value = true;
    try {
      const res = await service.getDrafts(id);
      drafts.value = res.data?.drafts || [];
    } finally {
      draftsLoading.value = false;
    }
  };

  const createDraft = async () => {
    draftsLoading.value = true;
    try {
      await service.createDraft(id);
      await loadDrafts();
    } finally {
      draftsLoading.value = false;
    }
  };

  return {
    job,
    loading: service.loading,
    analyzeLoading,
    statusLoading,
    drafts,
    draftsLoading,
    updateStatus,
    analyze,
    loadDrafts,
    createDraft
  };
};
