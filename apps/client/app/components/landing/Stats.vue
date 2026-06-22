<script setup>
// Credibility line — the four real figures woven into one first-person sentence,
// replacing the banned hero-metric grid (DESIGN.md: "evidence comes from content,
// not metric widgets"). Numbers carry emphasis through size + weight (Rubik display),
// never amber, so the Honey Signal Rule's amber budget stays untouched.
const figures = {
  years: '+5',
  projects: '+10',
  companies: '3',
  clients: '+50'
}
</script>

<template>
  <UPageSection
    :ui="{
      container: 'px-0 !pt-0 !pb-0'
    }"
  >
    <div
      class="-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 border-y border-default py-12 sm:py-16 lg:py-20 px-4 sm:px-12 lg:px-16"
    >
      <p
        class="credibility mx-auto max-w-3xl text-center text-balance text-default text-xl sm:text-2xl lg:text-3xl leading-relaxed"
      >
        على مدى
        <span
          class="num text-highlighted animate-fade-in animation-delay-100"
          dir="ltr"
        >{{ figures.years }}</span>
        سنوات، سلّمتُ
        <span
          class="num text-highlighted animate-fade-in animation-delay-200"
          dir="ltr"
        >{{ figures.projects }}</span>
        مشاريع لـ
        <span
          class="num text-highlighted animate-fade-in animation-delay-300"
          dir="ltr"
        >{{ figures.companies }}</span>
        شركات، ووثق بنتائجها
        <span
          class="num text-highlighted animate-fade-in animation-delay-400"
          dir="ltr"
        >{{ figures.clients }}</span>
        عميلاً.
      </p>
    </div>
  </UPageSection>
</template>

<style scoped>
.num {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.4em;
  line-height: 1;
  /* nudge the larger glyphs back onto the sentence baseline */
  vertical-align: -0.08em;
  margin-inline: 0.08em;
}
</style>
