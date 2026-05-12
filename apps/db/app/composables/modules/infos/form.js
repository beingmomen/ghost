const INITIAL_STATE = {
  resumeUrl: undefined,
  bio: {
    paragraphs: [''],
    quote: ''
  },
  stats: [{ value: '', label: '', icon: '' }],
  skills: [{ title: '', icon: '', items: [{ name: '', icon: '' }] }],
  images: [{ src: null, alt: '' }]
};

export const useInfoForm = () => {
  const state = reactive(JSON.parse(JSON.stringify(INITIAL_STATE)));

  const resetForm = () => {
    Object.assign(state, JSON.parse(JSON.stringify(INITIAL_STATE)));
  };

  const populateForm = (data) => {
    Object.assign(state, {
      resumeUrl: data.resumeUrl,
      bio: {
        paragraphs: data.bio?.paragraphs?.length ? [...data.bio.paragraphs] : [''],
        quote: data.bio?.quote || ''
      },
      stats: data.stats?.length
        ? data.stats.map((s) => ({ value: s.value || '', label: s.label || '', icon: s.icon || '' }))
        : [{ value: '', label: '', icon: '' }],
      skills: data.skills?.length
        ? data.skills.map((s) => ({
            title: s.title || '',
            icon: s.icon || '',
            items: s.items?.length
              ? s.items.map((i) => ({ name: i.name || '', icon: i.icon || '' }))
              : [{ name: '', icon: '' }]
          }))
        : [{ title: '', icon: '', items: [{ name: '', icon: '' }] }],
      images: data.images?.length
        ? data.images.map((i) => ({ src: i.src || null, alt: i.alt || '' }))
        : [{ src: null, alt: '' }]
    });
  };

  const prepareSubmitData = () => {
    const data = {
      resumeUrl: state.resumeUrl,
      bio: {
        paragraphs: state.bio.paragraphs.filter((p) => p.trim()),
        quote: state.bio.quote
      },
      stats: state.stats.filter((s) => s.value || s.label),
      skills: state.skills
        .filter((s) => s.title)
        .map((s) => ({
          ...s,
          items: s.items.filter((i) => i.name)
        })),
      images: state.images.filter((i) => i.src)
    };
    return toFormData(data);
  };

  return { state, resetForm, populateForm, prepareSubmitData };
};
