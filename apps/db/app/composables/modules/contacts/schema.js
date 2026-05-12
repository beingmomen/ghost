import * as z from 'zod';

export const useContactSchema = () => {
  const schema = computed(() =>
    z.object({
      name: z.string({ message: 'الاسم مطلوب' }).min(1, 'الاسم مطلوب'),
      email: z
        .string({ message: 'البريد الإلكتروني مطلوب' })
        .email('البريد غير صالح'),
      phone: z
        .string({ message: 'رقم الهاتف مطلوب' })
        .min(1, 'رقم الهاتف مطلوب')
        .regex(/^\+?[\d\s\-().]{7,20}$/, 'رقم الهاتف غير صالح'),
      description: z.string({ message: 'الوصف مطلوب' }).min(1, 'الوصف مطلوب')
    })
  );

  return { schema };
};
