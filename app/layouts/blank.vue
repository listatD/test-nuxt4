<script setup lang="ts"></script>

<template>
  <div class="flex min-h-full flex-col">
    <div class="relative z-20 flex min-h-[60px] items-center bg-auth-chrome px-6 py-1">
      <div class="flex items-center"></div>
    </div>
    <main class="flex flex-1 flex-col">
      <slot />
    </main>
    <div class="flex min-h-[270px] items-center bg-auth-chrome px-6 py-1">
      <div class="flex items-center"></div>
    </div>
  </div>
</template>
