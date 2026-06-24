<script setup lang="ts">
import type { JsonPlaceholderTodo, TodoStatusFilter } from '@/utils/types'

definePageMeta({
  public: false
})

const mainStore = useMainStore()
const userService = useUserService()
const localePath = useLocalePath()
const {
  data: todosData,
  pending: isTodosLoading,
  error: todosError
} = await userService.getTodos({
  asyncOptions: {
    default: () => []
  }
})

const todos = ref<JsonPlaceholderTodo[]>(todosData.value || [])
const favoriteIds = ref<number[]>([])
const statusFilter = ref<TodoStatusFilter>('all')
const userFilter = ref('all')
const search = ref('')
const newTodoUserId = ref('')
const newTodoTitle = ref('')
const createError = ref('')
const panelClass = 'rounded-lg border border-slate-200 bg-white p-4 sm:p-6'
const titleClass = 'm-0 text-2xl font-bold leading-tight text-slate-900'
const eyebrowClass = 'mb-1.5 mt-0 text-xs font-bold uppercase tracking-[0.08em] text-slate-500'

const user = computed(() => mainStore.userInfo)

const availableUserIds = computed(() =>
  [...new Set(todos.value.map(todo => todo.userId))].sort((a, b) => a - b)
)

const { t } = useI18n()

const statusOptions = computed(() => [
  { label: t('filter.all'), value: 'all' },
  { label: t('filter.completed'), value: 'completed' },
  { label: t('filter.uncompleted'), value: 'uncompleted' },
  { label: t('filter.favorites'), value: 'favorites' }
])

const userOptions = computed(() => [
  { label: t('filter.allUsers'), value: 'all' },
  ...availableUserIds.value.map(userId => ({ label: String(userId), value: String(userId) }))
])

const filteredTodos = computed(() => {
  const query = search.value.trim().toLowerCase()

  return todos.value.filter(todo => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'completed' && todo.completed) ||
      (statusFilter.value === 'uncompleted' && !todo.completed) ||
      (statusFilter.value === 'favorites' && favoriteIds.value.includes(todo.id))

    const matchesUser = userFilter.value === 'all' || todo.userId === Number(userFilter.value)
    const matchesSearch = !query || todo.title.toLowerCase().includes(query)

    return matchesStatus && matchesUser && matchesSearch
  })
})

const loadFavorites = () => {
  if (!import.meta.client) return

  try {
    const saved = window.localStorage.getItem('favoriteTodoIds')
    favoriteIds.value = saved ? JSON.parse(saved) : []
  } catch {
    favoriteIds.value = []
  }
}

const saveFavorites = () => {
  if (!import.meta.client) return

  window.localStorage.setItem('favoriteTodoIds', JSON.stringify(favoriteIds.value))
}

watch(todosData, value => {
  todos.value = value || []
})

const toggleFavorite = (todoId: number) => {
  favoriteIds.value = favoriteIds.value.includes(todoId)
    ? favoriteIds.value.filter(id => id !== todoId)
    : [...favoriteIds.value, todoId]

  saveFavorites()
}

const addTodo = async () => {
  createError.value = ''

  const userId = Number(newTodoUserId.value)
  const title = newTodoTitle.value.trim()

  if (!Number.isInteger(userId) || userId <= 0 || !title) {
    createError.value = mapError({ message: 'errorCreateTodoFields' })
    return
  }

  const { data, error } = await userService.postTodo({
    userId,
    title,
    completed: false
  })

  if (error.value || !data.value) {
    createError.value = error.value
    return
  }

  todos.value = [{ ...data.value, id: Date.now(), userId, title, completed: false }, ...todos.value]
  newTodoUserId.value = ''
  newTodoTitle.value = ''
}

const logout = async () => {
  mainStore.setLogOut()
  await navigateTo(localePath(defAuthPage.login.name))
}

