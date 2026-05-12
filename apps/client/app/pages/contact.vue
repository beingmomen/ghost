<script setup>
import { z } from 'zod'

const config = useRuntimeConfig()
const { global } = useAppConfig()
const { loading, post } = useApiRequest()

useSeoMeta({
  title: 'تواصل معنا | عبدالمؤمن الشطوري',
  description: 'تواصل مع عبدالمؤمن الشطوري لمناقشة مشروعك القادم. هنا لمساعدتك في تحويل أفكارك التقنية إلى واقع.',
  ogTitle: 'تواصل معنا | عبدالمؤمن الشطوري',
  ogDescription: 'تواصل مع عبدالمؤمن الشطوري لمناقشة مشروعك القادم. هنا لمساعدتك في تحويل أفكارك التقنية إلى واقع.',
  ogUrl: `${config.public.siteUrl}/contact`,
  ogType: 'website',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'تواصل معنا | عبدالمؤمن الشطوري',
  twitterDescription: 'تواصل مع عبدالمؤمن الشطوري لمناقشة مشروعك القادم وتحويل فكرتك إلى واقع.',
  twitterSite: '@beingmomen',
  keywords: 'تواصل, اتصل بنا, عبدالمؤمن الشطوري, مطور ويب, استشارة برمجية'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': 'تواصل معنا',
        'description': 'تواصل مع عبدالمؤمن الشطوري لمناقشة مشروعك القادم.',
        'url': `${config.public.siteUrl}/contact`
      })
    }
  ]
})

useBreadcrumbSchema([{ name: 'تواصل معنا', path: '/contact' }])

const schema = z.object({
  name: z.string({ error: 'يرجى كتابة اسمك' }).min(1, 'يرجى كتابة اسمك'),
  phone: z.string({ error: 'يرجى إدخال رقم التواصل' }).min(1, 'يرجى إدخال رقم التواصل').regex(/^[\d\s+\-()]{7,20}$/, 'يرجى إدخال رقم هاتف صحيح'),
  email: z.string().email('يرجى إدخال عنوان بريد إلكتروني صالح').optional().or(z.literal('')),
  description: z.string({ error: 'يرجى كتابة رسالتك أو وصف مشروعك' }).min(1, 'يرجى كتابة رسالتك أو وصف مشروعك')
})

const state = reactive({
  name: undefined,
  phone: undefined,
  email: undefined,
  description: undefined
})

const submitted = ref(false)

async function onSubmit(event) {
  const { status } = await post('/contacts', event.data)

  if (status === 'success') {
    state.name = undefined
    state.phone = undefined
    state.email = undefined
    state.description = undefined
    submitted.value = true
  }
}

function resetForm() {
  submitted.value = false
}

function handleCopyEmail() {
  copyToClipboard(global.email, 'تم نسخ البريد الإلكتروني')
}

const contactPills = [
  { icon: 'i-lucide-mail', label: global.email },
  { icon: 'i-lucide-map-pin', label: 'مصر — متاح عن بُعد' }
]
</script>

