const INITIAL_STATE = {
  name: undefined,
  email: undefined,
  description: undefined,
  image: undefined,
  isConfirmed: false
};

export const useTestimonialForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      name: data.name,
      email: data.email,
      description: data.description,
      image: data.image,
      isConfirmed: data.isConfirmed || false
    });
  };

  const prepareSubmitData = () => {
    const data = {
      name: state.name,
      email: state.email,
      description: state.description,
      isConfirmed: state.isConfirmed
    };
    if (state.image instanceof File) {
      data.image = state.image;
    }
    return toFormData(data);
  };

  return { state, resetForm, populateForm, prepareSubmitData };
};
