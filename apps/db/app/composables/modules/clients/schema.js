import * as z from 'zod';

export const useClientSchema = () => {
  const schema = computed(() =>
    z.object({
      name: z.string({ message: 'الاسم مطلوب' }).min(1, 'الاسم مطلوب'),
      website: z.string().url({ message: 'يجب أن يكون رابطاً صحيحاً' }).optional(),
      altText: z
        .string({ message: 'النص البديل مطلوب' })
        .min(1, 'النص البديل مطلوب'),
      image: z.any().refine((val) => val, 'الصورة مطلوبة')
    })
  );

  return { schema };
};
