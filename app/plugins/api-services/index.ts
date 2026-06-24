export default defineNuxtPlugin(() => {
  const mainStore = useMainStore()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()
  let refreshPromise: Promise<{ token: string; rt: string }> | null = null

  const useLogOut = async () => {
    mainStore.setLogOut()
    return navigateTo(localePath(defAuthPage.login.name), { replace: true })
  }

  const useUnauthorized = async () => {
    await useLogOut()
    if (import.meta.client) {
      throw createError({ status: defHttpStatus.s401, message: 'Unauthorized' })
    }
  }

  const customApiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      options.headers = new Headers(options.headers)
      if (mainStore.accessToken) {
        options.headers.set('Authorization', `Bearer ${mainStore.accessToken}`)
      }
    },
    async onResponseError({ request, response, options }) {
      const status = response.status
      const requestUrl = request.toString()

      const isRefreshRequest = requestUrl.includes('/auth/refresh')
      const isAuthRequest = requestUrl.includes('/auth/login')

      if (status === defHttpStatus.s401) {
        if (isRefreshRequest || isAuthRequest) {
          await useLogOut()
          return
        }

        if (mainStore.refreshToken) {
          try {
            if (!refreshPromise) {
              refreshPromise = $fetch<{ token: string; rt: string }>(
                `${config.public.apiBase}/auth/refresh`,
                {
                  method: 'POST',
                  body: { refreshToken: mainStore.refreshToken }
                }
              ).finally(() => {
                refreshPromise = null
              })
            }

            const refreshRes = await refreshPromise

            mainStore.setAccessToken({
              token: refreshRes.token,
              rt: refreshRes.rt
            })

            const headers = new Headers(options.headers)
            headers.set('Authorization', `Bearer ${refreshRes.token}`)

            return $fetch(
              request as string,
              {
                ...options,
                method: options.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
                headers: Object.fromEntries(headers.entries())
              } as any
            )
          } catch {
            await useUnauthorized()
            return
          }
        }

        await useUnauthorized()
        return
      }
      throw createError({
        status: response.status,
        data: response._data,
        message: response._data?.error || response._data?.message || 'error.unknown'
      })
    }
  })

  return {
    provide: {
      apiBase: customApiFetch
    }
  }
})
