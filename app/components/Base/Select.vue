<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
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
  name,
  class: className
} = defineProps<Omit<BaseSelectProps, 'modelValue'>>()

const model = defineModel<BaseSelectProps['modelValue']>({ default: '' })
const isOpen = ref(false)
const target = ref<HTMLElement | null>(null)

onClickOutside(target, () => {
  isOpen.value = false
})

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

const selectedOption = computed(() => options.find(option => option.value === model.value))
const selectedLabel = computed(() => selectedOption.value?.label || placeholder || '')

const toggleSelect = () => {
  if (disabled) return

  isOpen.value = !isOpen.value
}

const closeSelect = () => {
  isOpen.value = false
}

const selectOption = (value: BaseSelectProps['modelValue']) => {
  model.value = value
  closeSelect()
}
</script>

<template>
  <div
    ref="target"
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
      class="relative flex rounded-md border transition-all duration-300 focus-within:ring-2"
      :class="[
        sizeHeightClass,
        error
          ? 'border-red-500/50 bg-red-50/10 ring-1 ring-red-500/50'
          : 'border-gray-200/100 bg-gray-200/10 focus-within:border-transparent focus-within:ring-brand-primary'
      ]"
    >
      <button
        type="button"
        :disabled="disabled"
        v-bind="$attrs"
        class="flex h-full w-full items-center justify-between rounded-md bg-transparent px-4 py-1 pe-10 text-start outline-none"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        @click="toggleSelect"
        @keydown.esc.prevent="closeSelect"
      >
        <span
          :class="[
            'overflow-hidden text-ellipsis whitespace-nowrap',
            { 'text-slate-400': !selectedOption }
          ]"
          >{{ selectedLabel }}</span
        >
      </button>
      <input v-if="name" type="hidden" :name="name" :value="model ?? ''" />
      <Icon
        name="heroicons:chevron-down-20-solid"
        class="pointer-events-none absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          :class="
            twMerge(
              'absolute start-0 top-full z-50 mt-2 max-h-60 w-full origin-top-left overflow-auto rounded-md bg-white p-1 shadow-md ring-1 ring-black/5 focus:outline-none'
            )
          "
          role="listbox"
        >
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="flex w-full items-center rounded-md px-3 py-2 text-start text-sm transition-colors"
            :class="
              option.value === model
                ? 'bg-brand-primary text-white hover:brightness-110'
                : 'text-gray-200/900 hover:bg-gray-200/50'
            "
            role="option"
            :aria-selected="option.value === model"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </transition>
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
