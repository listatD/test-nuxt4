<script setup lang="ts">
import type { BasePaginationProps } from '@/utils/types'

const props = defineProps<Omit<BasePaginationProps, 'modelValue'>>()
const model = defineModel<number>({ default: 1 })

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.perPage)))

const pages = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

const setPage = (page: number) => {
  model.value = Math.min(Math.max(page, 1), totalPages.value)
}
</script>

<template>
  <nav class="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
    <BaseButton
      type="button"
      variant="secondary"
      size="sm"
      icon="heroicons:chevron-left-20-solid"
      :disabled="model <= 1"
      @click="setPage(model - 1)"
    />

    <BaseButton
      v-for="page in pages"
      :key="page"
      type="button"
      size="sm"
      :variant="page === model ? 'primary' : 'secondary'"
      @click="setPage(page)"
    >
      {{ page }}
    </BaseButton>

    <BaseButton
      type="button"
      variant="secondary"
      size="sm"
      icon="heroicons:chevron-right-20-solid"
      :disabled="model >= totalPages"
      @click="setPage(model + 1)"
    />
  </nav>
</template>
