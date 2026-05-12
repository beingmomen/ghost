<script setup>
definePageMeta({
  title: 'الصفحة الرئيسية'
});

const { user } = useGlobal();
</script>

<template>
  <div>
    <BaseCard title="لوحة القيادة" icon="i-lucide-layout-dashboard">
      <div class="text-center py-8">
        <h1 class="text-2xl font-bold">
          مرحباً {{ user.name }}
        </h1>
        <p class="text-dimmed mt-2">
          مرحباً بك في لوحة التحكم
        </p>
      </div>
    </BaseCard>
  </div>
</template>
