export default defineEventHandler(async (event) => {
  ensureDevOnly()

  const body = await readBody(event)
  const { name, description, content } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Missing required field: name'
    })
  }

  const slug = slugify(name)
  const today = new Date().toISOString().split('T')[0]

  let frontmatter = `title: "${name}"\n`
  if (description) {
    frontmatter += `description: "${description}"\n`
  }
  frontmatter += `created_at: "${today}"\n`

  let markdownBody = ''
  if (content) {
    markdownBody = `\`\`\`\`bash\n${content}\n\`\`\`\`\n`
  }

  const result = await createMarkdownFile('commands', slug, frontmatter, markdownBody)

  return {
    status: 'success',
    message: `Command "${name}" created successfully`,
    ...result
  }
})
