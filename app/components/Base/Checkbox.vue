<script setup lang="ts">
import type { BaseCheckboxProps } from '@/utils/types'

const { label, description, error, disabled, name } = defineProps<BaseCheckboxProps>()

const model = defineModel<boolean>({ default: false })

const onChange = (event: Event) => {
  model.value = (event.target as HTMLInputElement).checked
}
</script>

<template>
  <label class="flex w-full gap-3" :class="{ 'pointer-events-none opacity-60': disabled }">
    <input
      :checked="model"
      :disabled="disabled"
      :name="name"
      type="checkbox"
      class="peer sr-only"
      @change="onChange"
    />

    <span
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300"
      :class="
        error
          ? 'border-red-500/50 bg-red-50/20'
          : model
            ? 'border-brand-primary bg-brand-primary text-white'
            : 'border-gray-300 bg-white'
      "
    >
      <Icon
        name="mdi:check"
        class="h-3.5 w-3.5 transition-all duration-200"
        :class="model ? 'scale-100 opacity-100' : 'scale-75 opacity-0'"
      />
    </span>

    <span class="flex min-w-0 flex-1 flex-col">
      <span v-if="label" class="text-base text-slate-900">{{ label }}</span>
      <span v-if="description" class="mt-1 text-sm leading-5 text-slate-500">{{ description }}</span>
      <span v-if="error" class="mt-1 text-sm text-red-500/90">{{ error }}</span>
    </span>
  </label>
</template>
