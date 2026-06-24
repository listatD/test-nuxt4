const CACHE_VERSION = 'app-cache-v1'
const STATIC_CACHE = `${CACHE_VERSION}:static`
const RUNTIME_CACHE = `${CACHE_VERSION}:runtime`

const PRECACHE_URLS = ['/favicon.svg']

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

const isCacheableAssetRequest = request => {
  if (request.method !== 'GET') return false

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return false

  return request.destination === 'font' || request.destination === 'image'
}

const staleWhileRevalidate = async request => {
  const cache = await caches.open(RUNTIME_CACHE)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request)
    .then(response => {
      if (response && response.ok) {
        cache.put(request, response.clone())
      }

      return response
    })
    .catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

self.addEventListener('fetch', event => {
  if (!isCacheableAssetRequest(event.request)) return

  event.respondWith(staleWhileRevalidate(event.request))
})
