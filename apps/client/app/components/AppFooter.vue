<script setup>
// Footer link columns share their single source of truth with the header
// navigation (`app/utils/links.ts`), auto-imported as `footerGroups`.
const { footer, global } = useAppConfig()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="z-10 mt-16">
    <!-- CTA Banner — appears on every page. Do not add a separate closing CTA to individual pages. -->
    <div class="-mx-4 sm:-mx-12 lg:-mx-16 px-4 sm:px-12 lg:px-16">
      <div class="max-w-(--ui-container) mx-auto">
        <div
          class="rounded-2xl border border-default/60 bg-muted/40 p-8 sm:p-12 text-center"
        >
          <h2
            class="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-semibold leading-1.3 mb-3"
          >
            عندك مشروع أو فرصة؟
          </h2>

          <p class="text-base text-muted mb-6 max-w-lg mx-auto">
            متاح للفرص والمشاريع، عن بُعد — ويسعدني نتكلم.
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <UButton
              label="تواصل معي"
              to="/contact"
              color="primary"
              size="md"
              class="w-full sm:w-auto"
            />
            <UButton
              label="احجز اجتماع"
              :to="global.meetingLink"
              target="_blank"
              color="neutral"
              variant="outline"
              size="md"
              icon="i-lucide-calendar"
              class="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div
      class="-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 border-t border-default px-4 sm:px-12 lg:px-16 mt-10"
    >
      <div class="max-w-(--ui-container) mx-auto py-12 lg:py-16">
        <!-- Brand spans two columns on desktop so the 4-col grid has no dead cell;
             the wider brand block also gives the identity anchor premium breathing room. -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- Column 1: Brand (spans 2 cols on desktop) -->
          <div class="space-y-4 lg:col-span-2">
            <div>
              <p class="font-display text-lg font-bold text-amber">
                {{ global.fullName }}
              </p>
              <p class="text-base text-muted mt-1">
                {{ global.title }}
              </p>
            </div>
            <!-- leading-relaxed (1.625) violates the Arabic Baseline Rule (1.8 min);
                 let text-base's baked line-height apply instead. -->
            <p class="text-base text-muted">
              واجهات أنظف، تجارب أسرع — بُنيَت بإتقان.
            </p>
            <a
              :href="`mailto:${global.email}`"
              class="inline-flex items-center gap-2 text-sm text-muted hover:text-amber transition-colors duration-200 ease-out"
            >
              <!-- No explicit text color on the icon — it inherits the parent <a>
                   (muted at rest, amber on hover) so the icon tracks the link state. -->
              <UIcon
                name="i-lucide-mail"
                class="size-4 shrink-0"
                aria-hidden="true"
              />
              {{ global.email }}
            </a>
          </div>

          <!-- Columns 3-4: Link groups (derived from app/utils/links.ts) -->
          <div
            v-for="group in footerGroups"
            :key="group.title"
          >
            <h4 class="text-base font-semibold mb-4">
              {{ group.title }}
            </h4>
            <ul class="space-y-2.5">
              <li
                v-for="link in group.links"
                :key="link.to"
              >
                <NuxtLink
                  :to="link.to"
                  class="text-base text-muted hover:text-amber transition-colors duration-200 ease-out"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <USeparator class="mt-12 mb-8" />

        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p class="text-sm text-muted">
            {{ footer.credits }}
          </p>

          <!-- gap-2 (8px) gives 44px touch targets proper breathing room;
               ms-2 is the logical inline-start margin (right in RTL), so the
               scroll-to-top button is separated from the social links on the correct side. -->
          <div class="flex items-center gap-2">
            <CommonSocialPartLink
              v-for="link in global.socialLinks"
              :key="link.to"
              v-bind="link"
            />
            <UButton
              icon="i-lucide-arrow-up"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="العودة إلى الأعلى"
              class="ms-2"
              @click="scrollToTop"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
