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
    link: () => [...(head.value.link || [])],
    meta: () => [...(head.value.meta || [])]
  })
}
