<script setup>
const { open, links } = useSidebar();
const { ready } = useUserSession();
const sessionLoading = computed(() => !ready.value);
</script>

<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #header="{ collapsed }">
      <AppLogo :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        v-for="(group, index) in links"
        :key="index"
        :collapsed="collapsed"
        :items="group"
        :class="{ 'pointer-events-none opacity-50': sessionLoading }"
        orientation="vertical"
        tooltip
        popover
      />
    </template>
  </UDashboardSidebar>
</template>
