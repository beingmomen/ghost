import * as z from 'zod';

export const useProjectSchema = () => {
  const schema = computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(1, 'العنوان مطلوب'),
      tag: z.string({ message: 'الوسم مطلوب' }).min(1, 'الوسم مطلوب'),
      description: z
        .string({ message: 'الوصف مطلوب' })
        .min(60, 'الوصف يجب أن يكون 60 حرفًا على الأقل')
        .max(200, 'الوصف يجب ألا يتجاوز 200 حرف'),
      url: z.string({ message: 'الرابط مطلوب' }).url('الرابط غير صالح'),
      skillIds: z
        .array(z.string({ message: 'المهارات مطلوبة' }), {
          message: 'يجب اختيار 3 مهارات على الأقل'
        })
        .min(3, 'يجب اختيار 3 مهارات على الأقل'),
      isActive: z.boolean().optional(),
      detailSlug: z
        .string()
        .regex(
          /^[a-z0-9]+(-[a-z0-9]+)*$/,
          'الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط'
        )
        .optional()
        .or(z.literal('')),
      isProductionWork: z.boolean().optional(),
      productionOrder: z
        .number({ message: 'الترتيب يجب أن يكون رقم' })
        .int()
        .min(0)
        .optional(),
      altText: z
        .string({ message: 'النص البديل مطلوب' })
        .min(1, 'النص البديل مطلوب'),

      image: z.any().refine((val) => val, 'الصورة مطلوبة')
    })
  );

  return { schema };
};
