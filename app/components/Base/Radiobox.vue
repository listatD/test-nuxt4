<script setup lang="ts">
import type { BaseRadioboxProps } from '@/utils/types'

const { value, label, description, error, disabled, name } = defineProps<BaseRadioboxProps>()

const model = defineModel<BaseRadioboxProps['modelValue']>({ default: null })

const isChecked = computed(() => model.value === value)

const onChange = () => {
  model.value = value
}
</script>

<template>
  <label class="flex w-full gap-3" :class="{ 'pointer-events-none opacity-60': disabled }">
    <input
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      :value="String(value)"
      type="radio"
      class="peer sr-only"
      @change="onChange"
    />

    <span
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
      :class="
        error
          ? 'border-red-500/50 bg-red-50/20'
          : isChecked
            ? 'border-brand-primary bg-white'
            : 'border-gray-300 bg-white'
      "
    >
      <span
        class="h-2.5 w-2.5 rounded-full bg-brand-primary transition-all duration-200"
        :class="isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
      />
    </span>

    <span class="flex min-w-0 flex-1 flex-col">
      <span v-if="label" class="text-base text-slate-900">{{ label }}</span>
      <span v-if="description" class="mt-1 text-sm leading-5 text-slate-500">{{ description }}</span>
      <span v-if="error" class="mt-1 text-sm text-red-500/90">{{ error }}</span>
    </span>
  </label>
</template>
