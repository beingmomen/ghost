<script setup>
defineProps({
  light: { type: String, required: true },
  dark: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  // Below this width (px) the frame scrolls horizontally instead of shrinking the text.
  minWidth: { type: Number, default: 0 },
  // Cap for narrow-but-tall diagrams so they render at their natural size.
  maxWidth: { type: Number, default: 0 },
  caption: { type: String, default: '' }
})
</script>

<template>
  <figure class="animate-fade-in">
    <!-- ltr so a horizontally scrolling frame starts at the diagram's left edge -->
    <div
      dir="ltr"
      class="rounded-xl border border-default/60 bg-elevated/30 p-3 sm:p-5 overflow-x-auto"
    >
      <div
        class="mx-auto"
        :style="{
          minWidth: minWidth ? `${minWidth}px` : undefined,
          maxWidth: maxWidth ? `${maxWidth}px` : undefined
        }"
      >
        <img
          :src="light"
          :alt="alt"
          :width="width"
          :height="height"
          loading="lazy"
          decoding="async"
          class="block w-full h-auto dark:hidden"
        >
        <img
          :src="dark"
          :alt="alt"
          :width="width"
          :height="height"
          loading="lazy"
          decoding="async"
          class="hidden w-full h-auto dark:block"
        >
      </div>
    </div>

    <figcaption class="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted text-right">
      <span v-if="caption">{{ caption }}</span>
      <a
        :href="light"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-1 underline underline-offset-4 hover:text-highlighted transition-colors dark:hidden"
      >
        افتح الرسمة بحجم كامل
        <UIcon
          name="i-lucide-external-link"
          class="size-3.5"
        />
      </a>
      <a
        :href="dark"
        target="_blank"
        rel="noopener"
        class="hidden items-center gap-1 underline underline-offset-4 hover:text-highlighted transition-colors dark:inline-flex"
      >
        افتح الرسمة بحجم كامل
        <UIcon
          name="i-lucide-external-link"
          class="size-3.5"
        />
      </a>
    </figcaption>
  </figure>
</template>
