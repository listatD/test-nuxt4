<script setup lang="ts">
import type { BaseSwitchProps } from '@/utils/types'

const { label, description, error, disabled, name, icon } = defineProps<BaseSwitchProps>()

const model = defineModel<boolean>({ default: false })

const onChange = (event: Event) => {
  model.value = (event.target as HTMLInputElement).checked
}
</script>

<template>
  <label
    class="flex w-full items-start justify-between gap-4"
    :class="{ 'pointer-events-none opacity-60': disabled }"
  >
    <span class="relative inline-flex shrink-0 cursor-pointer">
      <input
        :checked="model"
        :disabled="disabled"
        :name="name"
        type="checkbox"
        class="peer sr-only"
        @change="onChange"
      />

      <span
        class="flex h-7 w-12 rounded-full border transition-all duration-300"
        :class="
          error
            ? 'border-red-500/50 bg-red-50/20'
            : model || icon
              ? 'border-brand-primary bg-brand-primary'
              : 'border-gray-300 bg-gray-200/70'
        "
      />
      <span
        class="pointer-events-none absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300"
        :class="model ? 'translate-x-5' : 'translate-x-0'"
        ><Icon v-if="icon" :name="icon" size="14" class="text-brand-primary"
      /></span>
    </span>
    <span class="flex min-w-0 flex-1 flex-col">
      <slot v-if="$slots.default" />
      <template v-else>
        <span v-if="label" class="text-base text-slate-900">{{ label }}</span>
        <span v-if="description" class="mt-1 text-sm leading-5 text-slate-500">{{
          description
        }}</span>
        <span v-if="error" class="mt-1 text-sm text-red-500/90">{{ error }}</span>
      </template>
    </span>
  </label>
</template>
