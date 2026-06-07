<script setup>
const { global } = useAppConfig()
</script>

<template>
  <section
    class="-mx-4 sm:-mx-12 lg:-mx-16 border-t border-default bg-elevated/30 px-4 sm:px-12 lg:px-16 py-20 sm:py-28"
    aria-labelledby="closing-cta-heading"
  >
    <div class="max-w-(--ui-container) mx-auto flex flex-col items-center text-center gap-5">
      <h2
        id="closing-cta-heading"
        class="font-display text-3xl sm:text-4xl font-bold text-highlighted text-balance leading-tight animate-fade-in"
      >
        هل لديك مشروع تريد تنفيذه؟
      </h2>
      <p class="text-muted text-base max-w-sm leading-relaxed text-pretty animate-fade-in animation-delay-100">
        أرسل لي تفاصيل فكرتك أو احجز استشارة مجانية — أرد في خلال 24 ساعة.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 mt-2 animate-fade-in animation-delay-200">
        <UButton
          :to="global.meetingLink"
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          color="primary"
          trailing-icon="i-lucide-calendar"
        >
          احجز استشارة
        </UButton>
        <UButton
          to="/contact"
          size="lg"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-arrow-left"
        >
          تواصل معي
        </UButton>
      </div>
    </div>
  </section>
</template>
