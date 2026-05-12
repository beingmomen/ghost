import * as z from 'zod';

export const useInfoSchema = () => {
  const schema = computed(() =>
    z.object({
      resumeUrl: z.string({ message: 'رابط السيرة الذاتية مطلوب' }).url('رابط السيرة الذاتية غير صالح'),
      bio: z.object({
        paragraphs: z.array(z.string()).optional(),
        quote: z.string().optional()
      }).optional(),
      stats: z.array(
        z.object({
          value: z.string({ message: 'القيمة مطلوبة' }),
          label: z.string({ message: 'العنوان مطلوب' }),
          icon: z.string().optional()
        })
      ).optional(),
      skills: z.array(
        z.object({
          title: z.string({ message: 'عنوان المهارة مطلوب' }),
          icon: z.string().optional(),
          items: z.array(
            z.object({
              name: z.string({ message: 'اسم العنصر مطلوب' }),
              icon: z.string().optional()
            })
          ).optional()
        })
      ).optional(),
      images: z.array(
        z.object({
          src: z.any().refine(
            (v) => (typeof v === 'string' && v.length > 0) || (typeof File !== 'undefined' && v instanceof File),
            { message: 'مسار الصورة مطلوب' }
          ),
          alt: z.string().optional()
        })
      ).optional()
    })
  );

  return { schema };
};
