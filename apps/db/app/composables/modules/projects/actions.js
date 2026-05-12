export const useProjectActions = () => {
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id;
  const isEditing = computed(() => id !== 'new');

  const service = useProjectsService();
  const EDIT_CACHE_KEY = `${service.CACHE_KEY}-edit`;
  const SKILLS_CACHE_KEY = 'skills-list';
  const { schema } = useProjectSchema();
  const { state, skillsList, populateForm, prepareSubmitData } =
    useProjectForm();

  const setSkillsList = (data) => {
    skillsList.value = (data || []).map((s) => ({
      id: s._id,
      name: s.title
    }));
  };

  const handleSubmit = async () => {
    const body = prepareSubmitData();
    if (isEditing.value) {
      await service.update(id, body);
    } else {
      await service.create(body);
    }
    router.push('/projects');
  };

  return {
    EDIT_CACHE_KEY,
    SKILLS_CACHE_KEY,
    isEditing,
    state,
    schema,
    skillsList,
    populateForm,
    setSkillsList,
    handleSubmit,
    loading: service.loading
  };
};
