export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    // $fetch (ofetch) parses JSON, throws on non-2xx, and reuses a keep-alive
    // agent — lighter and more robust than the raw fetch + manual .json() dance.
    return await $fetch(`${config.public.baseURL}/blogs/all`, {
      signal: AbortSignal.timeout(10000)
    })
  } catch (error) {
    const statusCode = error.statusCode || error.response?.status || 500
    throw createError({
      statusCode,
      message: 'Failed to fetch blogs'
    })
  }
})
