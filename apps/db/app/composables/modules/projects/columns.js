import { h } from 'vue';
import { BaseDelete, UAvatar, UBadge, UButton } from '#components';

export const useProjectColumns = () => {
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
        accessorKey: 'tag',
        header: 'الوسم'
      },
      {
        accessorKey: 'isActive',
        header: 'الحالة',
        cell: ({ row }) => {
          const active = row.getValue('isActive');
          return h(
            UBadge,
            {
              color: active ? 'success' : 'neutral',
              variant: 'subtle'
            },
            () => (active ? 'نشط' : 'غير نشط')
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
              onClick: () => navigateTo(`/projects/${record._id}`)
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
