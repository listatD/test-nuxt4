<script setup lang="ts">
import type { BaseSelectOption, TodoStatusFilter } from '@/utils/types'

defineProps<{
  statusOptions: BaseSelectOption[]
  userOptions: BaseSelectOption[]
}>()

const status = defineModel<TodoStatusFilter>('status', { default: defTodoStatusFilter.all.val })
const user = defineModel<string>('user', { default: 'all' })
const search = defineModel<string>('search', { default: '' })

const emit = defineEmits<{
  create: []
}>()

const panelClass =
  'sticky top-0 z-30 rounded-lg border border-slate-200 bg-white/95 px-4 pb-4 pt-7 shadow-sm backdrop-blur sm:px-6 sm:pb-6 sm:pt-8 relative'
const titleClass =
  'absolute start-4 top-1 m-0  sm:text-base font-bold leading-tight text-slate-900 sm:start-6'
</script>

<template>
  <div :class="panelClass">
    <h2 :class="titleClass">{{ $t('page.filters') }}</h2>

    <div class="flex flex-col gap-2 min-[901px]:flex-row">
      <div class="flex items-center gap-2 min-[901px]:contents">
        <BaseSelect
          v-model="status"
          :options="statusOptions"
          id="todo-status-filter"
          name="status"
          class="min-w-0 flex-1 min-[901px]:min-w-[120px]"
        />

        <BaseSelect
          v-model="user"
          :options="userOptions"
          id="todo-user-filter"
          name="user"
          class="min-w-0 flex-1 min-[901px]:min-w-[104px]"
        />
      </div>

      <div class="flex items-center gap-2 min-[901px]:contents">
        <BaseInput
          v-model="search"
          type="search"
          :placeholder="$t('label.searchByTitle')"
          id="todo-title-search"
          name="search"
          class="min-w-0 flex-1 min-[901px]:min-w-[150px] min-[901px]:flex-[1.5_1_150px]"
        />

        <BaseButton
          type="button"
          rounded="full"
          icon="heroicons:plus-20-solid"
          icon-class="w-9 h-9"
          :aria-label="$t('page.createTodo')"
          class="shrink-0"
          @click="emit('create')"
        />
      </div>
    </div>
  </div>
</template>
