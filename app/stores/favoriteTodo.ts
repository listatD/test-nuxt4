export const useFavoriteTodoStore = defineStore('favoriteTodo', () => {
  const favoriteTodoIds = useLocalStorage<number[]>('favoriteTodoIds', [])

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
