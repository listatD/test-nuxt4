import { i18nLocales } from '@/../i18n/languages-list'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const mainStore = useMainStore()
  const localePath = useLocalePath()

  const localeRoots = new Set(i18nLocales.map(l => `/${l.code}`))
  const normalizedPath = to.path.replace(/\/$/, '')
  const isRootPath =
    normalizedPath === '' || normalizedPath === '/' || localeRoots.has(normalizedPath)

  if (isRootPath) {
    const target = mainStore.accessToken ? defUserPage.main.name : defAuthPage.login.name;
    const targetPath = localePath(target)

    if (to.path !== targetPath) {
      return navigateTo(targetPath)
    }
  }

  if (to.path.startsWith('/api') || to.meta.error || to.matched.length === 0) return

  const nuxtError = useError()
  if (nuxtError.value) return

  const isPublic = to.meta.public === true

  if (!isPublic && !mainStore.accessToken) {
    return navigateTo(localePath(defAuthPage.login.name))
  }
})
