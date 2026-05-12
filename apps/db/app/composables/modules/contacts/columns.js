import { h } from 'vue';
import { BaseDelete, UBadge, UButton } from '#components';

export const useContactColumns = () => {
  const createColumns = ({ onDelete, onToggleViewed, deleteId } = {}) => {
    return computed(() => [
      {
        accessorKey: 'documentNumber',
        header: '#'
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
        accessorKey: 'phone',
        header: 'الهاتف'
      },
      {
        accessorKey: 'description',
        header: 'الرسالة',
        cell: ({ row }) => {
          const value = row.getValue('description');
          if (!value) return '';
          return value.length > 50 ? `${value.slice(0, 50)}...` : value;
        }
      },
      {
        accessorKey: 'isViewed',
        header: 'الحالة',
        cell: ({ row }) => {
          const viewed = row.getValue('isViewed');
          return h(
            UBadge,
            {
              color: viewed ? 'success' : 'warning',
              variant: 'subtle'
            },
            () => (viewed ? 'تمت المشاهدة' : 'جديد')
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
              icon: record.isViewed ? 'i-lucide-eye-off' : 'i-lucide-eye',
              color: 'neutral',
              variant: 'ghost',
              size: 'lg',
              onClick: () => onToggleViewed?.(record)
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
