<script setup lang="ts">
definePageMeta({
  layout: false,
  public: true,
  error: true
})

const localePath = useLocalePath()

const onBack = () => {
  navigateTo(localePath('/'))
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col items-center justify-center p-6">
    <h1 class="mb-6 text-[40px] font-bold">{{ $t(defAuthPage.error404.title) }}</h1>
    <BaseButton block class="max-w-[230px]" @click="onBack">
      {{ $t('btn.goBack') }}
    </BaseButton>
  </div>
</template>
