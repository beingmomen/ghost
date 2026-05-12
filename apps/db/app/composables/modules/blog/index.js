export const useBlogs = () => {
  const table = useBlogTable();
  const { createColumns } = useBlogColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useBlogEdit = () => {
  return useBlogActions();
};
