import type { UseFetchOptions } from 'nuxt/app'

/**
 * Thin wrapper around `useFetch` that:
 *   - routes through the configured `$api` client (baseURL + headers)
 *   - surfaces server errors as toasts (500 / 404 / generic 4xx)
 *   - exposes `error` and `refresh` to the caller so each section can decide
 *     whether to render a fallback, retry, or stay silent.
 *
 * Callers should branch on `error.value` (or `data.value?.length === 0`) and
 * render `<LandingSectionFallback />` (or equivalent) instead of disappearing
 * the section without context.
 */
export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL?.replace(/\/+$/, '') ?? ''

  // Resolve to a full URL ourselves. `$fetch.create({ baseURL })` has proven
  // unreliable across HMR boundaries — sometimes a relative `url` slipped
  // through and hit `…/api/v1?…` (no resource). Building the URL here is
  // bulletproof and matches what the network panel showed on the live server.
  const resolve = () => {
    const raw = typeof url === 'function' ? url() : url
    const path = raw.startsWith('/') ? raw : `/${raw}`
    return `${baseURL}${path}`
  }

  return useFetch<T>(resolve, {
    ...options,
    onResponseError({ response }) {
      const toast = useToast()
      const status = response?.status
      if (status === 500) {
        toast.add({ title: 'حدث خطأ في الخادم', color: 'error' })
      } else if (status === 404) {
        toast.add({ title: 'البيانات المطلوبة غير موجودة', color: 'error' })
      } else if (status >= 400) {
        toast.add({ title: 'حدث خطأ في الطلب', color: 'error' })
      }
    }
  })
}