onMounted(() => {
  if (!mainStore.userInfo) {
    navigateTo(localePath(defAuthPage.login.name))
    return
  }

  loadFavorites()
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <section
      v-if="user"
      :class="[
        panelClass,
        'grid items-start gap-6 min-[901px]:grid-cols-[minmax(180px,1fr)_2fr_auto]'
      ]"
    >
      <div>
        <p :class="eyebrowClass">{{ $t('page.userProfile') }}</p>
        <h1 :class="titleClass">{{ user.name }}</h1>
      </div>

      <dl class="m-0 grid gap-4 min-[561px]:grid-cols-2">
        <div class="min-w-0">
          <dt class="text-xs font-semibold text-slate-500">{{ $t('label.username') }}</dt>
          <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
            {{ user.username }}
          </dd>
        </div>
        <div class="min-w-0">
          <dt class="text-xs font-semibold text-slate-500">{{ $t('label.phoneNumber') }}</dt>
          <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
            {{ user.phone }}
          </dd>
        </div>
        <div class="min-w-0">
          <dt class="text-xs font-semibold text-slate-500">{{ $t('label.email') }}</dt>
          <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
            {{ user.email }}
          </dd>
        </div>
        <div class="min-w-0">
          <dt class="text-xs font-semibold text-slate-500">{{ $t('label.company') }}</dt>
          <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
            {{ user.company.name }}
          </dd>
        </div>
      </dl>

      <BaseButton type="button" @click="logout">{{ $t('btn.logout') }}</BaseButton>
    </section>

    <section class="grid gap-6 min-[901px]:grid-cols-[minmax(280px,1fr)_minmax(280px,2fr)]">
      <div :class="[panelClass, 'flex flex-col gap-4']">
        <h2 :class="titleClass">{{ $t('page.createTodo') }}</h2>
        <form class="grid gap-3" @submit.prevent="addTodo">
          <BaseInput
            v-model="newTodoUserId"
            type="number"
            :label="$t('label.userId')"
            id="create-todo-user-id"
            name="userId"
            size="md"
          />
          <BaseInput
            v-model="newTodoTitle"
            type="text"
            :label="$t('label.title')"
            id="create-todo-title"
            name="title"
            size="md"
          />
          <BaseButton type="submit">{{ $t('btn.add') }}</BaseButton>
        </form>
        <p v-if="createError" class="m-0 font-semibold text-[#b42318]">{{ $t(createError) }}</p>
      </div>

      <div :class="[panelClass, 'flex flex-col gap-4']">
        <h2 :class="titleClass">{{ $t('page.filters') }}</h2>
        <div class="grid gap-3 min-[901px]:grid-cols-3">
          <BaseSelect
            v-model="statusFilter"
            :options="statusOptions"
            id="todo-status-filter"
            name="status"
          />

          <BaseSelect
            v-model="userFilter"
            :options="userOptions"
            id="todo-user-filter"
            name="user"
          />

          <BaseInput
            v-model="search"
            type="search"
            :label="$t('label.searchByTitle')"
            id="todo-title-search"
            name="search"
            size="md"
          />
        </div>
      </div>
    </section>

    <section :class="panelClass">
      <div class="mb-5">
        <div>
          <p :class="eyebrowClass">{{ $t('page.todoList') }}</p>
          <h2 :class="titleClass">{{ $t('state.tasks', { count: filteredTodos.length }) }}</h2>
        </div>
      </div>

      <p v-if="isTodosLoading" class="m-0 font-semibold">{{ $t('state.loadingTodos') }}</p>
      <p v-else-if="todosError" class="m-0 font-semibold text-[#b42318]">
        {{ $t(todosError) }}
      </p>
      <p v-else-if="filteredTodos.length === 0" class="m-0 font-semibold">
        {{ $t('state.noTodosFound') }}
      </p>

      <ul v-else class="m-0 grid list-none gap-3 p-0">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="grid items-center gap-3.5 rounded-lg border border-slate-200 p-3.5 min-[561px]:grid-cols-[auto_minmax(0,1fr)_auto]"
        >
          <BaseButton
            class="justify-self-start border-slate-300 bg-white text-slate-400 hover:bg-white"
            type="button"
            rounded="full"
            size="sm"
            :class="{ 'border-amber-500 text-amber-500': favoriteIds.includes(todo.id) }"
            icon="heroicons:star-20-solid"
            icon-class="h-5 w-5"
            :aria-label="
              favoriteIds.includes(todo.id)
                ? $t('aria.removeFromFavorites')
                : $t('aria.addToFavorites')
            "
            @click="toggleFavorite(todo.id)"
          />

          <div class="min-w-0">
            <p class="m-0 font-semibold text-slate-900">{{ todo.title }}</p>
            <span class="mt-1 inline-block text-[13px] text-slate-500">
              {{ $t('state.user', { id: todo.userId }) }}
            </span>
          </div>

          <span
            class="justify-self-start rounded-full bg-red-100 px-2.5 py-1.5 text-xs font-bold text-red-800"
            :class="{ 'bg-green-100 text-green-800': todo.completed }"
          >
            {{ todo.completed ? $t('filter.completed') : $t('filter.uncompleted') }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>
