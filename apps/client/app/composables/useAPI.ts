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
  return useFetch<T>(url, {
    ...options,
    $fetch: useNuxtApp().$api,
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
