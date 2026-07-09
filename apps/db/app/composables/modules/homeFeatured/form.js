const INITIAL_STATE = {
  projects: []
};

export const useHomeFeaturedForm = () => {
  const state = reactive(JSON.parse(JSON.stringify(INITIAL_STATE)));
  // قائمة كل المشاريع للـ multi-select ({ id, name, image, slug }).
  const projectsList = ref([]);

  const resetForm = () => {
    Object.assign(state, JSON.parse(JSON.stringify(INITIAL_STATE)));
  };

  const populateForm = (data) => {
    Object.assign(state, {
      projects: Array.isArray(data.projects) ? [...data.projects] : []
    });
  };

  // JSON object مباشر (مش toFormData) — الـ route ما فيهوش multer، مفيش رفع ملفات.
  const prepareSubmitData = () => ({
    projects: [...state.projects]
  });

  // إعادة الترتيب — الـ ordered list هي مصدر الحقيقة للترتيب (BaseSelect مبيرتّبش).
  const moveUp = (i) => {
    if (i <= 0) return;
    const list = state.projects;
    [list[i - 1], list[i]] = [list[i], list[i - 1]];
  };

  const moveDown = (i) => {
    const list = state.projects;
    if (i >= list.length - 1) return;
    [list[i + 1], list[i]] = [list[i], list[i + 1]];
  };

  const removeProject = (i) => {
    state.projects.splice(i, 1);
  };

  return {
    state,
    projectsList,
    resetForm,
    populateForm,
    prepareSubmitData,
    moveUp,
    moveDown,
    removeProject
  };
};
