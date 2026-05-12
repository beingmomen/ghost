export const useCareerProfileActions = () => {
  const service = useCareerProfileService();

  const { schema } = useCareerProfileSchema();
  const { state, populateForm, prepareSubmitData } = useCareerProfileForm();

  const loadSettings = (settings) => {
    if (settings) populateForm(settings);
  };

  const handleSubmit = async () => {
    const body = prepareSubmitData();
    await service.updateSettings(body);
  };

  return {
    CACHE_KEY: service.CACHE_KEY,
    state,
    schema,
    loadSettings,
    handleSubmit,
    loading: service.loading
  };
};
