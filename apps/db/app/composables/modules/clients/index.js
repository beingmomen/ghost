export const useClients = () => {
  const table = useClientTable();
  const { createColumns } = useClientColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useClientEdit = () => {
  return useClientActions();
};
