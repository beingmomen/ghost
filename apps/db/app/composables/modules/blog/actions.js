export const useBlogActions = () => {
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id;
  const isEditing = computed(() => id !== 'new');

  const service = useBlogsService();
  const EDIT_CACHE_KEY = `${service.CACHE_KEY}-edit`;
  const RESOURCES_CACHE_KEY = 'resources-list';
  const { schema } = useBlogSchema(isEditing);
  const {
    state,
    statusOptions,
    populateForm,
    prepareSubmitData,
    resourcesList
  } = useBlogForm();

  const setResourcesList = (data) => {
    resourcesList.value = (data || []).map((s) => ({
      id: s._id,
      title: s.title,
      url: s.url
    }));
  };

  const handleSubmit = async () => {
    const body = prepareSubmitData();
    if (isEditing.value) {
      await service.update(id, body);
    } else {
      await service.create(body);
    }
    router.push('/blog');
  };

  return {
    EDIT_CACHE_KEY,
    RESOURCES_CACHE_KEY,
    isEditing,
    state,
    schema,
    statusOptions,
    populateForm,
    setResourcesList,
    handleSubmit,
    resourcesList,
    loading: service.loading
  };
};
