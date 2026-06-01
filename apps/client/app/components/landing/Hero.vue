<script setup>
const { global } = useAppConfig()
</script>

<template>
  <section
    class="hero relative overflow-hidden -mx-4 sm:-mx-12 lg:-mx-16 px-4 sm:px-12 lg:px-16"
  >
    <!-- Atmosphere layers -->
    <div
      class="hero-mesh"
      aria-hidden="true"
    />
    <div
      class="hero-grid"
      aria-hidden="true"
    />
    <div
      class="hero-grain"
      aria-hidden="true"
    />

    <div
      class="relative max-w-(--ui-container) mx-auto py-20 sm:py-24 lg:py-28"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8">
        <!-- Text column (start / right in RTL) -->
        <div
          class="order-2 lg:order-0 lg:col-span-7 text-center lg:text-right"
        >
          <!-- Availability badge -->
          <div
            v-if="global.available !== undefined"
            class="animate-fade-in inline-flex"
          >
            <UButton
              :color="global.available ? 'success' : 'error'"
              variant="soft"
              size="sm"
              class="gap-2 rounded-full"
              :to="global.available ? global.meetingLink : ''"
              :target="global.available ? '_blank' : undefined"
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
          </div>

          <!-- Name -->
          <h1
            class="hero-name animate-fade-in animation-delay-100 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.15] mt-6"
          >
            <span class="text-gradient">{{ global.fullName }}</span>
          </h1>

          <!-- Title -->
          <p
            class="animate-fade-in animation-delay-200 font-display text-2xl sm:text-3xl text-muted mt-3"
          >
            {{ global.title }}
          </p>

          <!-- Description -->
          <p
            class="animate-fade-in animation-delay-300 text-base sm:text-lg text-muted leading-relaxed mt-6 max-w-xl mx-auto lg:mx-0"
          >
            {{ global.description }}
          </p>

          <!-- CTAs -->
          <div
            v-if="global.links"
            class="animate-fade-in animation-delay-400 flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-8"
          >
            <UButton
              v-bind="global.links[0]"
              size="lg"
            />
            <UButton
              label="احجز اجتماع"
              :to="global.meetingLink"
              target="_blank"
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-calendar"
            />
          </div>

          <!-- Social links -->
          <div
            class="animate-fade-in animation-delay-500 inline-flex gap-x-2 mt-8"
          >
            <CommonSocialPartLink
              v-for="link in global.socialLinks"
              :key="link.to"
              v-bind="link"
            />
          </div>
        </div>

        <!-- Avatar column (end / left in RTL) -->
        <div
          class="order-1 lg:order-0 lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div class="hero-avatar animate-fade-in relative">
            <div
              class="hero-glow"
              aria-hidden="true"
            />
            <!-- Decorative rotated frame -->
            <div
              class="hero-frame absolute inset-0 rounded-4xl border border-primary/30"
              aria-hidden="true"
            />
            <UColorModeAvatar
              class="hero-photo relative size-44 sm:size-52 lg:size-60 rounded-4xl ring-1 ring-default shadow-2xl shadow-primary/20"
              :light="global.picture?.light"
              :dark="global.picture?.dark"
              :alt="global.picture?.alt"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  isolation: isolate;
}

/* Amber gradient mesh */
.hero-mesh {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    radial-gradient(42% 55% at 82% 18%, color-mix(in oklab, var(--color-amber-400) 30%, transparent), transparent 70%),
    radial-gradient(38% 48% at 12% 28%, color-mix(in oklab, var(--color-orange-400) 22%, transparent), transparent 70%),
    radial-gradient(55% 60% at 50% 108%, color-mix(in oklab, var(--color-amber-300) 18%, transparent), transparent 72%);
}

:global(.dark .hero-mesh) {
  background:
    radial-gradient(42% 55% at 82% 18%, color-mix(in oklab, var(--color-amber-500) 22%, transparent), transparent 70%),
    radial-gradient(38% 48% at 12% 28%, color-mix(in oklab, var(--color-orange-600) 18%, transparent), transparent 70%),
    radial-gradient(55% 60% at 50% 108%, color-mix(in oklab, var(--color-amber-600) 14%, transparent), transparent 72%);
}

/* Dot grid */
.hero-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: radial-gradient(
    color-mix(in oklab, var(--color-stone-400) 38%, transparent) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(ellipse 72% 62% at 50% 38%, #000, transparent 76%);
  mask-image: radial-gradient(ellipse 72% 62% at 50% 38%, #000, transparent 76%);
}

:global(.dark .hero-grid) {
  background-image: radial-gradient(
    color-mix(in oklab, var(--color-stone-600) 45%, transparent) 1px,
    transparent 1px
  );
}

/* Film grain */
.hero-grain {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.04;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

:global(.dark .hero-grain) {
  opacity: 0.07;
}

/* Avatar glow */
.hero-avatar {
  isolation: isolate;
}

.hero-glow {
  position: absolute;
  inset: -22%;
  z-index: -1;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--color-amber-400) 55%, transparent),
    transparent 64%
  );
  filter: blur(44px);
  animation: hero-glow-pulse 6s ease-in-out infinite;
}

.hero-frame {
  transform: rotate(6deg) scale(1.06);
  transition: transform 0.5s ease;
}

.hero-avatar:hover .hero-frame {
  transform: rotate(0deg) scale(1.06);
}

.hero-photo {
  transition: transform 0.5s ease;
}

.hero-avatar:hover .hero-photo {
  transform: rotate(-2deg);
}

@keyframes hero-glow-pulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-glow {
    animation: none;
  }
  .hero-frame,
  .hero-photo {
    transition: none;
  }
}
</style>
