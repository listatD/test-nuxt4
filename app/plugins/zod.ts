import { z } from 'zod'
import { zodMapError } from '@/utils/mapError'
import type { Composer } from 'vue-i18n'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as Composer
  const t = i18n.t.bind(i18n)

  z.config({
    customError: zodMapError(t)
  })
})
