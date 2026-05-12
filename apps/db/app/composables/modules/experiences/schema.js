import * as z from 'zod';

export const useExperienceSchema = () => {
  const schema = computed(() =>
    z.object({
      company: z.string({ message: 'اسم الشركة مطلوب' }).min(1, 'اسم الشركة مطلوب'),
      position: z.string({ message: 'المنصب مطلوب' }).min(1, 'المنصب مطلوب'),
      employmentType: z.string({ message: 'نوع العمل مطلوب' }).min(1, 'نوع العمل مطلوب'),
      workPlace: z.string({ message: 'مكان العمل مطلوب' }).min(1, 'مكان العمل مطلوب'),
      startDate: z.string({ message: 'تاريخ البداية مطلوب' }).min(1, 'تاريخ البداية مطلوب'),
      endDate: z.string({ message: 'تاريخ النهاية مطلوب' }).min(1, 'تاريخ النهاية مطلوب'),
      responsibilities: z.array(z.string()).min(1, 'أضف مسؤولية واحدة على الأقل'),
      linkedInUrl: z.string().url('رابط LinkedIn غير صالح').optional().or(z.literal('')),
      companySiteUrl: z.string().url('رابط الموقع غير صالح').optional().or(z.literal('')),
      iconName: z.string().optional().or(z.literal('')),
      imageAlt: z.string().optional().or(z.literal('')),
      order: z.number({ message: 'الترتيب يجب أن يكون رقم' }).int().min(0).optional()
    })
  );

  return { schema };
};
