<script setup lang="ts">
</script>

<template>
  <div class="min-h-full flex">
    <main class="flex-1 min-w-0">
      <div class="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 class="text-lg font-semibold tracking-tight">
          Главная
        </h1>
        <div class="flex items-center gap-3">
          
        </div>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
