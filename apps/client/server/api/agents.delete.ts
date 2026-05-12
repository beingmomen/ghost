export default defineEventHandler(async (event) => {
  ensureDevOnly()

  const body = await readBody(event)
  const { slug } = body

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Missing required field: slug'
    })
  }

  await deleteMarkdownFile('agents', slug)

  return {
    status: 'success',
    message: `Agent "${slug}" deleted successfully`
  }
})
