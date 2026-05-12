export const useTestimonials = () => {
  const table = useTestimonialTable();
  const { createColumns } = useTestimonialColumns();

  const columns = createColumns({
    onDelete: table.deleteItem,
    onToggleConfirmed: table.toggleConfirmed,
    deleteId: table.deleteId
  });

  return {
    ...table,
    columns
  };
};

export const useTestimonialEdit = () => {
  return useTestimonialActions();
};
