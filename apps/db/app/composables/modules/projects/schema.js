import * as z from 'zod';

export const useProjectSchema = () => {
  const schema = computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(1, 'العنوان مطلوب'),
      tag: z.string({ message: 'الوسم مطلوب' }).min(1, 'الوسم مطلوب'),
      description: z.string({ message: 'الوصف مطلوب' }).min(1, 'الوصف مطلوب'),
      url: z.string({ message: 'الرابط مطلوب' }).url('الرابط غير صالح'),
      skillIds: z
        .array(z.string({ message: 'المهارات مطلوبة' }), {
          message: 'يجب اختيار 3 مهارات على الأقل'
        })
        .min(3, 'يجب اختيار 3 مهارات على الأقل'),
      isActive: z.boolean().optional(),
      altText: z
        .string({ message: 'النص البديل مطلوب' })
        .min(1, 'النص البديل مطلوب'),

      image: z.any().refine((val) => val, 'الصورة مطلوبة')
    })
  );

  return { schema };
};
