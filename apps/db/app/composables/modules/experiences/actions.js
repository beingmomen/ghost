export const useExperienceActions = () => {
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id;
  const isEditing = computed(() => id !== 'new');

  const service = useExperiencesService();
  const EDIT_CACHE_KEY = `${service.CACHE_KEY}-edit`;

  const { schema } = useExperienceSchema();
  const { state, populateForm, prepareSubmitData } = useExperienceForm();

  const handleSubmit = async () => {
    const body = prepareSubmitData();
    if (isEditing.value) {
      await service.update(id, body);
    } else {
      await service.create(body);
    }
    router.push('/experiences');
  };

  return {
    EDIT_CACHE_KEY,
    isEditing,
    state,
    schema,
    populateForm,
    handleSubmit,
    loading: service.loading
  };
};
