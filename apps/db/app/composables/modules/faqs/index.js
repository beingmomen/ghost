export const useFaqs = () => {
  const table = useFaqTable();
  const { createColumns } = useFaqColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useFaqEdit = () => {
  return useFaqActions();
};
