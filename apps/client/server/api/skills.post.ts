export default defineEventHandler(async (event) => {
  ensureDevOnly()

  const body = await readBody(event)
  const { name, category, trigger, description, notes } = body

  if (!name || !category) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, category'
    })
  }

  const slug = slugify(name)
  const today = new Date().toISOString().split('T')[0]

  let frontmatter = `title: "${name}"\ncategory: "${category}"\n`
  if (trigger) {
    frontmatter += `trigger: "${trigger}"\n`
  }
  frontmatter += `created_at: "${today}"\n`

  let markdownBody = ''

  if (description) {
    markdownBody += `## الوصف\n\n${description}\n\n`
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

  const result = await createMarkdownFile('skills', slug, frontmatter, markdownBody)

  return {
    status: 'success',
    message: `Skill "${name}" created successfully`,
    ...result
  }
})
