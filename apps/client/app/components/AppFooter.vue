<script setup>
// Footer link columns share their single source of truth with the header
// navigation (`app/utils/links.ts`), auto-imported as `footerGroups`.
const { footer, global } = useAppConfig()
</script>

<template>
  <footer class="z-10 mt-16">
    <!-- CTA Banner -->
    <div class="-mx-4 sm:-mx-12 lg:-mx-16 px-4 sm:px-12 lg:px-16">
      <div class="max-w-(--ui-container) mx-auto">
        <div class="rounded-2xl border border-default/60 bg-muted/40 p-8 sm:p-12 text-center">
          <h2 class="animate-fade-in font-display text-2xl sm:text-3xl font-bold mb-3">
            هل لديك مشروع؟
            <span class="text-amber">لنعمل معاً</span>
          </h2>

          <p class="animate-fade-in animation-delay-300 text-base text-muted mb-6 max-w-lg mx-auto">
            أنا متاح لمشاريع جديدة ومستعد لتحويل أفكارك إلى واقع رقمي مميز
          </p>

          <div class="animate-fade-in animation-delay-500 flex items-center justify-center gap-3">
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
              <h3 class="font-display text-lg font-bold text-amber inline-block">
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

          <!-- Columns 2-4: Link groups (derived from app/utils/links.ts) -->
          <div
            v-for="group in footerGroups"
            :key="group.title"
          >
            <h4 class="text-base font-semibold mb-4 flex items-center gap-2">
              <UIcon
                :name="group.icon"
                class="size-4 text-primary/60"
              />
              {{ group.title }}
            </h4>
            <ul class="space-y-2.5">
              <li
                v-for="link in group.links"
                :key="link.to"
              >
                <NuxtLink
                  :to="link.to"
                  class="text-base text-muted hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <UIcon
                    :name="link.icon"
                    class="size-3.5 text-primary/60 shrink-0 group-hover:scale-110 transition-transform duration-200"
                  />
                  {{ link.label }}
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
