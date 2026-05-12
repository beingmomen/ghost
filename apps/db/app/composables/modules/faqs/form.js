const INITIAL_STATE = {
  category: undefined,
  question: undefined,
  answer: undefined,
  order: 0
};

export const useFaqForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      category: data.category,
      question: data.question,
      answer: data.answer,
      order: data.order ?? 0
    });
  };

  const prepareSubmitData = () => ({
    category: state.category,
    question: state.question,
    answer: state.answer,
    order: state.order
  });

  return { state, resetForm, populateForm, prepareSubmitData };
};
