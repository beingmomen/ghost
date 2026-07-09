import * as z from 'zod';

export const useHomeFeaturedSchema = () => {
  const schema = computed(() =>
    z.object({
      projects: z.array(z.string()).max(3, 'حد أقصى 3 مشاريع')
    })
  );

  return { schema };
};
