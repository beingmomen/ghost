const INITIAL_STATE = {
  title: undefined,
  tag: undefined,
  description: undefined,
  url: undefined,
  skillIds: [],
  isActive: true,
  altText: undefined,
  image: undefined
};

export const useProjectForm = () => {
  const state = reactive({ ...INITIAL_STATE });
  const skillsList = ref([]);

  const fetchSkills = async () => {
    try {
      const { $api } = useNuxtApp();
      const res = await $api('/skills/all');
      skillsList.value = (res || []).map((s) => ({ id: s._id, name: s.title }));
    } catch {
      skillsList.value = [];
    }
  };

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE, skillIds: [] });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      title: data.title,
      tag: data.tag,
      description: data.description,
      url: data.url,
      altText: data.altText,
      skillIds: data.skillIds || [],
      isActive: data.isActive ?? true,
      image: data.image
    });
  };

  const prepareSubmitData = () => {
    const data = {
      title: state.title,
      tag: state.tag,
      description: state.description,
      url: state.url,
      altText: state.altText,
      skillIds: state.skillIds,
      isActive: state.isActive
    };
    if (state.image instanceof File) {
      data.image = state.image;
    }
    return toFormData(data);
  };

  return {
    state,
    skillsList,
    fetchSkills,
    resetForm,
    populateForm,
    prepareSubmitData
  };
};
