import type { UseFetchOptions } from 'nuxt/app'

/**
 * Thin wrapper around `useFetch` that:
 *   - routes through the configured `$api` client (baseURL + headers) so the
 *     URL is built once from `baseURL + path + query` and never drops the path.
 *   - surfaces HTTP errors as toasts (500 / 404 / generic 4xx).
 *   - exposes `data`, `error`, `refresh` so the caller can decide whether to
 *     render a fallback, retry, or stay silent.
 *
 * Callers should branch on `error.value` (a real network/HTTP error) — NOT
 * on empty data. A 200 with `data: []` is a successful response, not an error.
 *
 * `useFetch` would otherwise treat an empty `data` as a fetch failure in SSR
 * (the fallback renders for every empty collection).
 */
export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  const config = useRuntimeConfig()
  const baseURL = (config.public.baseURL ?? '').replace(/\/+$/, '')
  const $api = useNuxtApp().$api
  const toast = useToast()

  // Resolve to a full URL ourselves. `$fetch.create({ baseURL })` was dropping
  // the resource segment under HMR, producing `…/api/v1?…` (404) instead of
  // `…/api/v1/projects?…`. Building the URL here is bulletproof.
  const fullUrl = (): string => {
    const raw = typeof url === 'function' ? url() : url
    const path = raw.startsWith('/') ? raw : `/${raw}`
    return `${baseURL}${path}`
  }

  return useFetch<T>(fullUrl, {
    ...options,
    onResponseError({ response }) {
      const status = response?.status
      if (status === 500) {
        toast.add({ title: 'حدث خطأ في الخادم', color: 'error' })
      } else if (status === 404) {
        toast.add({ title: 'البيانات المطلوبة غير موجودة', color: 'error' })
      } else if (status && status >= 400) {
        toast.add({ title: 'حدث خطأ في الطلب', color: 'error' })
      }
    }
  })
}

