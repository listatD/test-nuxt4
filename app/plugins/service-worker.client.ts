export default defineNuxtPlugin(() => {
  if (import.meta.dev || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker is an enhancement; the app should continue without it.
    })
  })
})
