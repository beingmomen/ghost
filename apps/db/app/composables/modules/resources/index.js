export const useResources = () => {
  const table = useResourceTable();
  const { createColumns } = useResourceColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useResourceEdit = () => {
  return useResourceActions();
};
