import { h } from 'vue';
import { BaseDelete, UAvatar, UButton } from '#components';

export const useClientColumns = () => {
  const createColumns = ({ onDelete, deleteId } = {}) => {
    return computed(() => [
      {
        accessorKey: 'documentNumber',
        header: '#'
      },
      {
        accessorKey: 'image',
        header: 'الصورة',
        cell: ({ row }) => {
          const src = normalizeAvatarSrc(row.getValue('image'));
          return h(UAvatar, { src, size: 'lg' });
        }
      },
      {
        accessorKey: 'name',
        header: 'الاسم'
      },
      {
        accessorKey: 'website',
        header: 'الموقع'
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
              onClick: () => navigateTo(`/clients/${record._id}`)
            }),
            h(BaseDelete, {
              deleteFunction: () => onDelete?.(record),
              loading: deleteId.value === record._id,
              itemName: record.name
            })
          ];
        }
      }
    ]);
  };

  return { createColumns };
};
