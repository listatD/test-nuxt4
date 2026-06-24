<!-- error.vue -->
<script setup lang="ts">
definePageMeta({
  layout: defLayoutPage.blank.name,
  public: true,
  error: true
})
</script>

<template>
  <div>
    <h1>{{ $t(defAuthPage.error500.title) }}</h1>
  </div>
</template>
