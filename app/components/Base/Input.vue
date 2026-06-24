<script setup lang="ts">
import type { BaseInputProps } from '@/utils/types'

const {
  type = 'text',
  size = defSize.md.val,
  label,
  placeholder,
  error,
  disabled,
  name,
  autocomplete
} = defineProps<Omit<BaseInputProps, 'modelValue'>>()

const model = defineModel<BaseInputProps['modelValue']>({ default: '' })

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
      <span v-if="$slots.before" class="flex items-center">
        <slot name="before" />
      </span>
      <input
        v-model="model"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        class="h-full w-full rounded-md bg-transparent px-4 py-1 outline-none"
      />
      <span v-if="$slots.after" class="flex items-center">
        <slot name="after" />
      </span>
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
