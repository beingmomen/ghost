import { h } from 'vue';
import { BaseDelete, UBadge, UButton } from '#components';

export const useExperienceColumns = () => {
  const createColumns = ({ onDelete, deleteId } = {}) => {
    return computed(() => [
      {
        accessorKey: 'documentNumber',
        header: '#'
      },
      {
        accessorKey: 'company',
        header: 'الشركة'
      },
      {
        accessorKey: 'position',
        header: 'المنصب'
      },
      {
        accessorKey: 'employmentType',
        header: 'نوع العمل'
      },
      {
        accessorKey: 'endDate',
        header: 'الحالة',
        cell: ({ row }) => {
          const endDate = row.getValue('endDate');
          const isCurrent = endDate === 'الحالي';
          return h(UBadge, {
            color: isCurrent ? 'success' : 'neutral',
            variant: 'subtle',
            label: isCurrent ? 'حالي' : 'منتهية'
          });
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
              onClick: () => navigateTo(`/experiences/${record._id}`)
            }),
            h(BaseDelete, {
              deleteFunction: () => onDelete?.(record),
              loading: deleteId.value === record._id,
              itemName: record.company
            })
          ];
        }
      }
    ]);
  };

  return { createColumns };
};
