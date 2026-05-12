const INITIAL_STATE = {
  targetRoles: [],
  targetSeniority: [],
  defaultStacks: [],
  optionalStacks: [],
  locationPreferences: [],
  workplacePreferences: [],
  requiredKeywords: [],
  excludedKeywords: [],
  maxJobAgeDays: 60
};

export const useCareerProfileForm = () => {
  const state = reactive({ ...INITIAL_STATE });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE });
  };

  const populateForm = (settings) => {
    Object.assign(state, {
      targetRoles: settings.targetRoles || [],
      targetSeniority: settings.targetSeniority || [],
      defaultStacks: settings.defaultStacks || [],
      optionalStacks: settings.optionalStacks || [],
      locationPreferences: settings.locationPreferences || [],
      workplacePreferences: settings.workplacePreferences || [],
      requiredKeywords: settings.requiredKeywords || [],
      excludedKeywords: settings.excludedKeywords || [],
      maxJobAgeDays: settings.maxJobAgeDays ?? 60
    });
  };

  const prepareSubmitData = () => ({
    targetRoles: state.targetRoles,
    targetSeniority: state.targetSeniority,
    defaultStacks: state.defaultStacks,
    optionalStacks: state.optionalStacks,
    locationPreferences: state.locationPreferences,
    workplacePreferences: state.workplacePreferences,
    requiredKeywords: state.requiredKeywords,
    excludedKeywords: state.excludedKeywords,
    maxJobAgeDays: state.maxJobAgeDays
  });

  return { state, resetForm, populateForm, prepareSubmitData };
};
