const INITIAL_STATE = {
  title: undefined,
  description: undefined,
  altText: undefined,
  image: undefined
};

export const useServiceForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      title: data.title,
      description: data.description,
      altText: data.altText,
      image: data.image
    });
  };

  const prepareSubmitData = () => {
    const data = {
      title: state.title,
      description: state.description,
      altText: state.altText
    };
    if (state.image instanceof File) {
      data.image = state.image;
    }
    return toFormData(data);
  };

  return { state, resetForm, populateForm, prepareSubmitData };
};
