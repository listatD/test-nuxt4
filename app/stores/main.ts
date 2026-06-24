export const useMainStore = defineStore('main', () => {
  const paramsCookie = {
    maxAge: 60 * 60 * 24 * 365,
    watch: true as const
  }

  const locale = useCookie<string | null>('locale', paramsCookie)
  const accessToken = useCookie<string | null>('accessToken', paramsCookie)
  const refreshToken = useCookie<string | null>('refreshToken', paramsCookie)
  const userInfo = useState('user-info', () => ({}))

  const setAccessToken = (item: { token?: string; rt?: string }) => {
    if (item.token) accessToken.value = item.token
    if (item.rt) refreshToken.value = item.rt
  }

  const setUserInfo = (item: any) => {
    userInfo.value = item
  }
  const setAppLocale = (val: string | null) => {
    locale.value = val
  }

  const setLogOut = () => {
    accessToken.value = null
    refreshToken.value = null
    userInfo.value = {}
  }

  return {
    locale,
    accessToken,
    refreshToken,
    userInfo,
    setAccessToken,
    setUserInfo,
    setAppLocale,
    setLogOut
  }
})
