import { h } from 'vue';
import { BaseDelete, UBadge, UButton, UAvatar } from '#components';

export const useTestimonialColumns = () => {
  const createColumns = ({ onDelete, onToggleConfirmed, deleteId } = {}) => {
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
        accessorKey: 'email',
        header: 'البريد'
      },
      {
        accessorKey: 'description',
        header: 'التوصية',
        cell: ({ row }) => {
          const value = row.getValue('description');
          if (!value) return '';
          return value.length > 50 ? `${value.slice(0, 50)}...` : value;
        }
      },
      {
        accessorKey: 'isConfirmed',
        header: 'الحالة',
        cell: ({ row }) => {
          const confirmed = row.getValue('isConfirmed');
          return h(
            UBadge,
            {
              color: confirmed ? 'success' : 'warning',
              variant: 'subtle'
            },
            () => (confirmed ? 'مؤكد' : 'معلق')
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
              onClick: () => navigateTo(`/testimonials/${record._id}`)
            }),
            h(UButton, {
              icon: record.isConfirmed ? 'i-lucide-x-circle' : 'i-lucide-check-circle',
              color: record.isConfirmed ? 'warning' : 'success',
              variant: 'ghost',
              size: 'lg',
              onClick: () => onToggleConfirmed?.(record)
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
