const INITIAL_STATE = {
  title: undefined,
  description: undefined,
  content: undefined,
  image: undefined,
  altText: undefined,
  tags: [],
  keywords: undefined,
  isArabicArticle: true,
  resources: [],
  status: 'draft'
};

export const useBlogForm = () => {
  const resourcesList = ref([]);
  const state = reactive({
    ...INITIAL_STATE,
    resources: []
  });

  const statusOptions = [
    { id: 'draft', name: 'مسودة' },
    { id: 'published', name: 'منشور' },
    { id: 'archived', name: 'مؤرشف' }
  ];

  const fetchResources = async () => {
    try {
      const { $api } = useNuxtApp();
      const res = await $api('/resources/all');
      resourcesList.value = (res || []).map((s) => ({
        id: s._id,
        title: s.title,
        url: s.url
      }));
    } catch {
      resourcesList.value = [];
    }
  };

  const resetForm = () => {
    Object.assign(state, {
      ...INITIAL_STATE,
      resources: [{ url: '', title: '' }]
    });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      title: data.title,
      description: data.description,
      content: data.content,
      altText: data.altText,
      tags: data.tags || [],
      keywords: data.keywords,
      isArabicArticle: data.isArabicArticle ?? true,
      image: data.image,
      resources: data.resources?.length
        ? data.resources
        : [{ url: '', title: '' }],
      status: data.status || 'draft'
    });
  };

  const prepareSubmitData = () => {
    const data = {
      title: state.title,
      description: state.description,
      content: state.content,
      altText: state.altText,
      tags: state.tags,
      keywords: state.keywords,
      isArabicArticle: state.isArabicArticle,
      resources: state.resources,
      status: state.status
    };
    if (state.image instanceof File) {
      data.image = state.image;
    }
    return toFormData(data);
  };

  return {
    state,
    statusOptions,
    resetForm,
    populateForm,
    prepareSubmitData,
    resourcesList,
    fetchResources
  };
};
