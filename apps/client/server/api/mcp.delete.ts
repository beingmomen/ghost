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

  await deleteMarkdownFile('mcp', slug)

  return {
    status: 'success',
    message: `Server "${slug}" deleted successfully`
  }
})
