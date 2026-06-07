<script setup>
/**
 * Empty/error fallback for landing sections whose data is API-driven.
 * Renders in place of the section when `useAPI` returns an error or no rows,
 * so the user always sees something instead of a silent gap.
 *
 * Tone: same Arabic, same icon family (lucide), same spacing rhythm as the
 * surrounding landing sections. Two states: error (with retry) and empty
 * (helpful nudge to another action).
 */
defineProps({
  state: {
    type: String,
    default: 'error',
    validator: v => ['error', 'empty'].includes(v)
  },
  eyebrow: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  retryLabel: {
    type: String,
    default: 'حاول مرة أخرى'
  },
  altActionLabel: {
    type: String,
    default: ''
  },
  altActionTo: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['retry'])

const defaults = {
  error: {
    icon: 'i-lucide-cloud-off',
    title: 'تعذّر تحميل المحتوى',
    message: 'حدث خطأ مؤقت أثناء جلب البيانات. حاول مرة أخرى بعد لحظات.'
  },
  empty: {
    icon: 'i-lucide-inbox',
    title: 'لا يوجد محتوى حالياً',
    message: 'سيتم إضافة محتوى جديد قريباً. في الأثناء، يمكنك تصفح بقية الموقع.'
  }
}
</script>

<template>
  <section
    :aria-live="state === 'error' ? 'polite' : 'off'"
    class="py-12 sm:py-16"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <LandingSectionHeading
        class="lg:col-span-4"
        :eyebrow="eyebrow"
        :title="title || defaults[state].title"
        :description="message || defaults[state].message"
      />

      <div class="lg:col-span-8">
        <div
          role="status"
          class="rounded-2xl border border-default/60 bg-elevated/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UIcon
              :name="defaults[state].icon"
              class="size-6 text-primary"
            />
          </div>

          <div class="flex-1 text-center sm:text-right">
            <h3 class="font-semibold text-base text-highlighted">
              {{ title || defaults[state].title }}
            </h3>
            <p class="text-base text-muted leading-relaxed mt-1">
              {{ message || defaults[state].message }}
            </p>

            <div
              v-if="state === 'error' || altActionTo"
              class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4"
            >
              <UButton
                v-if="state === 'error'"
                :label="retryLabel"
                icon="i-lucide-refresh-cw"
                color="primary"
                variant="soft"
                size="sm"
                @click="emit('retry')"
              />
              <UButton
                v-if="altActionTo && altActionLabel"
                :label="altActionLabel"
                :to="altActionTo"
                color="neutral"
                variant="ghost"
                size="sm"
                trailing-icon="i-lucide-arrow-left"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
