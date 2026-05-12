export const useJobs = () => {
  const table = useJobTable();
  const { createColumns } = useJobColumns();

  const columns = createColumns();

  return {
    ...table,
    columns
  };
};

export const useJobDetail = () => {
  return useJobActions();
};
