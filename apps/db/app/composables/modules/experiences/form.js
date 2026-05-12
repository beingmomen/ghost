const INITIAL_STATE = {
  company: undefined,
  position: undefined,
  employmentType: undefined,
  workPlace: undefined,
  startDate: undefined,
  endDate: undefined,
  responsibilities: [''],
  linkedInUrl: undefined,
  companySiteUrl: undefined,
  iconName: undefined,
  imageAlt: undefined,
  order: 0
};

export const useExperienceForm = () => {
  const state = reactive({ ...INITIAL_STATE, responsibilities: [''] });

  const resetForm = () => {
    Object.assign(state, { ...INITIAL_STATE, responsibilities: [''] });
  };

  const populateForm = (data) => {
    Object.assign(state, {
      company: data.company,
      position: data.position,
      employmentType: data.employmentType,
      workPlace: data.workPlace,
      startDate: data.startDate,
      endDate: data.endDate,
      responsibilities: data.responsibilities?.length ? [...data.responsibilities] : [''],
      linkedInUrl: data.linkedInUrl,
      companySiteUrl: data.companySiteUrl,
      iconName: data.iconName,
      imageAlt: data.imageAlt,
      order: data.order ?? 0
    });
  };

  const prepareSubmitData = () => {
    const data = {
      company: state.company,
      position: state.position,
      employmentType: state.employmentType,
      workPlace: state.workPlace,
      startDate: state.startDate,
      endDate: state.endDate,
      responsibilities: state.responsibilities.filter((r) => r?.trim()),
      linkedInUrl: state.linkedInUrl,
      companySiteUrl: state.companySiteUrl,
      imageAlt: state.imageAlt,
      order: state.order
    };
    if (state.iconName instanceof File) {
      data.iconName = state.iconName;
    }
    return toFormData(data);
  };

  return { state, resetForm, populateForm, prepareSubmitData };
};
