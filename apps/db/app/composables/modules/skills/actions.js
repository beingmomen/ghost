export const useSkillActions = () => {
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id;
  const isEditing = computed(() => id !== 'new');

  const service = useSkillsService();
  const EDIT_CACHE_KEY = `${service.CACHE_KEY}-edit`;

  const { schema } = useSkillSchema();
  const { state, populateForm, prepareSubmitData } = useSkillForm();

  const handleSubmit = async () => {
    const body = prepareSubmitData();
    if (isEditing.value) {
      await service.update(id, body);
    } else {
      await service.create(body);
    }
    router.push('/skills');
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
