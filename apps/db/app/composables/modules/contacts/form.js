const INITIAL_STATE = {
  name: undefined,
  email: undefined,
  phone: undefined,
  description: undefined
};

export const useContactForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      description: data.description
    });
  };

  const prepareSubmitData = () => ({
    name: state.name,
    email: state.email,
    phone: state.phone,
    description: state.description
  });

  return { state, resetForm, populateForm, prepareSubmitData };
};
