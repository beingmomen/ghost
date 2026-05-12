import { h } from 'vue';
import { BaseDelete, UButton } from '#components';

export const useSkillColumns = () => {
  const createColumns = ({ onDelete, deleteId } = {}) => {
    return computed(() => [
      {
        accessorKey: 'documentNumber',
        header: '#'
      },
      {
        accessorKey: 'title',
        header: 'العنوان'
      },
      {
        accessorKey: 'icon',
        header: 'الأيقونة'
      },
      {
        accessorKey: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const record = row.original;
          return [
            h(UButton, {
              icon: 'i-lucide-pencil',
              color: 'neutral',
              variant: 'ghost',
              size: 'lg',
              onClick: () => navigateTo(`/skills/${record._id}`)
            }),
            h(BaseDelete, {
              deleteFunction: () => onDelete?.(record),
              loading: deleteId.value === record._id,
              itemName: record.title
            })
          ];
        }
      }
    ]);
  };

  return { createColumns };
};
