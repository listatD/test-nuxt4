<script setup lang="ts">
import type { JsonPlaceholderTodo, TodoStatusFilter, TodoUserFilter } from '@/utils/types'

definePageMeta({
  public: false
})

const mainStore = useMainStore()
const favoriteTodoStore = useFavoriteTodoStore()
const userService = useUserService()
const localePath = useLocalePath()
const route = useRoute()
const { data: todosData, pending: isTodosLoading, error: todosError } = await userService.getTodos()

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

const getQueryUser = (): TodoUserFilter | string =>
  getQueryValue(route.query.user) || defTodoUserFilter.all.val
const getQuerySearch = () => getQueryValue(route.query.search)
const getQueryPage = () => {
  const value = Number(getQueryValue(route.query.page))

  return Number.isInteger(value) && value > 0 ? value : 1
}

const todos = ref<JsonPlaceholderTodo[]>(todosData.value || [])
const statusFilter = ref<TodoStatusFilter>(getQueryStatus())
const userFilter = ref<TodoUserFilter | string>(getQueryUser())
const searchInput = ref(getQuerySearch())
const search = ref(getQuerySearch())
const currentPage = ref(getQueryPage())
const newTodoUserId = ref('')
const newTodoTitle = ref('')
const createError = ref('')
const isCreateTodoModalOpen = ref(false)
const isSyncingFromRoute = ref(false)
const searchDebounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const user = computed(() => mainStore.userInfo)
const favoriteIds = computed(() => favoriteTodoStore.favoriteTodoIds)

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
  { label: t('filter.allUsers'), value: defTodoUserFilter.all.val },
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

    const matchesUser =
      userFilter.value === defTodoUserFilter.all.val || todo.userId === Number(userFilter.value)
    const matchesSearch = !query || todo.title.toLowerCase().includes(query)

    return matchesStatus && matchesUser && matchesSearch
  })
})

const clearSearchDebounce = () => {
  if (!searchDebounceTimer.value) return

  clearTimeout(searchDebounceTimer.value)
  searchDebounceTimer.value = null
}

const syncQuery = () => {
  if (!import.meta.client) return

  const query = { ...route.query }

  if (statusFilter.value === defTodoStatusFilter.all.val) {
    delete query.status
  } else {
    query.status = statusFilter.value
  }

  if (userFilter.value === defTodoUserFilter.all.val) {
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

  if (currentPage.value > 1) {
    query.page = String(currentPage.value)
  } else {
    delete query.page
  }

  navigateTo({ path: route.path, query }, { replace: true })
}

const resetPageAndSyncQuery = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    return
  }

  syncQuery()
}

watch(todosData, value => {
  todos.value = value || []
})

watch(
  () => route.query,
  () => {
    isSyncingFromRoute.value = true

    const nextStatus = getQueryStatus()
    const nextUser = getQueryUser()
    const nextSearch = getQuerySearch()
    const nextPage = getQueryPage()

    clearSearchDebounce()

    if (statusFilter.value !== nextStatus) {
      statusFilter.value = nextStatus
    }
    if (userFilter.value !== nextUser) {
      userFilter.value = nextUser
    }
    if (searchInput.value !== nextSearch) {
      searchInput.value = nextSearch
    }
    if (search.value !== nextSearch) {
      search.value = nextSearch
    }
    if (currentPage.value !== nextPage) {
      currentPage.value = nextPage
    }

    nextTick(() => {
      isSyncingFromRoute.value = false
    })
  }
)

watch([statusFilter, userFilter], () => {
  if (isSyncingFromRoute.value) return

  resetPageAndSyncQuery()
})

watch(searchInput, value => {
  if (isSyncingFromRoute.value) return

  clearSearchDebounce()
  searchDebounceTimer.value = setTimeout(() => {
    search.value = value
  }, defTodoSearch.debounceMs.val)
})

watch(search, () => {
  if (isSyncingFromRoute.value) return

  resetPageAndSyncQuery()
})

watch(currentPage, () => {
  if (isSyncingFromRoute.value) return

  syncQuery()
})

onBeforeUnmount(() => {
  clearSearchDebounce()
})

const toggleFavorite = (todoId: number) => {
  favoriteTodoStore.toggleFavoriteTodo(todoId)
}

const clearCreateError = () => {
  createError.value = ''
}

const resetCreateTodoForm = () => {
  newTodoUserId.value = ''
  newTodoTitle.value = ''
  createError.value = ''
}

watch(isCreateTodoModalOpen, value => {
  if (!value) {
    resetCreateTodoForm()
  }
})

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

  todos.value = [data.value, ...todos.value]
  resetCreateTodoForm()
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

})
</script>

<template>
  <div class="flex flex-col gap-6">
    <MainUserProfile :user="user" @logout="logout" />

    <MainTodoFilter
      v-model:status="statusFilter"
      v-model:user="userFilter"
      v-model:search="searchInput"
      :status-options="statusOptions"
      :user-options="userOptions"
      @create="isCreateTodoModalOpen = true"
    />

    <MainTodoList
      v-model:page="currentPage"
      :todos="filteredTodos"
      :favorite-ids="favoriteIds"
      :is-loading="isTodosLoading"
      :error="todosError"
      @toggle-favorite="toggleFavorite"
    />

    <BaseModal
      v-model="isCreateTodoModalOpen"
      :title="$t('page.createTodo')"
      width-class="max-w-md"
    >
      <MainCreateTodo
        v-model:user-id="newTodoUserId"
        v-model:title="newTodoTitle"
        :error="createError"
        @change="clearCreateError"
        @submit="addTodo"
      />
    </BaseModal>
  </div>
</template>
