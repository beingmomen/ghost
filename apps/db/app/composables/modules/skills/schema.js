import * as z from 'zod';

export const useSkillSchema = () => {
  const schema = computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(1, 'العنوان مطلوب'),
      icon: z
        .string({ message: 'الأيقونة مطلوبة' })
        .min(1, 'الأيقونة مطلوبة')
        .regex(/^i(-[a-z0-9]+)+$/, 'يجب أن تتبع الأيقونة الصيغة "i-lucide-plus" (تبدأ بـ "i-" متبوعة بكلمات أو أرقام صغيرة مفصولة بشرطات)')
    })
  );

  return { schema };
};
