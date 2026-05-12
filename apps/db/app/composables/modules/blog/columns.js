import { h } from 'vue';
import { BaseDelete, UAvatar, UBadge, UButton } from '#components';

const STATUS_MAP = {
  draft: { label: 'مسودة', color: 'neutral' },
  published: { label: 'منشور', color: 'success' },
  archived: { label: 'مؤرشف', color: 'warning' }
};

export const useBlogColumns = () => {
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
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const value = row.getValue('status');
          const status = STATUS_MAP[value] || STATUS_MAP.draft;
          return h(
            UBadge,
            { color: status.color, variant: 'subtle' },
            () => status.label
          );
        }
      },
      {
        accessorKey: 'description',
        header: 'الوصف',
        cell: ({ row }) => {
          const value = row.getValue('description');
          if (!value) return '';
          return value.length > 50 ? `${value.slice(0, 50)}...` : value;
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
              onClick: () => navigateTo(`/blog/${record._id}`)
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
