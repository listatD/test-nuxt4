<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { BaseButtonProps } from '@/utils/types'

const NuxtLinkLocale = resolveComponent('NuxtLinkLocale')
const {
  type = 'button',
  variant = defVariant.primary.val,
  size = defSize.md.val,
  rounded = defSize.md.val,
  loading = false,
  disabled = false,
  block = false,
  icon,
  to,
  href,
  iconClass,
  class: className
} = defineProps<BaseButtonProps>()

const emit = defineEmits<{
  click: [ev: MouseEvent]
}>()

const isDisabled = computed(() => disabled || loading)

const variantClass = computed(() => {
  switch (variant) {
    case defVariant.text.val:
      return 'border-transparent bg-transparent focus:ring-transparent hover:text-brand-primary hover:brightness-110'
    case defVariant.secondary.val:
      return 'border-gray-200/100 bg-gray-200/10 text-gray-200/900 hover:bg-gray-200/15 focus:ring-brand-primary/40'
    case defVariant.ghost.val:
      return 'border-transparent bg-transparent text-gray-200/900 hover:bg-gray-200/10 focus:ring-brand-primary/40'
    case defVariant.danger.val:
      return 'border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15 focus:ring-red-500/35'
    case defVariant.primary.val:
    default:
      return 'border-transparent bg-brand-primary text-white hover:brightness-110 focus:ring-brand-primary/45'
  }
})

const sizeClass = computed(() => {
  switch (size) {
    case defSize.sm.val:
      return 'min-h-8 min-w-8 text-sm'
    case defSize.lg.val:
      return 'min-h-14 min-w-14 text-[21px]'
    case defSize.md.val:
    default:
      return 'min-h-12 min-w-12 text-[17px]'
  }
})

const roundedSizeClass = computed(() => {
  switch (rounded) {
    case defSize.sm.val:
      return 'rounded-sm'
    case defSize.lg.val:
      return 'rounded-lg'
    case defSize.full.val:
      return 'rounded-full'
    case defSize.md.val:
    default:
      return 'rounded-md'
  }
})

const sizeIconClass = computed(() => {
  switch (size) {
    case defSize.sm.val:
      return 'h-5 w-5'
    case defSize.lg.val:
      return 'h-7 w-7'
    case defSize.md.val:
    default:
      return 'h-6 w-6'
  }
})

const onClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<template>
  <component
    :is="to ? NuxtLinkLocale : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :type="!to && !href ? type : undefined"
    :class="
      twMerge(
        'inline-flex items-center justify-center gap-2 border font-semibold outline-none transition-all duration-300 focus:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variantClass,
        sizeClass,
        roundedSizeClass,
        block ? 'w-full' : 'w-auto',
        isDisabled ? 'cursor-not-allowed' : '',
        $slots.default ? 'px-4 py-1' : '',
        className
      )
    "
    :disabled="isDisabled"
    @click="onClick"
  >
    <div v-if="$slots.default" class="inline-flex items-center">
      <div v-if="loading" class="me-1 p-[3px]" :class="[sizeIconClass]">
        <div
          class="h-full w-full animate-spin rounded-full border-2 border-current border-t-transparent opacity-90"
        />
      </div>
      <div v-else-if="icon" class="me-1 inline-flex items-center">
        <Icon :name="icon" :class="twMerge(iconClass ? iconClass : sizeIconClass)" />
      </div>
      <slot />
    </div>
    <Icon v-else-if="icon" :name="icon" :class="twMerge(iconClass ? iconClass : sizeIconClass)" />
  </component>
</template>
