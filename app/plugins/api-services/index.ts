export default defineNuxtPlugin(() => {
  const mainStore = useMainStore()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()
  let refreshPromise: Promise<{ token: string; rt: string }> | null = null

  const useLogOut = async () => {
    mainStore.setLogOut()
    return navigateTo(localePath(defAuthPage.login.name), { replace: true })
  }

  const useUnauthorized = async (): Promise<never> => {
    await useLogOut()
    throw createError({ status: defHttpStatus.s401, message: 'Unauthorized' })
  }

  const getErrorStatus = (error: any) =>
    error?.response?.status || error?.status || error?.statusCode || defHttpStatus.s500

  const getErrorData = (error: any) => error?.response?._data || error?.data

  const isRefreshRequest = (request: string) => request.includes('/refresh')

  const isAuthRequest = (request: string) => request.includes('/auth/login')

  const refreshTokens = async () => {
    if (!mainStore.refreshToken) {
      return await useUnauthorized()
    }

    if (!refreshPromise) {
      refreshPromise = $fetch<{ token: string; rt: string }>(`${config.public.apiBase}/refresh`, {
        method: 'POST',
        body: { refreshToken: mainStore.refreshToken }
      }).finally(() => {
        refreshPromise = null
      })
    }

    const refreshRes = await refreshPromise

    mainStore.setAccessToken({
      token: refreshRes.token,
      rt: refreshRes.rt
    })

    return refreshRes
  }

  const customApiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      options.headers = new Headers(options.headers)
      if (mainStore.accessToken) {
        options.headers.set('Authorization', `Bearer ${mainStore.accessToken}`)
      }
    }
  })

  const apiBase = async <T>(
    request: string,
    options?: any,
    hasRetried = false
  ): Promise<T> => {
    try {
      return await customApiFetch<T>(request, options)
    } catch (error: any) {
      const status = getErrorStatus(error)
      const data = getErrorData(error)

      if (status !== defHttpStatus.s401) {
        throw createError({
          status,
          data,
          message: data?.error || data?.message || error?.message || 'error.unknown'
        })
      }

      if (hasRetried || isRefreshRequest(request) || isAuthRequest(request)) {
        return await useUnauthorized()
      }

      try {
        await refreshTokens()
        return await apiBase<T>(request, options, true)
      } catch {
        return await useUnauthorized()
      }
    }
  }

  return {
    provide: {
      apiBase
    }
  }
})
