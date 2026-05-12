export const useContacts = () => {
  const table = useContactTable();
  const { createColumns } = useContactColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    onToggleViewed: table.toggleViewed,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useContactEdit = () => {
  return useContactActions();
};
