export const useHomeFeaturedActions = () => {
  const service = useHomeFeaturedService();
  const HOME_FEATURED_CACHE_KEY = service.CACHE_KEY;

  const { schema } = useHomeFeaturedSchema();
  const {
    state,
    projectsList,
    populateForm,
    prepareSubmitData,
    moveUp,
    moveDown,
    removeProject
  } = useHomeFeaturedForm();

  const existingId = ref(null);
  const isEditing = computed(() => !!existingId.value);

  const loadExisting = (record) => {
    existingId.value = record._id;
    populateForm(record);
  };

  // من /projects/all (bare array) → { id, name, image, slug } للـ select والـ ordered list.
  const setProjectsList = (data) => {
    projectsList.value = (data || []).map((p) => ({
      id: p._id,
      name: p.title,
      image: p.image,
      slug: p.slug
    }));
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
    HOME_FEATURED_CACHE_KEY,
    state,
    schema,
    projectsList,
    isEditing,
    loadExisting,
    setProjectsList,
    handleSubmit,
    moveUp,
    moveDown,
    removeProject,
    loading: service.loading
  };
};
