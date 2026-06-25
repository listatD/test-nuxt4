<script setup lang="ts">
import type { JsonPlaceholderTodo } from '@/utils/types'

const props = defineProps<{
  error?: string
  favoriteIds: number[]
  isLoading: boolean
  todos: JsonPlaceholderTodo[]
}>()

const emit = defineEmits<{
  toggleFavorite: [todoId: number]
}>()

const currentPage = defineModel<number>('page', { default: 1 })

const panelClass = 'rounded-lg border border-slate-200 bg-white p-4 sm:p-6'
const titleClass = 'm-0 text-2xl font-bold leading-tight text-slate-900'
const eyebrowClass = 'mb-1.5 mt-0 text-xs font-bold uppercase tracking-[0.08em] text-slate-500'
const perPage = defTodoPagination.perPage.val

const showPagination = computed(() => props.todos.length > perPage)
const totalPages = computed(() => Math.max(1, Math.ceil(props.todos.length / perPage)))

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * perPage

  return props.todos.slice(start, start + perPage)
})

watch(
  [() => props.todos.length, totalPages],
  () => {
    currentPage.value = Math.min(Math.max(currentPage.value, 1), totalPages.value)
  }
)
</script>

<template>
  <section :class="panelClass">
    <div class="mb-5">
      <div>
        <p :class="eyebrowClass">{{ $t('page.todoList') }}</p>
        <h2 :class="titleClass">{{ $t('state.tasks', { count: todos.length }) }}</h2>
      </div>
    </div>

    <div v-if="isLoading" class="flex min-h-[220px] items-center justify-center">
      <div
        class="h-16 w-16 animate-spin rounded-full border-4 border-brand-primary/30 border-t-brand-primary"
        role="status"
        :aria-label="$t('state.loadingTodos')"
      />
    </div>
    <p v-else-if="error" class="m-0 font-semibold text-[#b42318]">
      {{ $t(error) }}
    </p>
    <p v-else-if="todos.length === 0" class="m-0 text-center text-[22px] font-semibold">
      {{ $t('state.noData') }}
    </p>

    <div v-else>
      <ul class="m-0 grid list-none gap-3 p-0">
        <li
          v-for="todo in paginatedTodos"
          :key="todo.id"
          class="grid items-center gap-3.5 rounded-lg border border-slate-200 p-3.5 min-[561px]:grid-cols-[auto_minmax(0,1fr)_auto]"
        >
          <BaseButton
            class="justify-self-start border-slate-300 bg-white text-slate-400 hover:bg-white"
            type="button"
            rounded="full"
            size="sm"
            :class="favoriteIds.includes(todo.id) ? 'border-amber-500 text-amber-500' : ''"
            icon="heroicons:star-20-solid"
            icon-class="h-5 w-5"
            :aria-label="
              favoriteIds.includes(todo.id)
                ? $t('aria.removeFromFavorites')
                : $t('aria.addToFavorites')
            "
            @click="emit('toggleFavorite', todo.id)"
          />

          <div class="min-w-0">
            <p class="m-0 font-semibold text-slate-900">{{ todo.title }}</p>
            <span class="mt-1 inline-block text-[13px] text-slate-500">
              {{ $t('state.user', { id: todo.userId }) }}
            </span>
          </div>

          <span
            class="justify-self-start rounded-full border px-2.5 py-1.5 text-xs font-bold"
            :class="
              todo.completed
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-slate-200 bg-slate-100 text-slate-600'
            "
          >
            {{ todo.completed ? $t('filter.completed') : $t('filter.uncompleted') }}
          </span>
        </li>
      </ul>

      <BasePagination
        v-if="showPagination"
        v-model="currentPage"
        :total-items="todos.length"
        :per-page="perPage"
        :max-visible-pages="defTodoPagination.visiblePages.val"
      />
    </div>
  </section>
</template>
