const TERMINAL_STATUSES = ['completed', 'partial', 'failed'];
const ACTIVE_STATUSES = ['pending', 'running'];

export const useJobSearch = () => {
  const service = useJobSearchRunsService();
  const { state, prepareSubmitData, resetForm } = useJobSearchForm();
  const { schema } = useJobSearchSchema();

  const latestRun = ref(null);
  const isInFlight = ref(false);
  const isRunning = computed(() => ACTIVE_STATUSES.includes(latestRun.value?.status));
  const showImportModal = ref(false);

  let pollingTimer = null;

  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  };

  const pollStatus = async () => {
    if (!latestRun.value?._id) return;
    const result = await service.getOne(latestRun.value._id);
    if (result?.data?.run) {
      latestRun.value = result.data.run;
      if (TERMINAL_STATUSES.includes(result.data.run.status)) stopPolling();
    }
  };

  const startPolling = () => {
    stopPolling();
    pollingTimer = setInterval(pollStatus, 4000);
  };

  const runSearch = async () => {
    if (isInFlight.value || isRunning.value) return;
    isInFlight.value = true;
    try {
      const result = await service.create(prepareSubmitData());
      if (result?.data?.run) {
        latestRun.value = result.data.run;
        if (!TERMINAL_STATUSES.includes(latestRun.value.status)) startPolling();
      }
    } finally {
      isInFlight.value = false;
    }
  };

  const loadLatestRun = async () => {
    const result = await service.getAll({ limit: 1, sort: '-createdAt' });
    if (result?.data?.length) {
      latestRun.value = result.data[0];
      if (ACTIVE_STATUSES.includes(latestRun.value.status)) startPolling();
    }
  };

  onUnmounted(stopPolling);

  return {
    state,
    schema,
    loading: service.loading,
    latestRun,
    isRunning,
    isInFlight,
    showImportModal,
    runSearch,
    loadLatestRun,
    resetForm
  };
};
