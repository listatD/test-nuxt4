import type { ServiceResponse, RunAsyncOptions, FetchError } from '@/utils/types'

export const useUserService = () => {
  const nuxtApp = useNuxtApp()
  const mainStore = useMainStore()

  const handleError = (err: FetchError, options?: RunAsyncOptions): string => {
    const isFatal = options?.errorOptions?.fatal ?? false

    if (isFatal) {
      throw createError({
        status: err?.status ?? 500,
        message: err?.message,
        fatal: true
      })
    }

    return mapError(err)
  }

  const runTask = async <T>(
    task: () => Promise<T>,
    options?: RunAsyncOptions
  ): Promise<ServiceResponse<T>> => {
    const data = ref<T | null>(null) as Ref<T | null>
    const pending = ref(true)
    const error = ref('')

    try {
      const result = await task()
      data.value = result
    } catch (err: any) {
      error.value = handleError(err, options)
    } finally {
      pending.value = false
    }

    return { data, pending, error }
  }

  const runAsyncData = async <T>(
    key: string,
    task: () => Promise<T>,
    options?: RunAsyncOptions
  ) => {
    const result = await useAsyncData<T>(key, task, {
      server: true,
      lazy: false,
      watch: [],
      ...options?.asyncOptions
    })

    const error = ref('')

    if (result.error.value) {
      error.value = handleError(result.error.value, options)
    }

    return {
      data: result.data,
      pending: computed(() => result.status.value === 'pending'),
      error
    }
  }

  return {
    async postLogin(values: any, options?: RunAsyncOptions) {
      return runTask(
        () =>
          nuxtApp.$apiBase<any>('/auth/login', {
            method: 'POST',
            body: values
          }),
        options
      )
    },

    async getUser(options?: RunAsyncOptions) {
      const tokenKey = mainStore.accessToken || 'tokenKey'
      return runAsyncData(`auth-me-${tokenKey}`, () => nuxtApp.$apiBase<any>('/auth/me'), options)
    },
  }
}
