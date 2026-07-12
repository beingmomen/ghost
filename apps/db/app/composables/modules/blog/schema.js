import * as z from 'zod';

export const useBlogSchema = (isEditing) => {
  const baseSchema = {
    title: z
      .string({ message: 'عنوان المقال مطلوب' })
      .min(1, 'عنوان المقال مطلوب'),
    description: z
      .string({ message: 'وصف المقال مطلوب' })
      .min(60, 'وصف المقال يجب أن يكون 60 حرفًا على الأقل')
      .max(160, 'وصف المقال يجب ألا يتجاوز 160 حرف'),
    content: z.any().optional(),
    altText: z.string().optional(),
    tags: z
      .array(z.string({ message: 'الوسوم مطلوبة' }), {
        message: 'الوسوم مطلوبة'
      })
      .min(3, 'يجب إدخال 3 وسوم على الأقل'),
    keywords: z
      .string({ message: 'الكلمات المفتاحية مطلوبة' })
      .min(1, 'الكلمات المفتاحية مطلوبة'),
    isArabicArticle: z.boolean().default(true),
    resources: z
      .array(
        z.object({
          url: z
            .string({ message: 'رابط المورد مطلوب' })
            .min(1, 'رابط المورد مطلوب')
            .url('رابط غير صالح'),
          title: z
            .string({ message: 'عنوان المورد مطلوب' })
            .min(1, 'عنوان المورد مطلوب')
        }),
        { message: 'يجب إدخال مورد واحد على الأقل' }
      )
      .min(1, 'يجب إدخال مورد واحد على الأقل'),
    image: z.any().refine((val) => val, 'الصورة مطلوبة')
  };

  const schema = computed(() => {
    if (isEditing?.value) {
      return z.object({
        ...baseSchema,
        status: z.enum(['draft', 'published', 'archived'], {
          message: 'الحالة مطلوبة'
        })
      });
    }
    return z.object(baseSchema);
  });

  return { schema };
};
