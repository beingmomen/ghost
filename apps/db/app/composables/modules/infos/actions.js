export const useInfoActions = () => {
  const service = useInfosService();
  const INFOS_CACHE_KEY = service.CACHE_KEY;

  const { schema } = useInfoSchema();
  const { state, populateForm, prepareSubmitData } = useInfoForm();

  const existingId = ref(null);
  const isEditing = computed(() => !!existingId.value);

  const loadExisting = (record) => {
    existingId.value = record._id;
    populateForm(record);
  };

  const handleSubmit = async () => {
    const body = prepareSubmitData();
    if (isEditing.value) {
      await service.update(body);
    } else {
      await service.create(body);
    }
  };

  return {
    INFOS_CACHE_KEY,
    state,
    schema,
    isEditing,
    loadExisting,
    handleSubmit,
    loading: service.loading
  };
};
