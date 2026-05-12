import * as z from 'zod';

export const useTestimonialSchema = () => {
  const schema = computed(() =>
    z.object({
      name: z.string({ message: 'الاسم مطلوب' }).min(1, 'الاسم مطلوب'),
      email: z
        .string({ message: 'البريد الإلكتروني مطلوب' })
        .email('البريد غير صالح'),
      description: z.string({ message: 'الوصف مطلوب' }).min(1, 'الوصف مطلوب'),
      image: z.any().refine((val) => val, 'الصورة مطلوبة'),
      isConfirmed: z.boolean().optional()
    })
  );

  return { schema };
};
