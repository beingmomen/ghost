import * as z from 'zod';

export const useCareerProfileSchema = () => {
  const schema = computed(() =>
    z.object({
      targetRoles: z.array(z.string()).optional(),
      targetSeniority: z.array(z.string()).optional(),
      defaultStacks: z.array(z.string()).optional(),
      optionalStacks: z.array(z.string()).optional(),
      locationPreferences: z.array(z.string()).optional(),
      workplacePreferences: z.array(z.string()).optional(),
      requiredKeywords: z.array(z.string()).optional(),
      excludedKeywords: z.array(z.string()).optional(),
      maxJobAgeDays: z.number().optional()
    })
  );

  return { schema };
};
