<script setup lang="ts">
definePageMeta({
  layout: false,
  public: true,
  showPublicLoginButton: true
})

const mainStore = useMainStore()

const layoutName = computed(() => {
  return mainStore.accessToken ? defLayoutPage.default.name : defLayoutPage.blank.name
})
</script>

<template>
  <NuxtLayout :name="layoutName">
    <div>Контент дашборду {{ mainStore.userInfo }}</div>
    <div>Контент accessToken {{ mainStore.accessToken }}</div>

  </NuxtLayout>
</template>
