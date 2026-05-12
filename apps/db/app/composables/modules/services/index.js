export const useServices = () => {
  const table = useServiceTable();
  const { createColumns } = useServiceColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useServiceEdit = () => {
  return useServiceActions();
};
