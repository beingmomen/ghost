<script setup>
const { footer, global } = useAppConfig()

const quickLinks = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المشاريع', to: '/projects' },
  { label: 'المدونة', to: '/blog' },
  { label: 'نبذة عني', to: '/about' },
  { label: 'تواصل معي', to: '/contact' },
  { label: 'قم بتقييمنا', to: '/testimonial' }
]

const guides = [
  { label: 'SDLC Framework', to: '/sdlc' },
  { label: 'دورة حياة تطوير البرمجيات', to: '/sdlc-ar' }
]

const aiTools = [
  { label: 'MCP Servers', to: '/mcp', icon: 'i-lucide-server' },
  { label: 'Agents', to: '/agents', icon: 'i-lucide-bot' },
  { label: 'Skills', to: '/skills', icon: 'i-lucide-zap' },
  { label: 'Commands', to: '/commands', icon: 'i-lucide-terminal' }
]
</script>

<template>
  <footer class="z-10 mt-16">
    <!-- CTA Banner -->
    <div class="-mx-4 sm:-mx-12 lg:-mx-16 px-4 sm:px-12 lg:px-16">
      <div class="max-w-(--ui-container) mx-auto">
        <div class="rounded-2xl border border-default/60 bg-muted/40 backdrop-blur-sm p-8 sm:p-12 text-center shadow-lg shadow-neutral-950/5">
          <span class="animate-fade-in">
            <h2 class="text-2xl sm:text-3xl font-bold mb-3">
              هل لديك مشروع؟
              <span class="text-gradient">لنعمل معاً</span>
            </h2>
          </span>

          <span class="animate-fade-in animation-delay-300">
            <p class="text-base text-muted mb-6 max-w-lg mx-auto">
              أنا متاح لمشاريع جديدة ومستعد لتحويل أفكارك إلى واقع رقمي مميز
            </p>
          </span>

          <span class="animate-fade-in animation-delay-500">
            <div class="flex items-center justify-center gap-3">
              <UButton
                label="تواصل معي"
                to="/contact"
                color="primary"
                size="md"
              />
              <UButton
                label="احجز اجتماع"
                :to="global.meetingLink"
                target="_blank"
                color="neutral"
                variant="outline"
                size="md"
                icon="i-lucide-calendar"
              />
            </div>
          </span>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 border-t border-default px-4 sm:px-12 lg:px-16 mt-10">
      <div class="max-w-(--ui-container) mx-auto py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- Column 1: Brand -->
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-bold text-gradient inline-block">
                {{ global.fullName }}
              </h3>
              <p class="text-base text-muted mt-1">
                {{ global.title }}
              </p>
            </div>
            <p class="text-base text-muted leading-relaxed">
              أبني تطبيقات ويب حديثة وعالية الأداء مع التركيز على تجربة المستخدم.
            </p>
            <a
              :href="`mailto:${global.email}`"
              class="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors duration-200"
            >
              <UIcon
                name="i-lucide-mail"
                class="size-4 text-primary/60 shrink-0"
              />
              {{ global.email }}
            </a>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 class="text-base font-semibold mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-link"
                class="size-4 text-primary/60"
              />
              روابط سريعة
            </h4>
            <ul class="space-y-2.5">
              <li
                v-for="link in quickLinks"
                :key="link.to"
              >
                <NuxtLink
                  :to="link.to"
                  class="text-base text-muted hover:text-primary transition-all duration-200 inline-block"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 3: AI Tools -->
          <div>
            <h4 class="text-base font-semibold mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-sparkles"
                class="size-4 text-primary/60"
              />
              أدوات AI
            </h4>
            <ul class="space-y-2.5">
              <li
                v-for="tool in aiTools"
                :key="tool.to"
              >
                <NuxtLink
                  :to="tool.to"
                  class="text-base text-muted hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <UIcon
                    :name="tool.icon"
                    class="size-3.5 text-primary/60 shrink-0 group-hover:scale-110 transition-transform duration-200"
                  />
                  {{ tool.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 4: Guides -->
          <div>
            <h4 class="text-base font-semibold mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-book-open"
                class="size-4 text-primary/60"
              />
              أدلة تقنية
            </h4>
            <ul class="space-y-2.5">
              <li
                v-for="guide in guides"
                :key="guide.to"
              >
                <NuxtLink
                  :to="guide.to"
                  class="text-base text-muted hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <UIcon
                    name="i-lucide-file-text"
                    class="size-3.5 text-primary/60 shrink-0"
                  />
                  {{ guide.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <USeparator class="mt-10 mb-6" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-muted">
            {{ footer.credits }}
          </p>

          <div class="flex items-center gap-1">
            <CommonSocialPartLink
              v-for="link in global.socialLinks"
              :key="link.to"
              v-bind="link"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
