const INITIAL_STATE = {
  title: undefined,
  icon: undefined
};

export const useSkillForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      title: data.title,
      icon: data.icon
    });
  };

  const prepareSubmitData = () => ({
    title: state.title,
    icon: state.icon
  });

  return { state, resetForm, populateForm, prepareSubmitData };
};
