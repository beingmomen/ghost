import type { AsyncData, AsyncDataOptions } from 'nuxt/app'

/**
 * Thin wrapper around `useAsyncData` that:
 *   - builds a full URL from `baseURL + path + query` and never drops the
 *     resource segment (no more `…/api/v1?…` 404s).
 *   - unwraps the `{ status, data, … }` envelope so the caller sees
 *     `data` directly (an array, not a wrapper).
 *   - surfaces HTTP errors as toasts (500 / 404 / generic 4xx).
 *   - exposes `data`, `error`, `refresh` so the caller can decide whether
 *     to render a fallback, retry, or stay silent.
 *
 * Callers should branch on `error.value` (real HTTP error) — NOT on empty
 * data. A 200 with `data: []` is success; the caller can check
 * `data.value?.length === 0` to render an empty state.
 */
export function useAPI<T = unknown>(
  url: string | (() => string),
  options: AsyncDataOptions<T> & { query?: Record<string, unknown>, key?: string } = {}
) {
  const config = useRuntimeConfig()
  const $api = useNuxtApp().$api
  const toast = useToast()

  const baseURL = (config.public.baseURL ?? '').replace(/\/+$/, '')
  const fullUrl = (): string => {
    const raw = typeof url === 'function' ? url() : url
    const path = raw.startsWith('/') ? raw : `/${raw}`
    return `${baseURL}${path}`
  }

  const { query, default: defaultFn, key: userKey, ...rest } = options

  // Honour a caller-supplied `key` so shared caches work (e.g. `index.vue`
  // populates key `landing`, and `useNuxtData('landing')` reads it in child
  // sections). Fall back to a per-URL key when the caller omits one.
  const asyncKey = userKey
    ?? (typeof url === 'function' ? 'api-handler' : `api:${url}`)

  return useAsyncData<T | null>(
    asyncKey,
    async () => {
      // Errors propagate to useAsyncData (sets error.value); the toast is
      // shown by onResponseError below for HTTP-level failures.
      const res = await $api<T>(fullUrl(), { query })
      return (res as any)?.data ?? res
    },
    {
      ...rest,
      default: () => defaultFn?.() ?? null,
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
    }
  ) as AsyncData<T | null, Error | null>
}
