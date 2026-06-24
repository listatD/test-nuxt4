<script setup lang="ts">
definePageMeta({
  layout: false,
  public: true,
  error: true
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col items-center justify-center p-6">
    <h1 class="text-[40px] font-bold">{{ $t(defAuthPage.error500.title) }}</h1>
  </div>
</template>
