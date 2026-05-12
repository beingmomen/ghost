import { h } from 'vue';
import { UBadge, UButton } from '#components';

const SOURCE_MAP = {
  wuzzuf: { label: 'Wuzzuf', color: 'orange' },
  linkedin: { label: 'LinkedIn', color: 'blue' },
  manual: { label: 'يدوي', color: 'neutral' }
};

const STATUS_MAP = {
  new: { label: 'جديدة', color: 'info' },
  shortlisted: { label: 'مختارة', color: 'success' },
  ignored: { label: 'متجاهلة', color: 'neutral' },
  cv_ready: { label: 'CV جاهز', color: 'warning' },
  applied: { label: 'تقدمت', color: 'primary' }
};

export const useJobColumns = () => {
  const createColumns = () => {
    return computed(() => [
      {
        accessorKey: 'title',
        header: 'المسمى الوظيفي'
      },
      {
        accessorKey: 'company',
        header: 'الشركة'
      },
      {
        accessorKey: 'location',
        header: 'الموقع'
      },
      {
        accessorKey: 'seniority',
        header: 'المستوى'
      },
      {
        accessorKey: 'source',
        header: 'المصدر',
        cell: ({ row }) => {
          const source = row.getValue('source');
          const badge = SOURCE_MAP[source] || { label: source || '—', color: 'neutral' };
          return h(UBadge, { color: badge.color, variant: 'subtle' }, () => badge.label);
        }
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status');
          const badge = STATUS_MAP[status] || { label: status || '—', color: 'neutral' };
          return h(UBadge, { color: badge.color, variant: 'subtle' }, () => badge.label);
        }
      },
      {
        accessorKey: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const record = row.original;
          return h(UButton, {
            icon: 'i-lucide-eye',
            color: 'neutral',
            variant: 'ghost',
            size: 'lg',
            onClick: () => navigateTo(`/jobs/${record._id}`)
          });
        }
      }
    ]);
  };

  return { createColumns };
};
