import { h } from 'vue';
import { BaseDelete, UBadge, UButton } from '#components';

export const useFaqColumns = () => {
  const createColumns = ({ onDelete, deleteId } = {}) => {
    return computed(() => [
      {
        accessorKey: 'documentNumber',
        header: '#'
      },
      {
        accessorKey: 'category',
        header: 'التصنيف',
        cell: ({ row }) => {
          return h(UBadge, {
            color: 'info',
            variant: 'subtle',
            label: row.getValue('category')
          });
        }
      },
      {
        accessorKey: 'question',
        header: 'السؤال',
        cell: ({ row }) => {
          const value = row.getValue('question');
          if (!value) return '';
          return value.length > 60 ? `${value.slice(0, 60)}...` : value;
        }
      },
      {
        accessorKey: 'answer',
        header: 'الإجابة',
        cell: ({ row }) => {
          const value = row.getValue('answer');
          if (!value) return '';
          return value.length > 60 ? `${value.slice(0, 60)}...` : value;
        }
      },
      {
        accessorKey: 'order',
        header: 'الترتيب'
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
              onClick: () => navigateTo(`/faqs/${record._id}`)
            }),
            h(BaseDelete, {
              deleteFunction: () => onDelete?.(record),
              loading: deleteId.value === record._id,
              itemName: record.question
            })
          ];
        }
      }
    ]);
  };

  return { createColumns };
};
