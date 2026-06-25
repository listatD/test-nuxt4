export const useFavoriteTodoStore = defineStore('favoriteTodo', () => {
  const paramsCookie = {
    maxAge: 60 * 60 * 24 * 365,
    watch: true as const
  }

  const favoriteTodoIds = useCookie<number[]>('favoriteTodoIds', {
    ...paramsCookie,
    default: () => []
  })

  const setFavoriteTodoIds = (ids: number[]) => {
    favoriteTodoIds.value = ids
  }

  const toggleFavoriteTodo = (todoId: number) => {
    favoriteTodoIds.value = favoriteTodoIds.value.includes(todoId)
      ? favoriteTodoIds.value.filter(id => id !== todoId)
      : [...favoriteTodoIds.value, todoId]
  }

  const clearFavoriteTodoIds = () => {
    favoriteTodoIds.value = []
  }

  return {
    favoriteTodoIds,
    setFavoriteTodoIds,
    toggleFavoriteTodo,
    clearFavoriteTodoIds
  }
})
