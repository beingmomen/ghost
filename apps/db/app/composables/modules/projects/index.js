export const useProjects = () => {
  const table = useProjectTable();
  const { createColumns } = useProjectColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useProjectEdit = () => {
  return useProjectActions();
};
