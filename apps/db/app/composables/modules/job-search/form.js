const INITIAL_STATE = {
  terms: ['Frontend Developer', 'Vue Developer', 'Nuxt Developer'],
  source: 'wuzzuf',
  location: 'Egypt',
  maxPages: 3,
  maxJobs: 60
};

export const useJobSearchForm = () => {
  const state = reactive({ ...INITIAL_STATE, terms: [...INITIAL_STATE.terms] });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE, terms: [...INITIAL_STATE.terms] });
  };

  const prepareSubmitData = () => ({
    terms: [...state.terms],
    source: state.source,
    location: state.location,
    maxPages: state.maxPages,
    maxJobs: state.maxJobs
  });

  return { state, resetForm, prepareSubmitData };
};
