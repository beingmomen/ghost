import * as z from 'zod';

export const useJobSearchSchema = () => {
  const schema = computed(() =>
    z.object({
      terms: z
        .array(z.string())
        .min(1, 'أدخل كلمة بحث واحدة على الأقل'),
      source: z.enum(['wuzzuf', 'linkedin', 'all'], {
        message: 'اختر مصدرًا صالحًا'
      }),
      location: z.string().optional(),
      maxPages: z
        .number({ message: 'عدد الصفحات مطلوب' })
        .min(1, 'الحد الأدنى صفحة واحدة')
        .max(10, 'الحد الأقصى 10 صفحات'),
      maxJobs: z
        .number({ message: 'عدد الوظائف مطلوب' })
        .min(1, 'الحد الأدنى وظيفة واحدة')
        .max(200, 'الحد الأقصى 200 وظيفة')
    })
  );

  return { schema };
};
