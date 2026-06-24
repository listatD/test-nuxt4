<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const localePath = useLocalePath()

await callOnce(async () => {
  if (props.error?.status === defHttpStatus.s404) {
    await navigateTo(localePath(defAuthPage.error404.path), { replace: true })
  } else {
    await navigateTo(localePath(defAuthPage.error500.path), { replace: true })
  }
})
</script>

<template>
  <NuxtLayout>
    <div />
  </NuxtLayout>
</template>
