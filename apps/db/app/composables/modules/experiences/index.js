export const useExperiences = () => {
  const table = useExperienceTable();
  const { createColumns } = useExperienceColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useExperienceEdit = () => {
  return useExperienceActions();
};
