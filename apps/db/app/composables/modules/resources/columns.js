import { h } from 'vue';
import { BaseDelete, UButton } from '#components';

export const useResourceColumns = () => {
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
        accessorKey: 'url',
        header: 'الرابط',
        cell: ({ row }) => {
          const value = row.getValue('url');
          if (!value) return '';
          return h(
            UButton,
            {
              variant: 'link',
              size: 'sm',
              label: value,
              to: value,
              target: '_blank',
              class: 'max-w-xs truncate'
            }
          );
        }
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
              onClick: () => navigateTo(`/resources/${record._id}`)
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
