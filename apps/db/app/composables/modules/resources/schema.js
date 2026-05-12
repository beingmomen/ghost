import * as z from 'zod';

export const useResourceSchema = () => {
  const schema = computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(1, 'العنوان مطلوب'),
      url: z.string({ message: 'الرابط مطلوب' }).url('الرابط غير صالح')
    })
  );

  return { schema };
};
