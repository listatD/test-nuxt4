<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { BaseInputProps } from '@/utils/types'

defineOptions({
  inheritAttrs: false
})

const {
  type = 'text',
  size = defSize.md.val,
  label,
  placeholder,
  error,
  disabled,
  name,
  autocomplete,
  class: className,
  controlClass,
  inputClass
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
      return 'text-[21px]'
    case defSize.md.val:
    default:
      return 'text-[17px]'
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
    :class="
      twMerge(
        'flex w-full flex-col',
        sizeTextClass,
        disabled ? 'pointer-events-none opacity-60' : '',
        className
      )
    "
  >
    <div v-if="label" class="mb-1 block">
      {{ label }}
    </div>

    <div
      :class="
        twMerge(
          'relative flex rounded-md border transition-all duration-300 focus-within:ring-2',
          sizeHeightClass,
          error
            ? 'border-red-500/50 bg-red-50/10 ring-1 ring-red-500/50'
            : 'border-gray-200/100 bg-gray-200/10 focus-within:border-transparent focus-within:ring-brand-primary',
          controlClass
        )
      "
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
        v-bind="$attrs"
        :class="
          twMerge(
            'h-full w-full rounded-md bg-transparent px-4 py-1 font-normal outline-none',
            inputClass
          )
        "
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
