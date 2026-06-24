<script setup lang="ts">
import type { BaseAlertProps } from '@/utils/types'
import { twMerge } from 'tailwind-merge'

const { type = 'info', show = false, message = '' } = defineProps<BaseAlertProps>()

const styles = {
  success: 'bg-green-50 border-green-200 text-green-700 icon-green-500',
  info: 'bg-blue-50 border-blue-200 text-blue-700 icon-blue-500',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700 icon-yellow-500',
  error: 'bg-red-50 border-red-200 text-red-700 icon-red-500'
}

const icons = {
  success: 'heroicons:check-circle-20-solid',
  info: 'heroicons:information-circle-20-solid',
  warning: 'heroicons:exclamation-triangle-20-solid',
  error: 'heroicons:x-circle-20-solid'
}

const currentStyle = computed(() => styles[type])
const currentIcon = computed(() => icons[type])
</script>

<template>
  <div
    class="grid transition-all duration-300 ease-in-out"
    :class="
      show && (message || $slots.default)
        ? 'mb-4 grid-rows-[1fr] opacity-100 delay-300'
        : 'mb-0 grid-rows-[0fr] opacity-0'
    "
  >
    <div class="overflow-hidden">
      <div :class="twMerge('flex items-start gap-3 rounded-md border p-3 text-sm', currentStyle)">
        <Icon :name="currentIcon" class="h-5 w-5 shrink-0" />
        <div class="flex-1">
          <slot>{{ message }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
