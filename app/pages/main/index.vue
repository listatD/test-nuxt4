<script setup lang="ts">
import type { JsonPlaceholderTodo, TodoStatusFilter } from '@/utils/types'

definePageMeta({
  public: false
})

const mainStore = useMainStore()
const userService = useUserService()
const localePath = useLocalePath()
const route = useRoute()
const {
  data: todosData,
  pending: isTodosLoading,
  error: todosError
} = await userService.getTodos()

const getQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0] || ''
  }

  return typeof value === 'string' ? value : ''
}

const isTodoStatusFilter = (value: string): value is TodoStatusFilter =>
  Object.values(defTodoStatusFilter).some(item => item.val === value)

const getQueryStatus = () => {
  const value = getQueryValue(route.query.status)

  return isTodoStatusFilter(value) ? value : defTodoStatusFilter.all.val
}

const getQueryUser = () => getQueryValue(route.query.user) || 'all'
const getQuerySearch = () => getQueryValue(route.query.search)

const todos = ref<JsonPlaceholderTodo[]>(todosData.value || [])
const favoriteIds = ref<number[]>([])
const statusFilter = ref<TodoStatusFilter>(getQueryStatus())
const userFilter = ref(getQueryUser())
const search = ref(getQuerySearch())
const newTodoUserId = ref('')
const newTodoTitle = ref('')
const createError = ref('')
const isCreateTodoModalOpen = ref(false)

const user = computed(() => mainStore.userInfo)

const availableUserIds = computed(() =>
  [...new Set(todos.value.map(todo => todo.userId))].sort((a, b) => a - b)
)

const { t } = useI18n()

const statusOptions = computed(() => [
  { label: t('filter.all'), value: defTodoStatusFilter.all.val },
  { label: t('filter.completed'), value: defTodoStatusFilter.completed.val },
  { label: t('filter.uncompleted'), value: defTodoStatusFilter.uncompleted.val },
  { label: t('filter.favorites'), value: defTodoStatusFilter.favorites.val }
])

const userOptions = computed(() => [
  { label: t('filter.allUsers'), value: 'all' },
  ...availableUserIds.value.map(userId => ({ label: String(userId), value: String(userId) }))
])

const filteredTodos = computed(() => {
  const query = search.value.trim().toLowerCase()

  return todos.value.filter(todo => {
    const matchesStatus =
      statusFilter.value === defTodoStatusFilter.all.val ||
      (statusFilter.value === defTodoStatusFilter.completed.val && todo.completed) ||
      (statusFilter.value === defTodoStatusFilter.uncompleted.val && !todo.completed) ||
      (statusFilter.value === defTodoStatusFilter.favorites.val &&
        favoriteIds.value.includes(todo.id))

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

watch(
  () => route.query,
  () => {
    const nextStatus = getQueryStatus()
    const nextUser = getQueryUser()
    const nextSearch = getQuerySearch()

    if (statusFilter.value !== nextStatus) {
      statusFilter.value = nextStatus
    }
    if (userFilter.value !== nextUser) {
      userFilter.value = nextUser
    }
    if (search.value !== nextSearch) {
      search.value = nextSearch
    }
  }
)

watch([statusFilter, userFilter, search], () => {
  if (!import.meta.client) return

  const query = { ...route.query }

  if (statusFilter.value === defTodoStatusFilter.all.val) {
    delete query.status
  } else {
    query.status = statusFilter.value
  }

  if (userFilter.value === 'all') {
    delete query.user
  } else {
    query.user = userFilter.value
  }

  const searchValue = search.value.trim()
  if (searchValue) {
    query.search = searchValue
  } else {
    delete query.search
  }

  navigateTo({ path: route.path, query }, { replace: true })
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
  isCreateTodoModalOpen.value = false
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
    <MainUserProfile :user="user" @logout="logout" />

    <MainTodoFilter
      v-model:status="statusFilter"
      v-model:user="userFilter"
      v-model:search="search"
      :status-options="statusOptions"
      :user-options="userOptions"
      @create="isCreateTodoModalOpen = true"
    />

    <MainTodoList
      :todos="filteredTodos"
      :favorite-ids="favoriteIds"
      :is-loading="isTodosLoading"
      :error="todosError"
      @toggle-favorite="toggleFavorite"
    />

    <BaseModal v-model="isCreateTodoModalOpen" :title="$t('page.createTodo')" width-class="max-w-md">
      <MainCreateTodo
        v-model:user-id="newTodoUserId"
        v-model:title="newTodoTitle"
        :error="createError"
        @submit="addTodo"
      />
    </BaseModal>
  </div>
</template>
