export const useSkills = () => {
  const table = useSkillTable();
  const { createColumns } = useSkillColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useSkillEdit = () => {
  return useSkillActions();
};
