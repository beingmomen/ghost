export default defineEventHandler(async (event) => {
  ensureDevOnly()

  const body = await readBody(event)
  const { name, category, description, prompt, notes } = body

  if (!name || !category) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, category'
    })
  }

  const slug = slugify(name)
  const today = new Date().toISOString().split('T')[0]

  const frontmatter = `title: "${name}"\ncategory: "${category}"\ncreated_at: "${today}"\n`

  let markdownBody = ''

  if (description) {
    markdownBody += `## الوصف\n\n${description}\n\n`
  }

  if (prompt) {
    markdownBody += `## البرومبت\n\n\`\`\`text\n${prompt}\n\`\`\`\n\n`
  }

  if (notes) {
    const noteLines = notes.split('\n').filter((l: string) => l.trim())
    const formattedNotes = noteLines.map((l: string) => {
      const trimmed = l.trim()
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) return trimmed
      return `- ${trimmed}`
    }).join('\n')
    markdownBody += `## ملاحظات\n\n${formattedNotes}\n`
  }

  const result = await createMarkdownFile('agents', slug, frontmatter, markdownBody)

  return {
    status: 'success',
    message: `Agent "${name}" created successfully`,
    ...result
  }
})
