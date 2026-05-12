const INITIAL_STATE = {
  title: undefined,
  url: undefined
};

export const useResourceForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      title: data.title,
      url: data.url
    });
  };

  const prepareSubmitData = () => ({
    title: state.title,
    url: state.url
  });

  return { state, resetForm, populateForm, prepareSubmitData };
};