<template>
  <UPage>
    <!-- Hero Section -->
    <UPageHero
      description="سواء كان لديك مشروع جديد، سؤال تقني، أو فقط تريد التعارف — أنا هنا وأسعد دائماً بالتحدث"
      :ui="{
        title: 'text-center',
        description: 'text-center text-gradient font-bold animate-fade-in animation-delay-300',
        links: 'mt-4 flex-col justify-center items-center'
      }"
    >
      <template #title>
        <span class="animate-fade-in">
          لنبني شيئاً رائعاً معاً
        </span>
      </template>

      <template #links>
        <!-- Availability Badge -->
        <span class="animate-fade-in animation-delay-400">
          <UButton
            :color="global.available ? 'success' : 'error'"
            variant="ghost"
            class="gap-2 cursor-default"
            :label="global.available ? 'متاح للمشاريع الجديدة' : 'غير متاح حالياً'"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available ? 'bg-success' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
        </span>

        <!-- Contact Info Pills -->
        <div class="flex flex-wrap gap-3 justify-center mt-2">
          <div
            v-for="(pill, index) in contactPills"
            :key="index"
            class="animate-fade-in"
            :style="{ animationDelay: `${0.5 + index * 0.1}s` }"
          >
            <div
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 backdrop-blur-sm border border-default/50 shadow-sm"
            >
              <UIcon
                :name="pill.icon"
                class="size-4 text-primary"
              />
              <span class="text-base text-muted font-medium">{{ pill.label }}</span>
            </div>
          </div>
        </div>
      </template>
    </UPageHero>

    <!-- Two-Column Body -->
    <UPageSection
      :ui="{
        container: '!pt-0 flex flex-col gap-8 *:min-w-0'
      }"
    >
      <!-- Form Section -->
      <div>
        <div
          class="rounded-2xl border border-default/60 bg-muted/40 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-neutral-950/5"
        >
          <p class="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            راسلني
          </p>
          <h2 class="text-xl sm:text-2xl font-bold text-highlighted mb-6">
            أرسل رسالتك
          </h2>

          <Transition
            enter-active-class="transition-all duration-500"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            mode="out-in"
          >
            <!-- Success State -->
            <div
              v-if="submitted"
              key="success"
              class="flex flex-col items-center justify-center py-12 gap-4 text-center"
              role="alert"
            >
              <div class="animate-fade-in">
                <div class="size-16 rounded-full bg-success/10 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-check-circle"
                    class="size-8 text-success"
                  />
                </div>
              </div>
              <h3 class="text-xl font-bold text-highlighted">
                تم الإرسال بنجاح!
              </h3>
              <p class="text-muted text-base max-w-xs">
                شكراً لتواصلك، سأرد عليك في أقرب وقت ممكن بإذن الله.
              </p>
              <div class="flex items-center gap-3 mt-2">
                <UButton
                  variant="outline"
                  color="neutral"
                  icon="i-lucide-refresh-cw"
                  label="إرسال رسالة أخرى"
                  @click="resetForm"
                />
                <UButton
                  variant="ghost"
                  color="neutral"
                  to="/"
                  label="العودة للرئيسية"
                  icon="i-lucide-home"
                />
              </div>
            </div>

            <!-- Form -->
            <UForm
              v-else
              key="form"
              :schema="schema"
              :state="state"
              class="space-y-5"
              @submit="onSubmit"
            >
              <div class="animate-fade-in animation-delay-100">
                <UFormField
                  label="الاسم الكريم"
                  name="name"
                  size="lg"
                  required
                >
                  <UInput
                    v-model="state.name"
                    leading-icon="i-lucide-user"
                    placeholder="ما اسمك؟"
                    class="w-full"
                    :disabled="loading"
                  />
                </UFormField>
              </div>

              <div class="animate-fade-in animation-delay-200">
                <UFormField
                  label="رقم الهاتف"
                  name="phone"
                  size="lg"
                  required
                >
                  <UInput
                    v-model="state.phone"
                    leading-icon="i-lucide-phone"
                    placeholder="رقم الهاتف"
                    class="w-full"
                    :disabled="loading"
                  />
                </UFormField>
              </div>

              <div class="animate-fade-in animation-delay-300">
                <UFormField
                  label="البريد الإلكتروني"
                  name="email"
                  size="lg"
                >
                  <UInput
                    v-model="state.email"
                    leading-icon="i-lucide-mail"
                    placeholder="البريد الإلكتروني"
                    type="email"
                    class="w-full"
                    :disabled="loading"
                  />
                </UFormField>
              </div>

              <div class="animate-fade-in animation-delay-400">
                <UFormField
                  label="تفاصيل مشروعك"
                  name="description"
                  size="lg"
                  required
                  hint="كلما زادت التفاصيل كان أفضل"
                >
                  <UTextarea
                    v-model="state.description"
                    placeholder="أخبرني عن مشروعك، أهدافك، والجدول الزمني المتوقع..."
                    class="w-full"
                    :rows="5"
                    :disabled="loading"
                  />
                </UFormField>
              </div>

              <div class="animate-fade-in animation-delay-500">
                <UButton
                  type="submit"
                  block
                  size="xl"
                  :loading="loading"
                  leading-icon="i-lucide-send"
                  class="font-bold cursor-pointer shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
                >
                  إرسال الرسالة
                </UButton>
              </div>
            </UForm>
          </Transition>
        </div>
      </div>

      <!-- Info Panel Section -->
      <div>
        <div class="animate-fade-in animation-delay-200">
          <UCard
            variant="soft"
          >
            <template #header>
              <p class="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                تواصل مباشرة
              </p>
              <h3 class="text-lg font-bold text-highlighted">
                معلومات التواصل
              </h3>
              <p class="text-base text-muted mt-1">
                يمكنك التواصل معي عبر أي من الوسائل التالية
              </p>
            </template>

            <!-- Email Row -->
            <div
              class="flex items-center justify-between gap-3 p-3 rounded-xl bg-default/60 border border-default/40 group"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-lucide-mail"
                    class="size-4 text-primary"
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-muted mb-0.5">
                    البريد الإلكتروني
                  </p>
                  <p class="text-base font-medium text-highlighted truncate">
                    {{ global.email }}
                  </p>
                </div>
              </div>
              <UButton
                icon="i-lucide-copy"
                size="xs"
                color="neutral"
                variant="ghost"
                square
                class="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
                aria-label="نسخ البريد الإلكتروني"
                @click="handleCopyEmail"
              />
            </div>

            <!-- Meeting Link -->
            <UButton
              v-if="global.meetingLink"
              :to="global.meetingLink"
              target="_blank"
              block
              variant="outline"
              color="primary"
              icon="i-lucide-calendar"
              label="احجز موعداً"
              class="mt-4"
            />

            <!-- Availability Status -->
            <div
              class="flex items-center justify-between mt-4 p-3 rounded-xl bg-default/60 border border-default/40"
            >
              <div class="flex items-center gap-2">
                <span class="relative flex size-2">
                  <span
                    class="absolute inline-flex size-full rounded-full opacity-75"
                    :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
                  />
                  <span
                    class="relative inline-flex size-2 scale-90 rounded-full"
                    :class="global.available ? 'bg-success' : 'bg-error'"
                  />
                </span>
                <span
                  class="text-base font-medium"
                  :class="global.available ? 'text-success' : 'text-error'"
                >
                  {{ global.available ? 'متاح للمشاريع' : 'غير متاح حالياً' }}
                </span>
              </div>
              <span class="text-xs text-muted">
                {{ global.available ? 'الرد خلال 24 ساعة' : 'قائمة الانتظار مفتوحة' }}
              </span>
            </div>

            <USeparator class="my-5" />

            <!-- Social Links -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-muted mb-4 text-center">
                تابعني على
              </p>
              <CommonSocialPart />
            </div>

            <template #footer>
              <p class="text-xs text-muted text-center">
                أسعد دائماً بالتحدث معك
              </p>
            </template>
          </UCard>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
