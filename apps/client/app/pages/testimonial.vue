<script setup>
import { z } from 'zod'

const config = useRuntimeConfig()
const { global } = useAppConfig()
const { loading, post } = useApiRequest()
const { data: landingData } = await useAPI('/landing', {
  key: 'landing',
  default: () => ({}),
  transform: response => response.data || {}
})

const submitted = ref(false)
const form = ref(null)

const testimonials = computed(() => {
  const items = landingData.value?.testimonials || []
  return items.map(item => ({
    quote: item.description,
    author: {
      name: item.name,
      description: item.email,
      avatar: {
        src: item.image?.trim() ? (item.image.startsWith('http') ? item.image : `${config.public.cloudinary.cloudinaryUrl}${item.image}`) : undefined,
        alt: item.name
      }
    }
  }))
})

useSeoMeta({
  title: 'آراء العملاء | عبدالمؤمن الشطوري',
  description: 'شارك تقييمك واطلع على تجارب العملاء السابقين مع عبدالمؤمن الشطوري. رأيك يساعدنا على التطور والنمو.',
  ogTitle: 'آراء العملاء | عبدالمؤمن الشطوري',
  ogDescription: 'شارك تقييمك واطلع على تجارب العملاء السابقين مع عبدالمؤمن الشطوري. رأيك يساعدنا على التطور والنمو.',
  ogUrl: `${config.public.siteUrl}/testimonial`,
  ogType: 'website',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'آراء العملاء | عبدالمؤمن الشطوري',
  twitterDescription: 'شارك تقييمك واطلع على آراء العملاء السابقين. رأيك يساعدنا على التطور.',
  twitterSite: '@beingmomen',
  keywords: 'آراء العملاء, تقييمات, عبدالمؤمن الشطوري, تجارب العملاء'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'آراء العملاء',
        'description': 'صفحة تقييمات عملاء عبدالمؤمن الشطوري.',
        'url': `${config.public.siteUrl}/testimonial`
      })
    }
  ]
})

useBreadcrumbSchema([{ name: 'آراء العملاء', path: '/testimonial' }])

const schema = z.object({
  name: z.string({ error: 'الاسم مطلوب' }).min(1, 'الاسم مطلوب'),
  email: z.string({ error: 'البريد الإلكتروني مطلوب' }).email('يرجى إدخال عنوان بريد إلكتروني صالح'),
  description: z.string({ error: 'رسالتك مطلوبة' }).min(1, 'رسالتك مطلوبة'),
  image: z.string({ error: 'الصورة مطلوبة' }).min(1, 'الصورة مطلوبة')
})

const state = reactive({
  name: '',
  email: '',
  description: '',
  image: ''
})

watch(
  () => state.image,
  () => {
    form.value?.clear()
  }
)

async function onSubmit(event) {
  const { status } = await post('/testimonials', event.data)

  if (status === 'success') {
    submitted.value = true
  }
}

function resetForm() {
  state.name = ''
  state.email = ''
  state.description = ''
  state.image = ''
  submitted.value = false
  nextTick(() => form.value?.clear())
}
</script>

