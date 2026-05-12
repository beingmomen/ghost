import * as z from 'zod';

export const useFaqSchema = () => {
  const schema = computed(() =>
    z.object({
      category: z.string({ message: 'التصنيف مطلوب' }).min(1, 'التصنيف مطلوب'),
      question: z.string({ message: 'السؤال مطلوب' }).min(5, 'السؤال قصير جداً'),
      answer: z.string({ message: 'الإجابة مطلوبة' }).min(5, 'الإجابة قصيرة جداً'),
      order: z.number({ message: 'الترتيب يجب أن يكون رقم' }).int().min(0).optional()
    })
  );

  return { schema };
};
