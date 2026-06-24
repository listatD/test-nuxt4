import robotoBoldUrl from '@/assets/fonts/Roboto-Bold.ttf?url'
import robotoRegularUrl from '@/assets/fonts/Roboto-Regular.ttf?url'
import robotoSemiBoldUrl from '@/assets/fonts/Roboto-SemiBold.ttf?url'

export const useAppHead = () => {
  const head = useLocaleHead({
    dir: true,
    seo: true
  })
  useHead({
    htmlAttrs: {
      lang: () => head.value.htmlAttrs?.lang,
      dir: () => head.value.htmlAttrs?.dir as 'ltr' | 'rtl' | 'auto' | undefined
    },
    link: () => [
      ...(head.value.link || []),
      {
        rel: 'preload',
        href: robotoRegularUrl,
        as: 'font',
        type: 'font/ttf',
        crossorigin: ''
      },
      {
        rel: 'preload',
        href: robotoSemiBoldUrl,
        as: 'font',
        type: 'font/ttf',
        crossorigin: ''
      },
      {
        rel: 'preload',
        href: robotoBoldUrl,
        as: 'font',
        type: 'font/ttf',
        crossorigin: ''
      }
    ],
    meta: () => [...(head.value.meta || [])]
  })
}