<template>
  <UPage>
    <!-- Section 1: Animated Hero -->
    <UPageHero
      :ui="{
        headline: 'flex items-center justify-center',
        title: 'text-center',
        description: 'text-center text-gradient font-bold',
        links: 'mt-4 flex-col justify-center items-center'
      }"
    >
      <template #headline>
        <span class="animate-fade-in">
          <UColorModeAvatar
            class="size-18 ring ring-default ring-offset-3 ring-offset-bg"
            :light="global.picture?.light"
            :dark="global.picture?.dark"
            :alt="global.picture?.alt"
          />
        </span>
      </template>

      <template #title>
        <span class="animate-fade-in animation-delay-200">
          رأيك يصنع الفارق
        </span>
      </template>

      <template #description>
        <span class="animate-fade-in animation-delay-400">
          تجربتك تلهمنا وتقييمك يساعدنا على تقديم الأفضل دائماً
        </span>
      </template>

      <template #links>
        <span class="animate-fade-in animation-delay-600">
          <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-base text-muted">
            <span class="flex items-center gap-2">
              <UIcon
                name="i-lucide-users"
                class="size-5 text-primary"
              />
              عملاء سعداء
            </span>
            <span class="flex items-center gap-2">
              <UIcon
                name="i-lucide-star"
                class="size-5 text-primary"
              />
              تقييم ممتاز
            </span>
            <span class="flex items-center gap-2">
              <UIcon
                name="i-lucide-shield-check"
                class="size-5 text-primary"
              />
              موثوق ومعتمد
            </span>
          </div>
        </span>
      </template>
    </UPageHero>

    <!-- Section 2: Testimonials Carousel -->
    <UPageSection
      v-if="testimonials.length"
      title="ماذا قال عملاؤنا"
      description="تجارب حقيقية من عملاء وثقوا بنا وشاركونا آراءهم"
      :ui="{
        container: 'px-0 !pt-0',
        title: 'text-xl sm:text-xl lg:text-2xl font-medium',
        description: 'mt-2 text-base text-muted leading-relaxed'
      }"
    >
      <div class="animate-fade-in animation-delay-200">
        <UCarousel
          v-slot="{ item }"
          :items="testimonials"
          :autoplay="{ delay: 4000 }"
          loop
          dots
          :ui="{
            viewport: '-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 max-w-(--ui-container)'
          }"
        >
          <UPageCTA
            :description="item.quote"
            variant="naked"
            class="rounded-none"
            :ui="{
              container: 'sm:py-12 lg:py-12 sm:gap-8',
              description: '!text-base text-balance before:content-[open-quote] before:text-5xl lg:before:text-7xl before:inline-block before:text-dimmed before:absolute before:-mr-6 lg:before:-mr-10 before:-mt-2 lg:before:-mt-4 after:content-[close-quote] after:text-5xl lg:after:text-7xl after:inline-block after:text-dimmed after:absolute after:mt-1 lg:after:mt-0 after:mr-1 lg:after:mr-2'
            }"
          >
            <UUser
              v-bind="item.author"
              size="xl"
              class="justify-center"
            />
          </UPageCTA>
        </UCarousel>
      </div>
    </UPageSection>

    <!-- Section 3: Form / Success -->
    <UPageSection :ui="{ container: '!pt-0' }">
      <!-- Success State -->
      <div
        v-if="submitted"
        class="animate-fade-in"
      >
        <div class="mx-auto w-full md:w-2/3 lg:w-1/2 bg-elevated/50 rounded-xl p-8 sm:p-12 text-center space-y-6">
          <UIcon
            name="i-lucide-circle-check"
            class="size-16 text-success mx-auto"
          />
          <h2 class="text-2xl sm:text-3xl font-bold text-highlighted">
            تم الإرسال بنجاح!
          </h2>
          <p class="text-muted text-base">
            شكراً لثقتك ولمشاركتنا تجربتك. تقييمك يساعدنا على التطور والنمو.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <UButton
              label="إرسال تقييم آخر"
              icon="i-lucide-refresh-cw"
              color="primary"
              @click="resetForm"
            />
            <UButton
              label="العودة للرئيسية"
              icon="i-lucide-home"
              color="neutral"
              variant="outline"
              to="/"
            />
          </div>
        </div>
      </div>

      <!-- Form -->
      <div
        v-else
        class="animate-fade-in animation-delay-200"
      >
        <div class="mx-auto w-full md:w-3/4 lg:w-2/3 bg-elevated/50 rounded-xl p-6 sm:p-8 lg:p-10">
          <p class="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            أضف تقييمك
          </p>
          <h2 class="text-xl sm:text-2xl font-bold text-highlighted mb-6">
            شاركنا تجربتك
          </h2>

          <UForm
            ref="form"
            :schema="schema"
            :state="state"
            class="space-y-5"
            @submit="onSubmit"
          >
            <div class="animate-fade-in animation-delay-300">
              <UFormField
                label="الاسم الكريم"
                name="name"
                size="lg"
                required
              >
                <UInput
                  v-model="state.name"
                  icon="i-lucide-user"
                  placeholder="اسمك الكريم"
                  class="w-full"
                  :disabled="loading"
                />
              </UFormField>
            </div>

            <div class="animate-fade-in animation-delay-400">
              <UFormField
                label="البريد الإلكتروني"
                name="email"
                size="lg"
                required
              >
                <UInput
                  v-model="state.email"
                  icon="i-lucide-mail"
                  placeholder="بريدك الإلكتروني"
                  class="w-full"
                  :disabled="loading"
                />
              </UFormField>
            </div>

            <div class="animate-fade-in animation-delay-500">
              <UFormField
                label="رأيك وتجربتك"
                name="description"
                size="lg"
                required
                hint="كلما زادت التفاصيل كان أفضل"
              >
                <UTextarea
                  v-model="state.description"
                  placeholder="أخبرنا عن تجربتك معنا... ما الذي أعجبك وما الذي يمكن تحسينه؟"
                  class="w-full"
                  :rows="6"
                  :disabled="loading"
                />
              </UFormField>
            </div>

            <div class="animate-fade-in animation-delay-600">
              <FormFileInput
                v-model="state.image"
                label="الصورة الشخصية"
                name="image"
                hint="صورتك تضيف مصداقية لتقييمك"
                folder="testimonial"
              />
            </div>

            <div
              class="animate-fade-in"
              style="animation-delay: 0.7s"
            >
              <UButton
                type="submit"
                block
                icon="i-lucide-send"
                class="font-black text-xl cursor-pointer"
                :loading="loading"
              >
                إرسال التقييم
              </UButton>
            </div>
          </UForm>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
