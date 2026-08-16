// /cv — redirects to the current résumé link, fetched from the backend at
// request time (single source of truth: apps/db's "infos" admin field), not
// hardcoded here. No cache-control: a résumé update in the dashboard must be
// reflected immediately, unlike rss.xml.get.ts's 10-minute cache.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // `.trim()` guards against a stray trailing '\r'/whitespace in BASE_URL (e.g.
  // from a CRLF .env) — same guard as useAPI.ts, this project's known failure mode.
  const baseURL = (config.public.baseURL ?? '').trim().replace(/\/+$/, '')
  let resumeUrl = '/contact'

  try {
    const body = await $fetch(`${baseURL}/infos`, { signal: AbortSignal.timeout(10000) })
    resumeUrl = body?.data?.[0]?.resumeUrl || resumeUrl
  } catch {
    // network/timeout/non-2xx failure — keep the /contact fallback
  }

  return sendRedirect(event, resumeUrl, 302)
})
