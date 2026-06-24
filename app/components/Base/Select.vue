<script setup lang="ts">
import type { BaseSelectProps } from '@/utils/types'

defineOptions({
  inheritAttrs: false
})

const {
  size = defSize.md.val,
  label,
  placeholder,
  options = [],
  error,
  disabled,
  name
} = defineProps<Omit<BaseSelectProps, 'modelValue'>>()

const model = defineModel<BaseSelectProps['modelValue']>({ default: '' })

const sizeHeightClass = computed(() => {
  switch (size) {
    case defSize.sm.val:
      return 'h-8'
    case defSize.lg.val:
      return 'h-14'
    case defSize.md.val:
    default:
      return 'h-12'
  }
})

const sizeTextClass = computed(() => {
  switch (size) {
    case defSize.sm.val:
      return 'text-sm'
    case defSize.lg.val:
      return 'text-lg'
    case defSize.md.val:
    default:
      return 'text-base'
  }
})

const sizeTextErrorClass = computed(() => {
  switch (size) {
    case defSize.sm.val:
      return 'text-sm'
    case defSize.lg.val:
      return 'text-base'
    case defSize.md.val:
    default:
      return 'text-sm'
  }
})
</script>

<template>
  <div
    class="flex w-full flex-col"
    :class="[sizeTextClass, { 'pointer-events-none opacity-60': disabled }]"
  >
    <div v-if="label" class="mb-1 block">
      {{ label }}
    </div>

    <div
      class="relative flex rounded-md border transition-all duration-300 focus-within:ring-2"
      :class="[
        sizeHeightClass,
        error
          ? 'border-red-500/50 bg-red-50/10 ring-1 ring-red-500/50'
          : 'border-gray-200/100 bg-gray-200/10 focus-within:border-transparent focus-within:ring-brand-primary'
      ]"
    >
      <select
        v-model="model"
        :name="name"
        :disabled="disabled"
        v-bind="$attrs"
        class="h-full w-full appearance-none rounded-md bg-transparent px-4 py-1 pe-10 outline-none"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <Icon
        name="heroicons:chevron-down-20-solid"
        class="pointer-events-none absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      />
    </div>

    <transition name="fade">
      <div v-if="error" class="mt-1 text-red-500/90" :class="[sizeTextErrorClass]">
        {{ error }}
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
