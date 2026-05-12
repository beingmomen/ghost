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

  await deleteMarkdownFile('commands', slug)

  return {
    status: 'success',
    message: `Command "${slug}" deleted successfully`
  }
})
