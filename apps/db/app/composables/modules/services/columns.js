import { h } from 'vue';
import { BaseDelete, UAvatar, UButton } from '#components';

export const useServiceColumns = () => {
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
        accessorKey: 'title',
        header: 'العنوان'
      },
      {
        accessorKey: 'description',
        header: 'الوصف',
        cell: ({ row }) => {
          const value = row.getValue('description');
          if (!value) return '';
          return value.length > 60 ? `${value.slice(0, 60)}...` : value;
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
              onClick: () => navigateTo(`/services/${record._id}`)
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
