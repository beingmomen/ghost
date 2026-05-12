import * as z from 'zod';

export const useServiceSchema = () => {
  const schema = computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(1, 'العنوان مطلوب'),
      description: z.string({ message: 'الوصف مطلوب' }).min(1, 'الوصف مطلوب'),
      altText: z
        .string({ message: 'النص البديل مطلوب' })
        .min(1, 'النص البديل مطلوب'),
      image: z.any().refine((val) => val, 'الصورة مطلوبة')
    })
  );

  return { schema };
};
