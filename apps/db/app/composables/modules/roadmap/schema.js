import * as z from 'zod';

export const usePhaseSchema = () =>
  computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(2, 'العنوان قصير جداً'),
      description: z.string().max(1000, 'الوصف طويل جداً').optional().nullable(),
      weeksEstimate: z
        .number({ message: 'عدد الأسابيع مطلوب' })
        .int()
        .min(0, 'لا يقل عن 0'),
      milestoneLevel: z
        .enum(['mid', 'mid_advanced', 'senior'])
        .nullable()
        .optional()
    })
  );

export const useWeekSchema = () =>
  computed(() =>
    z.object({
      title: z.string({ message: 'العنوان مطلوب' }).min(1, 'العنوان مطلوب'),
      focus: z.string().max(300, 'النص طويل جداً').optional().nullable()
    })
  );

export const useSettingsSchema = () =>
  computed(() =>
    z.object({
      hoursPerWeek: z
        .number({ message: 'القيمة مطلوبة' })
        .int()
        .min(1, 'لا يقل عن 1'),
      startDate: z.string().optional().nullable(),
      levelOverride: z
        .enum(['junior_mid', 'mid', 'mid_advanced', 'senior'])
        .nullable()
        .optional()
    })
  );
