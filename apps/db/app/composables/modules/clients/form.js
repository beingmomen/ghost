const INITIAL_STATE = {
  name: undefined,
  website: undefined,
  altText: undefined,
  image: undefined
};

export const useClientForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      name: data.name,
      website: data.website,
      altText: data.altText,
      image: data.image
    });
  };

  const prepareSubmitData = () => {
    const data = {
      name: state.name,
      altText: state.altText,
      website: state.website
    };
    if (state.image instanceof File) {
      data.image = state.image;
    }
    return toFormData(data);
  };

  return { state, resetForm, populateForm, prepareSubmitData };
};
